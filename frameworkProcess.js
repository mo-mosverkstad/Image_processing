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