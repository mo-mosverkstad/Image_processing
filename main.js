var canvas = document.getElementById("imageProcessCanvas");
var ctx = canvas.getContext("2d");
var hiddenCanvas = document.getElementById('outputCanvas');
var hiddenCtx = hiddenCanvas.getContext('2d');
hiddenCanvas.style.display = 'none';

var fileUpload = document.getElementById('fileUpload');
var fileUploadRight = document.getElementById('fileUploadRight');

var imageOrigData;
var imageProcData;

var canvasPosition = new CanvasPosition(ctx);
var imgOrignal = new Image();

function readImage() {
    if ( this.files && this.files[0] ) {
        var fr= new FileReader();
        fr.onload = function(e) {
            imgOrignal.src = e.target.result;
            imgOrignal.onload = function() {
                canvasPosition.setImageSize(imgOrignal.naturalWidth, imgOrignal.naturalHeight);
                ctx.drawImage(imgOrignal, 0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
                imageOrigData  = loadData(0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
           };
        };       
        fr.readAsDataURL( this.files[0] );
    }
}
fileUpload.onchange = readImage;


var imgRight = new Image();

function readImageRight() {
    if ( this.files && this.files[0] ) {
        var fr= new FileReader();
        fr.onload = function(e) {
            imgRight.src = e.target.result;
            imgRight.onload = function() {
                pos = canvasPosition.getImagePosition(1, 0);
                ctx.drawImage(imgRight, pos.x, pos.y, imgRight.naturalWidth, imgRight.naturalHeight);
                imageProcData  = loadData(pos.x, pos.y, imgRight.naturalWidth, imgRight.naturalHeight);
           };
        };       
        fr.readAsDataURL( this.files[0] );
    }
}
fileUploadRight.onchange = readImageRight;



function imageProcessGeneralFunction(ipFunc, func) {
    pos = canvasPosition.getImagePosition(1, 0);
    ipFunc(func, imageOrigData, pos);
    imageProcData = loadData(pos.x, pos.y, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
}

function makeSqrt() {
    imageProcessGeneralFunction(imageProcess, imageSqrt);
}

function grayScale() {
    imageProcessGeneralFunction(imageProcess, imageGray);
}

function compress() {
    imageProcessGeneralFunction(imageProcess, imageCompress);
}

function soften() {
    imageProcessGeneralFunction(imageProcess2, imageSoften);
}

function sharpen() {
    imageProcessGeneralFunction(imageProcess2, imageSharpen);
}

function edge() {
    imageProcessGeneralFunction(imageProcess2, imageEdge);
}

function edgeBnW() {
    imageProcessGeneralFunction(imageProcess2, imageEdgeBnW);
}


function medianFilter() {
    imageProcessGeneralFunction(imageProcessArray, imageMedianFilter);
}

function valueFilter() {
    imageProcessGeneralFunction(imageProcess, imageValueFilter);
}




function colorOrigScatter() {
    colorScatter(imageOrigData, 0);
}

function colorProcScatter() {
    if (imageProcData != null)
        colorScatter(imageProcData, 1);
}

function colorScatter(data, x) {
    imageProcess(imageRed,   data, canvasPosition.getImagePosition(x, 1));
    imageProcess(imageGreen, data, canvasPosition.getImagePosition(x, 2));
    imageProcess(imageBlue,  data, canvasPosition.getImagePosition(x, 3));
}





function colorOrigAnalysis() {
    var histogramArray = statisData(imageOrigData);
    showHistogram(0, histogramArray);
}

function colorProcAnalysis() {
    if (imageProcData != null) {
        var histogramArray = statisData(imageProcData);
        showHistogram(1, histogramArray);
    }
}



function generateOutputImg() {
    var pos = canvasPosition.getImagePosition(1, 0);
    var x = pos.x;
    var y = pos.y;
    var w = imageOrigData.width;
    var h = imageOrigData.height;
    
    hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    hiddenCanvas.width = w;
    hiddenCanvas.height = h;
    
    //Draw the data you want to download to the hidden canvas
    hiddenCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
    
    //Create a download URL for the data
    var hiddenData = hiddenCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var dataURL = hiddenCanvas.toDataURL();
    document.getElementById('outputImg').src = dataURL;
}
