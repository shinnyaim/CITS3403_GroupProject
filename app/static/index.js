/*=================
DOM ELEMENTS
=================*/

const items = document.querySelectorAll('.menu-item');
const selector = document.querySelector('.selector');

const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');

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
cloudImage.src = "/static/clouds.png";

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
  /*ctx.globalAlpha sets the opacity for everything drawn after this line, ctx.dragImage draws
  the cloud position (x, y) with scaled width and height.
  Resetting globalAlpha back to 1 is important, without this subsequent draw call would also be 
  transparent. */
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
CREATE CLOUDS; creates an array of 8 Cloud instances
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

updateSelector();

/*=================
KEYBOARD CONTROLS
=================*/

document.addEventListener('keydown', (e) => {
 // Don't navigate menu if a modal is open
  if ($('.modal.show').length) {
    if (e.key === 'Escape') {
      $('.modal.show').modal('hide');
    }
    return;
  }
  // The % items.length wraps arround, if on last item 
  // index 3, and press down, (3 + 1) % 4 = 0,
  // jumping back to the first item.
  if (e.key === 'ArrowDown') {
    currentIndex = (currentIndex + 1) % items.length;
    updateSelector();
  }

  if (e.key === 'ArrowUp') {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateSelector();
  }
  // On enter, reads the data-target attribute of currently
  // selected item, and if it has one #gamelogModa,
  // calls Bootstrap's .modal('show') to open the modal.
  if (e.key === 'Enter') {
    const selected = items[currentIndex];
    const modalTarget = selected.getAttribute('data-target');
    if (modalTarget) {
      $(modalTarget).modal('show');
    }
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