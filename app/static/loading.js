let percent = 0;
const bar = document.getElementById('loadingBar');
let selectedTeammates = [];

async function init() {
    const res = await fetch('/api/random-teammates');
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

init();
