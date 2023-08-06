console.log("net tab js wokrs");

chrome.storage.local.get(null, function (items) {
    // console.log(allKeys +" : " + allvalues );
    console.log(items);
    buildCats(items)
});

// //clear storage
// chrome.storage.local.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
//     // do something more
// });

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("showDel").addEventListener('click', function () {
        //  const deleteItem = document.querySelector('#deleteItem');
        //  deleteItem.setAttribute("style", "display:block ");

        const deleteItems = document.querySelectorAll('.btn');
        for (const item in deleteItems){
            deleteItems[item].classList.toggle("visible");
        }
        // for (var i = 0; i < deleteItem.length; i++) {
        //     // els[i].setAttribute("style", "visibility :visible");
        //     deleteItem[i].classList.toggle("visible");
        // }

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
        <a href="`+ value.URL + `" id="card" class="card-` + settings + `" style="` + value.Style + `">
        <div id="top" class="icon-`+ settings + `">
            <img id="icon" src="` + value.Icon + `" alt="" title="local">
        </div>
        <div class="details-`+ settings + `">
            <p class="title-`+ settings + `" id="webTitle" style="` + value.Font + `">` + value.Title + `</p>
            <p class="domainurl-`+ settings + `" id="domain" title="` + value.URL + `">` + value.Domain + `</p>
        </div>
        
    </a> 
    
    </div>
        `);
}

function buildCats(items) {
    let cats = {};
    for (const [key, value] of Object.entries(items)) {
        // "CategoryID": "271",
        // "CategoryTitle": "Service-Electronic",
        catid = value.CategoryID
        cattitle = value.CategoryTitle
        Object.assign(cats, { [catid]: cattitle });
    }
    // settings = items['Settings']
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
            // console.log(title[catid]);
            if (cat == catid) {
                let settings
                if (title[catid]) {
                    settings = title[catid]['size']
                    // console.log(settings);
                } else {
                    settings = 'bigwide'
                }
                // console.log(settings);
                // console.log(title[catid]);
                // console.log("comparing " + cat + "  is eq  " + catid);
                makeCard(value, cat, key, settings)
            }
        }

    }
}
