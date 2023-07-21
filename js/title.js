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

  // //For Bookmarking
  //    chrome.bookmarks.create(
  //   {  'title': changedTitle.innerHTML,
  //     'url': changedWebpageURL.getAttribute("href")
  // },
  //   function(newFolder) {
  //     console.log("added folder: " + newFolder.title);
  //     console.log("id of folder: " + newFolder.id);
  //     console.log(newFolder);
  //   },
  // );

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
      console.log("error in DomainBookmarkURL");
    }


    function compareURLs(DomainfromBookmark , DomainfromCard) {
      if (DomainfromBookmark == DomainfromCard) {
        // console.log(node.url); 
        countSimilar++;
        console.log("found similar");
        $('#errTitle').text("Found " + countSimilar + " similar URL domain with title:")
        $('#errLog').append("<p>" + node.title + "</p> <a href=" + ">" + node.url + "</a>");
      }
    }
 
  }



  //to publish to server as <div> outerHtml
  const changedCARD = document.querySelector('#card');
  console.log(changedCARD);



}
