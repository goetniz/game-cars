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

// ---------- TILEMAP DE LA PISTA ----------
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

let aiCar = {
    x: spawnPoints[1].x,
    y: spawnPoints[1].y,
    width: 50,
    height: 50,
    speed: 2,
    sprite: images.car2_right,
    alive: true
};

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
            aiCar.alive = false;
            setTimeout(respawnAI, 1000); // respawn tras 1s
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
function respawnAI() {
    const validSpawns = spawnPoints.filter(sp => isPassable(sp.x, sp.y));
    const spawn = validSpawns[Math.floor(Math.random() * validSpawns.length)];
    aiCar.x = spawn.x;
    aiCar.y = spawn.y;
    aiCar.sprite = images.car2_right;
    aiCar.alive = true;
}

// ---------- MOVIMIENTO IA ----------
function updateAI() {
    if(!aiCar.alive) return;

    let directions = [
        {dx: aiCar.speed, dy: 0, sprite: images.car2_right},
        {dx: 0, dy: aiCar.speed, sprite: images.car2_down},
        {dx: -aiCar.speed, dy: 0, sprite: images.car2_left},
        {dx: 0, dy: -aiCar.speed, sprite: images.car2_up}
    ];

    for(let dir of directions) {
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
            break;
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
    if(car.alive===false){
        ctx.drawImage(images.explosion, car.x, car.y, car.width, car.height);
        return;
    }
    ctx.globalAlpha=0.45;
    ctx.drawImage(images.shadow, car.x-10, car.y+25, 60, 30);
    ctx.globalAlpha=1;
    ctx.drawImage(car.sprite, car.x, car.y, car.width, car.height);
}

// ---------- LOOP ----------
function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMap();
    updatePlayer();
    updateAI();
    drawCar(playerCar);
    drawCar(aiCar);
    requestAnimationFrame(loop);
}
loop();
