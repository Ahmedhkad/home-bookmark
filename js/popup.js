console.log("popup js ahmed workds");
document.addEventListener("DOMContentLoaded", () => {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    console.log(tab);    //log all avilable tab's object opions 

    var isSVG = new Boolean(true);

    var weburl = tab.url;
    $('#webUrl').attr("href", weburl);
    $('#urlInput').attr("value", weburl);
    searchBookmark(weburl);
    var iconurl = tab.favIconUrl;
    if (iconurl) {
      // $('#iconUrl').attr("href", iconurl);
      // $('#icon').attr("src", iconurl);

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
          const iconType = this.getResponseHeader('content-type');
          console.log(iconType)

          if (iconType == 'image/svg+xml') {
            isSVG = true;
            console.log("image is svg dont run colorThief !!");
          } else {
            isSVG = false;
            console.log("isSVG false");
          }
          runGetColor(isSVG);
          getIconEncode(iconurl, iconType)
        }

      };
      xhttp.open("HEAD", iconurl, true);
      xhttp.send();

    }

    var webTitle = tab.title;
    $('#webTitle').text(webTitle);
    $('#titleInput').attr("value", webTitle);

    try {
      let domain = (new URL(weburl));
      domain = domain.hostname;
      $('#domain').text(domain);
      $('#domain').attr("title", weburl);
    } catch (error) {
      console.log("cant get url domain");
    }

    countTitle();
    setCardColor();
  });

  const getIconEncode = (url, iconType) => {
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'arraybuffer';
    xhttp.onload = function () {
      //Array of 8-bit unsigned int
      var arr = new Uint8Array(this.response);
      // String.fromCharCode returns a 'string' from the specified sequence of Unicode values
      var raw = String.fromCharCode.apply(null, arr);
      //create base-64 encoded ASCII string from a String object 
      var b64 = btoa(raw);
      var dataURL = 'data:' + iconType + ';base64,' + b64;
      console.log(dataURL);
      $('#icon').attr("src", dataURL);
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function setCardColor() {
    const cardColor = document.getElementById("card");
    $(".itemColor").click(function () {
      var imgID = $(this).prop('id').replace("palette", "");
      // console.log(imgID);
      const imgRGB = $(this).attr("color");
      // console.log(imgRGB);
      cardColor.setAttribute("style", `background: linear-gradient(to left, rgb(${imgRGB}), black)`);
      cardColor.setAttribute("color", imgRGB)
    })

  }




  function runGetColor(isSVG) {

    const colorThief = new ColorThief();

    const pickerInput = document.getElementById("colourPicker");
    const cardDiv = document.getElementById("card");
    const iconImg = document.getElementById("icon");
    if (isSVG) {
      console.log("Can't get favicon colors from SVG");
      setCardColor();
    }
    else if (!isSVG) {
      // if (iconImg.complete) {}
      iconImg.addEventListener('load', function () {
        const rgb = colorThief.getColor(iconImg)
        cardDiv.setAttribute("style", `background: linear-gradient(to left, rgb(${rgb}), black)`);
        cardDiv.setAttribute("color", rgb)
        pickerInput.setAttribute("value", rgbToHex(rgb[0], rgb[1], rgb[2]))

        obj = colorThief.getPalette(iconImg);

        const palette = document.querySelector('.palette');
        obj.reduce((palette, rgb, pos) => {
          const colorRGB = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const pal = document.createElement('div');
          pal.style.setProperty('--color', colorRGB);
          pal.setAttribute('color', rgb);
          pal.setAttribute('id', `palette` + pos);
          pal.setAttribute('class', `itemColor`);
          palette.appendChild(pal);
          return palette;
        }, palette)

        setCardColor();

      });


    }
  }

  function searchBookmark(currentURL) {
    let searching = chrome.bookmarks.search({ url: currentURL });
    searching.then((bookmarks) => {
      try {
        console.log("searchBookmark is: ", bookmarks);
        const currentBookmarkID = bookmarks['0'].id;
        const currentBookmarkCategory = bookmarks['0'].parentId;
        console.log('parentId ' + currentBookmarkCategory);

        $('#errTitle').removeClass("red").addClass("green").text("We found this Bookmark with id: " + currentBookmarkID + "   you can (Store it)");

        $('#categories').attr("bookmarkid", currentBookmarkID);
        // $('#categories').value = currentBookmarkCategory ;
        const select = document.querySelector('#categories');
        select.value = currentBookmarkCategory

      } catch (error) {
        console.log("searchs on bookmarks got no results, this url is uniqe");
        $('#StoreButton').attr("disabled", true);
      }


      // document.getElementById('categories').value = currentBookmarkCategory;
    });
  }

  document.getElementById("titleInput").addEventListener("keyup", function () {
    // console.log(this.value);
    inputTextValue = this.value;
    $('.title').text(inputTextValue);
    countTitle();
  }, false);

  document.getElementById("colourPicker").addEventListener("click", function (ev) {
    const cardColor = document.getElementById("card");
    $('#colourPicker').on('input',
      function () {
        const colorValue = $(this).val()
        const colorRGB = hexToRgb(colorValue)
        cardColor.setAttribute("style", `background: linear-gradient(to left, rgb(${colorRGB}), black)`);
        cardColor.setAttribute("color", colorRGB)
      }
    );

  }, false);

  const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => '#' + r + r + g + g + b + b)
      .substring(1).match(/.{2}/g)
      .map(x => parseInt(x, 16))

  const rgbToHex = (r, g, b) => '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0')).join('')



  document.getElementById("urlInput").addEventListener("keyup", function (ev) {
    // console.log(this.value);
    inputURLValue = this.value;
    $('.domainurl').attr("title", inputURLValue);
    try {
      DomainCardURL = (new URL(inputURLValue)).hostname
      $('#domain').text(DomainCardURL);

    } catch (error) {
      // $('#domain').text("Unknown URL");
    }

  }, false);



  document.getElementById("refreshButton").addEventListener('click', function () {
    console.log("clicked refresh");
    $('#categories').html(''); //clean options
    chrome.bookmarks.getTree(function (itemTree) {
      // const bookmarkBarChildren = itemTree[0].children[0].children
      const bookmarkBarChildren = itemTree[0].children
      console.log("bookmarkBarChildren itemTree[0]", itemTree[0]);
      let bookmarkitems = {
        "bookmarksCategory": {
        }
      };
      let indexer = 0;

      function processBookmark(item, depth, isLast) {
        let prefix = "";
        if (depth > 0) {
          prefix += "\u00A0".repeat((depth - 1) * 4); // Adjust spacing as needed
          if (item.children && item.children.some(child => child.dateGroupModified)) {
            prefix += "[-]";
          } else {
            prefix += "|_";
          }
          prefix += "\u00A0"; // Add space for indentation after prefix
        }
        console.log(prefix + " " + item.title);
        indexer++;

        let bookmarkitem = {
          "title": item.title,
          "id": item.id,
          "prefixedTitle": prefix + " " + item.title,
          "indexer": indexer
        }

        Object.assign(bookmarkitems.bookmarksCategory, { [item.id]: bookmarkitem });

        var option = document.createElement("option");
        option.text = prefix + " " + item.title;
        option.value = item.id;

        var select = document.getElementById("categories");
        select.appendChild(option);

        if (item.children) {
          const folders = item.children.filter(child => child.dateGroupModified); // Filter out non-folder items
          const childrenCount = folders.length;
          folders.forEach(function (child, index) {
            const isLastChild = index === childrenCount - 1;
            processBookmark(child, depth + 1, isLastChild);
          });
        }
      }

      const folders = bookmarkBarChildren.filter(child => child.dateGroupModified); // Filter out non-folder items
      const foldersCount = folders.length;
      folders.forEach(function (item, index) {
        const isLastItem = index === foldersCount - 1;
        processBookmark(item, 0, isLastItem);
      });

      chrome.storage.local.set(bookmarkitems).then(() => {
        console.log("bookmarkitems is set");
      });

      chrome.storage.local.get(["bookmarksCategory"]).then((result) => {
        console.log("bookmarksCategory Values currently is ", result);
        // console.log(result);
      });

    });
  });


  try {
    chrome.storage.local.get(['bookmarksCategory']).then((result) => {
      console.log("try get(['bookmarksCategory'])   is ");
      console.log(result);
      const inside = result.bookmarksCategory

      // Convert object values to an array and sort by indexer
      const cats = Object.values(inside).sort((a, b) => a.indexer - b.indexer);

      for (const cat in cats) {
        // console.log(cats[cat]);
        var option = document.createElement("option");
        option.text = cats[cat].prefixedTitle;
        option.value = cats[cat].id;

        var select = document.getElementById("categories");
        select.appendChild(option);
      }

    });

  } catch (error) {
    console.log("stored bookmark's category not found , please click refresh");
  }



  document.getElementById("checkButton").addEventListener('click', function () {
    console.log("clicked check");
    checkCard();
  });  //check button

  var bookmarkAdded = false;


  document.getElementById("BookmarkButton").addEventListener('click', function () {
    console.log("clicked Bookmark Button ");

    if (!bookmarkAdded) {
      console.log(bookmarkCard("add"));
      $('#BookmarkButton').removeClass("green").addClass("red").text("Remove Bookmark");
      bookmarkAdded = true;
      $('#StoreButton').attr("disabled", false);
    } else {
      bookmarkCard("remove");
      bookmarkAdded = false;
      console.log(BookeID);
      console.log("  bookmarkCard(remove); ");
      $('#BookmarkButton').removeClass("red").addClass("green").text("Bookmark it");
    }
  });  //StoreButton


  document.getElementById("StoreButton").addEventListener('click', function () {
    // console.log("clicked StoreButton");
    const changedTitle = document.querySelector('#webTitle');
    const changedURL = document.querySelector('#domain').getAttribute("title");
    const chnagedDomain = document.querySelector('#domain').innerHTML;
    const changedCardColor = document.querySelector('#card').getAttribute("color");
    const changedIcon = document.querySelector('#icon').getAttribute("src");
    const changedCategoryID = document.querySelector('#categories').getAttribute("catvalue");
    const changedCategoryTitle = document.querySelector('#categories').getAttribute("cattext");
    const bookmarkID = document.querySelector('#categories').getAttribute("bookmarkid");
    const changedFont = document.querySelector('#webTitle').getAttribute("fontsize");

    chrome.storage.local.set({
      [bookmarkID]: {
        "Title": changedTitle.innerHTML,
        "Font": changedFont,
        "URL": changedURL,
        "Domain": chnagedDomain,
        "Color": changedCardColor,
        "EncodedIcon": changedIcon,
        "CategoryID": changedCategoryID,
        "CategoryTitle": changedCategoryTitle,
        "Style": "smallwide"
      }
    }).then(() => {
      console.log("Value is set stored local");
    });

  });  //end StoreButton




});



