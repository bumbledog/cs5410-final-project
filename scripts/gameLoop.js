var game = (function(){
  let that = {};
  let time, canceled, maze, keyboard;
  let character, enemies;
  let characterBody;

  let renderGraphics = true;
  let firstRender = true;

  that.initialize = function(){

    //physics initialize
    physics.initialize();
    // characterBody = physics.createRectangleBody(800, 800, 75, 75);
    // physics.addToWorld(characterBody);
    // //physics.setStaticBody(boxA, true);
    // physics.setFrictionAir(0.075, characterBody);  //how much friction in the air when it moves
    // physics.setRestitution(2,characterBody);      //how bouncy/elastic
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
        health: 10,
        body: physics.createRectangleBody((1000/2) + 60, (1000/2) + 70, 75, 75),
        tag: 'Character'
    });

    //physics character body:
    character.addBodyToWorld();
    //end

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

    //allows us to turn on and off the rendering of the maze
    keyboard.registerCommand(KeyEvent.DOM_VK_G, turnOffGraphics);
    keyboard.registerCommand(KeyEvent.DOM_VK_H, turnOnGraphics);
  }

  function turnOffGraphics(){
    if(renderGraphics === true){
      renderGraphics = false;
    }
  }

  function turnOnGraphics(){
    if(renderGraphics === false){
      renderGraphics = true;
    }
  }

  function gameLoop(){
    let newTime = performance.now();
    let elapsedTime = newTime - time;

    handleInput(elapsedTime);

    //physic input handling
    physics.handleInput(character.returnCharacterBody(), character);
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
    
    //set the offset to the body position
    //we dont use quite use offset anymore
    graphics.setOffset(character.returnCharacterBody().position.x, character.returnCharacterBody().position.y);
    //PARTICLE SYSTEM UPDATES SHOULD BE ADDED HERE
  };



  function render(elapsedTime){
    //graphics.renderMaze(maze);
    //TODO: use quad tree to only render on-screen enemies
    //TODO: only render this (and tiles) if character moves

    //Added a key listener to the 'G' and 'H' Key
    //'G' -> Turns off rendering of Graphics
    //'H' -> Turns on rendering of Graphics
    if(renderGraphics === true){

      //translates the context to where the characters center is
      graphics.drawCamera(character);

      graphics.renderMaze(maze, firstRender, character);

      //If the first rendering of the maze happens, then change this variable
      //This helps control how the physics bodies are added
      if(firstRender === true) firstRender = false;
    }
    //graphics.renderMaze(maze);
    // TODO: function could be changed so that only enemies
    //close to Link are updated. This would improve efficiency
    for(i = 0; i < enemies.length; i++){
      enemies[i].render(elapsedTime);
    }
    character.render(elapsedTime);
  };

  return that;
}());
