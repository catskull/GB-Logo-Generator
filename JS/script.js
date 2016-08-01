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

function mouseOverHandler(element){
  if (mouseDown){
    if (blackFlag){
      element.style.backgroundColor = "black";
    } else {
      element.style.backgroundColor = "white";
    }
  }
}

function mouseDownHandler(element){
  fill(element);
  setBlackFlag(element);
}

function setBlackFlag(element){
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

function invertLogo() {
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
  var hexdata = "C38B020000000000C38B02FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF87E15F1600195E2356D5E1E9FFFFFFFFFFFFFFFFFFFFFFFFC3FD01FFFFFFFFFFC31227FFFFFFFFFFC31227FFFFFFFFFFC37E01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00C35001";
  hexdata += convertToHex();
  hexdata += "4C4F474F20524F4D00000000000000004353000000000101001033BB";
  // fill up the rest of the 32kb rom with 0xFF
  for (var i =0; i < 32432; i++){
    hexdata += "FF";
  }

  var byteArray = new Uint8Array(hexdata.length/2);
  for (var x = 0; x < byteArray.length; x++){
    byteArray[x] = parseInt(hexdata.substr(x*2,2), 16);
  }

  var data = new Blob([byteArray], {type: "application/octet-stream"});

  textFile = window.URL.createObjectURL(data);

  // create the download link, then download it, then destroy it
  var a = document.createElement("a");
  var clickEvent = new MouseEvent("click", {
    "view": window,
    "bubbles": true,
    "cancelable": false
  });
  a.style = "display: none";
  a.href = textFile;
  a.download = "logo.gb";
  a.dispatchEvent(clickEvent);
  setTimeout(function(){
    // document.body.removeChild(a);
    window.URL.revokeObjectURL(textFile);
  }, 100);
}

// precondition: string is the hex representation of bytes of data
// with NO spaces
function calculateChecksum(string){
  var totalChecksum = "";
  var firstChecksum = 0;
  var secondChecksum = 0;
  var first = 0;
  var second = 0;
  var carry = 0;
  for (x = 0; x < string.length; x += 2){
    // reset carry bit
    carry = 0;
    // get the hex values for a byte
    var first = convertCharToInt(string[x]);
    var second = convertCharToInt(string[x + 1]);
    // invert them
    first = invert(first);
    second = invert(second);
    // sum the least significant 4 bits
    secondChecksum += second;
    // if this result is greater than 15, then we have a carry bit
    if (secondChecksum > 15){
      secondChecksum -= 16;
      carry = 1;
    }
    firstChecksum += first + carry;
    // if this result is greater than 15, then we have a carry bit
    // but we don't care about it
    if (firstChecksum > 15){
      firstChecksum -= 16;
    }
  }
  // at the very end, convert the checksum ints to chars and put them
  // together. NOTE: checksum should always be a single byte
  totalChecksum += convertIntToChar(firstChecksum);
  totalChecksum += convertIntToChar(secondChecksum);
  return totalChecksum;
}

function convertCharToInt(x){
  switch (x){
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "A":
      return 10;
    case "B":
      return 11;
    case "C":
      return 12;
    case "D":
      return 13;
    case "E":
      return 14;
    case "F":
      return 15;
    case "a":
      return 10;
    case "b":
      return 11;
    case "c":
      return 12;
    case "d":
      return 13;
    case "e":
      return 14;
    case "f":
      return 15;
  }
}

function invert(x){
  return 15 - x;
}

function calculateGlobalChecksum(string){
  var totalChecksum = "";
  var firstChecksum = 0;
  var secondChecksum = 0;
  var thirdChecksum = 0;
  var fourthChecksum = 0;
  var first = 0;
  var second = 0;
  var carry = 0;

  for (x = 0; x < string.length; x += 3){
    if (x != 1002 && x != 1005){
      first = convertCharToInt(string[x+1]);
      second = convertCharToInt(string[x]);
      firstChecksum += first;
      if (firstChecksum > 15){
        firstChecksum -= 16;
        carry = 1;
      } else {
        carry = 0;
      }
      secondChecksum += second + carry;
      if (secondChecksum > 15){
        secondChecksum -= 16;
        carry = 1;
      } else {
        carry = 0;
      }
      thirdChecksum += carry;
      if (thirdChecksum > 15){
        thirdChecksum -= 16;
        carry = 1;
      } else {
        carry = 0;
      }
      fourthChecksum += carry;
      if (fourthChecksum > 15){
        fourthChecksum -= 16;
      }
    }
  }
  totalChecksum += convertIntToChar(fourthChecksum);
  totalChecksum += convertIntToChar(thirdChecksum);
  totalChecksum += convertIntToChar(secondChecksum);
  totalChecksum += convertIntToChar(firstChecksum);
  return totalChecksum;
}

function loadLogo(hexData){
  var row = new Array(4);
  var list = document.getElementsByTagName("TD");
  var formattedHexData = "";
  if (!hexData){
    hexData = prompt("Please enter the hex data. Whitespace is ignored.", "CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E");

  }
  // first make sure hexData is the properlength and eliminate whitespace in the string
  for (x = 0; x < hexData.length; x++){
    if (isValidHexValue(hexData[x])){
      formattedHexData += hexData[x];
    }
  }
  if (formattedHexData.length == 96){
    clearTable();
    // first do top half of logo
    for (x = 0; x < 48; x += 4){
      // convert 2 bytes of data
      row[0] = convertCharToInt(formattedHexData[x]);
      row[1] = convertCharToInt(formattedHexData[x+1]);
      row[2] = convertCharToInt(formattedHexData[x+2]);
      row[3] = convertCharToInt(formattedHexData[x+3]);
      for (y = 0; y < 4; y++){
        // set first bit
        if (Math.floor(row[y] / 8) == 1){
          list[x + (y*48)].style.backgroundColor = "black";
          row[y] -= 8;
        }
        // then second bit
        if (Math.floor(row[y] / 4) == 1){
          list[(x+1) + (y*48)].style.backgroundColor = "black";
          row[y] -= 4;
        }
        // then third bit
        if (Math.floor(row[y] / 2) == 1){
          list[(x+2) + (y*48)].style.backgroundColor = "black";
          row[y] -= 2;
        }
        // then fourth bit
        if (Math.floor(row[y] / 1) == 1){
          list[(x+3) + (y*48)].style.backgroundColor = "black";
        }
      }
    }
    // then do bottom half
    for (x = 48; x < 96; x += 4){
      // convert 2 bytes of data
      row[0] = convertCharToInt(formattedHexData[x]);
      row[1] = convertCharToInt(formattedHexData[x+1]);
      row[2] = convertCharToInt(formattedHexData[x+2]);
      row[3] = convertCharToInt(formattedHexData[x+3]);
      for (y = 0; y < 4; y++){
        // set first bit
        if (Math.floor(row[y] / 8) == 1){
          list[144 + x + (y*48)].style.backgroundColor = "black";
          row[y] -= 8;
        }
        // then second bit
        if (Math.floor(row[y] / 4) == 1){
          list[145 + x + (y*48)].style.backgroundColor = "black";
          row[y] -= 4;
        }
        // then third bit
        if (Math.floor(row[y] / 2) == 1){
          list[146 + x + (y*48)].style.backgroundColor = "black";
          row[y] -= 2;
        }
        // then fourth bit
        if (Math.floor(row[y] / 1) == 1){
          list[147 + x + (y*48)].style.backgroundColor = "black";
        }
      }
    }
  } else {
    alert("The hex data received was not the correct length!");
  }
}

function resetLogo(){
  loadLogo("CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E");
}

function isValidHexValue(x){
  var validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"];
  for (var i = 0; i < validValues.length; i++) {
    if (validValues[i] == x) return true;
  }
  return false;
}

function clearTable(){
  var list = document.getElementsByTagName("TD");
  for (x = 0; x < list.length; x++){
    list[x].style.backgroundColor = "white";
  }
}

function checkValidLogo(){
  // If the logo has changed, warn that the rom will not boot
}

function generateHeaderData(){
  // Using all the fields, generate a header
}

function uploadROM(){
  // Allow user to upload ROM and fill in data fields

}

// document.querySelector('input').addEventListener('change', function(){
//     var reader = new FileReader();
//     reader.onload = function(){
//         var binaryString = this.result;
//         document.querySelector('#result').innerHTML = binaryString;
//         console.log(binaryString);
//         }
//     reader.readAsBinaryString(this.files[0]);
//   }, false);

$(function() {

  // We can attach the `fileselect` event to all file inputs on the page
  $(document).on('change', ':file', function() {
    var input = $(this);//,
    //     numFiles = input.get(0).files ? input.get(0).files.length : 1,
    //     label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect');
  });

// You have to use callbacks, otherwise you will try to read a result that isn't ready
  $(document).ready(function(){
      $(':file').on('fileselect', function(e) {
          readFile(this.files[0], function(e) {
              //manipulate with result...
              parseUploadedHexString(e.target.result.hexEncode());
          });

      });
  });

  function readFile(file, callback){
      var reader = new FileReader();
      reader.onload = callback
      reader.readAsBinaryString(file);
  }


  // // We can watch for our custom `fileselect` event like this
  // $(document).ready( function() {
  //   var reader = new FileReader();
  //     $(':file').on('fileselect', function(event, numFiles, label) {
  //
  //       var f = this.files[0];
  //       reader.readAsText(f);
  //       console.log(reader.result);
  //
  //         var input = $(this).parents('.input-group').find(':text'),
  //             log = numFiles > 1 ? numFiles + ' files selected' : label;
  //
  //         if( input.length ) {
  //             input.val(log);
  //         } else if( log ){
  //             console.log(log);
  //         }
  //
  //     });
  // });

});

// THIS FUNCTION NEEDS TO BE CLEANED UP!!!!
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    var temp = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        temp = ("000"+hex).slice(-4);
        temp = temp.substr(2,3);
        temp = temp.toUpperCase();
        result += temp;
    }

    return result
}

