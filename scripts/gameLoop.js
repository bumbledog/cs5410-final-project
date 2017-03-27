var game = (function(){
  let that = {};
  let time, canceled;

  that.initialize = function(){
    canceled = false;
    time = performance.now();
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
  function render(elapsedTime){};

  return that;
});
