const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ====== LOAD IMAGES (CON RUTAS REALES Y .png.png) ======

const car1 = new Image();
car1.src = "assets/cars/car1_up.png.png";

const car2 = new Image();
car2.src = "assets/cars/car2_up.png.png";

const shadow = new Image();
shadow.src = "assets/cars/car_shadow.png.png"; // si no existe, borra esta línea

// Road tiles
const road_horizontal = new Image();
road_horizontal.src = "assets/road/road_horizontal.png.png";

const road_vertical = new Image();
road_vertical.src = "assets/road/road_vertical.png.png";

const road_curve = new Image();
road_curve.src = "assets/road/road_curve.png.png";

const road_T = new Image();
road_T.src = "assets/road/road_T.png.png";

const road_cross = new Image();
road_cross.src = "assets/road/road_cross.png.png";

// Decorations
const tree = new Image();
tree.src = "assets/decoration/tree.png.png";

const rock = new Image();
rock.src = "assets/decoration/rock.png.png";

const border = new Image();
border.src = "assets/decoration/road_border.png.png";

// Explosion (sprite sheet 3×3)
const explosionSheet = new Image();
explosionSheet.src = "assets/effects/explosion.png.png";

let explosionFrame = 0;

// ====== GAME STATE ======

let car1X = 100;
let car1Y = 200;

let car2X = 200;
let car2Y = 50;

function drawExplosion(x, y) {
    const frameSize = 128; // tu sprite debe ser 3x3 cada cuadro igual tamaño
    const col = explosionFrame % 3;
    const row = Math.floor(explosionFrame / 3);

    ctx.drawImage(
        explosionSheet,
        col * frameSize,
        row * frameSize,
        frameSize,
        frameSize,
        x,
        y,
        frameSize,
        frameSize
    );

    explosionFrame++;
    if (explosionFrame > 8) explosionFrame = 0;
}

function drawRoad() {
    ctx.drawImage(road_horizontal, 0, 250, 800, 100);
    ctx.drawImage(road_vertical, 350, 0, 100, 600);
}

function drawCars() {
    ctx.drawImage(car1, car1X, car1Y, 60, 60);
    ctx.drawImage(car2, car2X, car2Y, 60, 60);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawCars();
    drawExplosion(350, 200);

    requestAnimationFrame(loop);
}

loop();
