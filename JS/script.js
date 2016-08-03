// TODO: Change values of select fields to be the values we need so we can just grab them and go

var mouseDown = false;
var blackFlag = false;
var lastElement = null;
var logoHex = "CEED6666CC0D000B03730083000C000D0008111F8889000EDCCC6EE6DDDDD999BBBB67636E0EECCCDDDC999FBBB9333E";
var uploadedHexData = "";

// When the user left clicks, set mouseDown flag
document.onmousedown = function() {
  mouseDown = true;
};

// When the user releases the left button, set mouseDown flag
document.onmouseup = function() {
  mouseDown = false;
};

// When the user hovers the mouse over something and the mouse is down,
// color it
function mouseOverHandler(element){
  if (mouseDown){
    if (blackFlag){
      element.style.backgroundColor = "black";
    } else {
      element.style.backgroundColor = "white";
    }
  }
}

// When the mouse is pressed over an element...
function mouseDownHandler(element){
  fill(element);
  setBlackFlag(element);
}

// When the black flag is set over an element...
function setBlackFlag(element){
  if (element.style.backgroundColor == "black"){
    blackFlag = true;
  } else {
    blackFlag = false;
  }
}

// Fill the element
function fill(element){
  if (element.style.backgroundColor == "black"){
    element.style.backgroundColor = "white";
  } else {
    element.style.backgroundColor = "black";
  }
}

// Changes the color of all cells
function invertLogo() {
  var list = document.getElementsByTagName("TD");
  for (var i = 0; i < list.length; i++){
    fill(list[i]);
  }
}

// Gets the state of the logo, and coverts it to a hex string
function convertLogoToHex(){
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
    hexString += convertIntToHexChar(toptop);
    hexString += convertIntToHexChar(topbottom);
    hexString += convertIntToHexChar(bottomtop);
    hexString += convertIntToHexChar(bottombottom);
  }
  return hexString;
}

