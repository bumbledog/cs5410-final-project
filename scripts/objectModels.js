var width = 16,
    height = 16;
var usePrevious = false,        //variables used to find gaussian distribution
    y2;
var character, //= {x:canvas.width/2, y:canvas.height/2, isHit:false, isDead:false};//initialize character position and states
    characterSizePercent;
var characterInventory = {};    //contains an inventory of all items that the character holds
var enemies = [];               //array of all enemies
var pots = [];                  //array of breakable pots
var movingLeft = false, movingRight = false,
    movingDown = false, movingUp = false;
var keyboard;

let imgChar = new Image();
imgChar.src = "assets/linkToThePast.png";

let imgEnemy = new Image();
imgEnemy.src = "assets/skeletonSprite.png";

function gaussian(mean, stdDev){   //performs a gaussian distribution. 
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

function randomLocation(){         
    let randLoc = {x:Math.random()*1000, y:Math.random()*1000};

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
    for(let i = 0; i < gaussian(avgPotCount, dev); i++){
        pots.push({location:randPotLocation(), isBroken:false, hasItem:false})
    }

    for(let i = 0; i < gaussian(potsWithItems, dev); i++){
        pots[i].hasItem = true;
    }

}

function initializeEnemies(){
    var avgEnemyCount = 25;
    var dev = 10;
    for(let i = 0; i < gaussian(avgEnemyCount, dev); i++){
        enemies.push(Character({
            image:imgEnemy,
            view:{width:1000, height:1000},
            moveRate: 1/100000, //pixels per millisecond
            isDead:false,
            isHit:false,
            center: randomLocation(),
            health: 2
        }));
    }
    //if we want to have a minimum # of enemies per room, this may need to be changed
}

function initializeCharacter(){
    character = Character({
        image: imgChar,
        view:{width:1000, height:1000},
        moveRate: 350/10000, //pixels per millisecond
        isDead:false,
        isHit:false,
        center: {x:1000/2, y:1000/2},
        health: 10
    });

    keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, character.moveLeft);
    keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, character.moveRight);
    keyboard.registerCommand(KeyEvent.DOM_VK_UP, character.moveUp);
    keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, character.moveDown);
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
function Character(spec){
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
        spec.center.x += spec.moveRate * elapsedTime;

       //need bounds to keep character from moving off the map
       //could be done with collision detection
    }

    that.moveLeft = function(elapsedTime){
        spec.center.x -= spec.moveRate*elapsedTime;

        //need bounds to keep character from moving off the map
        //could be done with collision detection
    }

    that.moveUp = function(elapsedTime){
        spec.center.y -= spec.moveRate*elapsedTime;

        //need bounds to keep character from moving off the map;
        //could be done with collision detection
    }

    that.moveDown = function(elapsedTime){
        spec.center.y += spec.moveRate*elapsedTime;
         //need bounds to keep character from moving off the map;
        //could be done with collision detection
    }

    that.update = function(elapsedTime){
        //need to write checkIfHit functions
        if(that.checkIfHit === true){
            spec.isHit = true;
        }

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

    return that;
}

function processInput(elapsedTime){
    keyboard.update(elapsedTime);
}


function updateGame(elapsedTime){
    character.update(elapsedTime);
    // function could be changed so that only enemies 
    //close to Link are updated. This would improve efficiency
    for(i = 0; i < enemies.length; i++){
            enemies[i].update(elapsedTime);

            if(enemies[i].isHit !== 0){
                enemies[i].health -= enemies[i].health - enemies[i].isHit;
                enemies[i].isHit = 0;
            }

            if(enemies[i].health === 0){
                enemies[i].isDead = true;
            }
    }
    
    if(character.isHit !== 0){
        character.health -= character.isHit;
        character.isHit = 0;
    }

    if(character.health === 0){
        character.isDead = true;
    }
    //PARTICLE SYSTEM UPDATES SHOULD BE ADDED HERE
}


//Used for testing. Needs to be altered and probably added to graphics.
function renderPlayers(){
    character.render();
    for(let i = 0; i < enemies.length; i++){
        //needs to be changed so only enemies in screen are rendered
        enemies[i].render();
    }
}