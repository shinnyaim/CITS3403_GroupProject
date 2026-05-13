// ===== TEMPORARY DEMO DATA (will be replaced by Flask backend) =====
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
  },
  gameHistory: [
    { grade: 'HD', days: 11, submitType: 'EARLY SUBMIT' },
    { grade: 'D', days: 14, submitType: 'ON TIME' },
    { grade: 'CR', days: 9, submitType: 'EARLY SUBMIT' }
  ]
};

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  initializeProfile();
  loadPlayerData();
  setupAvatarSelection();
  updateBars();
  setupAvatarPopup();
});

// ===== INITIALIZE PROFILE =====
function initializeProfile() {
  console.log('Profile page initialized');
  
  // Preload avatar images for smooth switching
  const avatarOptions = document.querySelectorAll('.avatarOption');
  avatarOptions.forEach(img => {
    const preloadImg = new Image();
    preloadImg.src = img.src;
  });
}

// ===== LOAD PLAYER DATA FROM BACKEND =====
function loadPlayerData() {
  // In production, fetch from /api/player/profile
  // For now, use demo data
  
  updatePlayerDisplay();
  updateStatsDisplay();
  updateHistoryDisplay();
}

// ===== UPDATE PLAYER DISPLAY =====
function updatePlayerDisplay() {
  const nameDisplay = document.getElementById('playerNameDisplay');
  const groupDisplay = document.getElementById('groupDisplay');
  const rankDisplay = document.getElementById('rankDisplay');
  
  if (nameDisplay) nameDisplay.textContent = `PLAYER: ${playerData.username.toUpperCase()}`;
  if (groupDisplay) groupDisplay.textContent = `GROUP: ${playerData.group.toUpperCase()}`;
  if (rankDisplay) rankDisplay.textContent = playerData.rank;
  
  // Set current avatar
  const mainAvatar = document.querySelector('.mainAvatar');
  if (mainAvatar) {
    mainAvatar.src = `/static/avatars/${playerData.avatar}.png`;
  }
  
  // Mark current avatar as selected
  const avatarOptions = document.querySelectorAll('.avatarOption');
  avatarOptions.forEach(opt => {
    const avatar = opt.getAttribute('data-avatar');
    if (avatar === playerData.avatar) {
      opt.classList.add('selectedAvatar');
    } else {
      opt.classList.remove('selectedAvatar');
    }
  });
}

// ===== UPDATE STATS DISPLAY =====
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

// ===== UPDATE HISTORY DISPLAY =====
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  playerData.gameHistory.forEach((game, index) => {
    const entry = document.createElement('div');
    entry.className = 'historyEntry';
    entry.style.animationDelay = `${index * 0.1}s`;
    entry.innerHTML = `
      <span class="gradeBadge">${game.grade}</span>
      <span class="daysBadge">DAY ${game.days}</span>
      <span class="submitBadge">${game.submitType}</span>
    `;
    historyList.appendChild(entry);
  });
}

// ===== UPDATE PROGRESS BARS =====
function updateBars() {
  const currentRun = playerData.currentRun;
  
  // Update bar widths
  const moraleBar = document.getElementById('moraleBar');
  const progressBar = document.getElementById('progressBar');
  const daysBar = document.getElementById('daysBar');
  
  if (moraleBar) moraleBar.style.width = currentRun.morale + '%';
  if (progressBar) progressBar.style.width = currentRun.progress + '%';
  if (daysBar) daysBar.style.width = (currentRun.daysLeft / 14) * 100 + '%';
  
  // Update text displays
  const moraleText = document.getElementById('moraleText');
  const progressText = document.getElementById('progressText');
  const daysText = document.getElementById('daysText');
  
  if (moraleText) moraleText.textContent = currentRun.morale + '%';
  if (progressText) progressText.textContent = currentRun.progress + '%';
  if (daysText) daysText.textContent = `${currentRun.daysLeft} / 14`;
}

function setupAvatarPopup() {
  const avatarContainer = document.getElementById('avatarContainer');
  const avatarCard = document.querySelector('.avatarSelectionCard');

  avatarContainer.addEventListener('click', () => {
    avatarCard.classList.toggle('show');
  });
}

// ===== AVATAR SELECTION SETUP =====
function setupAvatarSelection() {
  const avatarOptions = document.querySelectorAll('.avatarOption');
  const mainAvatar = document.querySelector('.mainAvatar');
  const avatarSavedMsg = document.getElementById('avatarSavedMsg');
  
  avatarOptions.forEach(avatar => {
    avatar.addEventListener('click', function() {
      selectAvatar(this, mainAvatar, avatarSavedMsg);
    });
    
    // Add keyboard accessibility
    avatar.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectAvatar(this, mainAvatar, avatarSavedMsg);
      }
    });
  });
}

