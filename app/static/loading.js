function toggleNav() {
    const nav = document.getElementById('mainNav');
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
}

let percent = 0;
const bar = document.getElementById('loadingBar');
let selectedTeammates = [];

async function init() {
    const res = await fetch('/api/random-teammates');
    selectedTeammates = await res.json();

    sessionStorage.setItem('teammates', JSON.stringify(selectedTeammates));

    const groupName = sessionStorage.getItem('groupName') || 'My Group';
    const teammateIds = selectedTeammates.map(t => t.id);

    const interval = setInterval(() => {
        percent += 2;
        bar.style.width = percent + '%';

        if (percent >= 25) revealCard('card1', selectedTeammates[0]);
        if (percent >= 55) revealCard('card2', selectedTeammates[1]);
        if (percent >= 80) revealCard('card3', selectedTeammates[2]);

        if (percent >= 100) clearInterval(interval);
    }, 60);
}

function revealCard(cardId, teammate) {
    const card = document.getElementById(cardId);
    if (card.classList.contains('revealed')) return;

    card.querySelector('.card-emoji').textContent = teammate.emoji;
    card.querySelector('.cardName').textContent = teammate.name.toUpperCase();
    card.querySelector('.cardRole').textContent = teammate.role;
    card.querySelector('.cardDesc').textContent = teammate.description;
    card.classList.add('revealed');
}

async function startSession() {
    const groupName = sessionStorage.getItem('groupName') || 'My Group';
    const teammateIds = selectedTeammates.map(t => t.id);

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const sessionRes = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  'X-CSRFToken': token },
        body: JSON.stringify({ group_name: groupName, teammate_ids: teammateIds })
    });
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
}

init();
