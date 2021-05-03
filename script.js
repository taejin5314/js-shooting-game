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
    this.deg = rotateSpeed;
  }

  draw() {
    ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    ctx.drawImage(planetImage, 0, 0, this.imageWidth, this.imageHeight, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
  }

  update() {
    ctx.translate(this.x, this.y);
    ctx.rotate((this.deg) * (Math.PI / 180));
    ctx.translate(-this.x, -this.y);
  }
}

// player
class Player {
  constructor() {
  }
}
// projectiles
// asteroid

let planet = new Planet();

function animate() {
  planet.draw();
  planet.update();
  requestAnimationFrame(animate);
}
animate();
