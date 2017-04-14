'use strict'

var physics = (function(){

    var that = {};

    //including my own input
    var myInput = input.Keyboard();

    var Engine = null,
        Render = null,
        World = null,
        Bodies = null,
        engine = null;
        

    //call first
    that.initialize = function(){

        //linking variables to Matter.js
        Engine = Matter.Engine;
        Render = Matter.Render;
        World = Matter.World;
        Bodies = Matter.Bodies;

        //creating the main engine to run all of our physics
        engine = Engine.create({
            render: {
                element : document.body,
                canvas: graphics.returnCanvas(),   //where to render to
                options: {
                    width: 1000,
                    height: 1000,
                    wireframes: false,
                }
            }
        });

        //sets the gravity to 0
        //we do this because its top down,
        //there should be no gravity in any direction
        engine.world.gravity.y = 0;

        // run the engine
        Engine.run(engine);

        // run the renderer
        Render.run(engine.render);

    };

    //allows the creation of a simple body
    that.createRectangleBody = function(x, y, w, h){
        var box = Bodies.rectangle(x, y, w, h);
        return box;
    };

    //allow the creation of a circle Body
    that.createCircleBody = function(x, y, r){
        var circle = Bodies.circle(x, y, r);
        return circle;
    };

    //directly set the position of a body
    that.setPosition = function(myBody, x, y){
        Matter.Body.setPosition(myBody, {x: x, y: y});
    };

    //a functional call to add to the world
    that.addToWorld = function(myBody){
        World.add(engine.world, myBody);
    };

    //allows you to set the incoming body as static or not
    //static = true means it WILL NOT move
    //static = false means it WILL move
    that.setStaticBody = function(myBody, bool){
        myBody.isStatic = bool;
    };

    //apply custom fricitonAir
    that.setFrictionAir = function(unit, myBody){
        myBody.frictionAir = unit;
    };

    //apply custom bounce
    that.setRestitution = function(unit, myBody){
        myBody.restitution = unit;
    };

    //apply custom speed. I found that this function doesnt really work how you think it would... =D
    that.setSpeed = function(unit, myBody){
        myBody.speed = unit;
    };


    return that;

}());
