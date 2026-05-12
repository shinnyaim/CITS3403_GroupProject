const canvas = document.getElementById("cloudCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const cloudImage = new Image();
  cloudImage.src = "static/clouds.png";

  class Cloud {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * (canvas.height / 2);
      this.speed = 0.2 + Math.random() * 0.6;
      this.scale = 0.5 + Math.random();
      this.alpha = 0.3 + Math.random() * 0.4;
    }
  
 
    update() {
      this.x += this.speed;
      if (this.x > canvas.width + 200) {
        this.x = -200;
        this.y = Math.random() * (canvas.height / 2);
      }
    }
 
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(
        cloudImage,
        this.x,
        this.y,
        200 * this.scale,
        120 * this.scale
      );
      ctx.globalAlpha = 1;
    }
  }

  /*Creates an array of 8 clouds with random properties. 
  The animate function clears the canvas, updates and 
  redraws each cloud, and then requests the next animation frame. 
  The animation starts once the cloud image has loaded to ensure it 
  renders correctly. */
  const clouds = Array.from({ length: 8 }, () => new Cloud());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clouds.forEach(cloud => {
      cloud.update();
      cloud.draw();
    });

    requestAnimationFrame(animate);
  }

  cloudImage.onload = () => {
  animate();
  };
}