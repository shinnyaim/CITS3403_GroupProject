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
User logged in check
=================*/

async function checkAuthStatus() {
    const res = await fetch('/api/me');
    const startBtn = document.getElementById('startBtn');
    const authMenuItem = document.getElementById('authMenuItem');

    if (res.ok) {
        authMenuItem.textContent = 'Log out';
        authMenuItem.onclick = () => window.location.href = '/logout';
        startBtn.onclick = () => window.location.href = '/setup';
    } else {
        authMenuItem.textContent = 'Sign Up / Log in';
        authMenuItem.onclick = () => window.location.href = '/auth';
        startBtn.onclick = () => window.location.href = '/auth?next=home';
    }
}

checkAuthStatus();
