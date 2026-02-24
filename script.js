// ---------- CARGA DE IMÁGENES ----------
const assetsPath = "assets/";

const images = {
    // Carros
    car1_up: new Image(),
    car1_down: new Image(),
    car1_left: new Image(),
    car1_right: new Image(),
    car2_up: new Image(),
    car2_down: new Image(),
    car2_left: new Image(),
    car2_right: new Image(),

    // Sombra
    shadow: new Image(),

    // Carretera
    road_horizontal: new Image(),
    road_vertical: new Image(),
    road_curve: new Image(),
    road_T: new Image(),
    road_cross: new Image(),

    // Explosión
    explosion: new Image()
};

// -------- ASIGNACIÓN DE RUTAS (.png.png) --------

// Carros
images.car1_up.src = assetsPath + "cars/car1_up.png.png";
images.car1_down.src = assetsPath + "cars/car1_down.png.png";
images.car1_left.src = assetsPath + "cars/car1_left.png.png";
images.car1_right.src = assetsPath + "cars/car1_right.png.png";

images.car2_up.src = assetsPath + "cars/car2_up.png.png";
images.car2_down.src = assetsPath + "cars/car2_down.png.png";
images.car2_left.src = assetsPath + "cars/car2_left.png.png";
images.car2_right.src = assetsPath + "cars/car2_right.png.png";

// Sombra
images.shadow.src = assetsPath + "effects/car_shadow.png.png";

// Carretera
images.road_horizontal.src = assetsPath + "road/road_horizontal.png.png";
images.road_vertical.src = assetsPath + "road/road_vertical.png.png";
images.road_curve.src = assetsPath + "road/road_curve.png.png";
images.road_T.src = assetsPath + "road/road_T.png.png";
images.road_cross.src = assetsPath + "road/road_cross.png.png";

// Explosión (spritesheet)
images.explosion.src = assetsPath + "effects/explosion.png.png";


// ---------- CANVAS ----------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ---------- CARRO ----------
let car = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    angle: 0,
    speed: 0,
    maxSpeed: 5,
    accel: 0.15,
    friction: 0.05,
    sprite: images.car1_up
};


// ---------- TECLAS ----------
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);


// ---------- ACTUALIZAR MOVIMIENTO DEL CARRO ----------
function updateCar() {

    // Acelerar
    if (keys["ArrowUp"]) {
        car.speed += car.accel;
        if (car.speed > car.maxSpeed) car.speed = car.maxSpeed;
    }

    // Frenar
    if (keys["ArrowDown"]) {
        car.speed -= car.accel;
        if (car.speed < -car.maxSpeed / 2) car.speed = -car.maxSpeed / 2;
    }

    // Gira izquierda
    if (keys["ArrowLeft"]) {
        car.angle -= 3;
    }

    // Gira derecha
    if (keys["ArrowRight"]) {
        car.angle += 3;
    }

    // Fricción natural
    if (!keys["ArrowUp"] && !keys["ArrowDown"]) {
        if (car.speed > 0) car.speed -= car.friction;
        if (car.speed < 0) car.speed += car.friction;
        if (Math.abs(car.speed) < 0.05) car.speed = 0;
    }

    // Movimiento según ángulo
    const rad = car.angle * Math.PI / 180;
    car.x += Math.cos(rad) * car.speed;
    car.y += Math.sin(rad) * car.speed;
}


// ---------- DIBUJAR CARRO ----------
function drawCar() {

    // Sombra
    ctx.globalAlpha = 0.45;
    ctx.drawImage(images.shadow, car.x - 10, car.y + 25, 60, 30);
    ctx.globalAlpha = 1;

    // Rotación
    ctx.save();
    ctx.translate(car.x + car.width / 2, car.y + car.height / 2);
    ctx.rotate(car.angle * Math.PI / 180);
    ctx.drawImage(car.sprite, -car.width / 2, -car.height / 2, car.width, car.height);
    ctx.restore();
}


// ---------- LOOP PRINCIPAL ----------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateCar();
    drawCar();

    requestAnimationFrame(loop);
}

loop();
