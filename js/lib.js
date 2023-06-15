let plural = function(number, unit, extension){
    if(number == 1){
        return number + " " + unit;
    }
    else{
        return number + " " + unit + extension.toLowerCase();
    }
}
let zeroBeforeSingleDigit = function(number){
    if(number < 10){
        return "0" + number;
    }
    else{
        return number;
    }
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
  }

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}