var ctx = document.getElementById("imageProcessCanvas").getContext("2d");
var fileUpload = document.getElementById('fileUpload');

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

function imageProcessGeneralFunction(func) {
    pos = canvasPosition.getImagePosition(1, 0);
    imageProcess(func, imageOrigData, pos);
    imageProcData = loadData(pos.x, pos.y, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
}

function makeSqrt() {
    imageProcessGeneralFunction(imageSqrt);
}

function grayScale() {
    imageProcessGeneralFunction(imageGray);
}

function compress() {
    imageProcessGeneralFunction(imageCompress);
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

