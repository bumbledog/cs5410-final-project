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

        //var myCanvas = graphics.returnCanvas();

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

        // //create the world
        // World.add(engine.world);

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
        World.add(engine.world, box);
        return box;
    };

    //allows you to set the incoming body as static or not
    //static = true means it WILL NOT move
    //static = false means it WILL move
    that.setStaticBody = function(myBody, bool){
        myBody.isStatic = bool;
    };


    //separate input for keyboard
    that.handleInput = function(myBody){
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_A)){
            //console.log(myBody.position);
            Matter.Body.applyForce(myBody, myBody.position, {x: -0.001125 * myBody.mass, y:0});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_D)){
            //console.log('D');
            Matter.Body.applyForce(myBody, myBody.position, {x: 0.001125 * myBody.mass, y:0});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_W)){
            //console.log('W');
            Matter.Body.applyForce(myBody, myBody.position, {x: 0, y:-0.001125 * myBody.mass});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_S)){
            //console.log('S');
            Matter.Body.applyForce(myBody, myBody.position, {x: 0, y:0.001125 * myBody.mass});
        }
    };

    //apply custom fricitonAir
    that.setFrictionAir = function(unit, myBody){
        myBody.frictionAir = unit;
    };

    


    return that;

}());