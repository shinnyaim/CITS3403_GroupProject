/* PLAYER DATA (Will be fetched from backend) */
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
    { 
      id: 1,
      grade: 'HD', 
      days: 11, 
      submitType: 'EARLY SUBMIT',
      date: '2024-05-10',
      groupName: 'LEGENDS',
      progress: 85,
      morale: 75,
      canResume: false
    },
    { 
      id: 2,
      grade: 'D', 
      days: 14, 
      submitType: 'ON TIME',
      date: '2024-05-05',
      groupName: 'CODERS',
      progress: 70,
      morale: 60,
      canResume: false
    },
    { 
      id: 3,
      grade: 'CR', 
      days: 9, 
      submitType: 'EARLY SUBMIT',
      date: '2024-04-28',
      groupName: 'HUSTLERS',
      progress: 65,
      morale: 55,
      canResume: false
    }
  ]
};

/* PAGE INITIALIZATION  */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Profile page loaded');
  initializeProfile();
});

function initializeProfile() {
  // Load player data
  loadPlayerData();
  
  // Setup event listeners
  setupAvatarContainer();
  setupGameLogModal();
  
  // Update UI
  updateBars();
  
  // Preload avatars
  preloadAvatars();
}

/* LOAD PLAYER DATA */
function loadPlayerData() {
  // In production, fetch from backend:
  // fetchPlayerDataFromBackend();
  
  // For now, use demo data
  updatePlayerDisplay();
  updateStatsDisplay();
  updateHistoryDisplay();
}

async function fetchPlayerDataFromBackend() {
  try {
    const response = await fetch('/api/player/profile');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    playerData = { ...playerData, ...data };
    
    loadPlayerData();
    console.log('Player data loaded from backend');
    
  } catch (error) {
    console.error('Error fetching player data:', error);
    // Fall back to demo data
  }
}

/* UPDATE PLAYER DISPLAY  */
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

/*  UPDATE STATS DISPLAY */
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

