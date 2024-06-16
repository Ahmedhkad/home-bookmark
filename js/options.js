const allBookmarks = {}

const autoGenerate = () => {
    console.log('auto gen started');
    async function logTree(bookmarkItems) {
        const countBooks = countBookmarks(bookmarkItems)
        console.log(countBooks);
        AutoGenBookmarks(bookmarkItems[0], countBooks);
    }
    function onRejected(error) {
        console.log(`autoGenerate error: ${error}`);
    }
    let gettingTree = chrome.bookmarks.getTree();
    gettingTree.then(logTree, onRejected);
}

const countBookmarks = (bookmarks) => {
    let count = 0
    process_bookmark(bookmarks)
    function process_bookmark(bookmarks) {
        for (var i = 0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i];
            if (bookmark.url) {
                // console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
                count++
            }
            if (bookmark.children) {
                process_bookmark(bookmark.children);
            }
        }
    }
    return count
}

const AutoGenBookmarks = (books, counts) => {

    logItems(books);
    var elem = document.getElementById("myBar");
    const textBar = document.getElementById("text-bar");
            var width = 1;
            let thisCount = 0

    async function logItems(bookmarkItem, parentId) {
        if (bookmarkItem.url) {
            let bookmarkDetails = {}
            const url = bookmarkItem.url
            const title = bookmarkItem.title
            const font = await getFontSize(title)
            const domain = await makeDomain(url)
            const size = 64
            const IconURLGoogle = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
            console.log('fetching G: ', IconURLGoogle);
            encode64 = await doEncode(IconURLGoogle)
            if (encode64.state === 404) {
                console.log('\x1b[34m%s\x1b[0m', "Google favicon not found, trying DuckDuckGo"); //blue log
                const IconURLDuckDuckGo = `https://icons.duckduckgo.com/ip3/${domain}.ico`
                const encode64 = await doEncode(IconURLDuckDuckGo)
            }
            if (encode64.state === 404) {
                encode64.data = null
            }
            let color = null
            if (encode64.state === 200) {
                color = await getImageFromBase64string(encode64.data)
            }

            bookmarkDetails[bookmarkItem.id] = {
                "Title": title,
                "URL": url,
                "CategoryID": parentId,
                "CategoryTitle": parentTitle,
                "Index": bookmarkItem.index,
                "Domain": domain,
                "EncodedIcon": encode64.data,
                "Color": color,
                "Font": font,
                "Style": "smallwide"
            }
            console.log(bookmarkDetails);
            allBookmarks[bookmarkItem.id] = bookmarkDetails[bookmarkItem.id]

            document.getElementById('storage').value = JSON.stringify(bookmarkDetails)
            thisCount++;
            width = (thisCount/counts)*100
            textBar.innerHTML = thisCount + '/ ' +counts
            elem.style.width = width + "%";
            if(thisCount === counts){
                textBar.innerHTML = "All Bookmarks added Successfully!"
            }
             displayOneCard(bookmarkDetails[bookmarkItem.id])

        } else {
            parentTitle = bookmarkItem.title
        }
        if (bookmarkItem.children) {
            for (const child of bookmarkItem.children) {
                parentId = child.parentId
                await logItems(child, parentId);
            }
        }
    }

}

const makeDomain = async (url) => {
    return new Promise(resolve => {
        setTimeout(async () => {
            const Domain = await new URL(url).hostname
            resolve(Domain)
        }, 1)
    })
}

const doEncode = (url) => {
    return new Promise(async function (resolve, reject) {
        try {
            console.log(`trying...  ${url}`);
            await fetch(url)
                .then(async (response) => {
                    if (!response.ok) {
                        // resolve(null);
                        // throw new Error(`Fetch HTTP error! Status: ${response.status} its local server or not found , ytu DucDuckGo icons service , current url is  ${url}`); 
                    }
                    const buffer = await response.arrayBuffer();
                    const type = response.headers.get("Content-Type")
                    var arr = new Uint8Array(buffer);
                    var raw = String.fromCharCode.apply(null, arr);
                    var b64 = btoa(raw);
                    var dataURL = 'data:' + type + ';base64,' + b64;
                    console.log('\x1b[32m%s\x1b[0m', response.status)
                    // resolve(dataURL)
                    resolve({ data: dataURL, state: response.status });
                })
        }
        catch (e) {
            console.log('\x1b[31m%s\x1b[0m', e.message)
        }
    })
}




const getFontSize = async (title) => {
    return new Promise(resolve => {
        setTimeout(async () => {
            let length = title.length;
            Number.prototype.map = function (in_min, in_max, out_min, out_max) {
                return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            }
            if (length <= 5) {
                length = 5;
            }
            else if (length > 34) {
                length = 35;
            }
            var fontsize = Math.floor(length.map(10, 35, 25, 15));
            resolve(fontsize)
        }, 1)
    })
}
 
async function getImageFromBase64string(b64str) {
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
        return rgba;
    }
}































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
    
    $("#Log").html('')
    for (const id in allBookmarks) {
        if (Object.hasOwnProperty.call(allBookmarks, id)) {
            const element = allBookmarks[id];
            displayOneCard(element)
        }
    }
}

const displayOneCard = async (element) =>{
     
    cardStyle = 'bigwide'
      $("#Log").append(
        `<a href="` + element.URL + `" id="card" class="card-` + cardStyle + `" style="
    background: linear-gradient(to left, rgb(${element.Color}), black)
    ">
        <div id="top" class="icon-`+ cardStyle + `">
            <img id="icon" src="` + element.EncodedIcon + `" alt="" title="local">
        </div>
        <div class="details-`+ cardStyle + `">
            <p class="title-`+ cardStyle + `" id="webTitle" style="font-size: ` + element.Font + `px;">` + element.Title + `</p>
            <p class="domainurl-`+ cardStyle + `" id="domain" title="` + element.URL + `">` + element.Domain + `</p>
        </div>
    </a>  `)
      
     
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

const showStorage = () => {
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
    showStorage);

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
document.getElementById('autoGenerate').addEventListener('click',
    autoGenerate
);