
    let TILE_SIZE = 40;
    let GRID_WIDTH = 16;
    let GRID_HEIGHT = 16;

    let tileColors = {};
    let bushTile = [];
    let waterTile = [];
    let pathTile = [];

    let mazeGrid = [];     
    let maze = [];         
    let pokeballPattern = [];
    let pokeballColors = { "1": "#ffffff", "2": "#ff0000", "3": "#000000" };

    let presentPattern = [];
    let trainerPatterns = {};
    let pikachuPattern = [];

   
    function refreshAssets() {
    TILE_SIZE = window.TILE_SIZE || TILE_SIZE;
    GRID_WIDTH = window.GRID_WIDTH || GRID_WIDTH;
    GRID_HEIGHT = window.GRID_HEIGHT || GRID_HEIGHT;

    tileColors = window.tileColors || tileColors;
    bushTile = window.bushTile || bushTile;
    waterTile = window.waterTile || waterTile;
    pathTile = window.pathTile || pathTile;

    mazeGrid = window.mazeGrid || mazeGrid;
    maze = window.maze || maze;

    pokeballPattern = window.pokeballPattern || pokeballPattern;
    pokeballColors = window.pokeballColors || pokeballColors;

    presentPattern = window.presentPattern || presentPattern;
    trainerPatterns = window.trainerPatterns || trainerPatterns;
    pikachuPattern = window.pikachuPattern || pikachuPattern;
    }

  
    let loki = { x: 1, y: 1, dir: 'right' };
    let present = { x: 14, y: 14 };
    let moving = false;
    let moveProgress = 0;
    let won = false;
    let animFrame = 0;
    let cutscene = {
    active: false,
    phase: 'transform',
    progress: 0,
    chestScale: 1,
    chestOpen: 0,
    balloons: [],
    streamers: []
    };

   
    const keys = {};
    document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    });
    document.addEventListener('keyup', e => keys[e.key] = false);

   
    function canMove(x, y) {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    
    if (Array.isArray(maze) && maze.length) return maze[y][x] === 0;
    return true;
    }

   
    function drawPixelChar(x, y, colors, patterns) {
        if (!patterns) return; 
        
        
        const isSingle = Array.isArray(patterns) && Array.isArray(patterns[0]);
        const isLayers = typeof patterns === 'object' && !Array.isArray(patterns);

        if (!isSingle && !isLayers) return;

        
        const pixelSize = (window.TILE_SIZE || TILE_SIZE) / 8;



   
    if (Array.isArray(patterns[0])) {
        for (let py = 0; py < 8; py++) {
        for (let px = 0; px < 8; px++) {
            const val = patterns[py][px];
            if (!val) continue;

           
            const colorFromMap = colors[val] || colors[String(val)];
            let fill = colorFromMap;
            if (!fill) {
            if (val === 1) fill = colors.yellow || colors.primary || colors.red || '#ffff00';
            else if (val === 2) fill = colors.brown || colors.secondary || '#8b4513';
            else if (val === 3) fill = colors.black || '#000000';
            else if (val === 4) fill = colors.red || '#ff0000';
            else if (val === 5) fill = colors.primary || '#ffffff';
            else fill = '#000000';
            }

            ctx.fillStyle = fill;
            ctx.fillRect(x + px * pixelSize, y + py * pixelSize, pixelSize, pixelSize);
        }
        }
        return;
    }

  
    const colorMap = {
        1: colors.green,
        2: colors.gold,
        3: colors.skin,
        4: colors.eye
    };

    ['hat', 'face', 'eyes', 'body'].forEach(layer => {
        if (patterns[layer]) {
        for (let py = 0; py < 8; py++) {
            for (let px = 0; px < 8; px++) {
            const val = patterns[layer][py][px];
            if (val) {
                ctx.fillStyle = colorMap[val] || '#000';
                ctx.fillRect(
                x + px * pixelSize,
                y + py * pixelSize,
                pixelSize,
                pixelSize
                );
            }
            }
        }
        }
    });
    }

   
    function updateCutscene() {
    cutscene.progress++;

    if (cutscene.phase === 'transform') {
        if (cutscene.progress > 60) {
        cutscene.phase = 'expand';
        cutscene.progress = 0;
        }
    } else if (cutscene.phase === 'expand') {
        cutscene.chestScale = 1 + (cutscene.progress / 120) * 8;
        if (cutscene.progress > 120) {
        cutscene.phase = 'open';
        cutscene.progress = 0;
        }
    } else if (cutscene.phase === 'open') {
        cutscene.chestOpen = Math.min(1, cutscene.progress / 30);
        if (cutscene.progress === 30) {
        for (let i = 0; i < 22; i++) {
            cutscene.balloons.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: -1.5 - Math.random() * 2.5,
            color: ['#ff69b4', '#4ec3e0', '#ffeb3b', '#4caf50', '#ff5252'][Math.floor(Math.random() * 5)],
            size: 40
            });
        }
        for (let i = 0; i < 25; i++) {
            cutscene.streamers.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 80,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: -2 - Math.random() * 5,
            color: ['#d4af37', '#c9b037', '#FFD700', '#b8860b'][Math.floor(Math.random() * 4)],
            width: 8,
            height: 4
            });
        }
        }
        if (cutscene.progress > 30) {
        cutscene.phase = 'celebrate';
        cutscene.progress = 0;
        status.innerHTML = '<span class="blink">★ TREASURE FOUND! ★</span>';
        }
    } else if (cutscene.phase === 'celebrate') {
        cutscene.balloons.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.02;
        });
        cutscene.streamers.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08;
        });
    }
    }

    
    function update() {
    animFrame++;

    if (cutscene.active) {
        updateCutscene();
        return;
    }

    if (won) return;

    if (!moving) {
        let newX = loki.x;
        let newY = loki.y;
        let newDir = loki.dir;

        if (keys['ArrowUp']) { newY--; newDir = 'up'; }
        else if (keys['ArrowDown']) { newY++; newDir = 'down'; }
        else if (keys['ArrowLeft']) { newX--; newDir = 'left'; }
        else if (keys['ArrowRight']) { newX++; newDir = 'right'; }

        if ((newX !== loki.x || newY !== loki.y) && canMove(newX, newY)) {
        loki.targetX = newX;
        loki.targetY = newY;
        loki.dir = newDir;
        moving = true;
        moveProgress = 0;
        }
    } else {
        moveProgress += 0.15;
        if (moveProgress >= 1) {
        loki.x = loki.targetX;
        loki.y = loki.targetY;
        moving = false;
        moveProgress = 0;

        if (loki.x === present.x && loki.y === present.y) {
            won = true;
            cutscene.active = true;
            cutscene.phase = 'transform';
            cutscene.progress = 0;
        }
        }
    }
    }

   
    function drawCutscene() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (cutscene.phase === 'transform') {
        for (let i = 0; i < 5; i++) {
        const angle = (cutscene.progress / 60) * Math.PI * 2 + (i * Math.PI * 2 / 5);
        const radius = 60;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x - 2, y - 2, 4, 4);
        }


        const colors = pokeballColors;
        drawPixelChar(centerX - TILE_SIZE / 2, centerY - TILE_SIZE / 2, colors, pokeballPattern);

    } else if (cutscene.phase === 'expand') {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(cutscene.chestScale, cutscene.chestScale);
        drawPixelChar(-TILE_SIZE / 2, -TILE_SIZE / 2, pokeballColors, pokeballPattern);
        ctx.restore();

    } else if (cutscene.phase === 'open' || cutscene.phase === 'celebrate') {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(9, 9);
        const flashAlpha = Math.max(0, 1 - cutscene.chestOpen);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, TILE_SIZE * 4, 0, Math.PI * 2);
        ctx.fill();

        drawPixelChar(-TILE_SIZE / 2, -TILE_SIZE / 2, pokeballColors, pokeballPattern);
        ctx.restore();

        cutscene.balloons.forEach(b => {
        const bs = b.size;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.fillStyle = '#000';
        ctx.fillRect(-bs/2 + bs*0.2, -bs/2 - 2, bs*0.6, 2);
        ctx.fillRect(-bs/2 + bs*0.1, -bs/2, bs*0.8, 2);
        ctx.fillRect(-bs/2 - 2, -bs/2 + bs*0.1, 2, bs*0.7);
        ctx.fillRect(bs/2, -bs/2 + bs*0.1, 2, bs*0.7);
        ctx.fillRect(-bs/2 + bs*0.3, bs/2 - bs*0.1, bs*0.4, 2);
        ctx.fillRect(-bs/2 + bs*0.4, bs/2 - bs*0.05, bs*0.2, 2);
        ctx.fillStyle = b.color;
        ctx.fillRect(-bs/2 + bs*0.2, -bs/2, bs*0.6, bs*0.1);
        ctx.fillRect(-bs/2 + bs*0.1, -bs/2 + bs*0.1, bs*0.8, bs*0.2);
        ctx.fillRect(-bs/2, -bs/2 + bs*0.3, bs, bs*0.4);
        ctx.fillRect(-bs/2 + bs*0.1, bs/2 - bs*0.3, bs*0.8, bs*0.2);
        ctx.fillRect(-bs/2 + bs*0.3, bs/2 - bs*0.1, bs*0.4, bs*0.05);
        ctx.fillStyle = '#fff';
        ctx.fillRect(-bs/2 + bs*0.25, -bs/2 + bs*0.15, bs*0.15, bs*0.1);
        ctx.fillRect(-bs/2 + bs*0.2, -bs/2 + bs*0.25, bs*0.1, bs*0.05);
        ctx.fillStyle = adjustBrightness(b.color, -40);
        ctx.fillRect(bs/2 - bs*0.2, -bs/2 + bs*0.3, bs*0.2, bs*0.35);
        ctx.fillStyle = adjustBrightness(b.color, -50);
        ctx.fillRect(-bs*0.1, bs/2, bs*0.2, bs*0.08);
        ctx.fillStyle = '#000';
        ctx.fillRect(-1, bs/2 + bs*0.08, 2, 20);
        ctx.restore();
        });

        cutscene.streamers.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x - s.width/2, s.y - s.height/2, s.width, s.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.x - s.width/2, s.y - s.height/2, s.width, s.height);
        });

        if (cutscene.phase === 'celebrate') {
        ctx.save();
        const textY = 80;
        ctx.font = 'bold 64px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Happy Birthday', canvas.width / 2 + 4, textY + 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Happy Birthday', canvas.width / 2, textY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Happy Birthday', canvas.width / 2 - 3, textY - 3);
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Happy Birthday', canvas.width / 2, textY);
        ctx.globalAlpha = 1;
        const textY2 = textY + 80;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('Áine', canvas.width / 2 + 4, textY2 + 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Áine', canvas.width / 2, textY2);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Áine', canvas.width / 2 - 3, textY2 - 3);
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Áine', canvas.width / 2, textY2);
        ctx.globalAlpha = 1;
        ctx.restore();
        }
    }
    }
    function drawMaze() {
        const grid = window.mazeGrid || mazeGrid || [];
        if (!grid.length) return;

        const T = window.TILE_SIZE || TILE_SIZE;
        const colors = window.tileColors || tileColors;
        const bush = window.bushTile || bushTile;
        const water = window.waterTile || waterTile;
        const path = window.pathTile || pathTile;

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < (grid[y] ? grid[y].length : 0); x++) {
            let tile;
            const cell = grid[y][x];
            if (cell === 'bush') tile = bush;
            else if (cell === 'water') tile = water;
            else tile = path;

            const px = x * T;
            const py = y * T;
            
            drawPixelChar(px, py, colors, tile);
            }
        }
        }


  
    function draw() {
    ctx.fillStyle = '#4b5320';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (cutscene.active) {
        drawCutscene();
        return;
    }

    drawMaze();

   
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
    }

   
    const presentX = present.x * (window.TILE_SIZE || TILE_SIZE);
    const presentY = present.y * (window.TILE_SIZE || TILE_SIZE);
    const presentColor = Math.floor(animFrame / 10) % 2 === 0 ? '#FFD700' : '#FFA500';
    const presentPat = window.presentPattern || presentPattern;
    drawPixelChar(presentX, presentY, { primary: presentColor, secondary: presentColor }, presentPat);


    
    const T = window.TILE_SIZE || TILE_SIZE;
    let lokiX = loki.x * T;
    let lokiY = loki.y * T;
    if (moving) {
    lokiX += (loki.targetX - loki.x) * T * moveProgress;
    lokiY += (loki.targetY - loki.y) * T * moveProgress;
    }
    const trainerPat = (window.trainerPatterns && window.trainerPatterns[loki.dir]) || (window.trainerPatterns && window.trainerPatterns.right) || trainerPatterns[loki.dir] || trainerPatterns.right;
    drawPixelChar(lokiX, lokiY, {
    green: '#1e7f1e',
    gold: '#ff0000',
    skin: '#fddbb0',
    eye: '#1a3a52'
    }, trainerPat);
}


   
    function adjustBrightness(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
        }

  
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

  
    let canvas, ctx, status;

function ensureDOM() {
    if (!canvas) {
        canvas = document.getElementById('gameCanvas');
        if (canvas) ctx = canvas.getContext('2d');
    }
    if (!status) status = document.getElementById('status');
}


function hasPatternContent(pat) {
    if (!pat) return false;

    if (Array.isArray(pat) && pat.length && Array.isArray(pat[0])) return true;

    if (typeof pat === 'object' && !Array.isArray(pat) && Object.keys(pat).length) return true;

    if (Array.isArray(pat) && pat.length && typeof pat[0] !== 'undefined') return true;
    return false;
}

function startWhenReady() {
    ensureDOM();

    const ready = (
        canvas && ctx &&
        Array.isArray(window.mazeGrid) && window.mazeGrid.length > 0 &&
        hasPatternContent(window.bushTile) &&
        hasPatternContent(window.pathTile) &&
        hasPatternContent(window.presentPattern)
    );

    if (ready) {
        refreshAssets();   
        gameLoop();
    } else {
        requestAnimationFrame(startWhenReady);
    }
}

requestAnimationFrame(startWhenReady);