/*  UPDATE HISTORY DISPLAY */
function updateHistoryDisplay() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  if (!playerData.gameHistory || playerData.gameHistory.length === 0) {
    historyList.innerHTML = '<p class="loadingText">No games yet. Start your first run!</p>';
    return;
  }
  
  playerData.gameHistory.forEach((game, index) => {
    const entry = document.createElement('div');
    entry.className = 'historyEntry';
    entry.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s both`;
    entry.innerHTML = `
      <span class="gradeBadge">${game.grade}</span>
      <span class="daysBadge">DAY ${game.days}</span>
      <span class="submitBadge">${game.submitType}</span>
    `;
    historyList.appendChild(entry);
  });
}

/*  UPDATE PROGRESS BARS */
function updateBars() {
  const currentRun = playerData.currentRun;
  
  const moraleBar = document.getElementById('moraleBar');
  const progressBar = document.getElementById('progressBar');
  const daysBar = document.getElementById('daysBar');
  
  const moraleText = document.getElementById('moraleText');
  const progressText = document.getElementById('progressText');
  const daysText = document.getElementById('daysText');
  
  if (moraleBar) moraleBar.style.width = currentRun.morale + '%';
  if (progressBar) progressBar.style.width = currentRun.progress + '%';
  if (daysBar) daysBar.style.width = (currentRun.daysLeft / 14) * 100 + '%';
  
  if (moraleText) moraleText.textContent = currentRun.morale + '%';
  if (progressText) progressText.textContent = currentRun.progress + '%';
  if (daysText) daysText.textContent = `${currentRun.daysLeft} / 14`;
}

/*  AVATAR CONTAINER SETUP  */
function setupAvatarContainer() {
  const avatarContainer = document.getElementById('avatarContainer');
  
  if (avatarContainer) {
    avatarContainer.addEventListener('click', openAvatarModal);
    avatarContainer.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAvatarModal();
      }
    });
  }
}

function openAvatarModal() {
  $('#avatarModal').modal('show');
  setupAvatarSelection();
}

/*  AVATAR SELECTION SETUP  */
function setupAvatarSelection() {
  const avatarOptions = document.querySelectorAll('.avatarOptionModal');
  const mainAvatar = document.querySelector('.mainAvatar');
  const avatarSavedMsg = document.getElementById('avatarSavedMsg');
  
  // Remove existing listeners by cloning
  avatarOptions.forEach(avatar => {
    const clone = avatar.cloneNode(true);
    avatar.parentNode.replaceChild(clone, avatar);
  });
  
  // Re-select after cloning
  const newOptions = document.querySelectorAll('.avatarOptionModal');
  
  newOptions.forEach(avatar => {
    avatar.addEventListener('click', function() {
      selectAvatar(this, mainAvatar, avatarSavedMsg);
    });
    
    avatar.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectAvatar(this, mainAvatar, avatarSavedMsg);
      }
    });
  });
  
  // Mark current avatar as selected
  newOptions.forEach(opt => {
    const avatar = opt.getAttribute('data-avatar');
    if (avatar === playerData.avatar) {
      opt.classList.add('selectedAvatar');
    } else {
      opt.classList.remove('selectedAvatar');
    }
  });
}

function selectAvatar(selectedElement, mainAvatar, savedMsg) {
  // Remove previous selection
  const previousSelected = document.querySelector('.avatarOptionModal.selectedAvatar');
  if (previousSelected) {
    previousSelected.classList.remove('selectedAvatar');
  }
  
  // Add selection to new avatar
  selectedElement.classList.add('selectedAvatar');
  
  // Update main avatar with animation
  const newAvatarSrc = selectedElement.src;
  if (mainAvatar) {
    mainAvatar.style.opacity = '0';
    
    setTimeout(() => {
      mainAvatar.src = newAvatarSrc;
      mainAvatar.style.opacity = '1';
    }, 150);
  }
  
  // Get avatar name
  const avatarName = selectedElement.getAttribute('data-avatar');
  playerData.avatar = avatarName;
  
  // Save to backend
  saveAvatarPreference(avatarName);
  
  // Show success message
  if (savedMsg) {
    savedMsg.style.display = 'block';
    setTimeout(() => {
      savedMsg.style.display = 'none';
    }, 2000);
  }
  
  console.log(`Avatar changed to: ${avatarName}`);
}

function saveAvatarPreference(avatarName) {
  // In production:
  // fetch('/api/player/avatar', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ avatar: avatarName })
  // })
  // .then(res => res.json())
  // .then(data => console.log('Avatar saved:', data))
  // .catch(err => console.error('Error:', err));
  
  console.log('Avatar saved locally:', avatarName);
}

/*  GAME LOG MODAL SETUP  */
function setupGameLogModal() {
  const gameLogModal = document.getElementById('gameLogModal');
  
  if (gameLogModal) {
    gameLogModal.addEventListener('show.bs.modal', loadGameLog);
  }
}

function loadGameLog() {
  const gameLogContent = document.getElementById('gameLogContent');
  
  if (!gameLogContent) return;
  
  // In production, fetch from backend:
  // fetchGameHistoryFromBackend();
  
  // For now, use demo data
  populateGameLog(playerData.gameHistory);
}

async function fetchGameHistoryFromBackend() {
  try {
    const response = await fetch('/api/player/game-history');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    playerData.gameHistory = data.games;
    populateGameLog(data.games);
    console.log('Game history loaded');
    
  } catch (error) {
    console.error('Error fetching game history:', error);
  }
}

function populateGameLog(games) {
  const gameLogContent = document.getElementById('gameLogContent');
  
  if (!gameLogContent) return;
  
  // Clear content
  gameLogContent.innerHTML = '';
  
  // Check if there are games
  if (!games || games.length === 0) {
    gameLogContent.innerHTML = `
      <div class="emptyState">
        <div class="emptyStateIcon">📊</div>
        <p>No previous games found.</p>
        <p style="font-size: 0.6rem; margin-top: 10px;">Start your first run to see your history!</p>
      </div>
    `;
    return;
  }
  
  // Create game log entries
  games.forEach((game, index) => {
    const entry = document.createElement('div');
    entry.className = `gameLogEntry ${game.canResume ? 'resumable' : ''}`;
    entry.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s both`;
    
    const formattedDate = formatDate(game.date);
    
    entry.innerHTML = `
      <div class="gameLogHeader">
        <div>
          <span class="gameLogGrade">${game.grade}</span>
          <span class="gameLogDate">${formattedDate}</span>
        </div>
        ${game.canResume ? '<span style="color: #66bb6a; font-size: 0.7rem;">RESUMABLE</span>' : ''}
      </div>
      <div class="gameLogDetails">
        <span>GROUP: ${game.groupName || 'N/A'}</span>
        <span>DAY ${game.days}</span>
        <span>${game.submitType}</span>
      </div>
    `;
    
    if (game.canResume) {
      entry.addEventListener('click', () => resumeGame(game.id));
      entry.style.cursor = 'pointer';
    }
    
    gameLogContent.appendChild(entry);
  });
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  
  const date = new Date(dateStr);
  const options = { year: '2-digit', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/* NAVIGATION FUNCTIONS */
function resumeGame(gameId) {
  console.log('Resuming game:', gameId);
  // In production:
  // sessionStorage.setItem('resumeGameId', gameId);
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
  if (!confirm('Are you sure you want to logout?')) return;
  
  fetch('/logout', { method: 'GET' })
    .then(() => {
      sessionStorage.clear();
      window.location.href = '/';
    })
    .catch(err => {
      console.error('Logout error:', err);
      window.location.href = '/';
    });
}

/*  UTILITY FUNCTIONS */
function preloadAvatars() {
  for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `/static/avatars/sprite${i}.png`;
  }
}

/*KEYBOARD SHORTCUTS */
document.addEventListener('keydown', (e) => {
  // Only trigger if no modal is open
  if ($('.modal.show').length > 0) return;
  
  const key = e.key.toLowerCase();
  
  // 'L' for Leaderboard
  if (key === 'l') {
    viewLeaderboard();
  }
  
  // 'A' for Avatar
  if (key === 'a') {
    openAvatarModal();
  }
  
  // 'Q' or 'Escape' for Logout
  if (key === 'q' || key === 'escape') {
    if (confirm('Logout?')) logout();
  }
});

/* CONSOLE HELPERS (For Testing) */
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
  resetCurrentRun: () => {
    playerData.currentRun = { morale: 100, progress: 0, daysLeft: 14 };
    updateBars();
  },
  getPlayerData: () => playerData,
  addGameToHistory: (game) => {
    playerData.gameHistory.unshift(game);
    updateHistoryDisplay();
  },
  clearHistory: () => {
    playerData.gameHistory = [];
    updateHistoryDisplay();
  }
};

console.log('%cProfile Debug Tools Enabled', 'color: #ffeb3b; font-weight: bold;');
console.log('Use window.debugProfile to test. Type debugProfile for available commands.');