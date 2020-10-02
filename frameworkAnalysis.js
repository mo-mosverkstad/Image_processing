function statisData(imageData) {
    var tempRedArray   = [];
    var tempGreenArray = [];
    var tempBlueArray  = [];
    for (i=0; i<maxColorValue; i++) {
        tempRedArray.push(0);
        tempGreenArray.push(0);
        tempBlueArray.push(0);
    }
    for (j=0; j<imageData.height; j++) {
        for (i=0; i<imageData.width; i++) {
            tempRedArray[imageData.data[j][i].r] += 1;
            tempGreenArray[imageData.data[j][i].g] += 1;
            tempBlueArray[imageData.data[j][i].b] += 1;
        }
    }
    return {r:calPercent(tempRedArray),
            g:calPercent(tempGreenArray),
            b:calPercent(tempBlueArray)};
}

function calPercent(tempArray, total) {
    var total = Math.max.apply(null, tempArray);
    for (i=0; i<maxColorValue; i++) {
        tempArray[i] = Math.round((tempArray[i] / total) * 100);
    }
    return tempArray;
}

function showHistogram(x, y, c, dataShowArray) {
    fillArea(x, y, dataShowWidth, dataShowHeight, 255, 255, 255);
    for (i=0; i<maxColorValue; i++) {
        switch (c) {
            case 0:
                drawHorizonLine(x, y+i, dataShowArray[i], i, 0, 0);
                break;
            case 1:
                drawHorizonLine(x, y+i, dataShowArray[i], 0, i, 0);
                break;
            case 2:
                drawHorizonLine(x, y+i, dataShowArray[i], 0, 0, i);
                break;
        }
    }
}