// function getMinMaxColor(obj) {
//   // console.log(obj);

//   var map1 = obj.map(([a, b, c]) => [a + b + c])
//   // console.log(map1);

//   maxV = Math.max.apply(null, map1);
//   // console.log(maxV);
//   minV = Math.min.apply(null, map1);
//   // console.log(minV);

//   const indexmaxV = map1.reduce((accumulator, current, index) => {
//     return current > map1[accumulator] ? index : accumulator;
//   }, 0);
//   // console.log(indexmaxV);
//   // console.log(obj[indexmaxV]);

//   const indexminV = map1.reduce((accumulator, current, index) => {
//     return current < map1[accumulator] ? index : accumulator;
//   }, 0);
//   // console.log(indexminV);
//   // console.log(obj[indexminV]);

//   $('#maxColor').attr("style", `background-color:  rgb(${obj[indexmaxV]}) `);
//   $('#minColor').attr("style", `background-color:  rgb(${obj[indexminV]}) `);

// }












function countTitle() {

  $(".title").each((i, el) => {
    var length = $(el).text().length;
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
    console.log("fontsize " + fontsize);

    $(".title").css("fontSize", fontsize);

    const changedTitle = document.querySelector('#webTitle');
    changedTitle.setAttribute("fontsize", fontsize)
  });
}

