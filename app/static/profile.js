/* =================
PLAYER DATA (DEV FALLBACK)
================= */
let playerData = {
  username: 'BOB',
  group: 'BOBBERS',
  avatar: 'sprite3',
  rank: 'DEADLINE DODGER',
  stats: {
    gamesPlayed: 24,
    bestGrade: 'HD',
    avgMorale: 82,
    fastestDays: 9
  },
  currentRun: {
    morale: 58,
    progress: 72,
    daysLeft: 8
  }
};

/* =================
INIT
================= */
document.addEventListener('DOMContentLoaded', () => {
  initializeProfile();
});

function initializeProfile() {
  loadPlayerData();
  setupAvatarContainer();
  updateBars();
  preloadAvatars();
}

/* =================
LOAD PROFILE DATA
================= */
function loadPlayerData() {
  updatePlayerDisplay();
  updateStatsDisplay();
}

/* =================
UI UPDATES
================= */
function updatePlayerDisplay() {
  const nameDisplay = document.getElementById('playerNameDisplay');
  const groupDisplay = document.getElementById('groupDisplay');
  const rankDisplay = document.getElementById('rankDisplay');
  const mainAvatar = document.querySelector('.mainAvatar');

  if (nameDisplay) nameDisplay.textContent = `PLAYER: ${playerData.username.toUpperCase()}`;
  if (groupDisplay) groupDisplay.textContent = `GROUP: ${playerData.group.toUpperCase()}`;
  if (rankDisplay) rankDisplay.textContent = playerData.rank;

  if (mainAvatar) {
    mainAvatar.src = `/static/avatars/${playerData.avatar}.png`;
  }
}

function updateStatsDisplay() {
  const gamesDisplay = document.getElementById('gamesPlayedCount');
  const gradeDisplay = document.getElementById('bestGradeDisplay');
  const moraleDisplay = document.getElementById('avgMoraleDisplay');
  const daysDisplay = document.getElementById('fastestDaysDisplay');

  if (gamesDisplay) gamesDisplay.textContent = playerData.stats.gamesPlayed;
  if (gradeDisplay) gradeDisplay.textContent = playerData.stats.bestGrade;
  if (moraleDisplay) moraleDisplay.textContent = playerData.stats.avgMorale + '%';
  if (daysDisplay) daysDisplay.textContent = `DAY ${playerData.stats.fastestDays}`;
}

/* =================
PROGRESS BARS
================= */
function updateBars() {
  const run = playerData.currentRun;

  const moraleBar = document.getElementById('moraleBar');
  const progressBar = document.getElementById('progressBar');
  const daysBar = document.getElementById('daysBar');

  const moraleText = document.getElementById('moraleText');
  const progressText = document.getElementById('progressText');
  const daysText = document.getElementById('daysText');

  if (moraleBar) moraleBar.style.width = run.morale + '%';
  if (progressBar) progressBar.style.width = run.progress + '%';
  if (daysBar) daysBar.style.width = (run.daysLeft / 14) * 100 + '%';

  if (moraleText) moraleText.textContent = run.morale + '%';
  if (progressText) progressText.textContent = run.progress + '%';
  if (daysText) daysText.textContent = `${run.daysLeft} / 14`;
}

/* =================
AVATAR MODAL
================= */
function setupAvatarContainer() {
  const avatarContainer = document.getElementById('avatarContainer');

  if (avatarContainer) {
    avatarContainer.addEventListener('click', openAvatarModal);
  }
}

function openAvatarModal() {
  $('#avatarModal').modal('show');
}

/* =================
GAME LOG MODAL (ONLY SYSTEM USED)
================= */
$('#gamelogModal').on('show.bs.modal', async () => {
  const tbody = document.getElementById('gamelogBody');
  tbody.innerHTML = '';

  try {
    const res = await fetch('/api/sessions/get');

    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="6">Log in to see your game history.</td></tr>';
      return;
    }

    const sessions = await res.json();

    if (!sessions.length) {
      tbody.innerHTML = '<tr><td colspan="6">No previous games found.</td></tr>';
      return;
    }

    sessions.forEach(session => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${session.group_name}</td>
        <td>${new Date(session.started_at).toLocaleDateString('en-AU')}</td>
        <td>${session.currentDay}</td>
        <td>${session.morale}%</td>
        <td>${session.progress}%</td>
        <td>
          ${
            session.status === 'in_progress'
              ? `<button class="btn btn-sm btn-success" onclick="resumeSession(${session.session_id})">Resume</button>`
              : session.overall_score + '%'
          }
        </td>
      `;

      tbody.appendChild(row);
    });

  } catch (err) {
    console.error('Game log error:', err);
    tbody.innerHTML = '<tr><td colspan="6">Error loading game log.</td></tr>';
  }
});

/* =================
RESUME SESSION
================= */
async function resumeSession(sessionId) {
  const res = await fetch(`/api/session/resume/${sessionId}`);
  const data = await res.json();

  sessionStorage.setItem('session_id', data.session_id);
  sessionStorage.setItem('groupName', data.group_name);
  sessionStorage.setItem('currentDay', data.currentDay);
  sessionStorage.setItem('morale', data.morale);
  sessionStorage.setItem('progress', data.progress);

  window.location.href = '/game';
}

/* =================
UTILS
================= */
function preloadAvatars() {
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/avatars/sprite${i}.png`;
  }
}