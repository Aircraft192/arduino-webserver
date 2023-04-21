let plural = function(number, unit, extension){
    if(number == 1){
        return number + " " + unit;
    }
    else{
        return number + " " + unit + extension.toLowerCase();
    }
}