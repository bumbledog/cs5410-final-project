
'use strict'

var Stats = (function(){

    var that = {};

    var statCanvas = null;
    var statContext = null;

    //initialization of the stats
    that.initialize = function(){
        
        //yes, stats have their own canvas
        statCanvas = document.getElementById('stats');
        statContext = statCanvas.getContext('2d');
        
        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, statCanvas.width, statCanvas.height);
            this.restore();
        };
    };


    //creating a stat/inventory item to be displayed
    that.StatItem = function(spec){

        let that = {};

        //initial loading of the image
        function loadImage(){
            var image = new Image();
            image.src = spec.image;
            return image;
        }

        //allows us to manually set the image anywhere if needed
        that.setImage = function(image){
            spec.image = image;
        };

        //main update for all of the overlays
        that.update = function(character){
            if(spec.tag === 'healthBar'){
                spec.health = character.returnHealth();
                spec.image = "assets/healthBar" + spec.health + "-5.png"
            }
        };

        //main rendering function for all of the stats
        that.render = function(){
            statContext.drawImage(loadImage(), spec.position.x, spec.position.y, spec.width, spec.height);
        };


        return that;
    };

    return that;

}());