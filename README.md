# Áine’s Game 

A browser-based pixel maze game built with HTML5 Canvas and vanilla JavaScript. Move through the maze, avoid walls, and find the hidden present (its not really hidden lets be real) to trigger a fun birthday celebration cutscene.

## Features

- 16×16 tile-based maze
- Arrow key movement (↑ ↓ ← →)
- Collision with walls (no clipping)
- Pixel-art tiles and sprites
- Data-driven assets via `assets.json`
- Animated win cutscene with balloons, streamers, and birthday message

## Requirements

- web browser
- Local web server (required for loading `assets.json`)

## Running the Game

Because the game uses `fetch()` to load assets, you must run it via a local server.

## VS Code (Live Server)
Right-click `birthday_game.html` → **Open with Live Server**

##  Python
```bash
python -m http.server 8000
 ```


Then open:

http://localhost:8000/birthday_game.html


### VS Code (Live Server)

Right-click `birthday_game.html` → **Open with Live Server**

## Controls & Gameplay

- **Move:** Arrow keys
- **Goal:** Reach the present to win
- **Obstacles:** Walls block movement
- Player starts at (1, 1)
- Present is at (14, 14)

## Project Structure
```bash
aine_game/
├── assets.json # Maze, tiles, sprites, colors
├── birthday_game.html # Main game page
├── styles.css # Styling
├── main.js # Asset loader
├── game.js # Game logic + rendering
└── README.md # This file
 ```

## Customization

Edit `assets.json` to change:

- Maze layout (`1` = wall, `0` = path)
- Tile size and colors
- Pixel-art patterns and sprites

Edit `game.js` to move:

- Player start location
- Present location

## Technical Notes

- HTML5 Canvas + 2D context
- `requestAnimationFrame()` game loop
- Assets loaded with `fetch()`
- Smooth tile-to-tile movement
- Phase-based win cutscene animation
