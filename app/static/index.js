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
GAME LOG MODAL
=================*/

$('#gamelogModal').on('show.bs.modal', async () => {
    const tbody = document.getElementById('gamelogBody');
    tbody.innerHTML = '';

    const res = await fetch('/api/sessions/get');
    if (!res.ok) {
        tbody.innerHTML = '<tr><td colspan="6">Log in to see your game history.</td></tr>';
        return;
    }

    const sessions = await res.json();
    if (sessions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No previous games found.</td></tr>';
        return;
    }

    sessions.forEach(session => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.group_name}</td>
            <td>${new Date(session.started_at).toLocaleDateString('en-AU')}</td>
            <td>${session.days}</td>
            <td>${session.morale}%</td>
            <td>${session.progress}%</td>
            <td>${session.status === 'in_progress' ? `<button onclick="resumeSession(${session.id})">Resume</button>` : session.overall_score + '%'}</td>
        `;
        tbody.appendChild(row);
    });
});


async function resumeSession(sessionId) {
    const res = await fetch(`/api/session/resume/${sessionId}`);
    const data = await res.json();

    sessionStorage.setItem('session_id', data.session_id);
    sessionStorage.setItem('groupName', data.group_name);
    sessionStorage.setItem('teammates', JSON.stringify(data.teammates));
    sessionStorage.setItem('seenCardIds', data.seen_event_ids);
    sessionStorage.setItem('Morale', data.morale);
    sessionStorage.setItem('Progress', data.progress);
    sessionStorage.setItem('Day', data.day);

    window.location.href = '/game';
}

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
