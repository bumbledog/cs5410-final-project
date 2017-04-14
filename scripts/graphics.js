var graphics = (function(){
  let that = {};
  let context = null;
  let canvas = null;
  let width = 0;
  let height = 0;
  let offset = {x:0, y:0};
  let visible = [];
  let camera;

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
  that.renderMaze = function(maze) {
    context.clear();
    context.beginPath();

  	context.lineWidth = 20;

    //draw north and west of each cell
  	for (let row = 0; row < maze.length; row++) {
  		for (let col = 0; col < maze[row].length; col++) {
  			drawCell(maze[row][col], maze.cellWidth, maze.cellHeight);
  		}
  	}

    //draw the south and east edges
  	context.moveTo(0, maze.length * maze.cellHeight);
  	context.lineTo(maze[0].length * maze.cellWidth, maze.length * maze.cellHeight);

    context.moveTo(maze[0].length * maze.cellWidth, 0);
  	context.lineTo(maze[0].length * maze.cellWidth, maze.length * maze.cellHeight);

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

    context.fillRect(cellLeft, cellTop, cellW, cellH);

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

  that.defineCamera = function(offset){
  var ptA = {x:offset.x , y:offset.y},
      ptB = {x:offset.x , y:offset.y + canvas.height},
      ptC = {x:offset.x + canvas.width, y:offset.y},
      ptD = {x:offset.x + canvas.width, y:offset.y + canvas.height}

      boundingCircle = objects.quadTree.circleFromSquare(ptA, ptB, ptC);

    camera = {pt1:ptA, pt2:ptB, pt3:ptC, pt4:ptD, boundingCircle:boundingCircle};

    return camera;

}
  that.renderEnemies = function(elapsedTime, enemies){
    
   visible = objects.quadTree.visibleObjects(that.defineCamera(offset));
   for(let enemy = 0; enemy < enemies.length; enemy++){
     that.drawCharacter(visible[enemy]);
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

  return that;
}());


