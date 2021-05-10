const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const rotateSpeed = 0.1;
const radius = 100;
const projectiles = [];
const asteroid = [];
const booms = [];

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
let laser;
let laserToggle = false;
let asteriodsInterval = Math.floor(Math.random() * 50) + 20;;
let level = 1;

const planetImage = new Image();
planetImage.src = './planets/planet_07.png';

const spaceshipImage = new Image();
spaceshipImage.src = './spaceship.png';

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

window.addEventListener('mousedown', function (e) {
  if (gameStart && level > 1) laserToggle = true;

})

window.addEventListener('mouseup', function (e) {
  if (gameStart && level > 1) laserToggle = false;

})

window.addEventListener('click', function (e) {
  // console.log(mouse.x, mouse.y);
  // if the game is started, and the player clicked, add the projectile to the array
  if (gameStart && level === 1) {
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
  if (gameStart && level > 1 && laserToggle) laser = new LaserBeam(mouse.x, mouse.y);
  else if (gameStart && !laserToggle) laser = undefined;
  // if (btnPressed && !gameOver) console.log(Math.PI * 2 + player.angle)
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
    this.width = 30;
    this.height = 30;
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

// Laser Beam
class LaserBeam {
  constructor(x, y) {
    this.x = -25;
    this.y = -100 - radius;
    this.angle = player.angle;
    this.size = 30;
    this.width = 30;
    this.height = canvas.height;
    this.posX = canvas.width / 2 + (radius + player.height / 3 * 2) * Math.sin(this.angle);
    this.posY = canvas.height / 2 - (radius + player.height / 3 * 2) * Math.cos(this.angle);
  }
  draw() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x + this.size / 3, this.y + this.size * 1.3, this.size, -canvas.height)
    // ctx.drawImage(projectileImage, 0, 32, 32, 32, this.x + this.size / 3, this.y, this.size, this.size)
    ctx.restore();
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
    this.width = this.size;
    this.height = this.size;
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
      if (frame % 4 === 0) {
        this.spritePosition++;
        if (this.spritePosition > 15) this.spritePosition = 0;
      }
    }
  }
}

function handleGameStatus() {
  ctx.fillStyle = 'black';
  ctx.font = '40px Orbitron';
  if (score > 1) level = 2;
  if (btnPressed && !gameOver) {
    ctx.fillText(score, canvas.width / 2 - score.toString().length * 15, canvas.height / 2 + 15)
    ctx.fillStyle = 'white';
    ctx.fillText('Level: ' + level, 20, 40)
  }
  if (gameOver) {
    document.getElementById('canvas').classList.remove('playing')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'black';
    ctx.font = '90px Orbitron';
    ctx.fillText('GAME OVER', canvas.width / 2 - 300, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.font = '40px Orbitron';
    ctx.fillText('Score: ' + score + '  Level: ' + level, canvas.width / 2 - 290, canvas.height / 2 + 50)
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
        booms.push(new Boom(asteroid[j].posX, asteroid[j].posY, asteroid[j].size * 1.5))
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

function handleLaser() {
  if (laser) laser.draw();
  for (let i = 0; i < asteroid.length; i++) {
    if (!gameOver && laser && asteroid[i] && (player.angle.toFixed(1) === asteroid[i].angle.toFixed(1) || (Math.PI * 2 + player.angle).toFixed(1) === asteroid[i].angle.toFixed(1))) {
      score++;
      booms.push(new Boom(asteroid[i].posX, asteroid[i].posY, asteroid[i].size * 1.5))
      asteroid.splice(i, 1);
      i--;
    }
  }
}

// explosion effect
class Boom {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = `./explosion${Math.floor(Math.random() * 3) + 1}.png`;
    this.x = x;
    this.y = y;
    this.size = size;
    this.spriteWidth = 256;
    this.spriteHeight = 256;
    this.spriteX = 0;
    this.spriteY = 0;
  }

  draw() {
    ctx.drawImage(this.image, this.spriteX * this.spriteWidth, this.spriteY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    if (frame % 4 === 0) {
      this.spriteX++;
      if (this.spriteX % 4 === 0) {
        this.spriteX -= 4;
        this.spriteY++;
      }
    }
  }
}

function animate() {
  planet.draw();
  startBtn.draw();
  let player = new Player(mouse.x, mouse.y);
  player.draw();
  if (level === 1) handleProjectiles();
  else if (level > 1) handleLaser();
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
  if (booms) {
    for (let i = 0; i < booms.length; i++) {
      if (booms[i].spriteY < 4) booms[i].draw();
      else {
        booms.splice(i, 1);
        i--;
      }
    }
  }
  requestAnimationFrame(animate);
  frame++;
}
animate();

// collision detecting function
function collision(first, second) {
  if (first && second && !(first.posX >= second.posX + second.width ||
    first.posX + first.width <= second.posX ||
    first.posY >= second.posY + second.height ||
    first.posY + first.height <= second.posY)
  ) {
    return true;
  }
}