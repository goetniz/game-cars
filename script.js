// ---------- CARGA DE IMÁGENES ----------
const assetsPath = "assets/";

const images = {
    car1_up: new Image(),
    car1_down: new Image(),
    car1_left: new Image(),
    car1_right: new Image(),
    car2_up: new Image(),
    car2_down: new Image(),
    car2_left: new Image(),
    car2_right: new Image(),
    shadow: new Image(),
    road_horizontal: new Image(),
    road_vertical: new Image(),
    road_curve: new Image(),
    road_T: new Image(),
    road_cross: new Image(),
    tree: new Image(),
    rock: new Image(),
    road_border: new Image(),
    explosion: new Image()
};

// ---------- ASIGNACIÓN DE RUTAS ----------
images.car1_up.src = assetsPath + "cars/car1_up.png.png";
images.car1_down.src = assetsPath + "cars/car1_down.png.png";
images.car1_left.src = assetsPath + "cars/car1_left.png.png";
images.car1_right.src = assetsPath + "cars/car1_right.png.png";

images.car2_up.src = assetsPath + "cars/car2_up.png.png";
images.car2_down.src = assetsPath + "cars/car2_down.png.png";
images.car2_left.src = assetsPath + "cars/car2_left.png.png";
images.car2_right.src = assetsPath + "cars/car2_right.png.png";

images.shadow.src = assetsPath + "effects/car_shadow.png.png";

images.road_horizontal.src = assetsPath + "road/road_horizontal.png.png";
images.road_vertical.src = assetsPath + "road/road_vertical.png.png";
images.road_curve.src = assetsPath + "road/road_curve.png.png";
images.road_T.src = assetsPath + "road/road_T.png.png";
images.road_cross.src = assetsPath + "road/road_cross.png.png";

images.tree.src = assetsPath + "decoration/tree.png.png";
images.rock.src = assetsPath + "decoration/rock.png.png";
images.road_border.src = assetsPath + "decoration/road_border.png.png";

images.explosion.src = assetsPath + "effects/explosion.png.png";

// ---------- CANVAS ----------
const canvas = document.getElementById("gameCanvas");
canvas.width = 768;
canvas.height = 512;
const ctx = canvas.getContext("2d");

// ---------- TILEMAP ----------
const tileSize = 64;
const map = [
    ["start","road_horizontal","road_horizontal","road_horizontal","road_T","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal","road_horizontal","finish"],
    ["road_vertical","tree","tree","road_vertical","road_vertical","road_vertical","road_vertical","rock","road_vertical","road_vertical","road_vertical","road_vertical"],
    ["road_vertical","tree","tree","road_vertical","road_curve","road_horizontal","road_horizontal","road_horizontal","road_T","road_vertical","rock","road_vertical"],
    ["road_T","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_T"],
    ["road_vertical","rock","road_vertical","tree","road_vertical","road_vertical","road_vertical","road_curve","road_vertical","tree","road_vertical","road_vertical"],
    ["road_vertical","road_vertical","road_vertical","road_vertical","road_T","road_horizontal","road_horizontal","road_horizontal","road_cross","road_vertical","road_vertical","road_vertical"],
    ["road_curve","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_curve","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal"],
    ["road_cross","road_horizontal","road_horizontal","road_T","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal","road_horizontal","road_horizontal","road_cross"]
];

const passableTiles = ["road_horizontal","road_vertical","road_curve","road_T","road_cross","start","finish"];

// ---------- SPAWN POINTS ----------
const spawnPoints = [];
map.forEach((row, r) => {
    row.forEach((tile, c) => {
        if(passableTiles.includes(tile)) {
            spawnPoints.push({x: c*tileSize + 8, y: r*tileSize + 8});
        }
    });
});

// ---------- CARROS ----------
let playerCar = {
    x: spawnPoints[0].x,
    y: spawnPoints[0].y,
    width: 50,
    height: 50,
    speed: 0,
    maxSpeed: 5,
    sprite: images.car1_up,
    alive: true
};

// --- IA1 (original) ---
let aiCar1 = {
    x: spawnPoints[1].x,
    y: spawnPoints[1].y,
    width: 50,
    height: 50,
    speed: 2,
    sprite: images.car2_right,
    alive: true
};

// --- IA2 (tu color, rojo) ---
let aiCar2 = {
    x: spawnPoints[2].x,
    y: spawnPoints[2].y,
    width: 50,
    height: 50,
    speed: 2,
    sprite: images.car1_right,
    alive: true
};

// --- IA3 (otro color, azul) ---
let aiCar3 = {
    x: spawnPoints[3].x,
    y: spawnPoints[3].y,
    width: 50,
    height: 50,
    speed: 2,
    sprite: images.car2_right,
    alive: true
};

// ---------- DIRECCIONES IA ----------
let aiDirections = [
    {dx: aiCar1.speed, dy: 0, sprite: aiCar1.sprite},
    {dx: aiCar2.speed, dy: 0, sprite: aiCar2.sprite},
    {dx: aiCar3.speed, dy: 0, sprite: aiCar3.sprite}
];

