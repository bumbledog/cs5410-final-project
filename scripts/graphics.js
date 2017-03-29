var graphics = (function(){
  let that = {};
  let context = null;

  that.initialize = function(){
    let canvas = document.getElementById('canvas-main');
    context = canvas.getContext('2d');

    CanvasRenderingContext2D.prototype.clear = function() {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
      this.clearRect(0, 0, canvas.width, canvas.height);
      this.restore();
    };
  };

  that.renderMaze = function(maze) {
    context.beginPath();
  	context.moveTo(0, 0);
  	context.lineTo(999, 0);
  	context.lineTo(999, 999);
  	context.lineTo(0, 999);
  	context.closePath();
  	context.strokeStyle = 'rgb(0, 0, 0)';
  	context.stroke();

  	context.lineWidth = 6;

  	for (let row = 0; row < 16; row++) {
  		for (let col = 0; col < 16; col++) {
  			drawCell(maze[row][col]);
  		}
  	}


  };

  function drawCell(cell) {

  	if (cell.edges.n === null) {
  		context.moveTo(cell.x * (1000 / 16), cell.y * (1000 / 16));
  		context.lineTo((cell.x + 1) * (1000 / 16), cell.y * (1000 / 16));
  	}

  	if (cell.edges.s === null) {
  		context.moveTo(cell.x * (1000 / 16), (cell.y + 1) * (1000 / 16));
  		context.lineTo((cell.x + 1) * (1000 / 16), (cell.y + 1) * (1000 / 16));
  	}

  	if (cell.edges.e === null) {
  		context.moveTo((cell.x + 1) * (1000 / 16), cell.y * (1000 / 16));
  		context.lineTo((cell.x + 1) * (1000 / 16), (cell.y + 1) * (1000 / 16));
  	}

  	if (cell.edges.w === null) {
  		context.moveTo(cell.x * (1000 / 16), cell.y * (1000 / 16));
  		context.lineTo(cell.x * (1000 / 16), (cell.y + 1) * (1000 / 16));
  	}
    context.stroke();
  }

  return that;
}());
