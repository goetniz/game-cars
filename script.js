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

    // Sombra del carro
    shadow: new Image(),

    // Carreteras
    road_horizontal: new Image(),
    road_vertical: new Image(),
    road_curve: new Image(),
    road_T: new Image(),
    road_cross: new Image(),

    // Efecto de explosión
    explosion: new Image()
};

// -------- ASIGNACIÓN DE RUTAS (.png.png) --------
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

// Carreteras
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

// Posición inicial del carro 1
let car = {
    x: 200,
    y: 200,
    angle: 0,
    speed: 2,
    sprite: images.car1_up
};


// ---------- LOOP PRINCIPAL ----------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ---- DIBUJAR SOMBRA PRIMERO ----
    ctx.globalAlpha = 0.45; // transparencia de la sombra
    ctx.drawImage(images.shadow, car.x - 5, car.y + 20, 50, 25);
    ctx.globalAlpha = 1.0; // reset

    // ---- DIBUJAR CARRO ----
    ctx.drawImage(car.sprite, car.x, car.y, 50, 50);

    requestAnimationFrame(loop);
}

loop();
