var memory = (function(){
  let that = {};

  let highScores;
  let previousScores = localStorage.getItem('highScores');
  if(previousScores !== null){
    highScores = JSON.parse(previousScores);
  }

  let gameState = {};
  let previousGame = localStorage.getItem('gameState');
  if(previousGame !== null){
    gameState = JSON.parse(previousGame);
  }

  let controls = "Arrows";
  let previousControls = localStorage.getItem('controls');
  if(previousControls !== null){
    controls = JSON.parse(previousControls);
  }

  that.addHighScore = function(value){
    for(let i = 0, added = false; i < numOfScores && !added; i++){
      if(highScores[i] === undefined){
        highScores[i] = {score: value};
        added = true;
      }
      else if (value > highScores[i].score){
        let temp = highScores[i].score;
        highScores[i] = {score: value};
        current = temp;
      }
    }
    localStorage['highScores'] = JSON.stringify(highScores);
  };

  that.resetHighScores = function(){
    highScores = {};
    localStorage['highScores'] = JSON.stringify(highScores);
  };

  that.getHighScores = function(){
    return highScores;
  };

  that.saveGame = function(spec){
    localStorage['gameState'] = JSON.stringify(spec);
  };

  that.resetGame = function(){
    gameState = {};
    localStorage['gameState'] = JSON.stringify(highScores);
  };

  that.loadGame = function(){
    return gameState;
  };

  that.getControls = function(){
    return controls;
  };

  that.setControls = function(value){
    controls = value;
    localStorage['controls'] = JSON.stringify(value);
  };

  return that;
}());
