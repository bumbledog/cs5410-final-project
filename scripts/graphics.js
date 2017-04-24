var graphics = (function(){
  let that = {};
  let context = null;
  let canvas = null;
  let statCanvas = null;
  let statContext = null;
  let width = 0;
  let height = 0;
  let offset = {x:0, y:0};
  let backgroundImage;
  let visible = [];
  let camera;
  let tiles;

  that.initialize = function(maze){
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    tileCanvas = document.getElementById('tiles');
    tileContext = tileCanvas.getContext('2d');

    //stats overlay:
    statCanvas = document.getElementById('stats');
    statContext = statCanvas.getContext('2d');
    //end

    tiles = {
      size: 500,
      src0: "assets/map/marsh background [www.imagesplitter.net]-",
      src1: "assets/map/forestBackground [www.imagesplitter.net]-",
      //src2:
      //src3:
      columns: 16,
      loaded: 0
    };

    //load all files before rendering
    for(let i = 0; i < maze.width; i++){
      tiles[i] = [];
      for(let j = 0; j < maze.height; j++){
        tiles[i][j] = new Image();
        tiles[i][j].src = tiles["src" + (maze[i][j].biome % 2)] + (j % 4) + "-" + (i % 4) + ".png";
        tiles[i][j].onload = function(){
          tiles.loaded++;
        };
      }
    }

    CanvasRenderingContext2D.prototype.clear = function() {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
      this.clearRect(0, 0, width, height);
      this.restore();
    };
  };

  that.setOffset = function(x,y){
    offset.x = width/2 - x;
    offset.y = width/2 - y;
  };

  that.returnCanvas = function(){
    return canvas;
  };

  //rendering the overlay stats page

  //rendering text
  that.Text = function(spec){
    let textThat = {};

    //measures the height of the text
    function measureTextHeight(spec) {
			statContext.save();

			statContext.font = spec.font;
			statContext.fillStyle = spec.fill;
			statContext.strokeStyle = spec.stroke;

			var height = statContext.measureText('m').width;

			statContext.restore();

			return height;
		}

    //measures the width of the text
    function measureTextWidth(spec) {
			statContext.save();

			statContext.font = spec.font;
			statContext.fillStyle = spec.fill;
			statContext.strokeStyle = spec.stroke;

			var width = statContext.measureText(spec.text).width;

			statContext.restore();

			return width;
		}

    //main draw function
    textThat.draw = function() {
			statContext.save();

			statContext.font = spec.font;
			statContext.fillStyle = spec.fill;
			statContext.strokeStyle = spec.stroke;
			statContext.textBaseline = 'top';

			statContext.translate(spec.position.x + textThat.width / 2, spec.position.y + textThat.height / 2);
			statContext.translate(-(spec.position.x + textThat.width / 2), -(spec.position.y + textThat.height / 2));

			statContext.fillText(spec.text, spec.positionition.x, spec.position.y);
			statContext.strokeText(spec.text, spec.position.x, spec.position.y);

			statContext.restore();
		};

		//
		// Compute and expose some public properties for this text.
		textThat.height = measureTextHeight(spec);
		textThat.width = measureTextWidth(spec);
		textThat.position = spec.position;


    return textThat;
  };


  that.initializeStats = function(spec){

  };


  //end

  //allows us to move the canvas to where the character is
  that.drawCamera = function(character){
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0, canvas.width, canvas.height);
    context.translate(offset.x, offset.y);
  };

  that.renderTiles = function(maze, character){

    if(tiles.loaded === maze.width * maze.height){

        tileContext.clear();

        /*TODO: object to define
        TILESIZE, leading string, tileColumns*/
        let viewport = that.defineCamera(character.center.x, character.center.y);
        tileRenderXStart = Math.max(Math.floor(viewport.pt1.x/tiles.size), 0);

        tileRenderXEnd = Math.min(Math.floor(viewport.pt3.x/tiles.size), maze.width - 1);
        tileRenderYStart =  Math.max(Math.floor(viewport.pt1.y/tiles.size), 0);
        tileRenderYEnd = Math.min(Math.floor(viewport.pt2.y/tiles.size), maze.height - 1);

        for(let xPos = tileRenderXStart; xPos <= tileRenderXEnd; xPos++){
          for(let yPos = tileRenderYStart; yPos <= tileRenderYEnd; yPos++){

            let tileXDepth = (xPos - tileRenderXStart) * tiles.size;
            let xOffset = (tileRenderXStart * tiles.size) - camera.pt1.x;
            xDraw = Math.max(tileXDepth + xOffset, 0);
            let cropX = Math.max(camera.pt1.x - xPos * tiles.size, 0);

            let tileYDepth = (yPos - tileRenderYStart) * tiles.size;
            let yOffset = (tileRenderYStart * tiles.size) - camera.pt1.y;
            yDraw = Math.max(tileYDepth + yOffset, 0);
            let cropY = Math.max(camera.pt1.y - yPos * tiles.size, 0);

            let xWidth = Math.min(tiles.size, viewport.pt3.x - xPos*tiles.size);
            let yWidth = Math.min(tiles.size, viewport.pt2.y - yPos*tiles.size);

            tileContext.drawImage(tiles[xPos][yPos],
                cropX, cropY, xWidth, yWidth,
                xDraw, yDraw, xWidth, yWidth);
          }
        }

        tileContext.restore();
    }
  };

  //just for testing
  that.renderMaze = function(maze, character) {
    context.clear();
    context.beginPath();

  	context.lineWidth = 20;

    //draw only cells in the viewport
    //this will still draw out of bounds but to a reasonable extent
    let viewport = that.defineCamera(character.center.x, character.center.y);
    cellXStart = Math.max(Math.floor(viewport.pt1.x/tiles.size), 0);
    cellXEnd = Math.min(Math.floor(viewport.pt3.x/tiles.size), maze.width - 1);
    cellYStart =  Math.max(Math.floor(viewport.pt1.y/tiles.size), 0);
    cellYEnd = Math.min(Math.floor(viewport.pt2.y/tiles.size), maze.height - 1);

    //draw north and west of each cell
  	for (let row = cellXStart; row <= cellXEnd; row++) {
  		for (let col = cellYStart; col <= cellYEnd; col++) {
        drawCell(maze[row][col], maze.cellWidth, maze.cellHeight);
  		}
  	}

    //draw the south and east edges
  	context.moveTo(0, maze.height * maze.cellHeight);
  	context.lineTo(maze.width * maze.cellWidth, maze.height * maze.cellHeight);

    context.moveTo(maze.width * maze.cellWidth, 0);
  	context.lineTo(maze.width * maze.cellWidth, maze.height * maze.cellHeight);

    context.stroke();
    context.restore();

  };

  //just for testing
  function drawCell(cell, cellW, cellH) {
    var box = physics.createRectangleBody(0, 0, 0, 0);
    switch (cell.biome) {
      case 0:
        context.fillStyle = 'rgb(200,200,0)';
        break;
      case 1:
        context.fillStyle = 'rgb(200,0,200)';
        break;
      case 2:
        context.fillStyle = 'rgb(0,200,200)';
        break;
      case 3:
        context.fillStyle = 'rgb(200,200,200)';
        break;
      default:
        context.fillStyle = 'rgb(0,0,0)';
    }

    let cellLeft = cell.x * cellW;
    let cellTop = cell.y * cellH;

    //context.fillRect(cellLeft, cellTop, cellW, cellH);

    //added physics bodies and updated the position of their bodies
    //NORTH
    if(cell.edges.n.hasOwnProperty('position')){
      context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft + cellW, cellTop);
    }

    //WEST
    if(cell.edges.w.hasOwnProperty('position')){
      context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft, cellTop + cellH);
    }
  }

  that.defineCamera = function(x,y){
  var ptA = {x: x - canvas.width/2, y:  y - canvas.height/2},
      ptB = {x: x - canvas.width/2 , y:  y + canvas.height/2},
      ptC = {x: x + canvas.width/2, y:  y - canvas.height/2},
      ptD = {x: x + canvas.width/2, y:  y + canvas.height/2}

      boundingCircle = math.circleFromSquare(ptA, ptB, ptC);

    camera = {pt1:ptA, pt2:ptB, pt3:ptC, pt4:ptD, boundingCircle:boundingCircle, size:(ptC.x - ptA.x), center:{x:x, y:y}};

    return camera;

  }

  that.renderEnemies = function(elapsedTime, enemies, character){
    let count1 = 0;
        count2 = 0;

  let square = {
        center:{x:character.center.x , y:character.center.y},
        size: that.defineCamera(character.center.x, character.center.y).size - 300
  }

   visible = objects.quadTree.visibleObjects(that.defineCamera(character.center.x, character.center.y));
   for(let enemy = 0; enemy < visible.length; enemy++){
     visible[enemy].render(elapsedTime);
     if(math.objectInSquare(visible[enemy], square)){
        if(visible[enemy].enemyType === 1){
          count1++;
        }
        else if(visible[enemy].enemyType === 0){
          count2++;
        }
     }
   }

   if(count1 === 0){
     audio.sounds['assets/slime-sound'].pause()
   }
   if(count2 === 0){
     audio.sounds['assets/bat-sound'].pause()
   }
  }

  //draw the character
  that.drawCharacter = function(spec){

    //draw the character and the body in the same aread
    context.drawImage(spec.image,
    (spec.x - 50), (spec.y - 50), width/(spec.width), height/spec.height)
  };

  that.drawParticle = function(image, x, y, size){
    context.drawImage(image,x - 25, y - 20, size, size);
  };

  that.drawSprite = function(sprite, x, y){
    context.drawImage(
			sprite.spriteSheet,
			sprite.pixelWidth * sprite.sprite, 0,	// Which sprite to pick out
			sprite.pixelWidth, sprite.pixelHeight,	// The size of the sprite in the sprite sheet
			x - sprite.width / 2,		// Where to draw the sprite
			y - sprite.height / 2,
			sprite.width, sprite.height);
	};

  return that;
}());
