var game = (function(){
  let that = {};
  let time, canceled, maze;

  that.initialize = function(){
    canceled = false;
    time = performance.now();
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
  function update(elapsedTime){};
  function render(elapsedTime){
    graphics.renderMaze(maze);
  };

  return that;
}());
