const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --------------------------
//   IMÁGENES CON .png.png
// --------------------------
const road = new Image();
road.src = "assets/road_straight.png.png";

const roadCurve = new Image();
roadCurve.src = "assets/road_curve.png.png";

const car1 = new Image();
car1.src = "assets/car_red_right.png.png";

const car2 = new Image();
car2.src = "assets/car_blue_up.png.png";

const shadow = new Image();
shadow.src = "assets/car_shadow.png.png";

// Explosiones (si las usas)
const explosionFrames = [
    "assets/explosion_1.png.png",
    "assets/explosion_2.png.png",
    "assets/explosion_3.png.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// --------------------------
//   JUGADORES
// --------------------------
let p1 = { x: 200, y: 550, w: 80, h: 120 };
let p2 = { x: 200, y: 50,  w: 80, h: 120 };

// --------------------------
//   LOOP DEL JUEGO
// --------------------------
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Carretera base
    ctx.drawImage(road, 0, 0, 500, 700);

    // Sombra
    ctx.drawImage(shadow, p1.x - 5, p1.y + 10, p1.w, p1.h);
    ctx.drawImage(shadow, p2.x - 5, p2.y + 10, p2.w, p2.h);

    // Carros
    ctx.drawImage(car1, p1.x, p1.y, p1.w, p1.h);
    ctx.drawImage(car2, p2.x, p2.y, p2.w, p2.h);

    requestAnimationFrame(loop);
}

loop();
