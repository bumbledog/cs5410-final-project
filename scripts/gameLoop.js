var game = (function(){
  let that = {};
  let time, canceled, maze, keyboard;
  let boxA;

  that.y = {};
  let renderGraphics;
  let character, enemies, particles;
  that.dustParticles;

  that.initialize = function(){

    renderGraphics = true;

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
      biomes: 4,
      cellHeight: 500,
      cellWidth: 500
    });

    objects.initialize(maze.width, maze.height);

    let imgChar = new Image();
    imgChar.src = "assets/linkToThePast.png";
    character = objects.Character({
        image: imgChar,
        view:{width:1000, height:1000},
        moveRate: 450/1000, //pixels per millisecond
        radius: 1000*(1/100),
        radiusSq: (1000*(1/100)*(1000*(1/100))),
        isDead: false,
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

    objects.buildQuadTree(100, enemies, maze.width*maze.height);

    keyboard = input.Keyboard();
    setupControlScheme();

    particles = [];
    //initialize dust trail
    that.dustParticles = ParticleSystem({
      image: "assets/dust.png"
    });

    gameLoop();
  };

  function setupControlScheme(){
    window.addEventListener("keydown", keyboard.keyPress, false);
    window.addEventListener("keyup", keyboard.keyRelease, false);

    let controlScheme = memory.getControls();
    if(controlScheme === "Arrows"){
      keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, character.moveLeft);
      keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, character.moveRight);
      keyboard.registerCommand(KeyEvent.DOM_VK_UP, character.moveUp);
      keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, character.moveDown);
    }
    else if(controlScheme === "ASDW"){
      keyboard.registerCommand(KeyEvent.DOM_VK_A, character.moveLeft);
      keyboard.registerCommand(KeyEvent.DOM_VK_D, character.moveRight);
      keyboard.registerCommand(KeyEvent.DOM_VK_W, character.moveUp);
      keyboard.registerCommand(KeyEvent.DOM_VK_S, character.moveDown);
    }
    else if(controlScheme === "JKLI"){
      keyboard.registerCommand(KeyEvent.DOM_VK_J, character.moveLeft);
      keyboard.registerCommand(KeyEvent.DOM_VK_L, character.moveRight);
      keyboard.registerCommand(KeyEvent.DOM_VK_I, character.moveUp);
      keyboard.registerCommand(KeyEvent.DOM_VK_K, character.moveDown);
    }

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

    objects.buildQuadTree(100, enemies, maze.width*maze.height);
    //set the offset to the body position
    //we dont use quite use offset anymore
    graphics.setOffset(character.returnCharacterBody().position.x, character.returnCharacterBody().position.y);

    //PARTICLE SYSTEM UPDATES SHOULD BE ADDED HERE
    that.dustParticles.update(elapsedTime);
    for(let i = 0; i < particles.length; i++){
      particles[i].update(elapsedTime);
      //delete unneeded particles
      if(particles[i].length === 0){
        particles.splice(i--, 0);
      }
    }
  };



  function render(elapsedTime){
    //TODO: use quad tree to only render on-screen enemies
    //TODO: only render this (and tiles) if character moves
    //Added a key listener to the 'G' and 'H' Key
    //'G' -> Turns off rendering of Graphics
    //'H' -> Turns on rendering of Graphics
    if(renderGraphics === true){

      //translates the context to where the characters center is
      graphics.drawCamera(character);

      graphics.renderMaze(maze);
    }

    that.dustParticles.render();
    for(let i = 0; i < particles.length; i++){
      particles[i].render();
    }

    // TODO: function could be changed so that only enemies
    //close to Link are updated. This would improve efficiency
    //for(i = 0; i < enemies.length; i++){
    //  enemies[i].render(elapsedTime);
    //}

    graphics.renderEnemies(elapsedTime, enemies);
    character.render(elapsedTime);
  };

  return that;
}());
