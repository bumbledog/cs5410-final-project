'use strict'


var physics = (function(){

    var that = {};

    var   b2Vec2 = Box2D.Common.Math.b2Vec2
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

    var world;
    var scale;
    var shapeType;
    var fixtureDefinition = new b2FixtureDef;
    var bodyDefinition = new b2BodyDef;

//---------------------------------------------------------//

    that.createWorld = function(gravityX, gravityY, toSleep){
        world = new b2World(
            new b2Vec2(gravityX, gravityX),
            toSleep
        );
    };

    //the scale so that the units are correct (should be 30)
    that.setScale = function(newScale){
        scale = newScale;
    };

    //creates the main factors that go into a fixture
    that.createFixture = function(newDensity, newFriction, newRestitution){
        fixtureDefinition.density = newDensity;
        fixtureDefinition.friction = newFriction;
        fixtureDefinition.restitution = newRestitution;
    };

    //determines what type of shape it will be
    that.setFixtureShape = function(type){
        shapeType = type;
        if(shapeType === 'polygon'){
            fixtureDefinition.shape = new b2PolygonShape;
        }
        if(shapeType === 'circle'){
            fixtureDefinition.shape = new b2CircleShape;
        }
    };

    //determines how big the body will be
    that.setFixtureSize = function(width, height, radius){
        if(shapeType === 'polygon'){
            fixtureDefinition.shape.SetAsBox(width/scale, height/scale);
        }
        if(shapeType === 'circle'){
            fixtureDefinition.shape.SetRadius(radius);
        }
    };

    //sets the body to static(NOT MOVING), or dynamic(MOVING)
    that.setBodyType = function(type){
        if(type === 'static'){
            bodyDefinition.type = b2Body.b2_staticBody;
        }
        if(type === 'dynamic'){
            bodyDefinition.type = b2Body.b2_dynamicBody;
        }
    };

    //positioning is based on the center of the body
    that.setBodyPosition = function(x, y){
        bodyDefinition.position.Set(x/scale, y/scale);
    };

    //creates the body in the world
    that.sendToWorld = function(){
        world.CreateBody(bodyDefinition).CreateFixture(fixtureDefinition);
    };


    return that;

}());