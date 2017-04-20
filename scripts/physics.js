'use strict'

var physics = (function(){

    var that = {};

    //including my own input
    var myInput = input.Keyboard();

    var Engine = null,
        Render = null,
        World = null,
        Bodies = null,
        Events = null,
        engine = null;

    var defaultCategory = 0x0001;
    var characterCategory = 0x0002;
    var enemyCategory = 0x0003;

    //call first
    that.initialize = function(){

        //linking variables to Matter.js
        Engine = Matter.Engine;
        Render = Matter.Render;
        World = Matter.World;
        Bodies = Matter.Bodies;
        Events = Matter.Events;

        //creating the main engine to run all of our physics
//CHANGE BACK
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

        // use this if you dont want to render
//---->>>>// engine = Engine.create({
        //     render: false
        // });


        //sets the gravity to 0
        //we do this because its top down,
        //there should be no gravity in any direction
        engine.world.gravity.y = 0;

        // run the engine
        Engine.run(engine);

        // run the renderer
        //comment out for original game
        Render.run(engine.render); //<----------CHANGE BACK

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

    //creates a sensor body thats also a static body
    that.createSensorBody = function(x, y, w, h) {
        var collider = Bodies.rectangle(x,y,w,h, {
            isSensor: true,
            isStatic: true
        });

        World.add(engine.world, collider);
        return collider;
    };

    //at the start of a collision between two objects
    that.eventSensorStart = function(character, enemies){

        Events.on(engine, 'collisionStart', function(event){
            var pairs = event.pairs;

            for(var i = 0, j = pairs.length; i != j; i++){
                var pair = pairs[i];

                if(pair.bodyA === character.returnSensor()) {
                    //pair.bodyA.isStatic = false;
                    //console.log(enemies[pair.bodyB.id].returnHealth());
                    //console.log(pair.bodyB.id);
                    // console.log('hit start');
                }
                else if(pair.bodyB === character.returnSensor()) {
                    //pair.bodyB.isStatic = false;
                    //console.log(enemies[pair.bodyA.id].returnHealth());
                    //console.log(pair.bodyA.id);
                    // console.log('hit start');
                }
            }
        });

    };

    //while there is a collision between two objects that is active
    that.eventSensorActive = function(character, enemies){

        Events.on(engine, 'collisionActive', function(event){
            var pairs = event.pairs;

            for(var i = 0, j = pairs.length; i != j; i++){
                var pair = pairs[i];

                if(pair.bodyA === character.returnSensor()) {
                    if(character.returnDirection() === 'down' && character.returnAttackState()){
                        Matter.Body.setPosition(pair.bodyB, {x: pair.bodyB.position.x, y: pair.bodyB.position.y + 50});
                        Matter.Body.setVelocity(pair.bodyB, { x: 0, y: 10 });
                        enemyMatchingId(enemies, pair.bodyB.id).damaged();
                        //console.log(enemies[pair.bodyB.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyB.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyB.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyB.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'up' && character.returnAttackState()){
                        Matter.Body.setPosition(pair.bodyB, {x: pair.bodyB.position.x, y: pair.bodyB.position.y - 50});
                        Matter.Body.setVelocity(pair.bodyB, { x: 0, y: -10 });
                        enemyMatchingId(enemies, pair.bodyB.id).damaged();
                        //console.log(enemies[pair.bodyB.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyB.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyB.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyB.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'right' && character.returnAttackState()){
                        Matter.Body.setPosition(pair.bodyB, {x: pair.bodyB.position.x + 50, y: pair.bodyB.position.y});
                        Matter.Body.setVelocity(pair.bodyB, { x: 10, y: 0 });
                        enemyMatchingId(enemies, pair.bodyB.id).damaged();
                        //console.log(enemies[pair.bodyB.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyB.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyB.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyB.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'left' && character.returnAttackState()){
                        Matter.Body.setPosition(pair.bodyB, {x: pair.bodyB.position.x - 50, y: pair.bodyB.position.y});
                        Matter.Body.setVelocity(pair.bodyB, { x: -10, y: 0 });
                        enemyMatchingId(enemies, pair.bodyB.id).damaged();
                        //console.log(enemies[pair.bodyB.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyB.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyB.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyB.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }

                }
                else if(pair.bodyB === character.returnSensor()) {
                    //pair.bodyB.isStatic = false;
                    // Matter.Body.applyForce(pair.bodyA, pair.bodyA.position, {x: 100 * pair.bodyA.mass, y:0});
                    if(character.returnDirection() === 'down' && character.returnAttackState()){
                        Matter.Body.setVelocity(pair.bodyA, { x: 0, y: 10});
                        Matter.Body.setPosition(pair.bodyA, {x: pair.bodyB.position.x, y: pair.bodyA.position.y + 50});
                        enemyMatchingId(enemies, pair.bodyA.id).damaged();
                        //console.log(enemies[pair.bodyA.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyA.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyA.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyA.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'up' && character.returnAttackState()){
                        Matter.Body.setVelocity(pair.bodyA, { x: 0, y: -10});
                        Matter.Body.setPosition(pair.bodyA, {x: pair.bodyB.position.x, y: pair.bodyA.position.y - 50});
                        enemyMatchingId(enemies, pair.bodyA.id).damaged();
                        //console.log(enemies[pair.bodyA.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyA.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyA.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyA.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'right' && character.returnAttackState()){
                        Matter.Body.setVelocity(pair.bodyA, { x: 10, y: 0});
                        Matter.Body.setPosition(pair.bodyA, {x: pair.bodyB.position.x + 50, y: pair.bodyA.position.y});
                        enemyMatchingId(enemies, pair.bodyA.id).damaged();
                        //console.log(enemies[pair.bodyA.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyA.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyA.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyA.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                    if(character.returnDirection() === 'left' && character.returnAttackState()){
                        Matter.Body.setVelocity(pair.bodyA, { x: -10, y: 0});
                        Matter.Body.setPosition(pair.bodyA, {x: pair.bodyB.position.x - 50, y: pair.bodyA.position.y});
                        enemyMatchingId(enemies, pair.bodyA.id).damaged();
                        //console.log(enemies[pair.bodyA.id].returnHealth());
                        //console.log('hit active');
                        // if(enemies[pair.bodyA.id].returnHealth() <= 1){
                        //     physics.removeFromWorld(enemies[pair.bodyA.id].returnCharacterBody());
                        //     enemies.splice(pair.bodyA.id, 1);
                        //     pairs.splice(i, 1);
                        // }
                    }
                }
            }
        });

    };

    //at the end of a collsion between two objects
    that.eventSensorEnd = function(character, enemies){

        Events.on(engine, 'collisionEnd', function(event){
            var pairs = event.pairs;

            for(var i = 0, j = pairs.length; i != j; i++){
                var pair = pairs[i];

                if(pair.bodyA === character.returnSensor()) {
                    character.attack(false);
                    // if(enemies[pair.bodyB.id] === pair.bodyB){
                    //     if(enemies[pair.bodyB.id].returnHealth() <= 0){
                    //         enemies.splice(pair.bodyB.id, 1);
                    //         physics.removeFromWorld(pair.bodyB);
                    //     }
                    // }
                    // if(enemies[pair.bodyB.id].returnHealth() <= 1){
                    //     physics.removeFromWorld(enemies[pair.bodyB.id].returnCharacterBody());
                    //     enemies.splice(pair.bodyB.id, 1);
                    // }
                    //console.log('hit end');
                }
                else if(pair.bodyB === character.returnSensor()) {
                    character.attack(false);
                    // if(enemies[pair.bodyA.id] === pair.bodyA){
                    //     if(enemies[pair.bodyA.id].returnHealth() <= 0){
                    //         enemies.splice(pair.bodyA.id, 1);
                    //         physics.removeFromWorld(pair.bodyA);
                    //     }
                    // }
                    // if(enemies[pair.bodyA.id].returnHealth() <= 1){
                    //     physics.removeFromWorld(enemies[pair.bodyA.id].returnCharacterBody());
                    //     enemies.splice(pair.bodyA.id, 1);
                    // }
                    //console.log('hit end');
                }
            }
        });

    };

    //find matching enemy
    function enemyMatchingId(enemies, id) {
      for(let i = 0; i < enemies.length; i++){
        if(enemies[i].body.id === id){
          return enemies[i];
        }
      }
      return undefined;
    }

    //directly set the position of a body
    that.setPosition = function(myBody, x, y){
        Matter.Body.setPosition(myBody, {x: x, y: y});
    };

    that.rotateBody = function(myBody, degrees){
        Matter.Body.rotate(myBody, degrees);
    };

    //a functional call to add to the world
    that.addToWorld = function(myBody){
        World.add(engine.world, myBody);
    };

    //a functional call to remove a body from the world
    that.removeFromWorld = function(myBody){
        Matter.World.remove(engine.world, myBody);
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

    //apply manual velocity to body, used in parallel with setPosition
    //velocity must be a vector = {x: , y: }
    that.setVelocity = function(myBody, velocity){
        Matter.Body.setVelocity(myBody, velocity);
    };

    //add collision filtering
    that.addCollisionFilter = function(myBody, myCategory){
        myBody.collisionFilter.category = myCategory;
    };

    //ad the collision mask
    that.addCollisionMask = function(myBody, myMask){
        myBody.collisionFilter.mask = myMask;
    };

    //allows manually entry of a bodies unique id
    that.setID = function(myBody, value){
        myBody.id = value;
    };

    //returns the unique id of the body
    that.returnID = function(myBody){
        return myBody.id;
    };


    return that;

}());
