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

function makeCard(value, cat) {
    $('#' + cat).append(`
        <a href="`+ value.URL + `" id="card" class="card" style="` + value.Style + `">
        <div id="top" class="icon">
            <img id="icon" src="` + value.Icon + `" alt="" title="local">
        </div>
        <div class="details">
            <p class="title" id="webTitle" style="`+ value.Font + `">` + value.Title + `</p>
            <p class="domainurl" id="domain" title="`+ value.URL + `">` + value.Domain + `</p>
        </div>
    </a> 
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
        } else if (cat == 'bookmarksCategory') {
            console.log("cats[cat]");

        }
        else {
            $('#categories').append(`
         <div class="cat" id="`+ cat + `">
         <h2 class="catTitle">`+ cats[cat] + `</h2>  
         `);
        }


        for (const [key, value] of Object.entries(items)) {
            let catid = value.CategoryID
            // let title = value.Title
            if (cat == catid) {
                console.log("coparee" + cat + "  is eq  " + catid);
                makeCard(value, cat)
            }
        }

    }
}
