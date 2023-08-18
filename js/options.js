const allBookmarks = {}

const storeBookmarks = () => {
    function logItems(bookmarkItem, indent, parentId) {
        let url
        let title
        let id

        if (bookmarkItem.url) {
            url = bookmarkItem.url
            title = bookmarkItem.title
            id = bookmarkItem.id

            // console.log(id, url,title,parentId,parentTitle);
            allBookmarks[id] = {
                "Title": title,
                "Font": 16,
                "URL": url,
                "CategoryID": parentId,
                "CategoryTitle": parentTitle
            }
        } else {
            // Folder
            parentTitle = bookmarkItem.title
        }
        if (bookmarkItem.children) {
            for (const child of bookmarkItem.children) {
                parentId = child.parentId
                logItems(child, indent, parentId);
            }
        }
    }

    function logTree(bookmarkItems) {
        // console.log(bookmarkItems);
        logItems(bookmarkItems[0], 0);
    }
    function onRejected(error) {
        console.log(`An error: ${error}`);
    }
    let gettingTree = chrome.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);

    printAllBookmarks()
}

const getDomain = function (link) {
    const url = new URL(link);
    return url.hostname;
}
const getFavicon = (domain, size) => {
    googleFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    return googleFavicon
}

const getIcons = () => {
    for (const id in allBookmarks) {
        if (Object.hasOwnProperty.call(allBookmarks, id)) {
            const element = allBookmarks[id];
            element.Domain = getDomain(element.URL)
            element.Icon = getFavicon(element.Domain, 64)
        }
    }
    printAllBookmarks()
}


const getEncodedIcon = () => {
    for (const id in allBookmarks) {
        if (Object.hasOwnProperty.call(allBookmarks, id)) {
            const element = allBookmarks[id];
            generateIconEncode(element.Icon, id)
        }
    }
    printAllBookmarks()
}


const generateIconEncode = (url, id) => {
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'arraybuffer';
    xhttp.onload = function () {
        const contentType = xhttp.getResponseHeader("Content-Type");
        //Array of 8-bit unsigned int
        var arr = new Uint8Array(this.response);
        // String.fromCharCode returns a 'string' from the specified sequence of Unicode values
        var raw = String.fromCharCode.apply(null, arr);
        //create base-64 encoded ASCII string from a String object 
        var b64 = btoa(raw);
        var dataURL = 'data:' + contentType + ';base64,' + b64;

        const element = allBookmarks[id];
        element.EncodedIcon = dataURL
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


const showCards = () => {
    cardStyle = 'bigwide'
    $("#Log").html('')
    for (const id in allBookmarks) {
        if (Object.hasOwnProperty.call(allBookmarks, id)) {
            const element = allBookmarks[id];

            $("#Log").append(
                `<a href="` + element.URL + `" id="card" class="card-` + cardStyle + `" style="
            background: linear-gradient(to left, rgb(${element.Style}), black)
            ">
                <div id="top" class="icon-`+ cardStyle + `">
                    <img id="icon" src="` + element.EncodedIcon + `" alt="" title="local">
                </div>
                <div class="details-`+ cardStyle + `">
                    <p class="title-`+ cardStyle + `" id="webTitle" style="font-size: 17px;">` + element.Title + `</p>
                    <p class="domainurl-`+ cardStyle + `" id="domain" title="` + element.URL + `">` + element.Domain + `</p>
                </div>
            </a>  `)
        }
    }
}

async function getImageFromBase64str(b64str, id) {
    const img = document.createElement('img');
    await new Promise((r) => {
        img.src = b64str;
        img.onload = r;
    })
    const colorThief = new ColorThief();
    const rgba = colorThief.getColor(img);
    if (!rgba) {
        return 'rgba(0,0,0,0)'; // seems to happen on white image
    } else {
        const element = allBookmarks[id];
        element.Style = rgba

        return rgba;
    }
}


const getIconColor = () => {
    for (const id in allBookmarks) {
        if (Object.hasOwnProperty.call(allBookmarks, id)) {
            const element = allBookmarks[id];
            try {
                getImageFromBase64str(element.EncodedIcon, id);
            } catch (error) {
                console.log(error);
            }
        }
    }
    printAllBookmarks()
}


const saveToStorage = () => {
    chrome.storage.local.set(allBookmarks).then(() => {
        console.log("Value is set");
    });
    printStorage()
}
function downloadTextFile(text, name) {
    const a = document.createElement('a');
    const type = name.split(".").pop();
    a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
    a.download = name;
    a.click();
}

const downloadStorage = () => {
    chrome.storage.local.get(null, function (items) {
        const result = JSON.stringify(items);
        downloadTextFile(result, 'backup-home-bookmark.json');
    });
}

function readSingleFile(event) {

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const contents = e.target.result;
            console.log("Got the file: \n"
                + "name: " + file.name + "\n"
                + "type: " + file.type + "\n"
                + "size: " + file.size + " bytes\n"
            )
            chrome.storage.local.set(JSON.parse(contents))
        }
        reader.readAsText(file);
    } else {
        console.dir("Failed to load file");
    }

}

const clearStorage = () => {
    chrome.storage.local.clear(function () {
        const error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        console.log('Storage clean');
    });
}


const printAllBookmarks = () => {
    const textArea = document.getElementById('storage')
    textArea.innerHTML = ('Loading ... ')
    setTimeout(() => {
        console.dir(allBookmarks);
        textArea.value = JSON.stringify(allBookmarks)
    }, 1000);
}

const printStorage = () => {
    chrome.storage.local.get(null, (items) => {
        console.log(items);
        document.getElementById('storage').value = JSON.stringify(items)
    })
}

document.getElementById('file-selector').addEventListener('change', readSingleFile, false);


document.getElementById('saveToStorage').addEventListener('click',
    saveToStorage);

document.getElementById('downloadStorage').addEventListener('click',
    downloadStorage);
document.getElementById('showStorage').addEventListener('click',
    printStorage);

document.getElementById('clearStorage').addEventListener('click',
    clearStorage);

document.getElementById('storeBookmarks').addEventListener('click',
    storeBookmarks);

document.getElementById('getIcons').addEventListener('click',
    getIcons
);
document.getElementById('getEncodedIcon').addEventListener('click',
    getEncodedIcon
);
document.getElementById('getIconColor').addEventListener('click',
    getIconColor
);
document.getElementById('showCards').addEventListener('click',
    showCards
);