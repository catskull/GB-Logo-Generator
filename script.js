var mouseDown = 0;
var blackFlag = 0;
var tmp = 0x00;
var bitFlag = 0;
var total = [];
var strings = [];
var position = 0;
var bgColor;

document.onmousedown = function() {
  ++mouseDown;
};

document.onmouseup = function() {
  --mouseDown;
};

function drag(element){
  if (mouseDown){
    if (!blackFlag){
      element.style.backgroundColor = "white";
    }
    else {
      element.style.backgroundColor = "black";
    }
  }
}

function fill(element){
    if (element.style.backgroundColor == "black"){
      element.style.backgroundColor = "white";
      blackFlag = 0;
    }
    else {
      element.style.backgroundColor = "black";
      blackFlag = 1;
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
  var top = 0;
  var bottom = 0;
  for (var block = 0; block < 48; block ++){
    top = 0;
    bottom = 0;
    for (var column = 0; column < 4; column ++){
      // first add top number
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 96) + column].style.backgroundColor;
      if (bgColor == "black"){
        top += Math.pow(2, 3 - column);
      }
      // then bottom number
      bgColor = list[((block % 12) * 4) + (Math.floor(block / 12) * 96) + column + 48].style.backgroundColor;
      if (bgColor == "black"){
        bottom += Math.pow(2, 3 - column);
      }
    }
    hexString += convertIntToChar(bottom);
    hexString += convertIntToChar(top);
  }
  console.log(hexString);
  console.log(hexString.length);
  return hexString;
}

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

(function () {
var textFile = null,
  makeTextFile = function() {
    // var string = "";
    //
    // for (var i = 0; i < strings.length; i++){
    //   // console.log(strings[i].toString(16));
    //   // string += hex2a(strings[i]);
    //   // console.log(hex2a(strings[i]));
    //   // console.log(String.fromCharCode(strings[i]));
    //   string += String.fromCharCode(strings[i]);
    //   // console.log("ˇ");
    // }

    var hexdata = convertToHex();

    var byteArray = new Uint8Array(hexdata.length/2);
    for (var x = 0; x < byteArray.length; x++){
      byteArray[x] = parseInt(hexdata.substr(x*2,2), 16);
    }

    var data = new Blob([byteArray], {type: "application/octet-stream"});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


  var create = document.getElementById('download'),
    textbox = document.getElementById('textbox');

  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile();
    link.style.display = 'block';
  }, false);
})();
