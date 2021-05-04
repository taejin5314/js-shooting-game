const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const rotateSpeed = 0.1;
const radius = 150;
let gameStart = false;
let btnPressed = false;
let btnHover = false;

const planetImage = new Image();
planetImage.src = './planets/planet_07.png';

const spaceshipImage = new Image();
spaceshipImage.src = './spaceship.png';

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

window.addEventListener('click', function (e) {
  if (!gameStart && mouse.x > canvas.width / 2 - 40 && mouse.x < canvas.width / 2 + 40 && mouse.y > canvas.height / 2 - 16 && mouse.y < canvas.height / 2 + 16) {
    gameStart = true;
    btnPressed = true;
  }
})

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
  if (!gameStart && mouse.x > canvas.width / 2 - 40 && mouse.x < canvas.width / 2 + 40 && mouse.y > canvas.height / 2 - 16 && mouse.y < canvas.height / 2 + 16) btnHover = true;
  else btnHover = false;
})

// planet
class Planet {
  constructor() {
    this.imageWidth = 450;
    this.imageHeight = 450;
    this.radius = radius;
    this.deg = 0;
  }

  // draw rotating planet.
  draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.deg += rotateSpeed) * (Math.PI / 180));
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(planetImage, 0, 0, this.imageWidth, this.imageHeight, canvas.width / 2 - this.radius, canvas.height / 2 - this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }
}
let planet = new Planet();

// mouse position
const mouse = {
  x: undefined,
  y: undefined
}

// player
class Player {
  constructor(x, y) {
    // distance from the center of planet and player
    this.playerDistance = 30;
    this.playerAngle = Math.atan2((x - canvas.width / 2), -(y - canvas.height / 2));
    this.imageWidth = 343;
    this.imageHeight = 383;
  }

  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (gameStart) {
      ctx.rotate(this.playerAngle);
      ctx.drawImage(spaceshipImage, 0, 0, this.imageWidth, this.imageHeight, -40, -80 - radius, 80, 100);
    } else {
      ctx.rotate(0);
      ctx.drawImage(spaceshipImage, 0, 0, this.imageWidth, this.imageHeight, -40, -80 - radius, 80, 100);
    }
    ctx.restore();
  }
}

const startBtnImage = {
  default: new Image(),
  hover: new Image()
}
startBtnImage.default.src = './play.png';
startBtnImage.hover.src = './play-pressed.png';
// start button
class StartBtn {
  constructor() {
    this.radius = 50;
  }
  draw() {
    if (!btnPressed) {
      if (btnHover) ctx.drawImage(startBtnImage.hover, 0, 0, 49, 20, canvas.width / 2 - 40, canvas.height / 2 - 16, 80, 32)
      else ctx.drawImage(startBtnImage.default, 0, 0, 49, 20, canvas.width / 2 - 40, canvas.height / 2 - 16, 80, 32)
    }
  }
}
let startBtn = new StartBtn();


// projectiles
class Projectile {
  constructor() {

  }
}
// asteroid


function animate() {
  planet.draw();
  startBtn.draw();
  let player = new Player(mouse.x, mouse.y);
  player.draw();
  requestAnimationFrame(animate);
}
animate();