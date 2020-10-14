function convertGreyToDisplay(greyData) {
    var w = greyData.width;
    var h = greyData.height;
    
    var showData = generateArray2(w, h);
    
    for (j=0; j<h; j++) {
        for (i=0; i<w; i++) {
            showData[j][i] = greyData.data[j*w+i];
        }
    }
    
    return {width:w, height:h, data:showData};
}

function convertGreyToDisplay2(showData) {
    var w = showData.width;
    var h = showData.height;
    var cw = Math.floor(w/2);
    var ch = Math.floor(h/2);
    
    var showArray = generateArray2(w, h);

    for (j=0; j<ch; j++) {
        for (i=0; i<cw; i++) {
            showArray[j+ch][i+cw] = showData.data[j][i];
        }
    }
    
    for (j=0; j<ch; j++) {
        for (i=cw; i<w; i++) {
            showArray[j+ch][i-cw] = showData.data[j][i];
        }
    }
    
    for (j=ch; j<h; j++) {
        for (i=0; i<cw; i++) {
            showArray[j-ch][i+cw] = showData.data[j][i];
        }
    }
    
    for (j=ch; j<h; j++) {
        for (i=cw; i<w; i++) {
            showArray[j-ch][i-cw] = showData.data[j][i];
        }
    }
    
    return {width:w, height:h, data:showArray};
}

function generateArray2(width, height) {
    var tempArray2 = []
    for (j=0; j<height; j++) {
        var tempArray = [];
        for (i=0; i<width; i++) {
            tempArray.push(0);
        }
        tempArray2.push(tempArray);
    }
    return tempArray2;
}

function convertFftToGrey(fftData) {
    var fftModulus = fftData.data;
    var maxValue = Math.max.apply(null, fftModulus);
    maxValue = Math.log(maxValue);
    var greyData = [];
    for (i = 0; i< fftModulus.length; i++) {
        //value = Math.round(fftModulus[i]/maxValue*100);
        //value1 = Math.round(((Math.sqrt(value)*10) / 100) * 255);
        value = Math.round(Math.max((Math.log(fftModulus[i]) / maxValue), 0)*255);
        greyData.push(value);
    }
    
    return {width:fftData.width, height:fftData.height, data:greyData};
}

function convertRgbToFft(imageData) {
    var h = imageData.height;
    var w = imageData.width;
    
    var tempArray = [];
    for (j = 0; j < imageData.height; j++) {
        for (i = 0; i < imageData.width; i++) {
            tempArray.push(Math.max(imageData.data[j][i].r, imageData.data[j][i].g, imageData.data[j][i].b));
        }
    }
    
    var fftData = fft2(tempArray, w, h);
    var fftModulus = [];
    for (i = 0; i< fftData.length; i++) {
        fftModulus.push(modulus(fftData[i]));
    }
    
    return {width:w, height:h, data:fftModulus};
}

function modulus (data) {
    return Math.round(Math.sqrt(data.real**2 + data.imag**2));
    //return data.real;
}

