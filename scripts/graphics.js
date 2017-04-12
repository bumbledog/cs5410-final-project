var graphics = (function(){
  let that = {};
  let context = null;
  let canvas = null;
  let width = 0;
  let height = 0;
  let offset = {x:0, y:0};

  that.initialize = function(){
    canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

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

  //allows us to move the canvas to where the character is
  that.drawCamera = function(character){
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0, canvas.width, canvas.height);
    context.translate(-character.center.x + canvas.width/2, -character.center.y + canvas.height/2);
  };

  //just for testing
  that.renderMaze = function(maze, firstRender) {
    context.clear();
    context.beginPath();

  	context.lineWidth = 6;

  	for (let row = 0; row < maze.length; row++) {
  		for (let col = 0; col < maze[row].length; col++) {
  			drawCell(maze[row][col], width/2, width/2, firstRender);
  		}
  	}
    context.stroke();
    context.restore();

  };

  that.addPhysicsWalls = function(maze){
    
  };

  //just for testing
  function drawCell(cell, cellW, cellH, firstRender) {
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

    //we dont need offset anymore since we translate the context
    // let cellLeft = cell.x * cellW + offset.x;
    // let cellTop = cell.y * cellH + offset.y;
    let cellLeft = cell.x * cellW;
    let cellTop = cell.y * cellH;

    context.fillRect(cellLeft, cellTop, cellW, cellH);

    //added physics bodies and updated the position of their bodies
    //NORTH
  	if (cell.edges.n === null) {
  		context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft + cellW, cellTop);

      //if it is the first rendering of the maze. Add the physics bodies.
      if(firstRender === true){
        cell.physicsWalls.wallN = physics.createRectangleBody((cellLeft + (cellW)/2), cellTop, cellW, 50);
        physics.setStaticBody(cell.physicsWalls.wallN , true);
        physics.addToWorld(cell.physicsWalls.wallN);
      }
      else{ //else update the position of the body
        physics.setPosition(cell.physicsWalls.wallN, (cellLeft + (cellW)/2), cellTop);
      }
  	}

    //SOUTH
  	if (cell.edges.s === null) {
  		context.moveTo(cellLeft, cellTop + cellH);
  		context.lineTo(cellLeft + cellW, cellTop + cellH);

      //South Physics body
      if(firstRender === true){
        cell.physicsWalls.wallS = physics.createRectangleBody((cellLeft + (cellW)/2), cellTop + cellH, cellW, 50);
        physics.setStaticBody(cell.physicsWalls.wallS , true);
        physics.addToWorld(cell.physicsWalls.wallS);
      }
      else{//else update the position of the body
        physics.setPosition(cell.physicsWalls.wallS, (cellLeft + (cellW)/2), cellTop + cellH);
      }
  	}

    //EAST
  	if (cell.edges.e === null) {
  		context.moveTo(cellLeft + cellW, cellTop);
  		context.lineTo(cellLeft + cellW, cellTop + cellH);

      //East Physics body
      if(firstRender === true){
        cell.physicsWalls.wallE = physics.createRectangleBody(cellLeft+cellW, (cellTop + (cellH)/2), 50, cellW);
        physics.setStaticBody(cell.physicsWalls.wallE , true);
        physics.addToWorld(cell.physicsWalls.wallE);
      }
      else{ //else update the position of the body
        physics.setPosition(cell.physicsWalls.wallE, (cellLeft + cellW), (cellTop + (cellH)/2));
      }
  	}

    //WEST
  	if (cell.edges.w === null) {
  		context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft, cellTop + cellH);

      //West Physics body
      if(firstRender === true){
        cell.physicsWalls.wallW = physics.createRectangleBody(cellLeft, (cellTop + (cellH)/2), 50, cellW);
        physics.setStaticBody(cell.physicsWalls.wallW , true);
        physics.addToWorld(cell.physicsWalls.wallW);
      }
      else{ //else update the position of the body
        physics.setPosition(cell.physicsWalls.wallW, cellLeft, (cellTop + (cellH)/2));
      }
  	}
  }

  that.drawCharacter = function(spec){

    //draw the character and the body in the same aread
    context.drawImage(spec.image,
    (spec.x - 50), (spec.y - 50), width/(spec.width), height/spec.height)
    
    // context.drawImage(spec.image,
    // spec.x + 10 + offset.x, spec.y + 15 + offset.y, width/(spec.width), height/spec.height)
    // spec.x - 20 + offset.x, spec.y - 30 + offset.y, width/(spec.width), height/spec.height);
  };

  that.drawParticle = function(image, x, y, size){
    context.drawImage(image,x - 25, y - 20, size, size);
  };

  return that;
}());
