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
      $('#icon').attr("src", iconurl);

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

  function setCardColor() {
    const cardColor = document.getElementById("card");
    $(".itemColor").click(function () {
      var imgID = $(this).prop('id').replace("palette", "");
      // console.log(imgID);
      const imgRGB = $(this).attr("color");
      // console.log(imgRGB);
      cardColor.setAttribute("style", `background: linear-gradient(to left, ${imgRGB}, black)`);
    })
  }


  function runGetColor(isSVG) {

    const colorThief = new ColorThief();

    const cardDiv = document.getElementById("card");
    const iconImg = document.getElementById("icon");
    if (isSVG) {
      console.log("Can't get favicon colors from SVG");

      // $('#maxColor').attr("style", `background-color: white  `);
      // $('#minColor').attr("style", `background-color:  black `);

      setCardColor();

    }
    else if (!isSVG) {

      // if (iconImg.complete) {}
      iconImg.addEventListener('load', function () {
        cardDiv.setAttribute("style", `background: linear-gradient(to left, rgb(${colorThief.getColor(iconImg)}), black)`);

        obj = colorThief.getPalette(iconImg);

        // getMinMaxColor(obj); //show Min and Max value of palettes

        // $('.rainbow').attr("style", `display:none`);
        const palette = document.querySelector('.palette');
        obj.reduce((palette, rgb, pos) => {
          const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const swatch = document.createElement('div');
          swatch.style.setProperty('--color', color);
          swatch.setAttribute('color', color);
          swatch.setAttribute('id', `palette` + pos);
          swatch.setAttribute('class', `itemColor`);
          palette.appendChild(swatch);
          return palette;
        }, palette)

        setCardColor();

      });


    } //end else if isSVG
  }

  function searchBookmark(currentURL) {
    let searching = chrome.bookmarks.search({ url: currentURL });
    searching.then((bookmarks) => {
      try {
        console.log(bookmarks);
        const currentBookmarkID = bookmarks['0'].id;
        const currentBookmarkCategory = bookmarks['0'].parentId;

        $('#errTitle').removeClass("red").addClass("green").text("We found this Bookmark with id: " + currentBookmarkID + "   you can (Store it)");

        $('#categories').attr("bookmarkid", currentBookmarkID);
      } catch (error) {
        console.log("searchs on bookmarks got no results, this url is uniqe");
        $('#StoreButton').attr("disabled", true);
      }




      // document.getElementById('categories').value=currentBookmarkCategory;
    });
  }

  document.getElementById("titleInput").addEventListener("keyup", function () {
    // console.log(this.value);

    inputTextValue = this.value;
    $('.title').text(inputTextValue);
    countTitle();

  }, false);



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

    chrome.bookmarks.getTree(function (itemTree) {
      const bookmarkBarChildren = itemTree[0].children[0].children
      // console.log(bookmarkBarChildren);
      let bookmarkitems = {
        "bookmarksCategory": {
          1
            :
            { title: 'Bookmarks bar', id: '1' }
        }
      };
      bookmarkBarChildren.forEach(function (item) {


        if (item.parentId == 1 && item.dateGroupModified) {
          let bookmarkitem = {
            "title": item.title,
            "id": item.id
          }

          console.log(bookmarkitem);

          Object.assign(bookmarkitems.bookmarksCategory, { [item.id]: bookmarkitem });
          var option = document.createElement("option");
          option.text = item.title;
          option.value = item.id;

          var select = document.getElementById("categories");
          select.appendChild(option);

        }

      });
      console.log(bookmarkitems);

      chrome.storage.local.set(bookmarkitems).then(() => {
        console.log("bookmarkitems is set");
      });

      chrome.storage.local.get(["bookmarksCategory"]).then((result) => {
        console.log("Value currently is ");
        console.log(result);
      });

    });
  });


  try {
    chrome.storage.local.get(['bookmarksCategory']).then((result) => {
      console.log("Value currently is ");
      console.log(result);
      const inside = result.bookmarksCategory

      for (const cat in inside) {

        // console.log(inside[cat]);

        var option = document.createElement("option");
        option.text = inside[cat].title;
        option.value = inside[cat].id;

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
    console.log("clicked StoreButton");

    const changedTitle = document.querySelector('#webTitle');
    const changedURL = document.querySelector('#domain').getAttribute("title");
    const chnagedDomain = document.querySelector('#domain').innerHTML;
    const changedCard = document.querySelector('#card').getAttribute("style");
    const changedIcon = document.querySelector('#icon').getAttribute("src");
    const changedCategoryID = document.querySelector('#categories').getAttribute("catvalue");
    const changedCategoryTitle = document.querySelector('#categories').getAttribute("cattext");
    const bookmarkID = document.querySelector('#categories').getAttribute("bookmarkid");
    const changedFont = document.querySelector('#webTitle').getAttribute("style");



    chrome.storage.local.set({
      [bookmarkID]: {
        "Title": changedTitle.innerHTML,
        "Font": changedFont,
        "URL": changedURL,
        "Domain": chnagedDomain,
        "Style": changedCard,
        "Icon": changedIcon,
        "CategoryID": changedCategoryID,
        "CategoryTitle": changedCategoryTitle
      }
    }).then(() => {
      console.log("Value is set stored local");
    });



  });  //end StoreButton




});



function getMinMaxColor(obj) {
  // console.log(obj);

  var map1 = obj.map(([a, b, c]) => [a + b + c])
  // console.log(map1);

  maxV = Math.max.apply(null, map1);
  // console.log(maxV);
  minV = Math.min.apply(null, map1);
  // console.log(minV);

  const indexmaxV = map1.reduce((accumulator, current, index) => {
    return current > map1[accumulator] ? index : accumulator;
  }, 0);
  // console.log(indexmaxV);
  // console.log(obj[indexmaxV]);

  const indexminV = map1.reduce((accumulator, current, index) => {
    return current < map1[accumulator] ? index : accumulator;
  }, 0);
  // console.log(indexminV);
  // console.log(obj[indexminV]);

  $('#maxColor').attr("style", `background-color:  rgb(${obj[indexmaxV]}) `);
  $('#minColor').attr("style", `background-color:  rgb(${obj[indexminV]}) `);

}




































function countTitle() {

  $(".title").each((i, el) => {
    var length = $(el).text().length;

    // console.log("letters " + length);

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
  });

} // countTitle end

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
    console.log(itemTree);
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



  //to publish to server as <div> outerHtml
  const changedCARD = document.querySelector('#card');
  console.log(changedCARD);


}

$(document).on("click", "#similar", function () {
  // Do something with `$(this)`.
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
