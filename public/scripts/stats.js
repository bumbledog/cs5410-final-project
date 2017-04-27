
'use strict'

var Stats = (function(){

    var that = {};

    var statCanvas = null;
    var statContext = null;
    let changed = true;
    let allKeys = [];
    let healthBar;
    let healthImg = [];
    let keyImg, noKeyImg;

    //initialization of the stats
    that.initialize = function(maxKeys){
      allKeys = [];
      healthBar = {};

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
        noKeyImg.onload = function(){changed = true;};

        //creates and initializes a healthbar for the character
        healthBar = StatItem({
            tag: 'health',
            health: 5,
            image: healthImg[5],
            position: {x: 10, y: 10},
            width: 400,
            height: 100
        });

        for(let amount = 0; amount < maxKeys; amount++){
          allKeys.push(StatItem({
            tag: 'key',
            image: noKeyImg,
            position: {x: 980 - 75 * maxKeys + 75 * amount, y:890},
            width: 100,
            height: 100
          }));
        }
    };


    //creating a stat/inventory item to be displayed
    function StatItem(spec){

        let that = {};

        that.health = spec.health;

        //main rendering function for all of the stats
        that.render = function(){
            statContext.drawImage(spec.image, spec.position.x, spec.position.y, spec.width, spec.height);
            if(game.upgrade["health"] && spec.tag === 'health') {
              statContext.strokeStyle = "rgb(122,12,6)";
              statContext.lineWidth = 3;
              statContext.rect(spec.position.x + spec.width - 8, spec.position.y + 11, 68 * 5 + 10, spec.height - 20);
            }
            if(that.health > 5){
              for (let i = 0; i < that.health - 5; i++){
                statContext.fillStyle = "rgb(" + (150 + i * 20) + ", 10, 24)";
                statContext.fillRect(spec.position.x + spec.width + 68 * i, spec.position.y + 17, 63, spec.height - 33)
              }
            }
            statContext.stroke();
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
      healthBar.health = Math.max(0, newHealth);
      if(newHealth <= 5) healthBar.setImage(healthImg[healthBar.health]);
      changed = true;
    };

    that.render = function(){
      if(changed){
        statContext.clear();
        healthBar.render();
        for(let i = 0; i < allKeys.length; i++){
          allKeys[i].render();
        }
        changed = false;
      }
    };

    return that;

}());
