$(document).ready(function () {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    // console.log(tab);    //log all avilable tab's object opions 

    var isSVG = new Boolean(true);

    var weburl = tab.url;
    $('#webUrl').attr("href", weburl);
    $('#urlInput').attr("value", weburl);
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

      if (iconImg.complete) {
        
        // console.log(colorThief.getPalette(iconImg) ); 
        console.log("iconImg complete");
      } else {
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
      }

    } //end else if isSVG
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
    } else {
      bookmarkCard("remove");
      bookmarkAdded = false;
      console.log(BookeID);
      console.log("  bookmarkCard(remove); ");
      $('#BookmarkButton').removeClass("red").addClass("green").text("Bookmark it");
      
    }

    

  });  //Bookmark button






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