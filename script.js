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
          // console.log(bitFlag);
          total[position - 12] = (total[position - 12] | tmp);
          // console.log(total[position - 12].toString(16));
          strings.push(total[position - 12]);
        }
        else {
          // console.log("bitflag was false");
          total[position] = tmp;
          // console.log(list[i]);
          // console.log(total[position].toString(16));
        }
        tmp = 0x00;
        position++;

        if (position%12 == 0 && position != 0){
          // console.log("setting bit flag");
          bitFlag = !bitFlag;
          // console.log(list[i]);
        }
        // if (position == 11){
        //   console.log(list[i]);
        // }
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

// function hex2a(hexx) {
//     var hex = hexx.toString();//force conversion
//     var str = '';
//     for (var i = 0; i < hex.length; i += 2)
//         str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//     return str;
// }


(function () {
var textFile = null,
  makeTextFile = function() {
    var string = "";

    for (var i = 0; i < strings.length; i++){
      // console.log(strings[i].toString(16));
      // string += hex2a(strings[i]);
      // console.log(hex2a(strings[i]));
      // console.log(String.fromCharCode(strings[i]));
      string += String.fromCharCode(strings[i]);
      // console.log("ˇ");
    }

    var data = new Blob([string], {encoding: "ANSI", type: "text/plain;charset=ANSI"});
    console.log(data);

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
