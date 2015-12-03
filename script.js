var mouseDown = false;
var blackFlag = false;
var lastElement = null;
//var tmp = 0x00;
//var bitFlag = 0;
//var total = [];
//var strings = [];
//var position = 0;
//var bgColor;

document.onmousedown = function() {
  mouseDown = true;
};

document.onmouseup = function() {
  mouseDown = false;
};

function mouseOutHandler(element){
  if (!mouseDown){
    fill(element);
  }
}

function mouseOverHandler(element){
  if (mouseDown){
    if (blackFlag){
      element.style.backgroundColor = "black";
    } else {
      element.style.backgroundColor = "white";
    }
  } else {
    fill(element);
  }
}

function mouseDownHandler(element){
  drag(element);
}

function mouseUpHandler(element){
  fill(element);
}

function drag(element){
  if (element.style.backgroundColor == "black"){
    blackFlag = true;
  } else {
    blackFlag = false;
  }
}

function fill(element){
  if (element.style.backgroundColor == "black"){
    element.style.backgroundColor = "white";
  } else {
    element.style.backgroundColor = "black";
  }
}

function invert() {
  var list = document.getElementsByTagName("TD");
  for (var i = 0; i < list.length; i++){
    fill(list[i]);
  }
}

function convertToHex(){
  var list = document.getElementsByTagName("TD");
  var hexString = "";
  var toptop = 0;
  var topbottom = 0;
  var bottomtop = 0;
  var bottombottom = 0;
  // there are 48 blocks total
  for (var block = 0; block < 24; block ++){
    toptop = 0;
    topbottom = 0;
    bottomtop = 0;
    bottombottom = 0;
    // each block has 4 columns
    for (var column = 0; column < 4; column ++){
      // block % 12 gives us which column of blocks we are in
      // Math.floor(block / 12) gives us which row of blocks we are in
      // if we are in the column n + 1 then we want to start 4 cells passed column n
      // if we are in row n + 1 then we want to start 96 cells passed row n
      // first add top number of top block
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column].style.backgroundColor;
      if (bgColor == "black"){
        // Math.pow(2, 3 - column) will give us 2^3 for the first column, and so on
        toptop += Math.pow(2, 3 - column);
      }
      // then bottom number of top block
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 48].style.backgroundColor;
      if (bgColor == "black"){
        topbottom += Math.pow(2, 3 - column);
      }
      // then top number of bottom block
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 96].style.backgroundColor;
      if (bgColor == "black"){
        bottomtop += Math.pow(2, 3 - column);
      }
      // then bottom number of bottom block
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 192) + column + 144].style.backgroundColor;
      if (bgColor == "black"){
        bottombottom += Math.pow(2, 3 - column);
      }
    }
    // the bottom is added to the string first, then the top
    hexString += convertIntToChar(toptop);
    hexString += convertIntToChar(topbottom);
    hexString += convertIntToChar(bottomtop);
    hexString += convertIntToChar(bottombottom);
  }
  console.log(hexString);
  console.log(hexString.length);
  return hexString;
}

// really basic function. May be kind of crappy.
function convertIntToChar(x){
  switch (x){
    case 0:
      return "0";
    case 1:
      return "1";
    case 2:
      return "2";
    case 3:
      return "3";
    case 4:
      return "4";
    case 5:
      return "5";
    case 6:
      return "6";
    case 7:
      return "7";
    case 8:
      return "8";
    case 9:
      return "9";
    case 10:
      return "A";
    case 11:
      return "B";
    case 12:
      return "C";
    case 13:
      return "D";
    case 14:
      return "E";
    case 15:
      return "F";
  }
}

function downloadFile(){
  var hexdata = convertToHex();

  var byteArray = new Uint8Array(hexdata.length/2);
  for (var x = 0; x < byteArray.length; x++){
    byteArray[x] = parseInt(hexdata.substr(x*2,2), 16);
  }

  var data = new Blob([byteArray], {type: "application/octet-stream"});

  textFile = window.URL.createObjectURL(data);

  // create the download link, then download it, then destroy it
  var a = document.createElement("a");
  a.style = "display: none";
  a.href = textFile;
  a.download = "logo.gb";
  a.click();
  window.URL.revokeObjectURL(textFile);
}
