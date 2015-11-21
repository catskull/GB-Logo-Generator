var mouseDown = 0;
var blackFlag = 0;
var tmp = 0x00;
var bitFlag = 0;
var total = [];
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
  // console.log("clicked!");
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

function convertToHex() {
    var list = document.getElementsByTagName("TD");
    for (var i = 0; i < list.length; i++){
      bgColor = list[i].style.backgroundColor;
      if (i%4 == 3){ // last item in group of 4
        if (bgColor == "black"){
          if (bitFlag){
            tmp = tmp | 0x01;
          }
          else {
            tmp = tmp | 0x10;
          }
        }

        if (bitFlag){
          total[position - 11] = total[position - 11] | tmp;
          console.log(total[position - 11].toString(16));
        }
        else {
          total[position] = tmp;
          // console.log(total[position].toString(16));
        }
        tmp = 0x00;
        position++;

        if (position%11 == 0){
          // console.log("setting bit flag");
          bitFlag = !bitFlag;
        }
        if (position == 11){
          console.log(list[i]);
        }
      }
      if (i%4 == 0 && bgColor == "black"){ // first item in group of 4
        if (bitFlag){
          tmp = tmp | 0x08;
        }
        else {
          tmp = tmp | 0x80;
        }
      }

      if (i%4 == 1 && bgColor == "black"){
        if (bitFlag){
          tmp = tmp | 0x04;
        }
        else {
          tmp = tmp | 0x40;
        }
      }

      if (i%4 == 2 && bgColor == "black"){
        if (bitFlag){
          tmp = tmp | 0x02;
        }
        else {
          tmp = tmp | 0x20;
        }
      }
    }
}
