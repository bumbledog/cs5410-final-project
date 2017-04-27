
'use strict'

var Stats = (function(){

    var that = {};

    var statCanvas = null;
    var statContext = null;
    let changed = true;
    let allKeys = [];
    let healthBar;
    let coinDisplay;
    let healthImg = [];
    let keyImg, noKeyImg;
    let coinImg;

    //initialization of the stats
    that.initialize = function(maxKeys){
      allKeys = [];
      healthBar = {};
      changed = true;

        //yes, stats have their own canvas
        statCanvas = document.getElementById('stats');
        statContext = statCanvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, statCanvas.width, statCanvas.height);
            this.restore();
        };


        //load imaged
        for(let i = 0; i <= 5; i++){
          let nextImg = new Image();
          nextImg.src = 'assets/healthBar' + i + '-5.png';
          healthImg.push(nextImg);
        }

        keyImg = new Image();
        keyImg.src = 'assets/key.png'

        noKeyImg = new Image();
        noKeyImg.src = 'assets/missing-key.png';

        coinImg = new Image();
        coinImg.src = 'assets/coinDisplay.png';

        //creates and initializes a healthbar for the character
        healthBar = StatItem({
            image: healthImg[5],
            position: {x: 10, y: 10},
            width: 400,
            height: 100
        });

        coinDisplay = StatItem({
            image: coinImg,
            position: {x: 10 , y: 900},
            width: 64,
            height: 64
        });

        for(let amount = 0; amount < maxKeys; amount++){
          allKeys.push(StatItem({
            tag: 'key',
            image: noKeyImg,
            position: {x: 400 + 75 * amount, y:10},
            width: 100,
            height: 100
          }));
        }
    };


    //creating a stat/inventory item to be displayed
    function StatItem(spec){

        let that = {};

        //main rendering function for all of the stats
        that.render = function(){
            //statContext.clear();
            statContext.drawImage(spec.image, spec.position.x, spec.position.y, spec.width, spec.height);
        };

        that.setImage = function(newImage){
          spec.image = newImage
        }

        return that;
    };

    that.updateKeys = function(numOfKeys){
      for(let i = 0; i < numOfKeys; i++){
        allKeys[i].setImage(keyImg);
      }
      changed = true;
    };

    that.updateHealth = function(newHealth){
      newHealth = Math.max(0, newHealth);
      healthBar.setImage(healthImg[newHealth])
      changed = true;
    };

    that.render = function(){
      //if(changed){
        statContext.clear();
        healthBar.render();
        for(let i = 0; i < allKeys.length; i++){
          allKeys[i].render();
        }
        game.scoreDraw.draw();
        coinDisplay.render();
        changed = false;
      //}
    };

    that.clear = function(){

    }

    return that;

}());
