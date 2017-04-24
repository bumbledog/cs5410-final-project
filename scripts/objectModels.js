var objects = (function(){
  let that = {};

  let width, height;
       //variables used to find gaussian distribution
  let characterSizePercent, characterInventory, /*enemies,*/ pots, potSizePercent;                  //array of breakable pots
  let movingLeft, movingRight,
      movingDown, movingUp;
  let imgBat, imgSlime, batSpec, slimeSpec;
  that.quadTree = {};

  let enemies, visible;
  //that.moreSlime = false;
  //that.moreBats = false;

    //categories for collision detection
    var defaultCategory = 0x0001;
    var characterCategory = 0x0002;
    var enemyCategory = 0x0003;

  that.initialize = function(gridWidth, gridHeight){
    width = gridWidth,
    height = gridHeight;
    //usePrevious = false
    characterInventory = {};    //contains an inventory of all items that the character holds
    pots = [];                  //array of breakable pots
    movingLeft = false;
    movingRight = false;
    movingDown = false;
    movingUp = false;
    characterSizePercent = {x:1,y:1};
    potSizePercent = {x:5, y:5}

    imgSlime = new Image();
    imgSlime.src = "assets/slime.png";

    imgBat = new Image();
    imgBat.src = "assets/bat.png";
  };



  function randomLocation(width,height, size){
    let randLoc = {x:Math.random()*size*width, y:Math.random()*size*height};

      return randLoc;
  }

  function randPotLocation(){
      let randLoc = {x:Math.random()*1000, y:Math.random()*1000};
        //This function needs to be changed. Pots should
        //only generate next to walls and in clusters.
        //could this generation be added to the Prim's generation algo?

      return randLoc;
  }

  function initializePots(){
      var avgPotCount = 50;
      var dev = 15;
      var potsWithItems = 15;
      var dev2 = 5;
      for(let i = 0; i < math.gaussian(avgPotCount, dev); i++){
          pots.push({
              location:randPotLocation(),
              isBroken:false,
              hasItem:false,
              radius:1000*(potSizePercent.y/100),
              radiusSq: (1000*(potSizePercent.y/100))*(1000*(potSizePercent.y/100))
            });
      }

      for(let i = 0; i < math.gaussian(potsWithItems, dev); i++){
          pots[i].hasItem = true;
      }

  }

  that.initializeEnemies = function(avgEnemyCount, width, height, size){
      enemies = [];
      let dev = 10;
      for(let i = 0; i < math.gaussian(avgEnemyCount, dev); i++){
        let chooseSprite = Math.floor(Math.random()*2);
        let enemySprite;
        if(chooseSprite === 1){
          enemySprite = AnimatedSprite({
            spriteSheet: imgSlime,
            spriteCount: 4,
            spriteTime: [100, 250, 220, 300, 175],
            spriteSize: 50,
            width: 100,
            height: 100,
            pixelWidth: 32,
            pixelHeight: 32
          });
        }else{
          enemySprite = AnimatedSprite({
            spriteSheet: imgBat,
            spriteCount: 6,
            spriteTime: [100, 80, 75, 125, 75, 60],
            spriteSize: 50,
            width: 150,
            height: 100,
            pixelWidth: 48,
            pixelHeight: 32
          });
        }
          let randLoc = randomLocation(width, height, size);
          enemies.push(that.Character({
              sprite: enemySprite,
              enemyType: chooseSprite,
              view:{width:1000, height:1000},
              moveRate: 1/100000, //pixels per millisecond
              radius: 1500*(characterSizePercent.y/100),
              radiusSq: (1000*(characterSizePercent.y/100))*(1000*(characterSizePercent.y/100)) ,
              isDead: false,
              isHit: false,
              center: randLoc,
              health: 2,
              tag: 'Enemy',
              body: physics.createRectangleBody(randLoc.x + 1, randLoc.y + 7, 60, 60)
          }));
      }

      for(let i = 0; i < enemies.length; i++) {
        physics.setID(enemies[i].returnCharacterBody(), i);
        enemies[i].addBodyToWorld();
      }


      //if we want to have a minimum # of enemies per room, this may need to be changed
      return enemies;
  };

  that.loadEnemies = function(spec){
    let enemies = [];
    for(let i = 0; i < spec.length; i++){
      let enemySprite;
      if(spec[i].chooseSprite === 1){
        enemySprite = AnimatedSprite({
          spriteSheet: imgSlime,
          spriteCount: 4,
          spriteTime: [100, 250, 220, 300, 175],
          spriteSize: 50,
          width: 100,
          height: 100,
          pixelWidth: 32,
          pixelHeight: 32
        });
      }else{
        enemySprite = AnimatedSprite({
          spriteSheet: imgBat,
          spriteCount: 6,
          spriteTime: [100, 80, 75, 125, 75, 60],
          spriteSize: 50,
          width: 150,
          height: 100,
          pixelWidth: 48,
          pixelHeight: 32
        });
      }
      enemies.push(that.Character({
          sprite: enemySprite,
          enemyType: spec[i].chooseSprite,
          view:{width:1000, height:1000},
          moveRate: 1/100000, //pixels per millisecond
          radius: 1500*(characterSizePercent.y/100),
          radiusSq: (1000*(characterSizePercent.y/100))*(1000*(characterSizePercent.y/100)) ,
          isDead: false,
          isHit: false,
          center: spec[i].center,
          health: spec[i].health,
          tag: 'Enemy',
          body: physics.createRectangleBody(spec[i].center.x + 1, spec[i].center.y + 7, 60, 60)
      }));
    }

    for(let i = 0; i < enemies.length; i++) {
      physics.setID(enemies[i].returnCharacterBody(), i);
      enemies[i].addBodyToWorld();
    }

    //if we want to have a minimum # of enemies per room, this may need to be changed
    return enemies;
  };

  //---------------------------------
  //Character model. spec must include:
  //    image: character image
  //    view:{width,height}
  //    radius: radius around object used in quadTree to determine if visible
  //    radiusSq : height squared
  //    moveRate: number in pixels per millisecond*/
  //    isDead: bool
  //    isHit:  bool    (could use number here instead that could be the damage taken if variable damage is possible depending on enemy)
  //    center: {x,y}
  //    health: number
  that.Character = function(spec){
      var that;

      spec.width = spec.view.width * (characterSizePercent.x/100);
      spec.height = spec.view.height * (characterSizePercent.y/100);



      that = {
          get left(){return spec.center.x - spec.width/2},
          get right(){return spec.center.x + spec.width/2},
          get top(){return spec.center.y - spec.height/ 2},
          get bottom(){return spec.center.y + spec.height/2},
          get center(){return spec.center},
          get width(){return spec.width},
          get radius(){return spec.radius},
          get radiusSq(){return spec.radiusSq},
          get isHit(){return spec.isHit},
          get isDead(){return spec.isDead},
          get body(){return spec.body},
          get enemyType(){ return spec.enemyType }
      };

      //adds the body to the physics world
      that.addBodyToWorld = function(){
        physics.setFrictionAir(0.075, spec.body);  //how much friction in the air when it moves
        physics.setRestitution(2, spec.body);      //how bouncy/elastic

        if(spec.tag === 'Character'){
            physics.addCollisionFilter(spec.body, characterCategory);
        }
        if(spec.tag === 'Enemy'){
            physics.addCollisionFilter(spec.body, enemyCategory);
        }
        physics.addToWorld(spec.body);
      };

      //returns the body of either the enemy or character
      that.returnCharacterBody = function(){
        return spec.body;
      };

      //returns the sensor body tied to the character
      that.returnSensor = function(){
          return spec.sensor;
      };

      //returns the category in which it can collide with
      that.returnCategory = function(){
        return spec.body.collisionFilter.category;
      };

      //returns the direciton in which the character is facing
      that.returnDirection = function(){
        return spec.direction;
      };

      //returns the amount of cooldown a character has before he can attack
      that.returnCoolDown = function(){
        return spec.coolDown;
      };

      //set the cooldown manually
      that.setCoolDown = function(CD){
        spec.coolDown = CD;
      };

      //manually sets the body position of the character
      that.setBodyPosition = function(myBody){
        spec.center.x = myBody.position.x;
        spec.center.y = myBody.position.y;
      };

      that.updatePosition = function(character){
          var charDistanceX = character.x - spec.center.x;
          var charDistanceY = character.y - spec.center.y;

          if(charDistanceX > 0){
            Matter.Body.applyForce(spec.body, spec.body.position, {x: 0.0005 * spec.body.mass, y:0});
          }

          else{
              Matter.Body.applyForce(spec.body, spec.body.position, {x: -0.0005 * spec.body.mass, y:0});
          }

          if(charDistanceY > 0){
              Matter.Body.applyForce(spec.body, spec.body.position, {x: 0, y:0.0005 * spec.body.mass});
          }

          else{
              Matter.Body.applyForce(spec.body, spec.body.position, {x: 0, y:-0.0005 * spec.body.mass});
          }

      };

      //sets if the character is in a state of attacking
      that.attack = function(state){
        spec.attacking = state;
        if(state){
            audio.playSound('assets/sword-swipe');
        }
      };

      //returns if the character is in a state of attacking
      that.returnAttackState = function(){
        return spec.attacking;
      };

      //allows the status of 'isHit' to be changed manually
      that.setHit = function(){
          spec.isHit = true;
      };

      that.setFalseHit = function(){
          spec.isHit = false;
      };

      that.returnIsHit = function(){
          return spec.isHit;
      };

      //checks if the character is hit
      that.checkIfHit = function(){
          if(spec.isHit){
              audio.playSound('assets/grunt');
          }
          //spec.isHit = false;

          
          return false;
          //WILL NEED TO BE CHANGED. JUST WRITTEN LIKE THIS FOR CHARACTER MOVEMENT TESTING
      };

      //allows the character or enemy to receive damage
      that.damaged = function(){
        spec.health--;
      };

      that.returnHealth = function(){
        return spec.health;
      };

      that.checkHealth = function(object){
        if(spec.isHit !== false){
            spec.health -= 1;
            spec.isHit = false;
        }

        if(spec.health <= 0){

            spec.isDead = true;
        }
      }

      //returns the amount of keys on the character
      that.returnKeyTotal = function(){
        return spec.keys;
      };

      //programmically updates the key stat image on the overly
      //whenever the character gets a new key
      function updateKeys(){
        for(let key = 0; key < spec.keys; key++){
            spec.keyInventory[key].setImage('assets/key.png');
        }
      }


//MOVEMENT:
      that.moveRight = function(elapsedTime){
          Matter.Body.applyForce(spec.body, spec.body.position, {x: 0.002 * spec.body.mass, y:0});
          game.dustParticles.createParticles(1, spec.center.x , spec.center.y + 20, 20);
        //   if(spec.direction === 'down' || spec.direction === 'up'){
        //     Matter.Body.setAngle(spec.sensor, 90);
        //   }
          spec.direction = 'right';
      };

      that.moveLeft = function(elapsedTime){
          Matter.Body.applyForce(spec.body, spec.body.position, {x: -0.002 * spec.body.mass, y:0});
          game.dustParticles.createParticles(1, spec.center.x , spec.center.y + 20, 20);
          spec.direction = 'left';
      };

      that.moveUp = function(elapsedTime){
          Matter.Body.applyForce(spec.body, spec.body.position, {x: 0, y:-0.002 * spec.body.mass});
          game.dustParticles.createParticles(1, spec.center.x , spec.center.y + 20, 20);
          spec.direction = 'up';
      };

      that.moveDown = function(elapsedTime){
          Matter.Body.applyForce(spec.body, spec.body.position, {x: 0, y:0.002 * spec.body.mass});
          game.dustParticles.createParticles(1, spec.center.x , spec.center.y + 20, 20);
          spec.direction = 'down';
      };


      that.update = function(elapsedTime, characterPos){


      //character/enemy update function

        // //determine if dead or not
        // if(spec.tag === 'Enemy' && spec.health <= 0){
        //     physics.removeFromWorld(spec.body);
        //     enemies.splice(spec.body.id, 1);
        // }
        // else{

        //need to add this so that the character doesnt skip to the body position
        if(spec.tag === 'Character'){
            spec.center.x = spec.body.position.x;
            spec.center.y = spec.body.position.y;

            that.checkIfHit();
            that.checkHealth();

            //change sensor position
            if(spec.direction === 'down'){
                physics.setPosition(spec.sensor, spec.center.x, spec.center.y + 85);
            }
            if(spec.direction === 'up'){
                physics.setPosition(spec.sensor, spec.center.x, spec.center.y - 85);
            }
            if(spec.direction === 'right'){
                physics.setPosition(spec.sensor, spec.center.x + 85, spec.center.y);
            }
            if(spec.direction === 'left'){
                physics.setPosition(spec.sensor, spec.center.x - 85, spec.center.y);
            }

            updateKeys();
        }

        //sprite & enemy position
        if(spec.tag === 'Enemy'){
          spec.sprite.update(elapsedTime);
          // if enemy in viewport{
              let square = {
                  center:{x:characterPos.x , y:characterPos.y},
                  size: graphics.defineCamera(characterPos.x, characterPos.y).size - 300
              }

              if(math.objectInSquare(spec, square)) {
                  if(spec.enemyType === 1){
                        audio.sounds['assets/slime-sound'].loop = true;
                         audio.playSound('assets/slime-sound');
                }

                else if(spec.enemyType === 0){
                    audio.sounds['assets/bat-sound'].loop = true;
                    audio.playSound('assets/bat-sound');
                }

                    that.updatePosition(characterPos);
              }
              else{
                  audio.sounds['assets/slime-sound'].loop = false;
                  //audio.pauseSound('assets/slime-sound');
                  audio.sounds['assets/bat-sound'].loop = false;
                  //audio.pauseSound('assets/bat-sound');

              }
              
            if(spec.health < 1){
                spec.isDead = true;
            }
            else{
                spec.center.x = spec.body.position.x;
                spec.center.y = spec.body.position.y;
                spec.sprite.update(elapsedTime);
            }
        }

            // //need to write checkIfHit functions
            // if(that.checkIfHit === true){
            //     spec.isHit = true;
            // }
            // checkHealth(that);
            //}


      };


      that.render = function(){

          if(spec.tag === 'Character'){
            physics.setPosition(spec.body, spec.center.x, spec.center.y);


          graphics.drawCharacter({
              x:spec.center.x,
              y:spec.center.y,
              width:spec.width,
              height:spec.height,
              image:spec.image
          })
          }
          else{
            //characters with a sprite
            spec.sprite.render(spec.center.x, spec.center.y);
          }
      };

      that.intersects = function(other){
          var distance = Math.pow((spec.center.x - other.center.x), 2) + Math.pow((spec.center.y - other.center.y), 2)

          return (distance < Math.pow(spec.radius + other.radius, 2));
      }

      return that;
  };

  that.buildQuadTree = function(maxObjectsPerNode, objects, rootSize){
      var objectToQuad = 0;

      that.quadTree = QuadTree(maxObjectsPerNode, rootSize);
      for(objectToQuad = 0; objectToQuad < objects.length; objectToQuad++){
          that.quadTree.insert(objects[objectToQuad]);
      }
  };

  return that;
}());