// ===== HANDLE AVATAR SELECTION =====
function selectAvatar(selectedElement, mainAvatar, savedMsg) {
  // Remove previous selection
  const previousSelected = document.querySelector('.avatarOption.selectedAvatar');
  if (previousSelected) {
    previousSelected.classList.remove('selectedAvatar');
  }
  
  // Add selection to new avatar
  selectedElement.classList.add('selectedAvatar');
  
  // Update main avatar image with smooth transition
  const newAvatarSrc = selectedElement.src;
  if (mainAvatar) {
    mainAvatar.style.opacity = '0';
    
    setTimeout(() => {
      mainAvatar.src = newAvatarSrc;
      mainAvatar.style.opacity = '1';
    }, 150);
  }
  
  // Get avatar name from data attribute
  const avatarName = selectedElement.getAttribute('data-avatar');
  playerData.avatar = avatarName;
  
  // Save to database (in production)
  saveAvatarPreference(avatarName);
  
  // Show success message
  if (savedMsg) {
    savedMsg.style.display = 'block';
    setTimeout(() => {
      savedMsg.style.display = 'none';
    }, 3000);
  }
  
  console.log(`Avatar changed to: ${avatarName}`);
}

// ===== SAVE AVATAR PREFERENCE TO BACKEND =====
function saveAvatarPreference(avatarName) {
  // In production, send to backend
  // fetch('/api/player/avatar', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ avatar: avatarName })
  // })
  // .then(res => res.json())
  // .then(data => console.log('Avatar saved:', data))
  // .catch(err => console.error('Avatar save error:', err));
  
  console.log('Avatar preference saved locally:', avatarName);
}

// ===== NAVIGATION FUNCTIONS =====
function resumeRun() {
  sessionStorage.setItem('resumeMode', 'true');
  window.location.href = '/game';
}

function newRun() {
  sessionStorage.clear();
  window.location.href = '/setup';
}

function viewLeaderboard() {
  window.location.href = '/leaderboard';
}

function logout() {
  fetch('/logout', { method: 'POST' })
    .then(() => {
      window.location.href = '/';
    })
    .catch(err => {
      console.error('Logout error:', err);
      window.location.href = '/';
    });
}

// ===== SMOOTH SCROLL ANIMATIONS =====
document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.avatarCard, .currentRunCard, .statsCard, .avatarSelectionCard, .historyCard');
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible && !el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // Press 'R' to Resume
  if (e.key === 'r' || e.key === 'R') {
    resumeRun();
  }
  
  // Press 'N' for New Run
  if (e.key === 'n' || e.key === 'N') {
    newRun();
  }
  
  // Press 'L' for Leaderboard
  if (e.key === 'l' || e.key === 'L') {
    viewLeaderboard();
  }
  
  // Press 'Q' for Logout
  if (e.key === 'q' || e.key === 'Q') {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  }
});

// ===== THEME TOGGLE (Optional) =====
function toggleTheme() {
  document.body.style.filter = 
    document.body.style.filter === 'invert(1)' ? 'none' : 'invert(1)';
}

// ===== FETCH REAL PLAYER DATA FROM BACKEND (Production) =====
async function fetchPlayerDataFromBackend() {
  try {
    const response = await fetch('/api/player/profile');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    playerData = { ...playerData, ...data };
    
    loadPlayerData();
    console.log('Player data loaded from backend:', playerData);
    
  } catch (error) {
    console.error('Error fetching player data:', error);
    // Fall back to demo data (already loaded)
  }
}

// Call this if you want to load real data:
// fetchPlayerDataFromBackend();

// ===== CONSOLE HELPERS FOR TESTING =====
window.debugProfile = {
  updateMorale: (val) => {
    playerData.currentRun.morale = Math.max(0, Math.min(100, val));
    updateBars();
  },
  updateProgress: (val) => {
    playerData.currentRun.progress = Math.max(0, Math.min(100, val));
    updateBars();
  },
  updateDays: (val) => {
    playerData.currentRun.daysLeft = Math.max(0, Math.min(14, val));
    updateBars();
  },
  resetStats: () => {
    playerData.currentRun = { morale: 100, progress: 0, daysLeft: 14 };
    updateBars();
  },
  getPlayerData: () => playerData
};

console.log('Profile debugging enabled. Use window.debugProfile to test.');