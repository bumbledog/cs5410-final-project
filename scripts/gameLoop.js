var game = (function(){
  let that = {};
  let time, canceled, maze, keyboard;
  let character, enemies;
  let boxA

  that.initialize = function(){

    //physics initialize
    physics.initialize();
    boxA = physics.createRectangleBody(500, 500, 80, 80);
    physics.setFrictionAir(0.075, boxA);
    //end

    canceled = false;
    time = performance.now();

    maze = that.Maze({
      height: 16,
      width: 16,
      biomes: 4
    });

    objects.initialize(maze.width, maze.height);

    let imgChar = new Image();
    imgChar.src = "assets/linkToThePast.png";
    character = objects.Character({
        image: imgChar,
        view:{width:1000, height:1000},
        moveRate: 450/1000, //pixels per millisecond
        isDead:false,
        isHit:false,
        center: {x:1000/2, y:1000/2},
        health: 10
    });

    enemies = objects.initializeEnemies();

    keyboard = input.Keyboard();
    setupControlScheme();

    gameLoop();
  };

  function setupControlScheme(){
    window.addEventListener("keydown", keyboard.keyPress, false);
    window.addEventListener("keyup", keyboard.keyRelease, false);

    keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, character.moveLeft);
    keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, character.moveRight);
    keyboard.registerCommand(KeyEvent.DOM_VK_UP, character.moveUp);
    keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, character.moveDown);
  }

  function gameLoop(){
    let newTime = performance.now();
    let elapsedTime = newTime - time;

    handleInput(elapsedTime);

    //physic input handling
    physics.handleInput(boxA);
    //end

    update(elapsedTime);
    render(elapsedTime);

    time = newTime;

    if(!canceled) requestAnimationFrame(gameLoop);
  }

  function handleInput(elapsedTime){
    keyboard.update(elapsedTime);
  };

  function update(elapsedTime){
    character.update(elapsedTime);
    // function could be changed so that only enemies
    //close to Link are updated. This would improve efficiency
    for(i = 0; i < enemies.length; i++){
            enemies[i].update(elapsedTime);
    }
    graphics.setOffset(character.center.x, character.center.y);
    //PARTICLE SYSTEM UPDATES SHOULD BE ADDED HERE
  };

  function render(elapsedTime){
    //graphics.renderMaze(maze);
    //TODO: use quad tree to only render on-screen enemies
    //TODO: only render this (and tiles) if character moves
    graphics.renderMaze(maze);
    // TODO: function could be changed so that only enemies
    //close to Link are updated. This would improve efficiency
    for(i = 0; i < enemies.length; i++){
      enemies[i].render(elapsedTime);
    }
    character.render(elapsedTime);
  };

  return that;
}());
