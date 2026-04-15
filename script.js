/*=================
DOM ELEMENTS
=================*/

const items = document.querySelectorAll('.menu-item');
const selector = document.querySelector('.selector');

const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');

/*=================
MODAL SYSTEM
=================*/

// Open modal
document.querySelectorAll('[data-modal]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const modalId = trigger.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
  });
});

// Close modal
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    if (modal) modal.classList.remove('show');
  });
});

/*=================
CANVAS SETUP
=================*/

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/*=================
CLOUD SPRITES
=================*/

// Load cloud image
const cloudImage = new Image();
cloudImage.src = "clouds.png";

/*=================
CLOUD CLASS
=================*/

class Cloud {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * (canvas.height / 2);
    this.speed = 0.2 + Math.random() * 0.6;
    this.scale = 0.5 + Math.random() * 1;
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

/*=================
CREATE CLOUDS
=================*/

const clouds = Array.from({ length: 8 }, () => new Cloud());

/*=================
ANIMATION LOOP
=================*/

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  clouds.forEach(cloud => {
    cloud.update();
    cloud.draw();
  });

  requestAnimationFrame(animate);
}

// Start animation only after image loads
cloudImage.onload = () => {
  animate();
};

/*=================
MENU NAVIGATION
=================*/

let currentIndex = 0;

function updateSelector() {
  const item = items[currentIndex];

  selector.style.top = item.offsetTop + 'px';

  items.forEach(i => i.classList.remove('active'));
  item.classList.add('active');
}

// Initial position
updateSelector();

/*=================
KEYBOARD CONTROLS
=================*/

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    currentIndex = (currentIndex + 1) % items.length;
    updateSelector();
  }

  if (e.key === 'ArrowUp') {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSelector();
  }

  if (e.key === 'Enter') {
    const selected = items[currentIndex];
    const modalId = selected.getAttribute('data-modal');

    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('show');
    }
  }

  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('show');
    });
  }
});

/*=================
MOUSE HOVER SUPPORT
=================*/

items.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    currentIndex = index;
    updateSelector();
  });
});