// Converts a decimal int to its representative hex character
function convertIntToHexChar(x){
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

// Creates a downloadable file based on a hex string
function downloadFile(){
  // First check field values to make sure they are okay
  var hexData = "";
  var fieldData = getFieldValues();
  if (fieldData === null){
    return;
  }
  // if there was hex data uploaded, inject the modifications into that
  if (uploadedHexData.length > 0){
    // pre-header stuff
    hexData = uploadedHexData.substr(0, 520);
    hexData += convertLogoToHex();
    hexData += fieldData;
    // post-header stuff
    hexData += uploadedHexData.substr(666, uploadedHexData.length);
  } else { // otherwise, just create some garbage data
    hexData = "C38B020000000000C38B02FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF87E15F1600195E2356D5E1E9FFFFFFFFFFFFFFFFFFFFFFFFC3FD01FFFFFFFFFFC31227FFFFFFFFFFC31227FFFFFFFFFFC37E01FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00C35001";
    hexData += convertLogoToHex();
    hexData += fieldData;
    // fill up the rest of the 32kb rom with 0xFF
    for (var i =0; i < 32432; i++){
      hexData += "FF";
    }
  }

  var byteArray = new Uint8Array(hexData.length/2);
  for (var x = 0; x < byteArray.length; x++){
    byteArray[x] = parseInt(hexData.substr(x*2,2), 16);
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
// Calculates the checksum for the header data
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
  totalChecksum += convertIntToHexChar(firstChecksum);
  totalChecksum += convertIntToHexChar(secondChecksum);
  return totalChecksum;
}

// Converts a hex character to its decimal int representation
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

// Performs a bitwise not operation on a decimal integer
function invert(x){
  return 15 - x;
}

// Calculates the global checksum based on a hex string
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
  totalChecksum += convertIntToHexChar(fourthChecksum);
  totalChecksum += convertIntToHexChar(thirdChecksum);
  totalChecksum += convertIntToHexChar(secondChecksum);
  totalChecksum += convertIntToHexChar(firstChecksum);
  return totalChecksum;
}

// Loads a hex representation of a logo into the editor
function loadLogo(hexData){
  var row = new Array(4);
  var list = document.getElementsByTagName("TD");
  if (!hexData){
    hexData = prompt("Please enter the hex data. Whitespace is ignored.", logoHex);

  }
  // first make sure hexData is the properlength and eliminate whitespace in the string
  if (!hexData.isValidHexString()){
    alert("The hex data contained invalid characters!");
    return;
  }
  if (hexData.length == 96){
    clearLogo();
    // first do top half of logo
    for (x = 0; x < 48; x += 4){
      // convert 2 bytes of data
      row[0] = convertCharToInt(hexData[x]);
      row[1] = convertCharToInt(hexData[x+1]);
      row[2] = convertCharToInt(hexData[x+2]);
      row[3] = convertCharToInt(hexData[x+3]);
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
      row[0] = convertCharToInt(hexData[x]);
      row[1] = convertCharToInt(hexData[x+1]);
      row[2] = convertCharToInt(hexData[x+2]);
      row[3] = convertCharToInt(hexData[x+3]);
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
    // CONVERT TO MODAL
    alert("The hex data received was not the correct length!");
  }
}

// Resets the logo to the default "Nintendo"
function resetLogo(){
  loadLogo(logoHex);
}

// Blanks the logo
function clearLogo(){
  var list = document.getElementsByTagName("TD");
  for (x = 0; x < list.length; x++){
    list[x].style.backgroundColor = "white";
  }
}

// Clears the logo and everything else
function clearEverything(){
  clearLogo();
  document.getElementById('titleInput').value = "";
  document.getElementById('manufacturerInput').value = "";
  document.getElementById('cgbSupportSelect').value = "";
  document.getElementById('newLicenseeInput').value = "";
  document.getElementById('sgbCheckbox').checked = false;
  document.getElementById('cartridgeTypeSelect').value = "";
  document.getElementById('romSizeSelect').value = "";
  document.getElementById('ramSizeSelect').value = "";
  document.getElementById('destinationCheckbox').checked = false;
  document.getElementById('oldLicenseeInput').value = "";
  document.getElementById('versionNumberInput').value = "";
}

// jQuery functions that are used for file uploading
$(function() {

  // We can attach the `fileselect` event to all file inputs on the page
  $(document).on('change', ':file', function() {
    var input = $(this);//,
    input.trigger('fileselect');
  });

// You have to use callbacks, otherwise you will try to read a result that isn't ready
  $(document).ready(function(){
      $(':file').on('fileselect', function(e) {
          readFile(this.files[0], function(e) {
              //manipulate with result...
              uploadedHexData = e.target.result.hexEncode();
              parseUploadedHexString(uploadedHexData);
          });

      });
  });

  function readFile(file, callback){
      var reader = new FileReader();
      reader.onload = callback
      // make sure user didn't hit cancel
      if (file != null){
        reader.readAsBinaryString(file);
      }
  }
});

// From the uploaded rom file, update the UI
function parseUploadedHexString(hexString){
  // first, set variables
  nintendoLogo = hexString.substr(520, 96);
  title = hexString.substr(616, 22);
  manufacturerCode = hexString.substr(638, 8);
  cgbFlag = hexString.substr(646, 2);
  newLicenseeCode = hexString.substr(648, 4);
  sgbFlag = hexString.substr(652, 2);
  cartridgeType = hexString.substr(654, 2);
  romSize = hexString.substr(656, 2);
  ramSize = hexString.substr(658, 2);
  destinationCode = hexString.substr(660, 2);
  oldLicenseeCode = hexString.substr(662, 2);
  romVersionNumber = hexString.substr(664, 2);

  // then update the UI
  loadLogo(nintendoLogo);
  document.getElementById('titleInput').value = title.getASCIIFromHex();
  document.getElementById('manufacturerInput').value = manufacturerCode.getASCIIFromHex();
  setCGBFlag(cgbFlag);
  document.getElementById('newLicenseeInput').value = newLicenseeCode.getASCIIFromHex();
  setSGBFlag(sgbFlag);
  setCartridgeType(cartridgeType);
  setRomSize(romSize);
  setRamSize(ramSize);
  setDestinationCode(destinationCode);
  document.getElementById('oldLicenseeInput').value = oldLicenseeCode;
  document.getElementById('versionNumberInput').value = romVersionNumber;
}

// Gets the title hex based on title input
function getTitle(){
  text = document.getElementById('titleInput').value;
  // Do checks
  if (text.length > 0 && text.isValidASCII()){
    // First convert to hex string
    var returnString = text.toHexString();
    // And then if length is less than 22, fill in remaining hex characters with 0's
    for (i = returnString.length; i < 22; i++){
      returnString += "0";
    }
    return returnString;
  } else {
    return null;
  }
}

// Gets the manufacturer ID hex based on the manufacturer input
function getManufacturerCode(){
  text = document.getElementById('manufacturerInput').value;
  // Do checks
  if (text.isLength(4) && text.isValidASCII()){
    return text.toHexString();
  } else {
    return null;
  }
}

// Sets the cgb select box based on hex data
function setCGBFlag(cgbFlag){
  var select = document.getElementById('cgbSupportSelect');
  switch (cgbFlag){
    case "80":
      select.value = 1;
      break;
    case "C0":
      select.value = 2;
      break;
    default:
      select.value = 0;
      break;
  }
}

// Gets the cgb select box hex data based on its value
function getCGBFlag(){
  var select = document.getElementById('cgbSupportSelect');
  switch (select.value){
    case "0":
      return "00";
    case "1":
      return "80";
    case "2":
      return "C0";
    default:
      return null;
  }
}

// Gets the new licensee hex data based on new licnesee input
function getNewLicenseeCode(){
  var text = document.getElementById('newLicenseeInput').value;
  // Do checks
  if (text.isLength(2) && text.isValidASCII()){
    return text.toHexString();
  } else {
    return null;
  }
}

// Sets the sgb checkbox based on hex data
function setSGBFlag(sgbFlag){
  var check = document.getElementById('sgbCheckbox');
  if (sgbFlag === "03"){
    check.checked = true;
  } else if (sgbFlag === "00") {
    check.checked = false;
  } else {
    // unknown sgb value
  }
}

// Gets the sgb hex based on checkbox
function getSGBFlag(){
  var check = document.getElementById('sgbCheckbox');
  if (check.checked == true){
    return "03";
  } else {
    return "00";
  }
}

// Sets the cartridge type based on hex data
function setCartridgeType(cartridgeType){
  var select = document.getElementById('cartridgeTypeSelect');
  switch (cartridgeType){
    case "00":
      select.value = 0;
      break;
    case "01":
      select.value = 1;
      break;
    case "02":
      select.value = 2;
      break;
    case "03":
      select.value = 3;
      break;
    case "05":
      select.value = 4;
      break;
    case "06":
      select.value = 5;
      break;
    case "08":
      select.value = 6;
      break;
    case "09":
      select.value = 7;
      break;
    case "0B":
      select.value = 8;
      break;
    case "0C":
      select.value = 9;
      break;
    case "0D":
      select.value = 10;
      break;
    case "0F":
      select.value = 11;
      break;
    case "10":
      select.value = 12;
      break;
    case "11":
      select.value = 13;
      break;
    case "12":
      select.value = 14;
      break;
    case "13":
      select.value = 15;
      break;
    case "15":
      select.value = 16;
      break;
    case "16":
      select.value = 17;
      break;
    case "17":
      select.value = 18;
      break;
    case "19":
      select.value = 19;
      break;
    case "1A":
      select.value = 20;
      break;
    case "1B":
      select.value = 21;
      break;
    case "1C":
      select.value = 22;
      break;
    case "1D":
      select.value = 23;
      break;
    case "1E":
      select.value = 24;
      break;
    case "20":
      select.value = 25;
      break;
    case "22":
      select.value = 26;
      break;
    case "FC":
      select.value = 27;
      break;
    case "FD":
      select.value = 28;
      break;
    case "FE":
      select.value = 29;
      break;
    case "FF":
      select.value = 30;
      break;
    default:
      // unknown code
      console.log("UNKNOWN CARTRIDGE TYPE");
      break;
  }
}

// Gets hex data based on cartridge type selected
function getCartridgeType(){
  var select = document.getElementById('cartridgeTypeSelect');
  switch (select.value){
    case "0":
      return "00";
    case "1":
      return "01";
    case "2":
      return "02";
    case "3":
      return "03";
    case "4":
      return "05";
    case "5":
      return "06";
    case "6":
      return "08";
    case "7":
      return "09";
    case "8":
      return "0B";
    case "9":
      return "0C";
    case "10":
      return "0D";
    case "11":
      return "0F";
    case "12":
      return "10";
    case "13":
      return "11";
    case "14":
      return "12";
    case "15":
      return "13";
    case "16":
      return "15";
    case "17":
      return "16";
    case "18":
      return "17";
    case "19":
      return "19";
    case "20":
      return "1A";
    case "21":
      return "1B";
    case "22":
      return "1C";
    case "23":
      return "1D";
    case "24":
      return "1E";
    case "25":
      return "20";
    case "26":
      return "22";
    case "27":
      return "FC";
    case "28":
      return "FD";
    case "29":
      return "FE";
    case "30":
      return "FF";
    default:
      // unknown code
      return null;
  }
}

// Sets the ROM size based on hex data
function setRomSize(romSize){
  var select = document.getElementById('romSizeSelect');
  switch (romSize){
    case "00":
      select.value = 0;
      break;
    case "01":
      select.value = 1;
      break;
    case "02":
      select.value = 2;
      break;
    case "03":
      select.value = 3;
      break;
    case "04":
      select.value = 4;
      break;
    case "05":
      select.value = 5;
      break;
    case "06":
      select.value = 6;
      break;
    case "07":
      select.value = 7;
      break;
    case "52":
      select.value = 8;
      break;
    case "53":
      select.value = 9;
      break;
    case "54":
      select.value = 10;
      break;
    default:
      // unknown code
      console.log("UNKNOWN ROM SIZE");
      break;
  }
}

// Gets hex data based on ROM selection
function getRomSize(){
  var select = document.getElementById('romSizeSelect');
  switch (select.value){
    case "0":
      return "00";
    case "1":
      return "01";
    case "2":
      return "02";
    case "3":
      return "03";
    case "4":
      return "04";
    case "5":
      return "05";
    case "6":
      return "06";
    case "7":
      return "07";
    case "8":
      return "52";
    case "9":
      return "53";
    case "10":
      return "54";
    default:
      // unknown code
      return null;
  }
}

// Sets the RAM size select box based on hex data
function setRamSize(ramSize){
  var select = document.getElementById('ramSizeSelect');
  switch (ramSize){
    case "00":
      select.value = 0;
      break;
    case "01":
      select.value = 1;
      break;
    case "02":
      select.value = 2;
      break;
    case "03":
      select.value = 3;
      break;
    case "04":
      select.value = 4;
      break;
    case "05":
      select.value = 5;
      break;
    default:
      // unknown code
      console.log("RAM SIZE UNKNOWN");
      break;
  }
}

// Gets hex data based on the RAM size select box
function getRamSize(){
  var select = document.getElementById('ramSizeSelect');
  switch (select.value){
    case "0":
      return "00";
    case "1":
      return "01";
    case "2":
      return "02";
    case "3":
      return "03";
    case "4":
      return "04";
    case "5":
      return "05";
    default:
      // still at the default value which isn't valid
      return null;
      break;
  }
}

// Sets the destination checkbox based on hex data
function setDestinationCode(destinationCode){
  var check = document.getElementById('destinationCheckbox');
  if (destinationCode === "00"){
    check.checked = true;
  } else if (destinationCode === "01"){
    check.checked = false;
  } else {
    // undefined behavior
    console.log(check.checked);
    console.log("UNKNOWN DESTINATION CODE");
  }
}

// Gets hex data based on the destination checkbox
function getDestinationCode(){
  var check = document.getElementById('destinationCheckbox');
  if (check.checked){
    return "00";
  } else {
    return "01";
  }
}

// Gets the old licnesee code hex based on the old licnesee input
function getOldLicenseeCode(){
  var text = document.getElementById('oldLicenseeInput').value;
  // Do checks
  if (text.isLength(2) && text.isValidHexString()){
    return text;
  } else {
    return null;
  }
}

// Gets the rom verion number hex based on the version number input
function getRomVersionNumber(){
  var text = document.getElementById('versionNumberInput').value;
  // Do checks
  if (text.isLength(2) && text.isValidHexString()){
    return text;
  } else {
    return null;
  }
}

// Retrieves the values of all fields and concatenates them into a single hex string
// If there are any errors, simply displays a popupbox instead and returns "NULL"
function getFieldValues(){
  // First get data
  var hexData = "";
  var title = getTitle();
  var manufacturerCode = getManufacturerCode();
  var cgbFlag = getCGBFlag();
  var newLicenseeCode = getNewLicenseeCode();
  var sgbFlag = getSGBFlag();
  var cartridgeType = getCartridgeType();
  var romSize = getRomSize();
  var ramSize = getRamSize();
  var destinationCode = getDestinationCode();
  var oldLicenseeCode = getOldLicenseeCode();
  var romVersionNumber = getRomVersionNumber();
  var errorString = "";
  // Check for invalid inputs
  if (title === null){
    errorString = "Input for title was invalid\n";
  }
  if (manufacturerCode === null){
    errorString += "Input for manufacturer code was invalid\n";
  }
  if (cgbFlag === null){
    errorString += "Input for cgb flag was invalid\n";
  }
  if (newLicenseeCode === null){
    errorString += "Input for new licensee code was invalid\n";
  }
  if (sgbFlag === null){
    errorString += "Input for sgb flag was invalid\n";
  }
  if (cartridgeType === null){
    errorString += "Input for cartridge type was invalid\n";
  }
  if (romSize === null){
    errorString += "Input for rom size was invalid\n";
  }
  if (ramSize === null){
    errorString += "Input for ram size was invalid\n";
  }
  if (destinationCode === null){
    errorString += "Input for destination code was invalid\n";
  }
  if (oldLicenseeCode === null){
    errorString += "Input for old licensee code was invalid\n";
  }
  if (romVersionNumber === null){
    errorString += "Input for rom version number was invalid\n";
  }
  if (errorString !== ""){
    document.getElementById('myModalBody').innerText = errorString;
    $('#myModal').modal();
    // alert(errorString);
    return null;
  } else {
    console.log(cgbFlag);
    console.log(newLicenseeCode);
    hexData += title;
    hexData += manufacturerCode;
    hexData += cgbFlag;
    hexData += newLicenseeCode;
    hexData += sgbFlag;
    hexData += cartridgeType;
    hexData += romSize;
    hexData += ramSize;
    hexData += destinationCode;
    hexData += oldLicenseeCode;
    hexData += romVersionNumber;
    return hexData;
  }
}

/*
//
// MODIFICATIONS TO STRING CLASS
//
*/

// Gets the ASCII equivalent of two hex characters
String.prototype.getASCIIFromHex = function() {
  returnString = "";
  // read the hex string two characters at a time
  for (i = 0; i < this.length; i += 2) {
    returnString += String.fromCharCode(parseInt(this.substr(i,2),16));
  }
  return returnString;
}

// THIS FUNCTION NEEDS TO BE CLEANED UP!!!!
// Encodes a (UNICODE?) string to hex values
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

String.prototype.isValidASCII = function(){
  return /^[\x00-\x7F]*$/.test(this);
}

String.prototype.isLength = function(length){
  if (this.length == length){
    return true;
  } else {
    return false;
  }
}

String.prototype.toHexString = function(){
  var returnString = "";
  for (i = 0; i < this.length; i++){
    returnString += this.charCodeAt(i).toString(16);
  }
  return returnString;
}

// Checks if a decimal integer can be converted to a hex value
String.prototype.isValidHexString = function (){
  var validValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"];
  // go through the entire string
  for (i = 0; i < this.length; i++){
    // check each character in string against array
    for (k = 0; k < validValues.length; k++) {
      // if a match is found get out of loop
      if (validValues[k] === this.charAt(i)){
        break;
      }
    }
    // if the characters match then restart loop
    if (validValues[k] === this.charAt(i)){
      break;
    }
    return false;
  }
  return true;
}
