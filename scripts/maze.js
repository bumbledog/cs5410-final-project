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
        },
        //this is only used for generating mazes
        visited: false
      });
    }
  }

  //pick seed biome locations
  let biomeSeeds = [];
  for(let i = 0; i < spec.biomes; i++){
    let x, y;
    do{
      x = getRandom(spec.width);
      y = getRandom(spec.height);
    }
    while(grid[x][y].biome !== null);
    grid[x][y].biome = i;

    biomeSeeds.push(NeighborList(x,y));
    biomeSeeds[i].addId(i);
  }

  //use prims algorithm to expand seeded areas
  //TODO: add min or max for each area?
  while(biomeSeeds.length > 0){
    let biome = getRandom(biomeSeeds.length);
    let nextCell = getRandom(biomeSeeds[biome].length);
    let x = biomeSeeds[biome][nextCell].x;
    let y = biomeSeeds[biome][nextCell].y;
    if(grid[x][y].biome === null){
      grid[x][y].biome = biomeSeeds[biome].id;
      biomeSeeds[biome].addNeighbors(x,y);
    }
    biomeSeeds[biome].splice(nextCell, 1);
    if(biomeSeeds[biome].length === 0){
      biomeSeeds.splice(biome, 1);
    }
  }

  //overlay maze
  let neighbors = NeighborList(0,0);
  grid[0][0].visited = true;
  while(neighbors.length !== 0){
    let rand = getRandom(neighbors.length);
    let nextCell = neighbors[rand];
    let x = nextCell.x;
    let y = nextCell.y;
    if(grid[x][y].visited !== true){
      grid[x][y].visited = true;
      let dir = nextCell.dir;
      //connect walls
      if(dir === 'n'){
        grid[x][y].edges.n = grid[x][y - 1];
        grid[x][y - 1].edges.s = grid[x][y];
      }
      else if(dir === 's'){
        grid[x][y].edges.s = grid[x][y + 1];
        grid[x][y + 1].edges.n = grid[x][y];
      }
      else if(dir === 'w'){
        grid[x][y].edges.w = grid[x - 1][y];
        grid[x - 1][y].edges.e = grid[x][y];
      }
      else if(dir === 'e'){
        grid[x][y].edges.e = grid[x + 1][y];
        grid[x + 1][y].edges.w = grid[x][y];
      }
      neighbors.addNeighbors(x, y);
    }
    neighbors.splice(rand, 1);
  }


  //array object that knows how to add neighbors
  //initialize with a beginning location in the grid
  function NeighborList(x,y){
    let that = [];

    that.addId = function(id){
      that.id = id;
    }

    that.addNeighbors = function(x,y){
      if(x > 0){
        that.push({x: x - 1, y: y, dir: 'e'});
      }
      if(x + 1 < spec.width){
        that.push({x: x + 1, y: y, dir: 'w'});
      }
      if(y > 0){
        that.push({x: x, y: y - 1, dir: 's'});
      }
      if(y + 1 < spec.height){
        that.push({x: x, y: y + 1, dir: 'n'});
      }
    }

    that.addNeighbors(x,y);

    return that;
  }

  function getRandom(limit){
    return Math.floor(Math.random() * limit);
  }

  return grid;
};