var BookeID = -1;
chrome.bookmarks.onCreated.addListener(
  function handleCreated(id, bookmarkInfo) {
    console.log(`New bookmark ID: ${id}`);
    BookeID = id;
    console.log(`New bookmark URL: ${bookmarkInfo.url}`);
  }
);

function bookmarkCard(addRemove) {
  const changedTitle = document.querySelector('#webTitle');
  const changedurl = document.querySelector('#domain').getAttribute("title");

  if (addRemove == "add") {

    chrome.bookmarks.create(
      {
        'title': changedTitle.innerHTML,
        'url': changedurl
      },
      function (Booked) {
        // "dateAdded": 1669346404018,
        // "id": "8",
        // "index": 4,
        // "parentId": "3",
        // "title": "AdGuard Home",
        // "url": "http://192.168.99.99/"

        $('#errTitle').removeClass("red").addClass("green").text("Bookmark Successfully added");
        $('#errLog').text(" ");

        console.log(" zz bookmarkCard(add);  inside chrome.bookmarks.create");
        // BookeID = Booked.id;
        $('#categories').attr("bookmarkid", Booked.id);
        // console.log(BookeID);
        for (const [key, value] of Object.entries(Booked)) {
          console.log(`${key}: ${value}`);

          var c, r, t;
          t = document.createElement('table');
          r = t.insertRow(0);
          c = r.insertCell(0);
          c.innerHTML = key;
          c = r.insertCell(1);
          c.innerHTML = value;
          document.getElementById("errLog").appendChild(t);
        }
      },
    );  //end chrome.create

  }
  if (addRemove == "remove") {
    console.log("this  is remove");
    console.log(BookeID);
    if (BookeID >= 0) {
      console.log(" this zz chrome.bookmark.remove section");
      console.log(BookeID);
      chrome.bookmarks.remove(BookeID, (Removed) => {
        console.log("removed success");
        // console.log(Removed);
        $('#errTitle').removeClass("green").addClass("red").text("Bookmark removed");
        $('#errLog').text("Bookmark ID: " + BookeID + "  removed!");
      });
    }
  }


}

