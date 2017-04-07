var game = (function(){
  let that = {};
  let time, canceled, maze;
  var boxA;

  that.initialize = function(){

    //physics initialize
    physics.initialize();
    boxA = physics.createRectangleBody(500, 500, 80, 80);
    physics.setFrictionAir(0.075, boxA);
    //end

    canceled = false;
    time = performance.now();
    characterSizePercent = {x:3,y:3};
    keyboard = input.Keyboard();
    initializeCharacter();
    initializeEnemies();
    window.addEventListener("keydown", keyboard.keyPress, false);
    window.addEventListener("keyup", keyboard.keyRelease, false);

    maze = that.Maze({
      height: 3,
      width: 3,
      biomes: 4
    });
    gameLoop();
  };

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
    processInput(elapsedTime);
  };

  function update(elapsedTime){
    updateGame(elapsedTime);
  };
  function render(elapsedTime){
    //graphics.renderMaze(maze);
    renderPlayers();
  };

  return that;
}());
