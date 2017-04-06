'use strict';

var game = {

};


game.movement = (function(graphics, input){


    var   b2Vec2,  b2AABB
                ,	b2BodyDef
                ,	b2Body
                ,	b2FixtureDef
                ,	b2Fixture
                ,	b2World
                ,	b2MassData
                ,	b2PolygonShape 
                ,	b2CircleShape
                ,	b2DebugDraw
                ,  b2MouseJointDef;

    var lastTimeStamp = performance.now();
    //var thisInput = input.Keyboard();

    //a world to hold all they physics components
    var world;



    function initialize(){
        b2Vec2 = Box2D.Common.Math.b2Vec2
                ,  b2AABB = Box2D.Collision.b2AABB
                ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
                ,	b2Body = Box2D.Dynamics.b2Body
                ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
                ,	b2Fixture = Box2D.Dynamics.b2Fixture
                ,	b2World = Box2D.Dynamics.b2World
                ,	b2MassData = Box2D.Collision.Shapes.b2MassData
                ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
                ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
                ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
                ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
                ;


        //creates a world for all the objects to live in
        world = new b2World(
            new b2Vec2(0, 0),  //gravity units, right now its set to 10 units in the Y direction
            true                //true, because we only want to render when objects come in contact with another
        );                      //false would mean we always render it and not put it to sleep

        var scale = 30;

        //create the basic template of a fixture and the properties
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.75;  //how bouncy it is

        //create ground
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;    //static means it wont move, only react to other objects
        // bodyDef.position.x = 640 / 2 / scale;   //where to place it on the x
        // bodyDef.position.y = 480 / scale;       //where to place it on the y
        bodyDef.position.Set(250/scale, 125/scale);

        fixDef.shape = new b2PolygonShape;      //type of shape
        fixDef.shape.SetAsBox(50/scale, 20/scale); //set its dimensions
        world.CreateBody(bodyDef).CreateFixture(fixDef);            //send it to the world and create it

        //create other objects
        bodyDef.type = b2Body.b2_dynamicBody;   //means it can be moved by other objects

       





        //this is what shows all of the outlining of the objects. 
        //this is not the actual image itself, if we turn it off 
        //nothing shows but there is still physics objects around, just not being shown
        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("canvas-main").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
        requestAnimationFrame(gameLoop);
    }

    

    function handleInput(input){

            if(input.keys.hasOwnProperty(KeyEvent.DOM_VK_LEFT)){
                //moveLeft(elapsedTime);
            }

            if(input.keys.hasOwnProperty(KeyEvent.DOM_VK_RIGHT)){
                //moveRight(elapsedTime);
            }

    }






    function update(){

        //handleInput(myInput);

        world.Step(
            1/60,
            10,
            10
        );

    }

    function render(){
        world.DrawDebugData();
        world.ClearForces();
    }

    function gameLoop(time){
        var elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    return {
        render : render,
        update : update,
        initialize : initialize
    };

}(game.graphics, game.input));