// ---------- TECLAS ----------
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ---------- COMANDO SECRETO 1579 ----------
let cheatSequence = [];
document.addEventListener("keydown", e => {
    if("1579".includes(e.key)) {
        cheatSequence.push(e.key);
        if(cheatSequence.slice(-4).join("") === "1579") {
            [aiCar1, aiCar2, aiCar3].forEach(ai => { ai.alive = false; });
            setTimeout(() => {
                respawnAI(aiCar1, 0);
                respawnAI(aiCar2, 1);
                respawnAI(aiCar3, 2);
            }, 1000);
        }
    }
});

// ---------- CHEQUEO TILE ----------
function isPassable(x, y) {
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);
    if(row < 0 || row >= map.length || col < 0 || col >= map[0].length) return false;
    return passableTiles.includes(map[row][col]);
}

// ---------- MOVIMIENTO PLAYER ----------
function updatePlayer() {
    let nextX = playerCar.x;
    let nextY = playerCar.y;

    if(keys["ArrowUp"]) { playerCar.sprite = images.car1_up; nextY -= playerCar.maxSpeed; }
    if(keys["ArrowDown"]) { playerCar.sprite = images.car1_down; nextY += playerCar.maxSpeed; }
    if(keys["ArrowLeft"]) { playerCar.sprite = images.car1_left; nextX -= playerCar.maxSpeed; }
    if(keys["ArrowRight"]) { playerCar.sprite = images.car1_right; nextX += playerCar.maxSpeed; }

    const corners = [
        [nextX, nextY],
        [nextX + playerCar.width, nextY],
        [nextX, nextY + playerCar.height],
        [nextX + playerCar.width, nextY + playerCar.height]
    ];
    if(corners.every(c => isPassable(c[0], c[1]))) {
        playerCar.x = nextX;
        playerCar.y = nextY;
    }
}

// ---------- RESPAWN IA ----------
function respawnAI(aiCar, spawnIndex) {
    const validSpawns = spawnPoints.filter(sp => isPassable(sp.x, sp.y));
    const spawn = validSpawns[spawnIndex % validSpawns.length];
    aiCar.x = spawn.x;
    aiCar.y = spawn.y;
    aiCar.alive = true;
    aiDirections[[aiCar1, aiCar2, aiCar3].indexOf(aiCar)] = {dx: aiCar.speed, dy:0, sprite: aiCar.sprite};
}

// ---------- MOVIMIENTO IA MEJORADO ----------
function updateAI(aiCar, aiIndex) {
    if(!aiCar.alive) return;

    let dir = aiDirections[aiIndex];
    let nextX = aiCar.x + dir.dx;
    let nextY = aiCar.y + dir.dy;

    const corners = [
        [nextX, nextY],
        [nextX + aiCar.width, nextY],
        [nextX, nextY + aiCar.height],
        [nextX + aiCar.width, nextY + aiCar.height]
    ];

    if(corners.every(c => isPassable(c[0], c[1]))) {
        aiCar.x = nextX;
        aiCar.y = nextY;
        aiCar.sprite = dir.sprite;
    } else {
        const directions = [
            {dx: aiCar.speed, dy: 0, sprite: aiCar.sprite},
            {dx: 0, dy: aiCar.speed, sprite: aiCar.sprite},
            {dx: -aiCar.speed, dy: 0, sprite: aiCar.sprite},
            {dx: 0, dy: -aiCar.speed, sprite: aiCar.sprite}
        ];
        const validDirs = directions.filter(d => {
            const nx = aiCar.x + d.dx;
            const ny = aiCar.y + d.dy;
            return [
                [nx, ny],
                [nx + aiCar.width, ny],
                [nx, ny + aiCar.height],
                [nx + aiCar.width, ny + aiCar.height]
            ].every(c => isPassable(c[0], c[1]));
        });
        if(validDirs.length > 0) {
            const newDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            aiDirections[aiIndex] = newDir;
            aiCar.x += newDir.dx;
            aiCar.y += newDir.dy;
            aiCar.sprite = newDir.sprite;
        }
    }
}

// ---------- DIBUJAR MAPA ----------
function drawMap() {
    for(let row=0; row<map.length; row++){
        for(let col=0; col<map[row].length; col++){
            const tile = map[row][col];
            if(images[tile]) ctx.drawImage(images[tile], col*tileSize, row*tileSize, tileSize, tileSize);
            ctx.strokeStyle="red";
            ctx.strokeRect(col*tileSize,row*tileSize,tileSize,tileSize);
        }
    }
}

// ---------- DIBUJAR CARRO ----------
function drawCar(car){
    if(!car.alive){
        ctx.drawImage(images.explosion, car.x, car.y, car.width, car.height);
        return;
    }
    ctx.globalAlpha = 0.45;
    ctx.drawImage(images.shadow, car.x-10, car.y+25, 60, 30);
    ctx.globalAlpha = 1;
    ctx.drawImage(car.sprite, car.x, car.y, car.width, car.height);
}

// ---------- LOOP ----------
function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMap();
    updatePlayer();
    updateAI(aiCar1, 0);
    updateAI(aiCar2, 1);
    updateAI(aiCar3, 2);
    drawCar(playerCar);
    drawCar(aiCar1);
    drawCar(aiCar2);
    drawCar(aiCar3);
    requestAnimationFrame(loop);
}
loop();
