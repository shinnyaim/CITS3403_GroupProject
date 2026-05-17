function toggleNav() {
    const nav = document.getElementById('mainNav');
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
}

// --- Read final stats from sessionStorage ---
const finalMorale   = parseInt(sessionStorage.getItem('finalMorale'));
const finalProgress = parseInt(sessionStorage.getItem('finalProgress'));
const days      = parseInt(sessionStorage.getItem('currentDay'));
const endReason     = sessionStorage.getItem('endReason');

// --- Update score numbers ---
document.getElementById('percentageProgress').textContent = finalProgress + '%';
document.getElementById('percentageMorale').textContent   = finalMorale   + '%';
document.getElementById('percentageDays').textContent     = days;
 
// --- Derive grade from progress ---
const grades = [
    { min: 80, label: 'HIGH DISTINCTION', emoji: '🏆', desc: 'Against all odds, your group actually functioned like a team. Do you know how rare that is?' },
    { min: 70, label: 'DISTINCTION',       emoji: '🎉', desc: 'Solid work. A few bumps, but you kept it together when it mattered.' },
    { min: 60, label: 'CREDIT',            emoji: '😊', desc: 'Decent effort. Could have been worse — and honestly, could have been better.' },
    { min: 50, label: 'PASS',              emoji: '😅', desc: 'You scraped through. Your group will never speak of this again.' },
    { min: 0,  label: 'FAIL',              emoji: '💀', desc: 'An absolute disaster from start to finish. At least it\'s over.' },
];

const grade = grades.find(g => finalProgress >= g.min);

document.querySelector('.grade').textContent    = grade.label;
document.querySelector('.emoji').textContent    = grade.emoji;
document.querySelector('.outcomeDesc').textContent = grade.desc;

// --- Override description if team morale collapsed or time ran out ---
if (endReason === 'morale') {
    document.querySelector('.outcomeDesc').textContent = 'Your team completely fell apart. The project never stood a chance.';
}

// --- Display overall score from session storage ---
const overallScore = sessionStorage.getItem('overallScore');
document.getElementById('finalScore').textContent = 'SCORE: ' + overallScore + '%';
