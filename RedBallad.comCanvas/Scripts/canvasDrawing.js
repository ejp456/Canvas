//using window.onload to load this function right away
window.onload = function () 
{
    //adding this to change jquery to use $j instead of $ since it
    //conflicts with the aliasing used by fabric.js
    var $j = jQuery.noConflict();

    var $ = function (id) { return document.getElementById(id) };

    //initializing both canvases
    var canvasOutside = new fabric.Canvas('mycanvasOutside', {
        isDrawingMode: true
    });

    var canvasInside = new fabric.Canvas('myCanvasInside', {
        isDrawingMode: true
    });


    //show inside of card
    var switchToInside = document.getElementById('showInside')
    switchToInside.onclick = function () {
        $j('#mycanvasOutside').parent().hide();
        $j('#myCanvasInside').parent().show();
        //canvasOutside.isDrawingMode = false;
        //canvasInside.isDrawingMode = true;
        canvasInside.calcOffset();
        canvas = canvasInside;
        canvasName = 'myCanvasInside';
    }

    //show outside of card
    var switchToOutside = document.getElementById('showOutside')
    switchToOutside.onclick = function () {
        $j('#myCanvasInside').parent().hide();
        $j('#mycanvasOutside').parent().show();
        //canvasInside.isDrawingMode = false;
        //canvasOutside.isDrawingMode = true;
        canvasOutside.calcOffset();
        canvas = canvasOutside;
        canvasName = 'mycanvasOutside';
    }


    //use the outside of the card first
    var canvas = canvasOutside;
    var canvasName = 'mycanvasOutside';

    $j('#myCanvasInside').parent().hide();

    canvas.calcOffset();

    fabric.Object.prototype.transparentCorners = false;

    var drawingModeEl = $('drawing-mode'),
        drawingOptionsEl = $('drawing-mode-options'),
        drawingColorEl = $('drawing-color'),
        drawingShadowColorEl = $('drawing-shadow-color'),
        drawingLineWidthEl = $('drawing-line-width'),
        drawingShadowWidth = $('drawing-shadow-width'),
        drawingShadowOffset = $('drawing-shadow-offset'),
        clearEl = $('clear-canvas');

    clearEl.onclick = function () { canvas.clear() };

    drawingModeEl.onclick = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = 'Cancel drawing mode';
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = 'Enter drawing mode';
            drawingOptionsEl.style.display = 'none';
        }
    };

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement(canvasName);
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
        hLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement(canvasName);
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');

            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement(canvasName);
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement(canvasName);
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRectWidth();

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };

        var img = new Image();
        img.src = '../assets/honey_im_subtle.png';

        var texturePatternBrush = new fabric.PatternBrush(canvas);
        texturePatternBrush.source = img;
    }

    $('drawing-mode-selector').onchange = function () {

        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
        }
    };

    drawingColorEl.onchange = function () {
        canvas.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function () {
        canvas.freeDrawingBrush.shadowColor = this.value;
    };
    drawingLineWidthEl.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function () {
        canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function () {
        canvas.freeDrawingBrush.shadowOffsetX =
        canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvas.freeDrawingBrush.shadowBlur = 0;
    }

    //handling the image uploading
    document.getElementById('imgLoader').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            console.log('fdsf');
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                // start fabricJS stuff

                var image = new fabric.Image(imgObj);
                image.set({
                    left: 250,
                    top: 250,
                    angle: 20,
                    padding: 10,
                    cornersize: 10
                });
                //image.scale(getRandomNum(0.1, 0.25)).setCoords();
                canvas.add(image);

                // end fabricJS stuff
            }

        }
        reader.readAsDataURL(e.target.files[0]);
    }

    //handling deleting selected objects
    var deleteSelectedObject = document.getElementById('delete-item');
    deleteSelectedObject.onclick = function () {
        if (canvas.getActiveGroup()) {
            canvas.getActiveGroup().forEachObject(function (o) { canvas.remove(o) });
            canvas.discardActiveGroup().renderAll();
        } else {
            canvas.remove(canvas.getActiveObject());
        }
    };

}