function parseUploadedHexString(hexString){
  // first, trim the string to only contain header
  header = hexString.substr(512, 158);
  console.log("All data: " + header);
  nonsense = hexString.substr(0, 100);
  entryPoint = hexString.substr(512, 8);
  nintendoLogo = hexString.substr(520, 96);
  title = hexString.substr(616, 22);
  manufacturerCode = hexString.substr(638, 8);
  cgbFlag = hexString.substr(646, 2);
  newLisenceeCode = hexString.substr(648, 4);
  sgbFlag = hexString.substr(652, 2);
  cartridgeType = hexString.substr(654, 2);
  romSize = hexString.substr(656, 2);
  ramSize = hexString.substr(658, 2);
  destinationCode = hexString.substr(660, 2);
  oldLisenceeCode = hexString.substr(662, 2);
  romVersionNumber = hexString.substr(664, 2);
  console.log("ENTRY POINT: " + entryPoint);
  console.log("LOGO DATA: " + nintendoLogo);
  console.log("TITLE: " + title);
  console.log("TITLE DECODED: " + title.getASCIIFromHex());
  console.log("MANUFACTURER CODE: " + manufacturerCode);
  console.log("MANUFACTURER CODE DECODED: " + manufacturerCode.getASCIIFromHex());
  console.log("CGB FLAG: " + cgbFlag);
  console.log("NEW LISENCEE CODE: " + newLisenceeCode);
  console.log("NEW LISENCEE CODE DECODED: " + newLisenceeCode.getASCIIFromHex());
  console.log("SGB FLAG: " + sgbFlag);
  console.log("CARTRIDGE TYPE: " + cartridgeType);
  console.log("ROM SIZE: " + romSize);
  console.log("RAM SIZE: " + ramSize);
  console.log("DESTINATION CODE: " + destinationCode);
  console.log("OLD LISENCEE CODE: " + oldLisenceeCode);
  console.log("ROM VERSION NUMBER: " + romVersionNumber);
}

// String.prototype.reverse = function() {
//   returnVal = "";
//   for (i = this.length - 1; i >= 0; i--){
//     returnVal += this[i];
//   }
//   return returnVal;
// }

String.prototype.getASCIIFromHex = function() {
  returnString = "";
  // read the hex string two characters at a time
  for (i = 0; i < this.length; i += 2) {
    returnString += String.fromCharCode(parseInt(this.substr(i,2),16));
  }
  return returnString;
}
