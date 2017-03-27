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
}

navigation.initialize = function(){
  var screen = null;

  for (screen in this.screens) {
    this.screens[screen].initialize();
  }

  //change this to menu when nav is more set up
  this.showScreen('game');
}

navigation.screens['game'] = function(){
  let that = {};
  that.initialize = function(){};
  return that;
}();
