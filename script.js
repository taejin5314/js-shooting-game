const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let deg = 0;
const planets = [];

const planetImage = new Image();
planetImage.src = './planets/planet_07.png';

class Planet {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.imageWidth = 450;
    this.imageHeight = 450;
    this.radius = 150;
    this.deg = 0.5;
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

planets.push(new Planet());

function animate() {
  planets[0].draw();
  planets[0].update();
  requestAnimationFrame(animate);
}
animate();
