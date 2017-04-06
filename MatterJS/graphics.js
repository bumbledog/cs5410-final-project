

var graphics = (function() {

    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    var that = {};


    CanvasRenderingContext2D.prototype.clear = function(){
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    that.clearContext = function(){
        context.clear();
    }

    that.returnCanvas = function(){
        return canvas;
    }

    that.drawSquare = function(){
        context.beginPath();
        context.lineWidth="4";
        context.strokeStyle="green";
        context.rect(250,250,80,80);
        context.stroke();
    }


    return that;

}());