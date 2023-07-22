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
  if ( addRemove == "remove" ){
    console.log("this  is remove");
    console.log(BookeID);
    if (BookeID >= 0) {
      console.log(" this zz chrome.bookmark.remove section");
    console.log(BookeID);
    chrome.bookmarks.remove(BookeID, (Removed) => {
      console.log("removed success");
      // console.log(Removed);
      $('#errTitle').removeClass("green").addClass("red").text("Bookmark removed");

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

  const changedFaviconURL = document.querySelector('#iconUrl');
  console.log(changedFaviconURL.getAttribute("href"));

  chrome.bookmarks.getTree(function (itemTree) {
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
        $('#errLog').append("<p>" + node.title + "</p> <a href=" + ">" + node.url + "</a>");
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
