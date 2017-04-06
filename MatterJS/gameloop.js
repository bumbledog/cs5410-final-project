'use strict';

var game = {

};


game.physics = (function(){

    var lastTimeStamp = performance.now();
    var myInput = input.Keyboard();

    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create an engine
    var engine = Engine.create({

        //initializes a renderer in engine to send to canvas
        render: {
            element: document.body,
            canvas: graphics.returnCanvas(),
            options: {
                width: 500,
                height: 500,
                wireframes: false,
            }
        }
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(80, 400, 80, 80);

    

    var boxB = Bodies.rectangle(110, 0, 80, 80);
    var ground = Bodies.rectangle(400, 500, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    World.add(engine.world, [boxA, boxB, ground]);

    //change gravity
    engine.world.gravity.y = 0

    // run the engine
    Engine.run(engine);

     // run the renderer
    Render.run(engine.render);

    
    function handleInput(){
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_A)){
            //console.log('A');
            Matter.Body.applyForce(boxA, boxA.position, {x: -0.001125 * boxA.mass, y:0});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_D)){
            //console.log('D');
            Matter.Body.applyForce(boxA, boxA.position, {x: 0.001125 * boxA.mass, y:0});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_W)){
            //console.log('W');
            Matter.Body.applyForce(boxA, boxA.position, {x: 0, y:-0.001125 * boxA.mass});
        }
        if(myInput.keys.hasOwnProperty(KeyEvent.DOM_VK_S)){
            //console.log('S');
            Matter.Body.applyForce(boxA, boxA.position, {x: 0, y:0.001125 * boxA.mass});
        }
    }



    function initialize(){
        
        requestAnimationFrame(gameLoop);
    }


    function update(){
        
        boxA.frictionAir = 0.075;

        // run the engine
        // Engine.run(engine);
       
        //Matter.Body.applyForce(boxA, boxA.position, {x:0, y: -0.001125 * boxA.mass});

    }

    function render(){

        // run the renderer
        // Render.run(render);
        graphics.drawSquare();
    }

    function gameLoop(time){
        var elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        handleInput();

        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    return {
        render : render,
        update : update,
        initialize : initialize
    };

}());