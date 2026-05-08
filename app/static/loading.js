let percent = 0;
const bar = document.getElementById('loadingBar');

const interval = setInterval(() => {
    percent += 2;
    bar.style.width = percent + '%';

    // REVEAL CARDS AT CERTAIN POINTS. THESE ARE JUST TEMPORARY PLACEHOLDERS. REPLACE EMOJIS WITH THE CHARACTERS PROFILE?
    if (percent >= 25) revealCard('card1', '👻', 'JOSH', 'The Ghost', 'Disappears without warning. Last seen 4 days ago. May or may not resurface before the deadline.');
    if (percent >= 55) revealCard('card2', '🦅', 'PRIYA', 'The Overachiever', 'Rewrites your work at 2am. Means well, but absolutely exhuasting.');
    if (percent >= 80) revealCard('card3', '😴', 'DAVID', 'The Slacker', 'Will submit something. Just lower your expectations... By a lot.');

    // REDIRECTS TO THE ACTUAL GAMEPLAY. 
    if (percent >= 100) {
        // clearInterval(interval);
        // setTimeout(() => {
        //     window.location.href = 'game.html';
        // }, 1000);
    }

}, 60);

function revealCard(cardId, emoji, name, role, description) {
    const card = document.getElementById(cardId);

    if (card.classList.contains('revealed')) return;

    card.querySelector('.card-emoji').textContent = emoji;
    card.querySelector('.cardName').textContent = name;
    card.querySelector('.cardRole').textContent = role;
    card.querySelector('.cardDesc').textContent = description;
    card.classList.add('revealed');
}