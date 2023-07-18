$(document).ready(function () {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];

    var weburl = tab.url;
    $('#webUrl').attr("href", weburl);
    $('#urlInput').attr("value", weburl);
    var iconurl = tab.favIconUrl;
    if (iconurl) {
      $('#iconUrl').attr("href", iconurl);

      var iconElement = document.getElementById('icon');
      iconElement.src = iconurl;
      iconElement.hidden = false;
    }

    var webTitle = tab.title;
    $('#webTitle').text(webTitle);
    $('#titleInput').attr("value", webTitle);
    // $('#webTitle2').text(webTitle);


    $(function () {
      let domain = (new URL(weburl));
      domain = domain.hostname;
      $('#domain').text(domain);

    })
    const colorThief = new ColorThief();

    const cardDiv = document.getElementById("card");
    const iconImg = document.getElementById("icon");

    if (iconImg.complete) {
      cardDiv.setAttribute("style", `background: linear-gradient(to left, rgb(${colorThief.getColor(iconImg)}), black)`);
      // console.log(colorThief.getPalette(iconImg) ); 
    } else {
      iconImg.addEventListener('load', function () {
        cardDiv.setAttribute("style", `background: linear-gradient(to left, rgb(${colorThief.getColor(iconImg)}), black)`);

        obj = colorThief.getPalette(iconImg);
        console.log(obj);

        var map1 = obj.map(([a, b, c]) => [a + b + c])
        console.log(map1);

        maxV = Math.max.apply(null, map1);
        console.log(maxV);
        minV = Math.min.apply(null, map1);
        console.log(minV);

        const indexmaxV = map1.reduce((accumulator, current, index) => {
          return current < map1[accumulator] ? index : accumulator;
        }, 0);
        console.log(indexmaxV);
        console.log(obj[indexmaxV]);

        const indexminV = map1.reduce((accumulator, current, index) => {
          return current > map1[accumulator] ? index : accumulator;
        }, 0);
        console.log(indexminV);
        console.log(obj[indexminV]);


        $('#maxColor').attr("style", `background-color:  rgb(${obj[indexmaxV]}) `);
        $('#minColor').attr("style", `background-color:  rgb(${obj[indexminV]}) `);
      });

    }

    countTitle();
  });



});