var math = (function(){
    let that = {};
    let usePrevious = false;
    let y2, x1, x2, z;

 that.gaussian = function(mean, stdDev){   //performs a gaussian distribution.
      if(usePrevious){               //I use this function to initialize how many enemies are generated.
          usePrevious = false;
          return mean + y2*stdDev;
      }

      usePrevious = true;

      do{
          x1 = 2*Math.random() - 1;
          x2 = 2*Math.random() - 1;
          z = (x1*x1) + (x2*x2);
      } while(z>=1);

      z = Math.sqrt((-2*Math.log(z)));
      y1 = x1*z;
      y2 = x2*z;
      return mean + y1*stdDev;
  }

  that.circleVector = function() {
		var angle = Math.random() * 2 * Math.PI;
		return {
			x: Math.cos(angle),
			y: Math.sin(angle)
		};
	}



that.Circle = function(spec) {
	'use strict';
	var radiusSq = spec.radius * spec.radius,	// This gets used by various mathematical operations to avoid a sqrt
		that = {
			get center() { return spec.center; },
			get radius() { return spec.radius; },
			get radiusSq() { return radiusSq; }
		};

	//------------------------------------------------------------------
	//
	// Checks to see if the two circles intersect each other.  Returns
	// true if they do, false otherwise.
	//
	//------------------------------------------------------------------
	that.intersects = function(other) {
		var distance = Math.pow((spec.center.x - other.center.x), 2) + Math.pow((spec.center.y - other.center.y), 2);

		return (distance < Math.pow(spec.radius + other.radius, 2));
	};


    return that;
};



that.objectInSquare = function(objectToAdd, square){
        var squareDiv2 = square.size/2,
            objectDistanceX,
            objectDistanceY,
            distanceX,
            distanceY,
            cornerDistanceSq;

        objectDistanceX = Math.abs(objectToAdd.center.x - square.center.x);
        if(objectDistanceX > (squareDiv2 + objectToAdd.radius)) {return false;}
        objectDistanceY = Math.abs(objectToAdd.center.y - square.center.y);
        if(objectDistanceY > (squareDiv2 + objectToAdd.radius)) {return false};

        if(objectDistanceX <= squareDiv2) { return true;}
        if(objectDistanceY <= squareDiv2) { return true;}

        distanceX = (objectDistanceX - squareDiv2);
        distanceY = (objectDistanceY - squareDiv2);
        distanceX *= distanceX;
        distanceY *= distanceY;

        cornerDistanceSq = distanceX + distanceY;
        return ( cornerDistanceSq <= objectToAdd.radiusSq);
    }

//Creates a circle around a given square
    that.circleFromSquare = function(pointA, pointB, pointC){
        var circleSpec = {
            center: {},
            radius: 0
        },

        midPointAB = {
            x: (pointA.x + pointB.x)/2,
            y: (pointA.y + pointB.y)/2
        },

        midPointAC = {
            x:(pointA.x + pointC.x)/2,
            y:(pointA.y + pointC.y)/2
        },
            slopeAB = (pointB.y - pointA.y)/(pointB.x - pointA.x),
            slopeAC = (pointC.y - pointA.y)/(pointC.x - pointA.x);
        slopeAB = -(1/slopeAB);
        slopeAC = -(1/slopeAC);

        circleSpec.center.x = midPointAC.x;
        circleSpec.center.y = midPointAB.y;
        circleSpec.radius = Math.sqrt(Math.pow(circleSpec.center.x - pointA.x, 2) + Math.pow(circleSpec.center.y - pointA.y, 2));

        return math.Circle(circleSpec);
    }

return that;
}());
