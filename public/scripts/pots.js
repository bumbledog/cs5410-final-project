'use strict'

var Pot = function(spec) {
    var that = {};

    that.returnBody = function(){
        return spec.body;
    };

    that.setId = function(){
        spec.id = spec.body.id;
    };

    that.isBroken = function(){
        return spec.broken;
    };

    that.break = function(state){
        spec.broken = state;
    };

    that.returnPosition = function(){
        return spec.position;
    };

    that.returnImage = function(){
        return spec.img;
    };

    that.returnDimensions = function(){
        return spec.dimensions;
    };

    that.update = function(){
        spec.position.x = spec.body.position.x;
        spec.position.y = spec.body.position.y;
    };

    return that;
}