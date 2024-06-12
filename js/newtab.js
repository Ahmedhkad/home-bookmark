//first get items from chrome.storage.local
chrome.storage.local.get(null, function (items) {
    console.log(items);
    buildCats(items)
});


let templateTopListsSettings = { "topListsSettings": {} }

document.addEventListener("DOMContentLoaded", () => {
    // Initialize a variable to track the drag and drop ability
    let TemplateAreaEnabled = false;

    // Function to toggle template drop area
    function toggleTemplateArea() {
        TemplateAreaEnabled = !TemplateAreaEnabled; // Toggle the variable

        const lists = document.querySelectorAll('.list');
        const dropArea = document.getElementById("dropArea");

        // toggle list class showlist and hide-drop-area
        lists.forEach(list => {
            if (TemplateAreaEnabled) {
                list.classList.add("showList");
                dropArea.classList.remove("hide-drop-area")
            } else {
                list.classList.remove("showList");
                dropArea.classList.add("hide-drop-area")
            }
        });
    }

    // Add click event listener to the button
    document.getElementById("showDel").addEventListener('click', function () {
        const deleteItems = document.querySelectorAll('.btn');

        // Toggle visibility of delete items
        deleteItems.forEach(item => {
            item.classList.toggle("visible");
        });

        // Toggle template drop area
        toggleTemplateArea();
    });
});

$(document).on("click", "#deleteItem", function () {
    const itemToRemove = this.attributes.bookid.nodeValue;
    console.log(itemToRemove);

    chrome.storage.local.remove([itemToRemove], (result) => {
        console.log('Removed items for the key: ' + itemToRemove);
        console.log(result);
    });

    chrome.bookmarks.remove(itemToRemove, answer => {
        console.log(answer);
    })

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
    const icon = value.EncodedIcon ? value.EncodedIcon : './icons/default.png';

    // Create the card element
    const card = document.createElement('div');
    card.classList.add('cardHolder');
    card.setAttribute('draggable', 'true'); // Make the card draggable
    card.setAttribute('cardid', key); // Set card id attribute
    card.id = key;

    card.innerHTML = `
        <button class="showDelete btn" id="deleteItem" bookid="${key}">X</button>
        <a href="${value.URL}" id="card" class="card-${settings}" style="background: linear-gradient(to left, rgb(${value.Color}), black)">
            <div id="top" class="icon-${settings}">
                <img id="icon" src="${icon}" alt="" title="local">
            </div>
            <div class="details-${settings}">
                <p class="title-${settings}" id="webTitle" style="font-size: ${value.Font}px">${value.Title}</p>
                <p class="domainurl-${settings}" id="domain" title="${value.URL}">${value.Domain}</p>
            </div>
        </a>`;

    // Append the card to the specified category
    document.getElementById(cat).appendChild(card);

    // Add dragstart event listener to the created card
    card.addEventListener('dragstart', function (event) {

        // Set the data to be dragged
        event.dataTransfer.setData('text/plain', card.id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        // Add class to indicate dragging
        card.classList.add('dragging');
        console.log('Drag started. Card ID:', card.id);
    });
}




//fsecond Build Categories
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
        if (cat == 199) {
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

document.addEventListener('DOMContentLoaded', function () {
    // const numberOfLists = Math.ceil(data.length / 3);
    const numberOfLists = 5;

    for (let i = 1; i <= numberOfLists; i++) {
        const newList = document.createElement('div');
        newList.classList.add('list');
        newList.id = `list${i}`;
        document.getElementById("bookmarkbar").appendChild(newList); // Append to bookmarkbar



        // Add event listener for dragover to allow dropping over newList
        newList.addEventListener('dragover', function (event) {
            event.preventDefault();

            const targetList = event.target.closest('.list');
            const itemId = event.dataTransfer.getData('text/plain');
            const item = document.getElementById(itemId);

            if (item) {
                targetList.appendChild(item);
                console.log('if Dragging over list:');
            }

        });
        newList.addEventListener("dragleave", function (event) {
            event.preventDefault();
            console.log('dragleave');
        });

        // Add event listener for drop to handle dropping over newList
        newList.addEventListener('drop', function (event) {
            event.preventDefault();
            const targetList = event.target.closest('.list');
            const itemId = event.dataTransfer.getData('text/plain');
            // console.log('itemId', itemId);
            const item = document.getElementById(itemId);


            if (item) {
                const targetItem = event.target.closest('.cardHolder');
                console.log(targetItem);
                if (targetItem) {
                    targetList.insertBefore(item, targetItem);
                } else {
                    // If dropped outside existing items, append to the end of the list
                    targetList.appendChild(item);
                }

                const listNumber = parseInt(targetList.id.replace('list', ''));

                const rowNumber = Array.from(targetList.children).indexOf(item) + 1;
                console.log('listNumber ', listNumber, ' rowNumber ', rowNumber);
                // Update positions after drop
                updateItemPositions(targetList);

                // Update the card's category attribute to match the new list
                // item.setAttribute('cardid', targetList.id);
                item.classList.remove('dragging');

                // Log the result
                console.log(`Item ${itemId} dropped at list ${targetList.id}`);
                // topListsSettings.targetList.id = itemId 

            }
        });
    }

});

// Function to update positions of items in the same list after a drop
function updateItemPositions() {
    // Get the container element containing all lists
    const bookmarksBar = document.getElementById('bookmarkbar');
    // Get all lists with class "list"
    const lists = bookmarksBar.querySelectorAll('.list');

    lists.forEach(list => {
        // Get all items in the current list
        const itemsToUpdate = Array.from(list.children);
        itemsToUpdate.forEach((item, index) => {
            const itemId = item.id;
            newPosition = index + 1; // Update row number
            console.log(`Position of item ${itemId} updated to`, newPosition, `on list number`, list.id);

            // Update the position of the item in the template object
            templateTopListsSettings["topListsSettings"][itemId] = {
                "list": list.id,
                "pos": newPosition
            };

            // Save the updated template object to local storage
            chrome.storage.local.set(templateTopListsSettings).then(() => {
                console.log("Value is set");
            });
        });
    });
}



document.addEventListener("DOMContentLoaded", () => {

    chrome.storage.local.get('topListsSettings').then((items) => {
        for (const item in items['topListsSettings']) {
            const id = item;
            const data = items.topListsSettings[item];
            const listId = data.list;
            const pos = data.pos;

            // Get the list element by its ID
            const list = document.getElementById(listId);

            // Get the element of the item that we will append to the list
            const itemElement = document.getElementById(id);

            // If both list and item elements exist
            if (list && itemElement) {
                // Get all existing items in the list
                const existingItems = list.children;

                // Ensure position is within bounds
                const insertIndex = Math.min(pos - 1, existingItems.length);

                // If the position is out of bounds, append the item to the end of the list
                if (insertIndex === existingItems.length) {
                    list.appendChild(itemElement);
                } else {
                    // Insert the item at the calculated position
                    list.insertBefore(itemElement, existingItems[insertIndex]);
                }
            }
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea"); // Append to dropArea

    // Add event listener for dragover to allow dropping over dropArea
    dropArea.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    dropArea.addEventListener('drop', function (event) {
        event.preventDefault();
        const targetList = event.target.closest('.drop-area');
        const itemId = event.dataTransfer.getData('text/plain');
        const item = document.getElementById(itemId);

        if (item) {
            targetList.appendChild(item);
            item.classList.remove('dragging');
        }
    });

});


