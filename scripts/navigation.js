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
    graphics.initialize();
    //audio.playSound('assets/main-menu-music');
  };
  return that;
}();

navigation.screens['menu'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('newGame').addEventListener('click', function() {
      navigation.showScreen('game');
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
      let control = document.querySelector('input[name = "controls"]:checked').value;
      memory.setControls(control);
    });

    //id like to be able to find by value but whatever
    let select = memory.getControls();
     document.querySelector('input[value = ' + select + ']').checked = true;
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
