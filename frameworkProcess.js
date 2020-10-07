function imageRed(imageData) {
    return {r:imageData.r, g:0, b:0};
}

function imageGreen(imageData) {
    return {r:0, g:imageData.g, b:0};
}

function imageBlue(imageData) {
    return {r:0, g:0, b:imageData.b};
}

function imageGray(imageData) {
    gray = Math.round(Math.min(imageData.r, imageData.g, imageData.b));
    return {r:gray, g:gray, b:gray};
}

function imageSqrt(imageData) {
    return {r:sqrt(imageData.r), g:sqrt(imageData.g), b:sqrt(imageData.b)};
}

function sqrt(value) {
    result = Math.min((Math.round(Math.sqrt(value))*1)**2, 255);
    return result;
}

function imageCompress(imageData) {
    return {r:compressTo8(imageData.r), g:compressTo8(imageData.g), b:compressTo8(imageData.b)};
}

function compressTo8(value) {
    index = 256/8;
    return Math.round(value / index)*index+(index/2-1);
}

function imageSoften(imageData1, imageData2) {
    r = Math.round((imageData2.r + imageData1.r) / 2);
    g = Math.round((imageData2.g + imageData1.g) / 2);
    b = Math.round((imageData2.b + imageData1.b) / 2);
    return {r:r, g:g, b:b};
}

function imageSharpen(imageData1, imageData2) {
    dr = imageData2.r - imageData1.r;
    dg = imageData2.g - imageData1.g;
    db = imageData2.b - imageData1.b;
    return {r:imageData1.r+dr*2, g:imageData1.g+dg*2, b:imageData1.b+db*2};
}

function imageEdge(imageData1, imageData2) {
    dr = imageData2.r - imageData1.r;
    dg = imageData2.g - imageData1.g;
    db = imageData2.b - imageData1.b;
    return {r:127+dr, g:127+dg, b:127+db};
}


function imageMedianFilter(imageDatas) {
    var temp = convertRgbToArray(imageDatas);
    return {r:median(temp.redArray), g:median(temp.greenArray), b:median(temp.blueArray)};
}

function imageValueFilter(imageData) {
    return {r:valuen(imageData.r), g:valuen(imageData.g), b:valuen(imageData.b)}
}

function valuen(value) {
    var min = 100;
    var max = 255;
    /*
    if (value < min || value > max)
        console.log(value, Math.min(Math.max(value, min), max));*/
    return Math.min(Math.max(value, min), max);
}

function convertRgbToArray(imageDatas) {
    var tempRedArray   = [];
    var tempGreenArray = [];
    var tempBlueArray  = [];
    for (d of imageDatas) {
        tempRedArray.push(d.r);
        tempGreenArray.push(d.g);
        tempBlueArray.push(d.b);
    }
    return {redArray:tempRedArray, greenArray:tempGreenArray, blueArray:tempBlueArray};
}

function median(values){
  if(values.length ===0) return 0;

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2)+1;

  if (values.length % 2)
    return Math.round(values[half]);

  return Math.round((values[half - 1] + values[half]) / 2.0);
}

/*
function imageValueFilter(imageDatas) {
    var temp = convertRgbToArray(imageDatas);
    return {r:valuen(temp.redArray), g:valuen(temp.greenArray), b:valuen(temp.blueArray)};
}

function valuen(values) {
    var min = 50;
    var max = 255;
    if(values.length ===0) return 0;
    var half = Math.floor(values.length / 2)+1;
    if (values[half] < min || values[half] > max) {
        var total = 0;
        for(var i = 0; i < values.length; i++) {
            if (i != half)
                total += values[i];
        }
        var avg = Math.round(total / (values.length-1));
        if (avg < min) {
            console.log(avg, Math.max(Math.min(avg, max), min));
        }
        return Math.max(Math.min(avg, max), min);
    }
    return values[half];
}
*/
