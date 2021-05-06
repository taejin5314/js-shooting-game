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
let gameOver = false;
let score = 0;
let frame = 0;
let asteriodsInterval = Math.floor(Math.random() * 50) + 20;;

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
    this.size = 30;
    this.posX = canvas.width / 2 + (radius + player.height / 3 * 2) * Math.sin(this.angle);
    this.posY = canvas.height / 2 - (radius + player.height / 3 * 2) * Math.cos(this.angle);
  }
  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(projectileImage, 0, 32, 32, 32, this.x + this.size / 3, this.y, this.size, this.size)
    ctx.restore();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.posX - 15, this.posY - 15, this.size, this.size)
  }
  update() {
    this.y -= this.speed;
    this.posX += this.speed * Math.sin(this.angle);
    this.posY -= this.speed * Math.cos(this.angle);
  }
}

// asteroid
class Asteroid {
  constructor() {
    this.image = new Image();
    this.image.src = `./asteroid${Math.floor(Math.random() * 6 + 1)}.png`
    this.spriteWidth = 322;
    this.spriteHeight = 242;
    this.spritePosition = 0;
    this.gap = 40;
    this.angle = (Math.random() * 360) / 180 * Math.PI;
    // this.angle = Math.PI / 2 * 3;
    this.x = 0;
    this.y = -canvas.height;
    this.speed = (Math.random() * 1.5) + 0.5;
    // this.speed = 10;
    this.size = (Math.random() * 50) + 100;
    this.posX = canvas.width / 2 - this.y * Math.sin(this.angle);
    this.posY = canvas.height / 2 + this.y * Math.cos(this.angle);
  }
  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);
    // ctx.fillStyle = 'blue';
    // ctx.fillRect(-this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.drawImage(this.image, this.spritePosition * this.spriteWidth + this.gap * this.spriteWidth / this.spriteHeight, this.gap, this.spriteWidth - this.gap * this.spriteWidth / this.spriteHeight * 2, this.spriteHeight - this.gap * 2, -this.size / 2, this.y - this.size / 2 * 0.8, this.size, this.size * 0.8)
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.restore();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.posX - this.size / 2, this.posY - this.size / 2, this.size, this.size)
  }
  update() {
    if (!gameOver) {
      this.y += this.speed;
      this.posX -= this.speed * Math.sin(this.angle);
      this.posY += this.speed * Math.cos(this.angle);
      if (frame % 3 === 0) {
        this.spritePosition++;
        if (this.spritePosition > 15) this.spritePosition = 0;
      }
    }
  }
}

function handleGameStatus() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Orbitron';
  if (btnPressed && !gameOver) ctx.fillText(score, canvas.width / 2 - 18, canvas.height / 2 + 10)
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black';
    ctx.font = '90px Orbitron';
    ctx.fillText('GAME OVER', canvas.width / 2 - 300, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.font = '40px Orbitron';
    ctx.fillText('Score: ' + score, canvas.width / 2 - 290, canvas.height / 2 + 50)
  }
}

function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].draw();
    projectiles[i].update();
    // console.log(projectiles[i].posX, projectiles[i].posY)
    for (let j = 0; j < asteroid.length; j++) {
      if (!gameOver && projectiles[i] && asteroid[j] && collision(projectiles[i], asteroid[j])) {
        score++;
        asteroid.splice(j, 1);
        projectiles.splice(i, 1);
        j--;
        i--;
      }
    }
    if (projectiles[i] && projectiles[i].y < -canvas.height * 1.5) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  planet.draw();
  startBtn.draw();
  let player = new Player(mouse.x, mouse.y);
  player.draw();
  handleProjectiles();
  if (btnPressed && frame % asteriodsInterval === 0) {
    asteroid.push(new Asteroid());
    asteriodsInterval = Math.floor(Math.random() * 50) + 20;
  }
  for (let j = 0; j < asteroid.length; j++) {
    if (asteroid[j]) {
      asteroid[j].draw();
      asteroid[j].update();
    }
    // console.log(asteroid[j].posX, asteroid[j].posY)
    if (asteroid[j].y + asteroid[j].size / 2 > -radius + 20) {
      gameOver = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  handleGameStatus();
  requestAnimationFrame(animate);
  frame++;
}
animate();

// collision detecting function
function collision(first, second) {
  if (first && second && !(first.posX >= second.posX + second.size ||
    first.posX + first.size <= second.posX ||
    first.posY >= second.posY + second.size ||
    first.posY + first.size <= second.posY)
  ) {
    return true;
  }
}