// ---------- CARGA DE IMÁGENES ----------
const assetsPath = "assets/";

const images = {
    car1_up: new Image(),
    car1_down: new Image(),
    car1_left: new Image(),
    car1_right: new Image(),
    shadow: new Image(),
    road_horizontal: new Image(),
    road_vertical: new Image(),
    road_curve: new Image(),
    road_T: new Image(),
    road_cross: new Image(),
    tree: new Image(),
    rock: new Image(),
    road_border: new Image()
};

// -------- ASIGNACIÓN DE RUTAS (.png.png) --------
images.car1_up.src = assetsPath + "cars/car1_up.png.png";
images.car1_down.src = assetsPath + "cars/car1_down.png.png";
images.car1_left.src = assetsPath + "cars/car1_left.png.png";
images.car1_right.src = assetsPath + "cars/car1_right.png.png";

images.shadow.src = assetsPath + "effects/car_shadow.png.png";

images.road_horizontal.src = assetsPath + "road/road_horizontal.png.png";
images.road_vertical.src = assetsPath + "road/road_vertical.png.png";
images.road_curve.src = assetsPath + "road/road_curve.png.png";
images.road_T.src = assetsPath + "road/road_T.png.png";
images.road_cross.src = assetsPath + "road/road_cross.png.png";

images.tree.src = assetsPath + "decoration/tree.png.png";
images.rock.src = assetsPath + "decoration/rock.png.png";
images.road_border.src = assetsPath + "decoration/road_border.png.png";

// ---------- CANVAS ----------
const canvas = document.getElementById("gameCanvas");
canvas.width = 768;
canvas.height = 512;
const ctx = canvas.getContext("2d");

// ---------- TILEMAP DE LA PISTA ----------
const tileSize = 64;
const map = [
    ["road_cross","road_horizontal","road_horizontal","road_horizontal","road_T","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal","road_horizontal","road_cross"],
    ["road_vertical","tree","tree","road_vertical","road_vertical","road_vertical","road_vertical","rock","road_vertical","road_vertical","road_vertical","road_vertical"],
    ["road_vertical","tree","tree","road_vertical","road_curve","road_horizontal","road_horizontal","road_horizontal","road_T","road_vertical","rock","road_vertical"],
    ["road_T","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_T"],
    ["road_vertical","rock","road_vertical","tree","road_vertical","road_vertical","road_vertical","road_curve","road_vertical","tree","road_vertical","road_vertical"],
    ["road_vertical","road_vertical","road_vertical","road_vertical","road_T","road_horizontal","road_horizontal","road_horizontal","road_cross","road_vertical","road_vertical","road_vertical"],
    ["road_curve","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_horizontal","road_curve","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal"],
    ["road_cross","road_horizontal","road_horizontal","road_T","road_vertical","road_vertical","road_vertical","road_curve","road_horizontal","road_horizontal","road_horizontal","road_cross"]
];

// ---------- CARRO ----------
let car = {
    x: tileSize * 1 + 8,
    y: tileSize * 1 + 8,
    width: 50,
    height: 50,
    speed: 0,
    maxSpeed: 5,
    sprite: images.car1_up
};

// ---------- TECLAS ----------
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ---------- ACTUALIZAR MOVIMIENTO ----------
function updateCar() {
    let nextX = car.x;
    let nextY = car.y;

    if(keys["ArrowUp"]) { car.sprite = images.car1_up; nextY -= car.maxSpeed; }
    if(keys["ArrowDown"]) { car.sprite = images.car1_down; nextY += car.maxSpeed; }
    if(keys["ArrowLeft"]) { car.sprite = images.car1_left; nextX -= car.maxSpeed; }
    if(keys["ArrowRight"]) { car.sprite = images.car1_right; nextX += car.maxSpeed; }

    // Limitar dentro del canvas
    if(nextX >= 0 && nextX + car.width <= canvas.width) car.x = nextX;
    if(nextY >= 0 && nextY + car.height <= canvas.height) car.y = nextY;
}

// ---------- DIBUJAR MAPA ----------
function drawMap() {
    for(let row = 0; row < map.length; row++) {
        for(let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            if(images[tile]) ctx.drawImage(images[tile], col * tileSize, row * tileSize, tileSize, tileSize);

            // Dibuja borde rojo feo para que se vea el tile
            ctx.strokeStyle = "red";
            ctx.strokeRect(col*tileSize, row*tileSize, tileSize, tileSize);
        }
    }
}

// ---------- DIBUJAR CARRO ----------
function drawCar() {
    // Sombra
    ctx.globalAlpha = 0.45;
    ctx.drawImage(images.shadow, car.x - 10, car.y + 25, 60, 30);
    ctx.globalAlpha = 1;

    // Carro
    ctx.drawImage(car.sprite, car.x, car.y, car.width, car.height);
}

// ---------- LOOP PRINCIPAL ----------
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMap();
    updateCar();
    drawCar();
    requestAnimationFrame(loop);
}

loop();
