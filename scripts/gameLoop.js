var game = (function(){
  let that = {};
  let time, canceled, maze;

  that.initialize = function(){
    canceled = false;
    time = performance.now();
    characterSizePercent = {x:2,y:3};
    initializeCharacter();
    initializeEnemies();
    maze = that.Maze({
      height: 16,
      width: 16,
      biomes: 4
    });
    gameLoop();
  };

  function gameLoop(){
    let newTime = performance.now();
    let elapsedTime = newTime - time;
    time = newTime;

    handleInput(elapsedTime);
    update(elapsedTime);
    render(elapsedTime);

    if(!canceled) requestAnimationFrame(gameLoop);
  }

  function handleInput(elapsedTime){};
  function update(elapsedTime){
    updateGame(elapsedTime);
  };
  function render(elapsedTime){
    graphics.renderMaze(maze);
    renderPlayers();
  };

  return that;
}());