function checkCard() {

  // clean after every click
  $('#errLog').text(" ");
  $('#errTitle').text(" ");

  const changedTitle = document.querySelector('#webTitle');
  console.log(changedTitle.innerHTML);

  const changeddomainZ = document.querySelector('#domain');
  changedurl = changeddomainZ.innerHTML
  console.log(changedurl);

  // const changedFaviconURL = document.querySelector('#iconUrl');
  // console.log(changedFaviconURL.getAttribute("href"));

  chrome.bookmarks.getTree(function (itemTree) {
    // console.log(itemTree);
    itemTree.forEach(function (item) {
      processNode(item);
    });
  });
  let countSimilar = 0;
  function processNode(node) {
    // print folder list and their folder inside
    // if(node.children) { console.log(node.title); }

    // recursively process child nodes
    if (node.children) {
      node.children.forEach(function (child) { processNode(child); });
    }
    // console.log(node);

    // print leaf nodes URLs to console
    try {
      DomainBookmarkURL = (new URL(node.url)).hostname
      // console.log(DomainBookmarkURL);
      compareURLs(DomainBookmarkURL, changedurl);
    } catch (error) {
      // console.log("error in DomainBookmarkURL");
    }


    function compareURLs(DomainfromBookmark, DomainfromCard) {
      if (DomainfromBookmark == DomainfromCard) {
        // console.log(node.url); 
        countSimilar++;
        // console.log("found similar");
        $('#errTitle').removeClass("green").addClass("yellow").text("Found " + countSimilar + " similar URL domain with title:")
        $('#errLog').append("<div><p>" + node.title + "</p> <a href=" + node.url + ">" + node.url + "</a><button id=" + "similar" + " bookid=" + node.id + " >X</button></div>");
      }
      else if (countSimilar == 0) {
        $('#errTitle').removeClass("red").addClass("green").text("Success! this URL is unique")
      }

    }

  }



}

$(document).on("click", "#similar", function () {
  similarid = this.attributes.bookid.nodeValue;
  // console.dir(this);
  chrome.bookmarks.remove(similarid, (Removed) => {
    console.log("removed bookmark with id " + similarid);
  });

  checkCard();
});

$(document).on("change", "#categories", function () {
  let catText = this.options[this.selectedIndex].text
  let catValue = this.options[this.selectedIndex].value
  console.log(catText);
  console.log(catValue);
  $('#categories').attr("cattext", catText).attr("catvalue", catValue);

});
