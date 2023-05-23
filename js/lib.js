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
}