game.Maze = function(spec){
  let grid = [];

  //create Empty Grid
  for(let col = 0; col < spec.width; col++){
    grid.push([]);
    for(let row = 0; row < spec.height; row++){
      grid.push({
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

  return grid;
};
