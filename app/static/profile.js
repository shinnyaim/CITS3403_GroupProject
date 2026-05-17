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
  loadProfileData();
  setupAvatarContainer();
  preloadAvatars();
}

/* =================
LOAD PROFILE DATA FROM API
================= */
async function loadProfileData() {
  try {
    const res = await fetch('/api/user/profile')

    if (!res.ok) {
      console.error('Failed to load profile');
      return;
    }

    const profileData = await res.json();
    updatePlayerDisplay(profileData);
    updateStatsDisplay(profileData.stats);

    if (profileData.bestRun) {
      updateBestRunDisplay(profileData.bestRun);
    } else {
      displayNoBestRun();
    }
  } catch (err) {
    console.error('Profile loading error:', err);
  }
}

/* =================
UI UPDATES
================= */
function updatePlayerDisplay(profileData) {
  const nameDisplay = document.getElementById('playerNameDisplay');
  const groupDisplay = document.getElementById('groupDisplay');
  const rankDisplay = document.getElementById('rankDisplay');
  const mainAvatar = document.querySelector('.mainAvatar');
 
  if (nameDisplay) nameDisplay.textContent = `PLAYER: ${profileData.username.toUpperCase()}`;
  
  // Show "No run yet" if no best run
  if (profileData.bestRun) {
    if (groupDisplay) groupDisplay.textContent = `GROUP: ${profileData.bestRun.groupName.toUpperCase()}`;
  } else {
    if (groupDisplay) groupDisplay.textContent = `GROUP: NONE YET`;
  }
  
  if (rankDisplay) rankDisplay.textContent = profileData.rank || 'NOVICE';
 
  if (mainAvatar) {
    mainAvatar.src = `/static/avatars/${profileData.avatar}.png`;
  }
}

function updateStatsDisplay(stats) {
  const gamesDisplay = document.getElementById('gamesPlayedCount');
  const gradeDisplay = document.getElementById('bestGradeDisplay');
  const moraleDisplay = document.getElementById('avgMoraleDisplay');
  const daysDisplay = document.getElementById('fastestDaysDisplay');
 
  if (gamesDisplay) gamesDisplay.textContent = stats.gamesPlayed;
  if (gradeDisplay) gradeDisplay.textContent = stats.bestGrade;
  if (moraleDisplay) moraleDisplay.textContent = stats.avgMorale + '%';
  if (daysDisplay) daysDisplay.textContent = `DAY ${stats.fastestDays}`;
}

/* =================
PROGRESS BARS
================= */
function updateBestRunDisplay(bestRun) {
  const moraleBar = document.getElementById('moraleBar');
  const progressBar = document.getElementById('progressBar');
  const daysBar = document.getElementById('daysBar');
 
  const moraleText = document.getElementById('moraleText');
  const progressText = document.getElementById('progressText');
  const daysText = document.getElementById('daysText');
 
  // Update bars
  if (moraleBar) moraleBar.style.width = bestRun.morale + '%';
  if (progressBar) progressBar.style.width = bestRun.progress + '%';
  if (daysBar) daysBar.style.width = (bestRun.daysLeft / 14) * 100 + '%';
 
  // Update text
  if (moraleText) moraleText.textContent = bestRun.morale + '%';
  if (progressText) progressText.textContent = bestRun.progress + '%';
  if (daysText) daysText.textContent = `${bestRun.daysLeft} / 14`;
}

function displayNoBestRun() {
  const cardTitle = document.querySelector('.currentRunCard .cardTitle');
  
  // Change title to indicate no run
  if (cardTitle) {
    cardTitle.textContent = 'NO RUN COMPLETED YET';
  }
 
  // Reset all bars to 0
  const moraleBar = document.getElementById('moraleBar');
  const progressBar = document.getElementById('progressBar');
  const daysBar = document.getElementById('daysBar');
 
  const moraleText = document.getElementById('moraleText');
  const progressText = document.getElementById('progressText');
  const daysText = document.getElementById('daysText');
 
  if (moraleBar) moraleBar.style.width = '0%';
  if (progressBar) progressBar.style.width = '0%';
  if (daysBar) daysBar.style.width = '0%';
 
  if (moraleText) moraleText.textContent = '0%';
  if (progressText) progressText.textContent = '0%';
  if (daysText) daysText.textContent = '0 / 14';
}

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
 
  // Setup avatar selection modal
  setupAvatarSelection();
}
 
function openAvatarModal() {
  $('#avatarModal').modal('show');
}
 
function setupAvatarSelection() {
  const avatarOptions = document.querySelectorAll('.avatarOptionModal');
 
  avatarOptions.forEach(img => {
    img.addEventListener('click', async (e) => {
      // Remove previous selection
      avatarOptions.forEach(option => option.classList.remove('selectedAvatar'));
      
      // Mark as selected
      e.target.classList.add('selectedAvatar');
 
      // Get avatar name (e.g., "sprite3" from data-avatar)
      const avatarName = e.target.getAttribute('data-avatar');
 
      // Save to database
      try {

        const token = document.querySelector('meta[name="csrf-token"]').content;

        const res = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token
          },
          body: JSON.stringify({ avatar: avatarName })
        });
 
        if (res.ok) {
          // Update the main avatar immediately
          const mainAvatar = document.querySelector('.mainAvatar');
          if (mainAvatar) {
            mainAvatar.src = `/static/avatars/${avatarName}.png`;
          }
 
          // Show success message
          const savedMsg = document.getElementById('avatarSavedMsg');
          if (savedMsg) {
            savedMsg.style.display = 'block';
            setTimeout(() => {
              savedMsg.style.display = 'none';
            }, 2000);
          }
        } else {
          console.error('Failed to save avatar');
        }
      } catch (err) {
        console.error('Avatar save error:', err);
      }
    });
  });
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