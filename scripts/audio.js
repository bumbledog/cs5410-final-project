var audio = (function(){
 var that = {};

 that.initialize = function initialize() {
     function loadSound(source) {
        let sound = new Audio();
        sound.addEventListener('canplay', function(){
//            console.log(`${source} is ready to play`);
        });
        sound.addEventListener('play', function(){
//            console.log(`${source} started playing`);
        });
        sound.addEventListener('canplaythrough', function(){
//            console.log(`${source} can play through`);
        });
        sound.addEventListener('progress', function(){
//            console.log(`${source} progress in loading`);
        });
        sound.addEventListener('timeupdate', function(){
//            console.log(`${source} time update: ${this.currentTime}`);
        });
        sound.src = source;
        return sound;
 };

function loadAudio(){
    that.sounds = {};
    that.sounds['assets/sword-swipe'] = loadSound('assets/sword-swipe.wav');
    that.sounds['assets/grunt'] = loadSound('assets/grunt.wav');
    that.sounds['assets/main-menu-music'] = loadSound('assets/main-menu-music.mp3');
    that.sounds['assets/song-1'] = loadSound('assets/song-1.mp3');

    that.sounds['assets/main-menu-music'].volume = 0.0;
    that.sounds['assets/song-1'].volume = 0.0;
};

loadAudio();
};

that.playSound = function(soundToPlay){
    that.sounds[soundToPlay].play();
};

return that;
}());
