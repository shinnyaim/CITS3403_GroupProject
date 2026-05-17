let percent = 0;
const bar = document.getElementById('loadingBar');
let selectedTeammates = [];

async function init() {
  try {
    const res = await fetch('/api/random-teammates');

    if (!res.ok) {
        throw new Error('Failed to load teammates');
    }

    selectedTeammates = await res.json();

    sessionStorage.setItem('teammates', JSON.stringify(selectedTeammates));

    const interval = setInterval(() => {
        percent += 2;
        bar.style.width = percent + '%';

        if (percent >= 25) revealCard('card1', selectedTeammates[0]);
        if (percent >= 55) revealCard('card2', selectedTeammates[1]);
        if (percent >= 80) revealCard('card3', selectedTeammates[2]);

        if (percent >= 100) clearInterval(interval);
    }, 60);
  } catch (err) {
    console.error('Teammate loading error:', err);
    alert('Could not load teammates. Please try again.');
    window.location.href = '/setup';
  }
}

function revealCard(cardId, teammate) {
    if (!teammate) return;

    const card = document.getElementById(cardId);
    if (card.classList.contains('revealed')) return;

    card.querySelector('.card-emoji').textContent = teammate.emoji;
    card.querySelector('.cardName').textContent = teammate.name.toUpperCase();
    card.querySelector('.cardRole').textContent = teammate.role;
    card.querySelector('.cardDesc').textContent = teammate.description;
    card.classList.add('revealed');
}

async function startSession() {
  try {
    const groupName = sessionStorage.getItem('groupName') || 'My Group';
    const teammateIds = selectedTeammates.map(t => t.id);

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const sessionRes = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  'X-CSRFToken': token },
        body: JSON.stringify({ group_name: groupName, teammate_ids: teammateIds })
    });

    if (!sessionRes.ok) {
        throw new Error('Failed to start session');
    }

    const sessionData = await sessionRes.json();
    sessionStorage.setItem('session_id', sessionData.session_id);
    sessionStorage.setItem('currentDay', '1');
    sessionStorage.setItem('Morale', '70');
    sessionStorage.setItem('Progress', '0');

    sessionStorage.removeItem('currentEvent');
    sessionStorage.removeItem('eventLog');
    sessionStorage.removeItem('timeRemaining');
    sessionStorage.removeItem('seenCardIds');

    window.location.href = '/game';
  } catch (err) {
    console.error('Session start error:', err);
    alert('Could not start the game. Please try again.');
  }
}

init();
