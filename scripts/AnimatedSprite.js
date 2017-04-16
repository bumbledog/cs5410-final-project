var AnimatedSprite = function(spec){
  that = {
    get spriteSheet() { return spec.spriteSheet; },
    get pixelWidth() { return spec.pixelWidth; },
    get pixelHeight() { return spec.spriteSheet.height; },
    //get width() { return spec.spriteSize.width; },
    //get height() { return spec.spriteSize.height; },
    //get center() { return spec.spriteCenter; },
    get sprite() { return spec.sprite; }
  }

  //placeholder
  that.render = function(x, y){graphics.drawSprite(spec, x, y);};

  spec.sprite = Math.floor(Math.random() * (spec.spriteCount - 1));
  spec.elapsedTime = 0;
  spec.width = 100;
  spec.height = 100;

  spec.spriteSheet = new Image();

  //draw sprites
  spec.spriteSheet.onload = function(){
    that.render = function(x, y){
      graphics.drawSprite(spec, x, y);
    };

    spec.pixelWidth = 32;
    spec.pixelHeight = 32;
  }
  spec.spriteSheet.src = spec.image;

  that.update = function(elapsedTime){
    spec.elapsedTime += elapsedTime;

    if(spec.elapsedTime >= spec.spriteTime[spec.sprite]){
      spec.elapsedTime -= spec.spriteTime[spec.sprite];
      spec.sprite += 1;
      spec.sprite = spec.sprite % spec.spriteCount;
    }
  };

  return that;
}
