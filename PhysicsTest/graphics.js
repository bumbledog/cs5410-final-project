

game.graphics = (function() {

    'use strict';

    var canvas = document.getElementById('canvas-main');
    var context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function(){
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };

    function clearContext(){
        context.clear();
    }


    return {
        clearContext : clearContext,
    };

}());