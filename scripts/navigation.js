var navigation = {
  screens: {}

};

navigation.showScreen = function(id){
  var screen = 0, active = null;

  //remove active state
  active = document.getElementsByClassName('active');
  for (screen = 0; screen < active.length; screen++){
    active[screen].classList.remove('active');
  }

  document.getElementById(id).classList.add('active');
  if(id === 'game'){
    audio.sounds['assets/main-menu-music'].pause();
    audio.playSound('assets/song-1');
  }
  if(id === 'menu'){
    audio.sounds['assets/song-1'].pause();
    audio.playSound('assets/main-menu-music');
  }
};

navigation.initialize = function(){
  var screen = null;
  audio.initialize();
  for (screen in this.screens) {
    this.screens[screen].initialize();
  }

  this.showScreen('menu');
};

navigation.screens['game'] = function(){
  let that = {};
  that.initialize = function(){
    //audio.playSound('assets/main-menu-music');
  };
  document.getElementById('quitGame').addEventListener('click', function() {
    navigation.showScreen('menu');
    game.quit();
  });
  return that;
}();

navigation.screens['menu'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('newGame').addEventListener('click', function() {
      navigation.showScreen('game');
      game.level = 1;
      game.initialize(false); //start a new game
    });
    document.getElementById('loadGame').addEventListener('click', function() {
      navigation.showScreen('game');
      game.initialize(true); //load game
    });
    document.getElementById('toOptions').addEventListener('click', function() {
      navigation.showScreen('options');
    });
    document.getElementById('toAbout').addEventListener('click', function() {
      navigation.showScreen('about');
    });
    document.getElementById('toHigh-scores').addEventListener('click', function() {
      navigation.showScreen('high-scores');
    });
  };
  return that;
}();

navigation.screens['options'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('options-menu').addEventListener('click', function() {
      navigation.showScreen('menu');
      //let control = document.querySelector('input[name = "controls"]:checked').value;
      memory.setControls(controls);
    });

    let grabInput = null;

    let upButton = document.getElementById('upControl');
    let downButton = document.getElementById('downControl');
    let leftButton = document.getElementById('leftControl');
    let rightButton = document.getElementById('rightControl');
    let attackButton = document.getElementById('attackControl');
    //set them to be able to reconfig controls
    upButton.addEventListener('click', function() {
      grabInput = "up";
    });
    downButton.addEventListener('click', function() {
      grabInput = "down";
    });
    leftButton.addEventListener('click', function() {
      grabInput = "left";
    });
    rightButton.addEventListener('click', function() {
      grabInput = "right";
    });
    attackButton.addEventListener('click', function() {
      grabInput = "attack";
    });

    //key value mapping
    function controlsToString(code){
      if (code === 3) return "CANCEL";
      if (code === 8) return "BACK SPACE";
      if (code === 9) return "TAB";
      if (code === 12) return "CLEAR";
      if (code === 13) return "RETURN";
      if (code === 14) return "ENTER";
      if (code === 16) return "SHIFT";
      if (code === 17) return "CONTROL";
      if (code === 18) return "ALT";
      if (code === 20) return "CAPS LOCK";
      if (code === 27) return "ESCAPE";
      if (code === 32) return "SPACE";
      if (code === 38) return "UP";
      if (code === 39) return "RIGHT";
      if (code === 40) return "DOWN";
      if (code === 37) return "LEFT";
      return String.fromCharCode(code);
    }

    //initialize
    let controls = memory.getControls();
    upButton.innerHTML = controlsToString(controls.up);
    downButton.innerHTML = controlsToString(controls.down);
    leftButton.innerHTML = controlsToString(controls.left);
    rightButton.innerHTML = controlsToString(controls.right);
    attackButton.innerHTML = controlsToString(controls.attack);

    //set event handler to handle button clicks
    window.addEventListener('keydown', function(e){
      if(grabInput !== null){
        controls[grabInput] = e.keyCode;
        if(grabInput === "up") upButton.innerHTML = controlsToString(e.keyCode);
        if(grabInput === "down") downButton.innerHTML = controlsToString(e.keyCode);
        if(grabInput === "left") leftButton.innerHTML = controlsToString(e.keyCode);
        if(grabInput === "right") rightButton.innerHTML = controlsToString(e.keyCode);
        if(grabInput === "attack") attackButton.innerHTML = controlsToString(e.keyCode);
        grabInput = null;
      }
    });


  };
  return that;
}();

navigation.screens['about'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('about-menu').addEventListener('click', function() {
      navigation.showScreen('menu');
    });
  };
  return that;
}();

navigation.screens['high-scores'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('scores-menu').addEventListener('click', function() {
      navigation.showScreen('menu');
    });
  };
  return that;
}();

navigation.screens['levelUp'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('nextLevel').addEventListener('click', function() {
      game.initialize(false);
      navigation.showScreen('game');
    });
  };
  return that;
}();

navigation.screens['win'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('win-menu').addEventListener('click', function() {
      navigation.showScreen('menu');
    });
  };
  return that;
}();
