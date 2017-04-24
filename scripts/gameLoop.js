var game = (function(){
  let that = {};
  let time, canceled, maze, keyboard;
  let boxA;

  that.y = {};
  let renderGraphics;
  let character, enemies, particles;
  that.dustParticles;

    //categories:
    var defaultCategory = 0x0001;
    var characterCategory = 0x0002;
    var enemyCategory = 0x0003;

    var healthBar;
    var keys = [];

  that.initialize = function(load){
    renderGraphics = true;
    canceled = false;
    time = performance.now();

    //physics initialize
    physics.initialize();
    // characterBody = physics.createRectangleBody(800, 800, 75, 75);
    // physics.addToWorld(characterBody);
    // //physics.setStaticBody(boxA, true);
    // physics.setFrictionAir(0.075, characterBody);  //how much friction in the air when it moves
    // physics.setRestitution(2,characterBody);      //how bouncy/elastic
    //end

    audio.initialize();

    let imgChar = new Image();
    imgChar.src = "assets/linkToThePast.png";

    let previousGame = memory.loadGame();

    if (!load || previousGame === undefined || previousGame === {}){

      maze = that.Maze({
        height: 5,
        width: 8,
        biomes: 4,
        cellHeight: 500,
        cellWidth: 500
      });

      objects.initialize(maze.width, maze.height);

      character = objects.Character({
          image: imgChar,
          view:{width:1000, height:1000},
          moveRate: 450/1000, //pixels per millisecond
          radius: 1000*(1/100),
          radiusSq: (1000*(1/100)*(1000*(1/100))),
          isDead: false,
          isHit:false,
          body: physics.createCircleBody((1000/2) + 60, (1000/2) + 70, 40),
          sensor: physics.createSensorBody((1000/2) + 60, (1000/2) + 70, 75, 75),
          direction: 'down',
          attacking: false,
          coolDown: 0,
          tag: 'Character',
          center: {x:1000/2, y:1000/2},
          health: 5,
          keys: 0,
          keyInventory: keys //relates to the key images
      });

      enemies = objects.initializeEnemies(50, maze.width, maze.height, maze.cellWidth);
    }
    //load game
    else{
      maze = previousGame.maze;
      maze.width = maze.length;
      maze.height = maze[0].length;
      maze.cellHeight = 500;
      maze.cellWidth = 500;
      physics.addMazeBodies(maze);

      objects.initialize(maze.width, maze.height);

      character = objects.Character({
          image: imgChar,
          view:{width:1000, height:1000},
          moveRate: 450/1000, //pixels per millisecond
          radius: 1000*(1/100),
          radiusSq: (1000*(1/100)*(1000*(1/100))),
          isDead: false,
          isHit:false,
          body: physics.createCircleBody(previousGame.character.center.x, previousGame.character.center.y, 40),
          sensor: physics.createSensorBody(previousGame.character.center.x, previousGame.character.center.y, 75, 75),
          direction: 'down',
          attacking: false,
          coolDown: 0,
          tag: 'Character',
          center: previousGame.character.center,
          health: previousGame.character.health,
          keys: previousGame.character.keys,
          keyInventory: previousGame.character.keyInventory //relates to the key images
      });

      enemies = objects.loadEnemies(previousGame.enemies);
    }

    graphics.initialize(maze);

    //key slot for the character
    for(let amount = 0; amount < 3; amount++){
      keys.push(Stats.StatItem({
        tag: 'key',
        image: 'assets/missing-key.png',
        position: {x: 400 + 75 * amount, y:10},
        width: 100,
        height: 100
      }));
    }

    //physics character body:
    physics.addCollisionFilter(character.returnSensor(), enemyCategory);
    character.addBodyToWorld();
    //end

    keyboard = input.Keyboard();
    setupControlScheme();

    particles = [];
    //initialize dust trail
    that.dustParticles = ParticleSystem({
      image: "assets/dust.png"
    });

    //gives more information on what collides with the player
    physics.eventSensorStart(character, enemies);
    physics.eventSensorActive(character, enemies);
    physics.eventSensorEnd(character, enemies);


    //stats initialize
    Stats.initialize();

    //creates and initializes a healthbar for the character
    healthBar = Stats.StatItem({
        tag: 'healthBar',
        health: character.returnHealth(),
        image: 'assets/healthBar5-5.png',
        position: {x: 10, y: 10},
        width: 400,
        height: 100
    });

    objects.buildQuadTree(8, enemies, maze.length*maze.cellWidth);

    //allow enemies to damage character
    physics.enemyDamageEvent(character, enemies);

    gameLoop();
  };

  function setupControlScheme(){
    window.addEventListener("keydown", keyboard.keyPress, false);
    window.addEventListener("keyup", keyboard.keyRelease, false);

    let controlScheme = memory.getControls();
    keyboard.registerCommand(controlScheme.left, character.moveLeft);
    keyboard.registerCommand(controlScheme.right, character.moveRight);
    keyboard.registerCommand(controlScheme.up, character.moveUp);
    keyboard.registerCommand(controlScheme.down, character.moveDown);
    //key for attacking
    keyboard.registerCommand(controlScheme.attack, coolDownCheck);

    //allows us to turn on and off the rendering of the maze
    //keyboard.registerCommand(KeyEvent.DOM_VK_G, turnOffGraphics);
    //keyboard.registerCommand(KeyEvent.DOM_VK_H, turnOnGraphics);
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

  //checking cooldown of attack
  function coolDownCheck(){
    if(character.returnCoolDown() < time){
      character.attack(true);
      character.setCoolDown(time + 500);
    }
    else{
      character.attack(false);
    }
  }

  function gameLoop(){
    let newTime = performance.now();
    let elapsedTime = newTime - time;
    //console.log(character.returnAttackState());
    //console.log(time);
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

    //console.log(character.returnIsHit());
    console.log(character.returnHealth());

    character.update(elapsedTime);

    graphics.setOffset(character.center.x, character.center.y);

    // function could be changed so that only enemies
    //close to Link are updated. This would improve efficiency
    for(i = 0; i < enemies.length; i++){
      enemies[i].update(elapsedTime, character.center);
      if(enemies[i].isDead === true){
        physics.removeFromWorld(enemies[i].body);
        enemies.splice(i--, 1);
      }
    }

    objects.buildQuadTree(8, enemies, maze.width*maze.cellWidth);
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

    //console.log(character.returnDirection());
     healthBar.update(character);
  };

  function render(elapsedTime){

    //only render background when character moves
    //TODO: move this to update only when the OFFSET changes!!!
    graphics.renderTiles(maze, character);
    //TODO: use quad tree to only render on-screen enemies
    //TODO: only render this (and tiles) if character moves
    //Added a key listener to the 'G' and 'H' Key
    //'G' -> Turns off rendering of Graphics
    //'H' -> Turns on rendering of Graphics
    if(renderGraphics === true){

      //translates the context to where the characters center is
      graphics.drawCamera(character);

      graphics.renderMaze(maze, character);
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

    graphics.renderEnemies(elapsedTime, enemies,character);
    character.render(elapsedTime);
    Stats.returnContext().clear();
    healthBar.render();

    for(let key = 0; key < keys.length; key++){
      keys[key].render();
    }

  };

  that.saveGame = function(){
    let saveMaze = [];
    //make smaller, saveable maze
    for(let i = 0; i < maze.length; i++){
      saveMaze[i] = [];
      for(let j = 0; j < maze[i].length; j++){
        let n = (maze[i][j].edges.n === false) ? false : null;
        let s = (maze[i][j].edges.s === false) ? false : null;
        let w = (maze[i][j].edges.w === false) ? false : null;
        let e = (maze[i][j].edges.e === false) ? false : null;
        saveMaze[i][j] = {
          x: i, y: j,
          biome: maze[i][j].biome,
          edges: {
            n: n,
            s: s,
            e: e,
            w: w
          }
        }
      }
    }

    let saveEnemies = [];
    for(let i = 0; i < enemies.length; i++){
      let current = enemies[i];
      let newEnemy = {};
      newEnemy.chooseSprite = current.enemyType;
      newEnemy.health = current.returnHealth();
      newEnemy.center = current.center;
      saveEnemies.push(newEnemy);
    }

    let saveCharacter = {
      center: character.center,
      health: character.returnHealth(),
      keys: character.returnKeyTotal()
    }
    //all needed perpetuated data
    let spec =
    {
      maze: saveMaze,
      character: saveCharacter,
      enemies: saveEnemies
    }
    memory.saveGame(spec);
  }

  return that;
}());
