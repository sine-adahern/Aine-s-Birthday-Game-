
async function loadAssets() {
  const res = await fetch('./assets.json');
  if (!res.ok) throw new Error('Failed to load assets.json: ' + res.status);
  return res.json();
}

(async function init() {
  try {
    const assets = await loadAssets();
    console.log('assets keys', Object.keys(assets));


   
    window.TILE_SIZE = assets.TILE_SIZE;
    window.GRID_WIDTH = assets.GRID_WIDTH;
    window.GRID_HEIGHT = assets.GRID_HEIGHT;

  
    window.maze = assets.maze;

    
    window.mazeGrid = assets.maze.map(row => row.map(cell => cell === 1 ? 'bush' : 'path'));

   
    window.tileColors = assets.tileColors;
    window.bushTile = assets.bushTile;
    window.waterTile = assets.waterTile;
    window.pathTile = assets.pathTile;

    
    window.presentPattern = assets.presentPattern || null;
    window.pokeballPattern = assets.pokeballPattern || null;
    window.pokeballColors = assets.pokeballColors || null;
    window.trainerPatterns = assets.trainerPatterns || null;
    window.pikachuPattern = assets.pikachuPattern || null;


    
    console.log('Assets loaded and globals set.');
  } catch (err) {
    console.error('Asset load error', err);
  }
})();