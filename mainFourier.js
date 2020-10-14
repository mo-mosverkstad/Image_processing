var canvas = document.getElementById("imageProcessCanvas");
var ctx = canvas.getContext("2d");
var fileUpload = document.getElementById('fileUpload');

var imageOrigData = null;
var ttfShowData = null;

var canvasPosition = new CanvasPosition(ctx);
var imgOrignal = new Image();
function readImage() {
    if ( this.files && this.files[0] ) {
        var fr= new FileReader();
        fr.onload = function(e) {
            imgOrignal.src = e.target.result;
            imgOrignal.onload = function() {
                canvasPosition.sethistogramSize(0,0);
                canvasPosition.setImageSize(imgOrignal.naturalWidth, imgOrignal.naturalHeight);
                canvasPosition.setImagesPerColumn(1);
                ctx.drawImage(imgOrignal, 0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
                imageOrigData  = loadData(0, 0, imgOrignal.naturalWidth, imgOrignal.naturalHeight);
                ttfShowData = null;
           };
        };       
        fr.readAsDataURL( this.files[0] );
    }
}
fileUpload.onchange = readImage;


function testFft() {
    ttfShowData = generateShowData(ttfShowData);
    displayGreyData(ttfShowData);
}

function testFftCenter() {
    ttfShowData = generateShowData(ttfShowData);
    displayGreyData(convertGreyToDisplay2(ttfShowData));
}

function generateShowData(showData) {
    if (showData == null) {
        var greyData = convertFftToGrey(convertRgbToFft(imageOrigData));
        showData = convertGreyToDisplay(greyData);
    }
    return showData;
}

function displayGreyData(showData) {
    var pos = canvasPosition.getImagePosition(1, 0);
    
    for (j=0; j<showData.height; j++) {
        for (i=0; i<showData.width; i++) {
            var c = showData.data[j][i]
            putPoint(pos.x + i, pos.y + j, [c, c, c]);
        }
    }
}


