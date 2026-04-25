let percent = 0;
const bar = document.getElementById('loadingBar');

const interval = setInterval(() => {
    percent += 2;
    bar.style.width = percent + '%';

    // REVEAL CARDS AT CERTAIN POINTS. THESE ARE JUST TEMPORARY PLACEHOLDERS
    if (percent >= 25) revealCard('card1', '👻', 'JOSH', 'The Ghost');
    if (percent >= 55) revealCard('card2', '🦅', 'PRIYA', 'The Overachiever');
    if (percent >= 80) revealCard('card3', '😴', 'DAVID', 'The Slacker');

    // Redirect when done
    if (percent >= 100) {
        // clearInterval(interval);
        // setTimeout(() => {
        //     window.location.href = 'game.html';
        // }, 1000);
    }

}, 60);

function revealCard(cardId, emoji, name, role) {
    const card = document.getElementById(cardId);

    if (card.classList.contains('revealed')) return;

    card.querySelector('.card-emoji').textContent = emoji;
    card.querySelector('.cardName').textContent = name;
    card.querySelector('.cardRole').textContent = role;
    card.classList.add('revealed');
}