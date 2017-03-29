game.Maze = function(spec){
  let grid = [];

  //create Empty Grid
  for(let col = 0; col < spec.width; col++){
    grid.push([]);
    for(let row = 0; row < spec.height; row++){
      grid[col].push({
        x: col, y: row,
        biome: null,
        edges: {
          n: null,
          s: null,
          e: null,
          w: null
        }
      });
    }
  }

  //pick seed biome locations
  /*let biomeSeeds = [];
  for(let i = 0; i < biome.length; i++){
    let x, y;
    do{
      x = getRandom(spec.length);
      y = getRandom(spec.length);
    }
    while(grid[x][y] !== null);
    grid[x][y].biome = i;

    biomeSeeds.push(NeighborList());
    biomeSeeds[i].addNeighbors(x,y);
  }

  function NeighborList(){
    let that = [];

    that.addNeighbors = function(x,y){
      if(x > 0){
        that.push({x: x - 1, y: y});
      }
      if(x + 1 < spec.length){
        that.push({x: x + 1, y: y});
      }
      if(y > 0){
        that.push({x: x, y: y - 1});
      }
      if(y + 1 < spec.height){
        that.push({x: x, y: y - 1});
      }
    }

    return that;
  }

  function getRandom(limit){
    return Math.floor(Math.random() * limit);
  }*/

  return grid;
};
