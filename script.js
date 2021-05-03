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
    this.color = 'white';
    this.shadowBlur = 100;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowColor = '#999';
    this.deg = 0.1;
  }

  draw() {
    ctx.fillStyle = this.color;
    // ctx.shadowBlur = this.shadowBlur;
    // ctx.shadowOffsetX = this.shadowOffsetX;
    // ctx.shadowOffsetY = this.shadowOffsetY;
    // ctx.shadowColor = this.shadowColor;
    ctx.translate(this.x, this.y);
    ctx.save();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(planetImage, 0, 0, 450, 450, this.x - 100, this.y - 100, 200, 200);
    ctx.restore();
  }

  update() {
    ctx.rotate((this.deg) * (Math.PI / 180));
    ctx.restore();
  }
}

planets.push(new Planet());

function animate() {
  planets[0].draw();
  planets[0].update();
  requestAnimationFrame(animate);
}
animate();
