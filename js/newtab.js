chrome.storage.local.get(null, function (items) {
    console.log(items);
    buildCats(items)
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("showDel").addEventListener('click', function () {
        const deleteItems = document.querySelectorAll('.btn');
        for (const item in deleteItems) {
            if (item !== undefined) {
                let itemToDel = deleteItems[item]
                console.log(itemToDel);
                itemToDel.classList.toggle("visible");
            }
        }
    });
});

$(document).on("click", "#deleteItem", function () {
    const itemToRemove = this.attributes.bookid.nodeValue;
    console.log(itemToRemove);

    chrome.storage.local.remove([itemToRemove], (result) => {
        console.log('Removed items for the key: ' + itemToRemove);
        console.log(result);
    });

    $(this).parents('.cardHolder').remove();

});

function changeBookmarkSize(catid, sizeSuffix) {
    let SettingsAdd = {
        [catid]
            :
            { "size": sizeSuffix }
    }
    let newSetting = {};
    let templateSettings = { "Settings": {} }

    chrome.storage.local.get('Settings').then((items) => {
        // console.log(items); 
        for (const item in items['Settings']) {
            // console.log();
            const size = items['Settings'][item].size
            Object.assign(newSetting, { [item]: { "size": size } });
        }

        Object.assign(newSetting, SettingsAdd);
        Object.assign(templateSettings['Settings'], newSetting);
        console.log(templateSettings);
        
        chrome.storage.local.set(templateSettings).then(() => {
            console.log(sizeSuffix + " is setted to category id " + catid);
        });
    });
}

$(document).on("click", "#smallwide", function () {
    const catid = this.attributes.catid.nodeValue;;
    console.log(catid);
    changeBookmarkSize(catid, "smallwide")

});
$(document).on("click", "#bigwide", function () {
    const catid = this.attributes.catid.nodeValue;;
    console.log(catid);
    changeBookmarkSize(catid, "bigwide")

});


function makeCard(value, cat, key, settings) {
    $('#' + cat).append(`<div class="cardHolder" cardid="` + key + `">
    <button id="deleteItem" class="showDelete  btn" bookid="`+ key + `">X</button>
        <a href="`+ value.URL + `" id="card" class="card-` + settings + `" style="background: linear-gradient(to left, rgb(` + value.Style + `), black)">
        <div id="top" class="icon-`+ settings + `">
            <img id="icon" src="` + value.EncodedIcon + `" alt="" title="local">
        </div>
        <div class="details-`+ settings + `">
            <p class="title-`+ settings + `" id="webTitle" style="font-size: ` + value.Font + `px">` + value.Title + `</p>
            <p class="domainurl-`+ settings + `" id="domain" title="` + value.URL + `">` + value.Domain + `</p>
        </div>
        
    </a> 
    
    </div>
        `);
}

function buildCats(items) {
    let cats = {};
    for (const [key, value] of Object.entries(items)) {
        if (value.CategoryID !== undefined) {
            catid = value.CategoryID
            cattitle = value.CategoryTitle
            Object.assign(cats, { [catid]: cattitle });
        }

    }
    console.log(cats);
    compareCats(cats, items)
}

function compareCats(cats, items) {
    for (const cat in cats) {
        if (cat == 1) {
            $('#bookmarkbar').append(`
            <div class="bookmarkbarcat" id="`+ cat + `">
            <h2 class="catTitle">`+ cats[cat] + `</h2>  
            `);
        } else if (cat == 'Settings') {
            console.log("cats Settings");

        }
        else {
            $('#categories').append(`
            
         <div class="cat" id="`+ cat + `">
         <button id="smallwide" class="smallwide btn" catid="`+ cat + `">_</button>
         <button id="bigwide" class="bigwide btn" catid="`+ cat + `">+</button>
         <h2 class="catTitle">`+ cats[cat] + `</h2>  
         `);
        }

        for (const [key, value] of Object.entries(items)) {
            let catid = value.CategoryID
            let title = items['Settings']
            // console.log(title);
            // console.log(title?.[catid]);
            if (cat == catid) {
                let settings

                if (title?.[catid] !== undefined) {
                    settings = title[catid]['size']
                    // console.log(settings);
                } else {
                    settings = 'bigwide'
                }
                makeCard(value, cat, key, settings)
            }
        }

    }
}
