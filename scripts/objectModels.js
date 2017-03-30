var width = 16;
var height = 16;
var usePrevious = false,        //variables used to find gaussian distribution
    y2;

var character = {x:canvas.width/2, y:canvas.height/2, isHit:false, isDead:false};//initialize character position and states

var characterInventory = {};    //contains an inventory of all items that the character holds

var enemies = [];               //array of all enemies

var pots = [];                  //array of breakable pots

function gaussian(mean, stdDev){   //performs a gaussian distribution. 
    if(usePrevious){               //I use this function to initialize how many enemies are generated.
        usePrevious = false;
        return mean + y2Dev;
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

function randomLocation(){         //this function will need to have
                                   //restraints so that items and enemies 
                                   //do not appear in walls or water
    let randLoc = {x:Math.random()*width, y:Math.random()*height};

    return randLoc;
}

function randPotLocation(){
    let randLoc = {x:Math.random()*width, y:Math.random()*height}; 
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
        enemies.push({location:randomLocation(), isHit:false, isDead:false})
    }
    //if we want to have a minimum # of enemies per room, this may need to be changed.
}

