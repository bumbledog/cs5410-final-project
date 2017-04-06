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

  //just for testing
  that.renderMaze = function(maze) {
    context.clear();
    context.beginPath();
  	context.moveTo(offset.x, offset.y);
  	context.lineTo(999 + offset.x, offset.y);
  	context.lineTo(999 + offset.x, 999 + offset.y);
  	context.lineTo(offset.x, 999 + offset.y);
  	context.closePath();
  	context.strokeStyle = 'rgb(0, 0, 0)';
  	context.stroke();

  	context.lineWidth = 6;

  	for (let row = 0; row < 3; row++) {
  		for (let col = 0; col < 3; col++) {
  			drawCell(maze[row][col]);
  		}
  	}
    context.stroke();
    context.restore();

  };

  //just for testing
  function drawCell(cell) {
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

    let cellW = width / 3;
    let cellH = height / 3;
    let cellLeft = cell.x * cellW + offset.x;
    let cellTop = cell.y * cellH + offset.y;

    context.fillRect(cellLeft, cellTop, cellW, cellH);

  	if (cell.edges.n === null) {
  		context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft + cellW, cellTop);
  	}

  	if (cell.edges.s === null) {
  		context.moveTo(cellLeft, cellTop + cellH);
  		context.lineTo(cellLeft + cellW, cellTop + cellH);
  	}

  	if (cell.edges.e === null) {
  		context.moveTo(cellLeft + cellW, cellTop);
  		context.lineTo(cellLeft + cellW, cellTop + cellH);
  	}

  	if (cell.edges.w === null) {
  		context.moveTo(cellLeft, cellTop);
  		context.lineTo(cellLeft, cellTop + cellH);
  	}
  }

  that.drawCharacter = function(spec){
    context.drawImage(spec.image,
    spec.x + 10, spec.y + 15, width/(spec.width), height/spec.height)
  };

  return that;
}());
