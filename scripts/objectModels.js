var objects = (function(){
  let that = {};

  let width, height;
       //variables used to find gaussian distribution
  let characterSizePercent, characterInventory, enemies, pots;                  //array of breakable pots
  let movingLeft, movingRight,
      movingDown, movingUp;
  let imgEnemy;

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

    imgEnemy = new Image();
    imgEnemy.src = "assets/skeletonSprite.png";
  }



  function randomLocation(){
let randLoc = {x:Math.random()*500*16, y:Math.random()*500*16};

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
          pots.push({location:randPotLocation(), isBroken:false, hasItem:false})
      }

      for(let i = 0; i < math.gaussian(potsWithItems, dev); i++){
          pots[i].hasItem = true;
      }

  }

  that.initializeEnemies = function(){
      let enemies = [];
      let avgEnemyCount = 100;
      let dev = 10;
      for(let i = 0; i < math.gaussian(avgEnemyCount, dev); i++){
          enemies.push(that.Character({
              image:imgEnemy,
              view:{width:1000, height:1000},
              moveRate: 1/100000, //pixels per millisecond
              isDead: false,
              isHit: false,
              center: randomLocation(),
              health: 2
          }));
      }
      //if we want to have a minimum # of enemies per room, this may need to be changed
      return enemies;
  }

  //---------------------------------
  //Character model. spec must include:
  //    image: character image
  //    view:{width,height}
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
          get width(){return spec.width}
      };

      that.moveRight = function(elapsedTime){
          game.dustParticles.createParticles(1, math.gaussian(spec.center.x, 20), math.gaussian(spec.center.y + 20, 20));
          spec.center.x += spec.moveRate * elapsedTime;

         //need bounds to keep character from moving off the map
         //could be done with collision detection
      }

      that.moveLeft = function(elapsedTime){
        game.dustParticles.createParticles(1, math.gaussian(spec.center.x, 20), math.gaussian(spec.center.y + 20, 20));
          spec.center.x -= spec.moveRate*elapsedTime;

          //need bounds to keep character from moving off the map
          //could be done with collision detection
      }

      that.moveUp = function(elapsedTime){
        game.dustParticles.createParticles(1, math.gaussian(spec.center.x, 20), math.gaussian(spec.center.y + 20, 20));
          spec.center.y -= spec.moveRate*elapsedTime;

          //need bounds to keep character from moving off the map;
          //could be done with collision detection
      }

      that.moveDown = function(elapsedTime){
        game.dustParticles.createParticles(1, math.gaussian(spec.center.x, 20), math.gaussian(spec.center.y + 20, 20));
          spec.center.y += spec.moveRate*elapsedTime;
           //need bounds to keep character from moving off the map;
          //could be done with collision detection
      }

      that.update = function(elapsedTime){
          //need to write checkIfHit functions
          if(that.checkIfHit === true){
              spec.isHit = true;
          }
          checkHealth(that);
      }

      that.checkIfHit = function(){
          return false;
          //WILL NEED TO BE CHANGED. JUST WRITTEN LIKE THIS FOR CHARACTER MOVEMENT TESTING
      }

      that.render = function(){
          graphics.drawCharacter({
              x:spec.center.x,
              y:spec.center.y,
              width:spec.width,
              height:spec.height,
              image:spec.image
          })
      }

      function checkHealth(object){
        if(that.isHit !== 0){
            that.health -= that.isHit;
            that.isHit = 0;
        }

        if(that.health === 0){
            that.isDead = true;
        }
      }

      return that;
  }

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

return that;
}());
