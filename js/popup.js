$(document).ready(function () {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
   console.log(tab);    //log all avilable tab's object opions 
    var isSVG= new Boolean(true);

    var weburl = tab.url;
    $('#webUrl').attr("href", weburl);
    $('#urlInput').attr("value", weburl);
    var iconurl = tab.favIconUrl;
    if (iconurl) {
      $('#iconUrl').attr("href", iconurl);
      $('#icon').attr("src", iconurl);
      // var iconElement = document.getElementById('icon');
      // iconElement.src = iconurl;
      // iconElement.hidden = false;

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
          runGetColor();
        }
      };
      xhttp.open("HEAD", iconurl, true);
      xhttp.send();
    }

    var webTitle = tab.title;
    $('#webTitle').text(webTitle);
    $('#titleInput').attr("value", webTitle);


    $(function () {
      let domain = (new URL(weburl));
      domain = domain.hostname;
      $('#domain').text(domain);

    })

      function runGetColor(){

      
    const colorThief = new ColorThief();

    const cardDiv = document.getElementById("card");
    const iconImg = document.getElementById("icon");
    if (isSVG) {
      console.log("Can't get favicon colors from SVG");
  
      $('#maxColor').attr("style", `background-color: white  `);
      $('#minColor').attr("style", `background-color:  black `);

      setCardColor();

    }
    else if (!isSVG) {

      if (iconImg.complete) {
        cardDiv.setAttribute("style", `background: linear-gradient(to left, rgb(${colorThief.getColor(iconImg)}), black)`);
        // console.log(colorThief.getPalette(iconImg) ); 
        console.log("iconImg not complete");
      } else {
        iconImg.addEventListener('load', function () {

          // $('.rainbow').attr("style", `display:none`);

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
            return current > map1[accumulator] ? index : accumulator;
          }, 0);
          console.log(indexmaxV);
          console.log(obj[indexmaxV]);

          const indexminV = map1.reduce((accumulator, current, index) => {
            return current < map1[accumulator] ? index : accumulator;
          }, 0);
          console.log(indexminV);
          console.log(obj[indexminV]);


          $('#maxColor').attr("style", `background-color:  rgb(${obj[indexmaxV]}) `);
          $('#minColor').attr("style", `background-color:  rgb(${obj[indexminV]}) `);

          const palette = document.querySelector('.palette');
          obj.reduce( (palette,rgb, pos) => {
            const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;        
            const swatch = document.createElement('div');
            swatch.style.setProperty('--color', color);
            swatch.setAttribute('color', color);
            swatch.setAttribute('id', `palette`+pos);
            swatch.setAttribute('class', `itemColor`);
            palette.appendChild(swatch);
            return palette;
        }, palette)

        setCardColor();

        });
      }

    } //end else if isSVG
  }

    countTitle();
  });

  function setCardColor(){
  const cardColor = document.getElementById("card");
  $(".itemColor").click(function () {
    var imgID = $(this).prop('id').replace("palette", "");
    // console.log(imgID);
    const imgRGB = $(this).attr("color");
    // console.log(imgRGB);
    cardColor.setAttribute("style", `background: linear-gradient(to left, ${imgRGB}, black)`);
})
}


});

