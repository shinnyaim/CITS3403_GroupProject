const canvas = document.getElementById("cloudCanvas");
const ctx = canvas.getContext("2d");

// --- Resize canvas to full screen ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// --- Cloud object ---
class Cloud {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.6; // keep upper sky area
        this.size = 40 + Math.random() * 80;
        this.speed = 0.3 + Math.random() * 1.2;
        this.opacity = 0.2 + Math.random() * 0.4;
    }

    update() {
        this.x += this.speed;

        // loop cloud when off screen
        if (this.x > canvas.width + 100) {
            this.x = -150;
            this.y = Math.random() * canvas.height * 0.6;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

        // simple pixel-cloud style (stacked circles)
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.3, this.y - 10, this.size * 0.35, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.6, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.3, this.y + 10, this.size * 0.45, 0, Math.PI * 2);

        ctx.fill();
    }
}

// --- Create cloud population ---
const clouds = [];
const CLOUD_COUNT = 25;

for (let i = 0; i < CLOUD_COUNT; i++) {
    clouds.push(new Cloud());
}

// --- Animation loop ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let cloud of clouds) {
        cloud.update();
        cloud.draw();
    }

    requestAnimationFrame(animate);
}

animate();