var ctx = document.getElementById("imageProcessCanvas").getContext("2d");
var border = 10;
var dataShowWidth = 101;
var dataShowHeight = 256;

var imageOrigData;
var imageProcData;

var maxColorValue = 256;

var imgOrignal = new Image();
imgOrignal.onload = function() {
    //ctx.canvas.width  = (Math.max(imgOrignal.naturalWidth, dataShowWidth) + border) * 4;
    //ctx.canvas.height = (imgOrignal.naturalHeight + dataShowHeight + border*2)* 2;
    ctx.canvas.width  = imgOrignal.naturalWidth*2 + border*3 + dataShowWidth*2;
    ctx.canvas.height = (Math.max(imgOrignal.naturalHeight, dataShowHeight) + border) * 4;
    ctx.drawImage(imgOrignal, 0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
    imageOrigData  = loadData(0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
    //console.log({x:0, y:0, width:imgOrignal.naturalWidth, height:imgOrignal.naturalHeight});
    //console.log(imageOrigData);
};
imgOrignal.src = 'resources/imageShow.jpg';


function grayScale() {
    imageProcess(imageGray, imageOrigData, {x:imgOrignal.naturalWidth+border*3+dataShowWidth*2, y:0});
    imageProcData = loadData(imgOrignal.naturalWidth+border*3+dataShowWidth*2, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
}

function makeSqrt() {
    imageProcess(imageSqrt, imageOrigData, {x:imgOrignal.naturalWidth+border*3+dataShowWidth*2, y:0});
    imageProcData = loadData(imgOrignal.naturalWidth+border*3+dataShowWidth*2, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
}

function colorOrigScatter() {
    colorScatter(imageOrigData, 0);
}

function colorProcScatter() {
    if (imageProcData != null)
        colorScatter(imageProcData, imgOrignal.naturalWidth+border*3+dataShowWidth*2);
}

function colorOrigAnalysis() {
    var dataShowArray = statisData(imageOrigData);
    showHistogram(imgOrignal.naturalWidth+border, (imgOrignal.naturalHeight+border)*1, 0, dataShowArray.r);
    showHistogram(imgOrignal.naturalWidth+border, (imgOrignal.naturalHeight+border)*2, 1, dataShowArray.g);
    showHistogram(imgOrignal.naturalWidth+border, (imgOrignal.naturalHeight+border)*3, 2, dataShowArray.b);
}

function colorProcAnalysis() {
    if (imageProcData != null) {
        var dataShowArray = statisData(imageProcData);
        showHistogram(imgOrignal.naturalWidth+border+dataShowWidth+border, (imgOrignal.naturalHeight+border)*1, 0, dataShowArray.r);
        showHistogram(imgOrignal.naturalWidth+border+dataShowWidth+border, (imgOrignal.naturalHeight+border)*2, 1, dataShowArray.g);
        showHistogram(imgOrignal.naturalWidth+border+dataShowWidth+border, (imgOrignal.naturalHeight+border)*3, 2, dataShowArray.b);
    }
}




function colorScatter(data, x) {
    imageProcess(imageRed,   data, {x:x, y:(imgOrignal.naturalHeight+border)});
    imageProcess(imageGreen, data, {x:x, y:(imgOrignal.naturalHeight+border)*2});
    imageProcess(imageBlue,  data, {x:x, y:(imgOrignal.naturalHeight+border)*3});
}

function loadData(x, y, w, h) {
    return {width : w,
            height: h,
            data  : getImageData({x:x, y:y, width:w, height:h})};
}