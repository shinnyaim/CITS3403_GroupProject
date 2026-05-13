/*=================
DOM ELEMENTS
=================*/
const items = document.querySelectorAll('.menu-item');
const selector = document.querySelector('.selector');


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

/*=================
CHARACTER ANIMATION (WALKING IN PLACE)
=================*/

const characterCanvas = document.getElementById('characterCanvas');
const characterCtx = characterCanvas.getContext('2d');

characterCanvas.width = 140;
characterCanvas.height = 160;

const spritesheet = new Image();
spritesheet.src = "/static/sprite1.png";

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const FRAMES_PER_ROW = 4;
const DISPLAY_SIZE = 140;

let characterFrame = 0;
let characterRow = 0;
let lastCharacterFrameTime = 0;
const CHARACTER_ANIMATION_SPEED = 150;

const charX = 700;
const charY = window.innerHeight - 680;

function animateCharacter() {
  const now = Date.now();
  
  characterCanvas.style.position = 'fixed';
  characterCanvas.style.left = charX + 'px';
  characterCanvas.style.top = charY + 'px';
  
  if (now - lastCharacterFrameTime > CHARACTER_ANIMATION_SPEED) {
    lastCharacterFrameTime = now;
    
    if (spritesheet.complete) {
      characterCtx.clearRect(0, 0, characterCanvas.width, characterCanvas.height);
      
      characterCtx.drawImage(
        spritesheet,
        characterFrame * FRAME_WIDTH,
        characterRow * FRAME_HEIGHT,
        FRAME_WIDTH,
        FRAME_HEIGHT,
        14,
        14,
        DISPLAY_SIZE,
        DISPLAY_SIZE
      );
      
      characterFrame = (characterFrame + 1) % FRAMES_PER_ROW;
    }
  }
  
  requestAnimationFrame(animateCharacter);
}

spritesheet.onload = () => {
  console.log('Spritesheet loaded');
  animateCharacter();
};

spritesheet.onerror = () => {
  console.error('Failed to load spritesheet');
};