function fft(dataArray) {
    // Complex multiple
    this.mul = function(a, b) {
        if(typeof(a)!=='object') {
            a = {real: a, imag: 0}
        }
        if(typeof(b)!=='object') {
            b = {real: b, imag: 0}
        }
        return {
            real: a.real*b.real-a.imag*b.imag,
            imag: a.real*b.imag+a.imag*b.real
        };
    };

    // complex addition
    this.add = function(a, b) {
        if(typeof(a)!=='object') {
            a = {real: a, imag: 0}
        }
        if(typeof(b)!=='object') {
            b = {real: b, imag: 0}
        }
        return {
            real: a.real+b.real,
            imag: a.imag+b.imag
        };
    };

    // complex sub
    this.sub = function(a, b) {
        if(typeof(a)!=='object') {
            a = {real: a, imag: 0}
        }
        if(typeof(b)!=='object') {
            b = {real: b, imag: 0}
        }
        return {
            real: a.real-b.real,
            imag: a.imag-b.imag
        };
    };

    // sort
    this.sort = function(data, r) {
        if(data.length <=2) {
            return data;
        }
        var index = [0,1];
        for(var i=0; i<r-1; i++) {
            var tempIndex = [];
            for(var j=0; j<index.length; j++) {
                tempIndex[j] = index[j]*2;
                tempIndex[j+index.length] = index[j]*2+1;
            }
            index = tempIndex;
        }
        var datatemp = [];
        for(var i=0; i<index.length; i++) {
            datatemp.push(data[index[i]]);
        }
        return datatemp;
    };

    var dataLen = dataArray.length;
    var r = 1; // iteration number
    var i = 1;
    while(i*2 < dataLen) {
        i *= 2;
        r++;
    }
    var count = 1<<r; // same as count=2^r

    // if dataArray length is not 2^N, add 0 as placeholders
    for(var i=dataLen; i<count; i++) {
        dataArray[i] = 0;
    }

    dataArray = this.sort(dataArray, r);

    // calculate weight
    var w = [];
    for(var i=0; i<count/2; i++) {
        var angle = -i*Math.PI*2/count;
        w.push({real: Math.cos(angle), imag: Math.sin(angle)});
    }

    for(var i=0; i<r; i++) {
        var group = 1<<(r-1-i);
        var distance = 1<<i;
        var unit = 1<<i;
        for(var j=0; j<group; j++) {
            var step = 2*distance*j;
            for(var k=0; k<unit; k++) {
                var temp = this.mul(dataArray[step+k+distance], w[count*k/2/distance]);
                dataArray[step+k+distance] = this.sub(dataArray[step+k], temp);
                dataArray[step+k] = this.add(dataArray[step+k], temp);
            }
        }
    }
    return dataArray;
}


function ifft(dataArray) {
    for(var i=0, dataLen=dataArray.length; i<dataLen; i++) {
        if(typeof(dataArray[i])!='object'){
            dataArray[i] = {
                real: dataArray[i],
                imag: 0
            }
        }
        dataArray[i].imag *= -1;
    }
    dataArray = fft(dataArray);
    for(var i=0, dataLen=dataArray.length; i<dataLen; i++) {
        dataArray[i].real *= 1/dataLen;
        dataArray[i].imag *= -1/dataLen;
    }
    return dataArray;
}

function fft2(dataArray, width, height) {
    var r = 1;
    var i = 1;
    while(i*2 < width) {
        i *= 2;
        r++;
    }
    var width2 = 1<<r;
    var r = 1;
    var i = 1;
    while(i*2 < height) {
        i *= 2;
        r++;
    }
    var height2 = 1<<r;

    var dataArrayTemp = [];
    for(var i=0; i<height2; i++) {
        for(var j=0; j<width2; j++) {
            if(i>=height || j>=width) {
                dataArrayTemp.push(0);
            }
            else {
                dataArrayTemp.push(dataArray[i*width+j]);
            }
        }
    }

    dataArray = dataArrayTemp;
    width = width2;
    height = height2;

    var dataTemp = [];
    var dataArray2 = [];
    for(var i=0; i<height; i++) {
        dataTemp = [];
        for(var j=0; j<width; j++) {
            dataTemp.push(dataArray[i*width+j]);
        }
        dataTemp = fft(dataTemp);
        for(var j=0; j<width; j++) {
            dataArray2.push(dataTemp[j]);
        }
    }
    dataArray = dataArray2;
    dataArray2 = [];
    for(var i=0; i<width; i++) {
        var dataTemp = [];
        for(var j=0; j<height; j++) {
            dataTemp.push(dataArray[j*width+i]);
        }
        dataTemp = fft(dataTemp);
        for(var j=0; j<height; j++) {
            dataArray2.push(dataTemp[j]);
        }
    }
    dataArray = [];
    for(var i=0; i<height; i++) {
        for(var j=0; j<width; j++) {
            dataArray[j*height+i] = dataArray2[i*width+j];
        }
    }
    return dataArray;
}