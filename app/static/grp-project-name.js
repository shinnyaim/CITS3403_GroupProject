/*=================
CLOUDS ANIMATION
===================*/

const canvas = document.getElementById("cloudCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Cloud {
  constructor() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.speed = 0.2 + Math.random() * 0.5;

  // Create multiple puffs per cloud
  this.puffs = [];
  const puffCount = 3 + Math.floor(Math.random() * 4); // 3–6 circles

  for (let i = 0; i < puffCount; i++) {
    this.puffs.push({
      offsetX: Math.random() * 60,
      offsetY: Math.random() * 20,
      radius: 20 + Math.random() * 30
    });
  }
}
  draw() {
  ctx.fillStyle = 'rgba(255,255,255,0.3)';

  this.puffs.forEach(puff => {
    ctx.beginPath();
    ctx.arc(
      this.x + puff.offsetX,
      this.y + puff.offsetY,
      puff.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });
}
  update() {
    this.x += this.speed;
    if (this.x > canvas.width + 100) this.x = -100;
    this.draw();
  }
}

const clouds = Array.from({ length: 10 }, () => new Cloud());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clouds.forEach(cloud => cloud.update());
  requestAnimationFrame(animate);
}

animate();

const groupNameForm = document.getElementById("groupNameForm");

groupNameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const groupNameInput = document.getElementById("grpName");
  const groupName = groupNameInput.value.trim() || "BOBBERS";

  sessionStorage.setItem("groupName", groupName);
  window.location.href = "/loading";
});
