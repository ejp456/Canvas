//using window.onload to load this function right away
window.onload = function () 
{
    //adding this to change jquery to use $j instead of $ since it
    //conflicts with the aliasing used by fabric.js
    var $j = jQuery.noConflict();

    var $ = function (id) { return document.getElementById(id) };

    //hiding the shadow buttons since they don't seem to do anything
    // but fails to work without them
    $j('#drawing-shadow-color').hide();
    $j('#drawing-shadow-width').hide();
    $j('#drawing-shadow-offset').hide();

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
        selectionModeEl = $('selection-mode'),
        drawingOptionsEl = $('drawing-mode-options'),
        drawingColorEl = $('drawing-color'),
        drawingShadowColorEl = $('drawing-shadow-color'),
        drawingLineWidthEl = $('drawing-line-width'),
        drawingShadowWidth = $('drawing-shadow-width'),
        drawingShadowOffset = $('drawing-shadow-offset'),
        clearEl = $('clear-canvas');

    clearEl.onclick = function () { canvas.clear() };

    drawingModeEl.onclick = function () {
        //canvas.isDrawingMode = !canvas.isDrawingMode;
        canvasOutside.isDrawingMode = true;
        canvasInside.isDrawingMode = true;
        if (canvas.isdrawingmode) {
            drawingmodeel.innerhtml = 'cancel drawing mode';
            drawingoptionsel.style.display = '';
        }
        else {
            drawingmodeel.innerhtml = 'enter drawing mode';
            drawingoptionsel.style.display = 'none';
        }
    };

    //seperating the drawing and selection mode
    selectionModeEl.onclick = function () 
    {
        canvasOutside.isDrawingMode = false;
        canvasInside.isDrawingMode = false;
    }

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('mycanvasOutside');
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

        var hLinePatternBrush = new fabric.PatternBrush(canvasOutside);
        hLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('mycanvasOutside');
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

            var patternCanvas = fabric.document.createElement('mycanvasOutside');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('mycanvasOutside');
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
            canvasInside.freeDrawingBrush = vLinePatternBrush;
            canvasOutside.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvasInside.freeDrawingBrush = hLinePatternBrush;
            canvasOutside.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvasInside.freeDrawingBrush = squarePatternBrush;
            canvasOutside.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvasInside.freeDrawingBrush = diamondPatternBrush;
            canvasOutside.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvasInside.freeDrawingBrush = texturePatternBrush;
            canvasOutside.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvasInside.freeDrawingBrush = new fabric[this.value + 'Brush'](canvasInside);
            canvasOutside.freeDrawingBrush = new fabric[this.value + 'Brush'](canvasOutside);
        }

        if (canvas.freeDrawingBrush) {
            canvasInside.freeDrawingBrush.color = drawingColorEl.value;
            canvasInside.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvasInside.freeDrawingBrush.shadowBlur = parseInt(drawingLineWidthEl.value, 10) || 0;
            canvasOutside.freeDrawingBrush.color = drawingColorEl.value;
            canvasOutside.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvasOutside.freeDrawingBrush.shadowBlur = parseInt(drawingLineWidthEl.value, 10) || 0;
        }
    };

    drawingColorEl.onchange = function () {
        canvasInside.freeDrawingBrush.color = this.value;
        canvasOutside.freeDrawingBrush.color = this.value;
    };
    drawingShadowColorEl.onchange = function () {
        canvasInside.freeDrawingBrush.shadowColor = this.value;
        canvasOutside.freeDrawingBrush.shadowColor = this.value;
    };
    drawingLineWidthEl.onchange = function () {
        canvasInside.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        canvasOutside.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function () {
        canvasInside.freeDrawingBrush.shadowBlur = 0;
        canvasOutside.freeDrawingBrush.shadowBlur = 0;
        //this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function () {
        //canvas.freeDrawingBrush.shadowOffsetX =
        canvasInside.freeDrawingBrush.shadowOffsetY = 0;
        canvasOutside.freeDrawingBrush.shadowOffsetY =  0;
        //this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {

        canvasInside.freeDrawingBrush.color = drawingColorEl.value;
        canvasInside.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvasInside.freeDrawingBrush.shadowBlur = 0;
        canvasOutside.freeDrawingBrush.color = drawingColorEl.value;
        canvasOutside.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
        canvasOutside.freeDrawingBrush.shadowBlur = 0;
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

    //adding shapes to the canvas
    //add the selected shape to the card
    var addShape = document.getElementById('add-shape')
    addShape.onclick = function () {
        var shape = $('adding-shapes-selector').value;
        var color = $('shape-color').value;
        var shapeToAdd;
        if (shape == 0) {
            shapeToAdd = new fabric.Circle({
                radius: 20, fill: color, left: 100, top: 100
            });
        }
        else if (shape == 1) {
            shapeToAdd = new fabric.Rect({
                width: 20, height:20, fill: color, left: 100, top: 100
            });
        }
        else if (shape == 2) {
            shapeToAdd = new fabric.Triangle({
                radius: 20, fill: color, left: 100, top: 100
            });
        }
        canvas.add(shapeToAdd);
    }

    //initilizaing objects to give more structure to the card

    var centerLine = new fabric.Line([480, 0, 480, 672], {
        stroke: 'black',
        strokeWidth: 2
    });

    canvasInside.add(centerLine);
    canvasOutside.add(centerLine);

    canvasInside.add(new fabric.IText("Inside Left",
        {
            top: 100,
            left: 170
        }));

    canvasInside.add(new fabric.IText("Inside Right",
        {
            top: 100,
            left: 650
        }));

    canvasOutside.add(new fabric.IText("Back",
       {
           top: 100,
           left: 170
       }));

    canvasOutside.add(new fabric.IText("Front",
        {
            top: 100,
            left: 650
        }));
}
