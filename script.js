const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const rotateSpeed = 0.1;
const radius = 150;

const planetImage = new Image();
planetImage.src = './planets/planet_07.png';

const spaceshipImage = new Image();
spaceshipImage.src = './spaceship.png';

// planet
class Planet {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.imageWidth = 450;
    this.imageHeight = 450;
    this.radius = radius;
    this.deg = 0;
  }

  // draw rotating planet.
  draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(this.x, this.y);
    ctx.rotate((this.deg += rotateSpeed) * (Math.PI / 180));
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(planetImage, 0, 0, this.imageWidth, this.imageHeight, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    ctx.restore();
  }
}

// mouse position
const mouse = {
  x: undefined,
  y: undefined
}


// player
class Player {
  constructor(x, y) {
    // distance from the center of planet and player
    this.playerDistance = 0;
    this.playerAngle = Math.atan2((x - canvas.width / 2), -(y - canvas.height / 2)) - Math.PI / 2;
    // this.angle = Math.atan((y - canvas.height / 2) / (x - canvas.width / 2));
    this.x = (radius + this.playerDistance) * Math.cos(this.playerAngle) + (canvas.width / 2);
    this.y = (radius + this.playerDistance) * Math.sin(this.playerAngle) + (canvas.height / 2);
    this.imageWidth = 343;
    this.imageHeight = 383;
  }

  draw() {
    ctx.drawImage(spaceshipImage, 0, 0, this.imageWidth, this.imageHeight, this.x, this.y, 80, 100);
  }
  update() {
  }
}

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
})

// projectiles
// asteroid

let planet = new Planet();

function animate() {
  planet.draw();
  let player = new Player(mouse.x, mouse.y);
  player.draw();
  player.update();
  requestAnimationFrame(animate);
}
animate();
