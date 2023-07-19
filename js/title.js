function countTitle() {

  $(".title").each((i, el) => {
    var length = $(el).text().length;
    $(el).addClass("text-length-" + length);
    console.log("letters " + length);

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
  // for (x = 1; x <= 35; x++) {
  //   console.log("letter " + x + " font " + Math.floor(x.map(10, 35, 35, 15)));
  // }

} // countTitle end


//creates a listener for when you press a key
window.onkeyup = keyup;

var inputTextValue;

function keyup(e) {
  inputTextValue = e.target.value;
  $('.title').text(inputTextValue);
  //listens for you to press the ENTER key
  // if (e.keyCode == 13) {
  //   window.location = "https://duckduckgo.com/?q=" + inputTextValue;
  // }
  countTitle();

}
