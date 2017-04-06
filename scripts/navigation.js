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
};

navigation.initialize = function(){
  var screen = null;

  for (screen in this.screens) {
    this.screens[screen].initialize();
  }

  this.showScreen('menu');
};

navigation.screens['game'] = function(){
  let that = {};
  that.initialize = function(){
    graphics.initialize();
  };
  return that;
}();

navigation.screens['menu'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('newGame').addEventListener('click', function() {
      navigation.showScreen('game');
      game.initialize();
    });
    document.getElementById('toOptions').addEventListener('click', function() {
      navigation.showScreen('options');
    });
  };

  return that;
}();

navigation.screens['options'] = function(){
  let that = {};
  that.initialize = function(){
    document.getElementById('options-menu').addEventListener('click', function() {
      navigation.showScreen('menu');
    });
  };

  return that;
}();
