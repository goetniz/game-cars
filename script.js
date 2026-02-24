
const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

// LOAD IMAGES
const car1_up=new Image(); car1_up.src="assets/cars/car1_up.png";
const car1_shadow=new Image(); car1_shadow.src="assets/cars/car1_shadow.png";

const road_horizontal=new Image(); road_horizontal.src="assets/road/road_horizontal.png";

const explosionImage=new Image();
explosionImage.src="assets/effects/explosion.png";

// EXPLOSION VARS
const framesPerRow=3;
const framesPerCol=3;
const totalFrames=9;
let frameWidth,frameHeight;
let currentFrame=0,frameDelay=4,frameCounter=0;

// CAR POSITION
let carX=350;
let carY=400;

function drawCar(){
    // shadow
    ctx.globalAlpha=0.4;
    ctx.drawImage(car1_shadow, carX-10, carY+15, 80, 40);
    ctx.globalAlpha=1;

    // car
    ctx.drawImage(car1_up, carX, carY, 60, 100);
}

function drawRoad(){
    for(let i=0;i<5;i++){
        ctx.drawImage(road_horizontal,0, i*120, 800,120);
    }
}

// EXPLOSION ANIM
function startExplosion(x,y){
    frameWidth=explosionImage.width/framesPerRow;
    frameHeight=explosionImage.height/framesPerCol;
    currentFrame=0;
    animateExplosion(x,y);
}

function animateExplosion(x,y){
    frameCounter++;
    if(frameCounter>=frameDelay){
        currentFrame++;
        frameCounter=0;
    }
    if(currentFrame>=totalFrames){ return; }

    const col=currentFrame%framesPerRow;
    const row=Math.floor(currentFrame/framesPerRow);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawRoad();
    drawCar();

    ctx.drawImage(
        explosionImage,
        col*frameWidth,row*frameHeight,
        frameWidth,frameHeight,
        x,y,
        frameWidth,frameHeight
    );

    requestAnimationFrame(()=>animateExplosion(x,y));
}

// MAIN LOOP
function loop(){
    ctx.clearRect(0,0,800,600);
    drawRoad();
    drawCar();
    requestAnimationFrame(loop);
}
loop();

// TEST EXPLOSION
explosionImage.onload=()=>setTimeout(()=>startExplosion(carX,carY-30),1500);
