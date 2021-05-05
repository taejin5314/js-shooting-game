const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const rotateSpeed = 0.1;
const radius = 100;
const projectiles = [];
const asteroid = [];

let player = {
  x: undefined,
  y: undefined,
  width: 60,
  height: 75,
  angle: undefined
};
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
  console.log(mouse.x, mouse.y);
  // if the game is started, and the player clicked, add the projectile to the array
  if (gameStart) {
    projectiles.push(new Projectile(mouse.x, mouse.y));
  }
  // if the cursor clicked the start button
  if (!gameStart && mouse.x > canvas.width / 2 - 40 && mouse.x < canvas.width / 2 + 40 && mouse.y > canvas.height / 2 - 16 && mouse.y < canvas.height / 2 + 16) {
    gameStart = true;
    btnPressed = true;
    document.getElementById('canvas').classList.add('playing');
    // add random asteroids
    for (let i = 0; i < 1; i++) {
      asteroid.push(new Asteroid())
    }
  }
})

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
  // if the cursor is on the start button
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
      ctx.drawImage(spaceshipImage, 0, 0, this.imageWidth, this.imageHeight, -player.width / 2, -player.height * 4 / 5 - radius, player.width, player.height);
    } else {
      ctx.rotate(0);
      ctx.drawImage(spaceshipImage, 0, 0, this.imageWidth, this.imageHeight, -player.width / 2, -player.height * 4 / 5 - radius, player.width, player.height);
    }
    player.angle = this.playerAngle;
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

const projectileImage = new Image();
projectileImage.src = './projectile.png'
// projectiles
class Projectile {
  constructor(x, y) {
    this.x = -25;
    this.y = -100 - radius;
    this.angle = player.angle;
    this.speed = 20;
    this.posX = canvas.width / 2 + (radius + player.height / 3 * 2) * Math.sin(this.angle);
    this.posY = canvas.height / 2 + (radius + player.height / 3 * 2) * Math.cos(this.angle);
  }
  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(projectileImage, 0, 32, 32, 32, this.x, this.y, 50, 50)
    ctx.restore();
  }
  update() {
    this.y -= this.speed;
    this.posX += this.speed * Math.sin(this.angle);
    this.posY += this.speed * Math.cos(this.angle);
  }
}


// asteroid
class Asteroid {
  constructor() {
    this.angle = (Math.random() * 360) / 180 * Math.PI;
    // this.angle = Math.PI / 2;
    this.y = -canvas.height / 2;
    this.speed = (Math.random() * 2) + 0.5;
    this.size = (Math.random() * 50) + 25;
  }
  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.fillStyle = 'blue';
    ctx.fillRect(canvas.width / 2 - this.size / 2, this.y, this.size, this.size);
    ctx.restore();
    console.log(this.angle * 180 / Math.PI)
  }
  update() {
    this.y += this.speed;
  }
}

function animate() {
  planet.draw();
  startBtn.draw();
  let player = new Player(mouse.x, mouse.y);
  player.draw();
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].draw();
    projectiles[i].update();
    // console.log(projectiles[i].posX, projectiles[i].posY, projectiles[i].angle / Math.PI * 180);
    if (projectiles[i] && projectiles[i].y < -canvas.height * 1.5) {
      projectiles.splice(i, 1);
      i--;
    }
  }
  for (let j = 0; j < asteroid.length; j++) {
    asteroid[j].draw();
    asteroid[j].update();

  }
  requestAnimationFrame(animate);
}
animate();

// collision detecting function
function collision(first, second) {
  if (!(first.x >= second.x + second.width ||
    first.x + first.width <= second.x ||
    first.y >= second.y + second.height ||
    first.y + first.height <= second.y)
  ) {
    return true;
  }
}