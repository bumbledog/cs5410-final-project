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


  //just for testing
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

    context.fillRect(cell.x * (1000 / 16), cell.y * (1000 / 16), 1000 / 16, 1000 / 16);

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

  function drawCharacter(spec){
    context.drawImage(spec.image,
    spec.x, spec.y, 1000/spec.width, 1000/spec.height)
    //need to define character size
  }

  return that;
}());
