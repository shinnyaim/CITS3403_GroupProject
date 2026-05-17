function toggleNav() {
    const nav = document.getElementById('mainNav');
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
}

// --- Game State ---
let morale = parseInt(sessionStorage.getItem('Morale')) || 70;
let progress = parseInt(sessionStorage.getItem('Progress')) || 0;
let currentDay = parseInt(sessionStorage.getItem('currentDay')) || 1;
let currentEvent = null;
let seenCardIds = sessionStorage.getItem('seenCardIds') ? sessionStorage.getItem('seenCardIds').split(',').map(Number) : [];

const teammates = JSON.parse(sessionStorage.getItem('teammates') || '[]');
const teammateIds = teammates.map(t => t.id);
let selectedOptionIndex = null;

// --- Timer State ---
const TIMER_SECONDS = 30;
let timerInterval = null;
let timeRemaining = TIMER_SECONDS;

// --- On page load ---
document.addEventListener('DOMContentLoaded', () => {
    updateNames();
    loadTeammates();
    updateBars();
    updateDayCounter();
    restoreEventLog();
    
    const savedEvent = sessionStorage.getItem('currentEvent');
    if (savedEvent) {
        currentEvent = JSON.parse(savedEvent);
        displayEventCard(currentEvent);
    } else {
        fetchEventCard();
    }
});

async function updateNames() {
    const groupName = sessionStorage.getItem('groupName');
    try {
        const userResponse = await fetch('/api/me');
        const user = await userResponse.json();
        document.querySelector('.playerName').textContent = `PLAYER: ${user.username}`;
    } catch (e) {
        console.error('Failed to fetch user:', e);
    }
    document.querySelector('.grpName').textContent = `GROUP: ${groupName}`;
}

function loadTeammates() {
    teammates.forEach((t, i) => {
        const card = document.getElementById(`teammate${i + 1}`);
        card.querySelector('.emoji').textContent = t.emoji;
        card.querySelector('.nameText').textContent = t.name;
        card.querySelector('.desc').textContent = t.description;
    });
}

// --- Update progress bar and percentage displays ---
function updateBars() {
    const moraleBar = document.querySelector('#moraleProgress .progress-bar');
    moraleBar.style.width = morale + '%';
    moraleBar.setAttribute('aria-valuenow', morale);
    document.getElementById('moralePercentage').textContent = morale + '%';

    const progressBar = document.querySelector('#workProgress .progress-bar');
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
    document.getElementById('progressPercentage').textContent = progress + '%';

    sessionStorage.setItem('Morale', morale);
    sessionStorage.setItem('Progress', progress);
}

// --- Update day counter display ---
function updateDayCounter() {
    document.querySelector('.dayCounter').textContent = 'DAY ' + currentDay + ' / 14'; 
    sessionStorage.setItem('currentDay', currentDay);
}

// --- Fetch a random event card from the API ---
async function fetchEventCard() {
    try {
        const res = await fetch(`/api/random-event?teammate_ids=${teammateIds.join(',')}&seen=${seenCardIds.join(',')}`);
        const event = await res.json();

        if (event.error) {
            console.error('No event cards found:', event.error);
            return;
        }

        currentEvent = event;
        seenCardIds.push(event.id);
        sessionStorage.setItem('currentEvent', JSON.stringify(event));

        fetch('/api/session/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionStorage.getItem('session_id'),
                current_event: JSON.stringify(event)
            })
        }).catch(e => console.error('Failed to save event:', e));

        displayEventCard(event);
    } catch (e) {
        console.error('Failed to fetch event card:', e);
    }
}

// --- Timer: start a 30-second countdown for the current card ---
function startTimer() {
    stopTimer();
    const stored = parseInt(sessionStorage.getItem('timeRemaining'));
    timeRemaining = (stored > 0) ? stored : TIMER_SECONDS;
    document.querySelector('.timer').textContent = timeRemaining + 's';

    timerInterval = setInterval(() => {
        timeRemaining--;
        sessionStorage.setItem('timeRemaining', timeRemaining); // persist remaining time in case of accidental refresh
        document.querySelector('.timer').textContent = timeRemaining + 's';

        if (timeRemaining <= 0) {
            stopTimer();
            onTimerExpired();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}


// --- Called when the timer hits 0 without a player choice ---
function onTimerExpired() {
    document.getElementById('confirmChoice').style.display = 'none';

    sessionStorage.removeItem('timeRemaining');
    sessionStorage.removeItem('currentEvent');
    morale -= 5;
    progress -= 5;
    if (morale < 0) morale = 0;
    if (progress < 0) progress = 0;
    updateBars();

    addToEventLog('Timeout', 'Time ran out! (-5 morale, -5 progress)');

    if (morale <= 0) {
        endGame('morale');
        return;
    }

    if (currentDay === 14) {
        endGame('days');
        return;
    }

    currentDay++;
    updateDayCounter();
    fetchEventCard();
}

// --- Update the event card UI with the fetched event ---
function displayEventCard(event) {
    document.querySelector('.eventCard h6').textContent = event.title;
    document.querySelector('.eventCardDesc').textContent = event.description;

    const buttons = document.querySelectorAll('.options');
    buttons[0].textContent = 'A) ' + event.options[0].text;
    buttons[1].textContent = 'B) ' + event.options[1].text;
    buttons[2].textContent = 'C) ' + event.options[2].text;

    // wire up option buttons — first click selects, confirm button applies
    buttons[0].onclick = () => selectOption(0);
    buttons[1].onclick = () => selectOption(1);
    buttons[2].onclick = () => selectOption(2);

    startTimer();
}

// --- Player highlights an option (before confirming) ---
function selectOption(index) {
    selectedOptionIndex = index;

    // highlight the selected button, clear others
    const buttons = document.querySelectorAll('.options');
    buttons.forEach((btn, i) => btn.classList.toggle('selected', i === index));

    // reveal the confirm button
    document.getElementById('confirmChoice').style.display = 'flex';
}

// --- Player confirms their selected option ---
async function chooseOption() {
    if (selectedOptionIndex === null) return;
    stopTimer();
    sessionStorage.removeItem('timeRemaining');
    sessionStorage.removeItem('currentEvent');

    const option = currentEvent.options[selectedOptionIndex];

    // clear selection state and hide confirm button
    selectedOptionIndex = null;
    document.querySelectorAll('.options').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('confirmChoice').style.display = 'none';

    // apply morale and progress impacts
    morale = Math.max(0, Math.min(100, morale + option.morale));
    progress = Math.max(0, Math.min(100, progress + option.progress));

    updateBars();
    addToEventLog(currentEvent.title, option.text);
    currentDay++;

    try {
        await fetch('/api/session/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionStorage.getItem('session_id'),
                seen_event_ids: seenCardIds.join(','),
                morale: morale,
                progress: progress,
                currentDay: currentDay - 1,
                event_log: sessionStorage.getItem('eventLog') || '[]',
                current_event: sessionStorage.getItem('currentEvent')
            })
        });
    } catch (e) {
        console.error('Failed to save session:', e);
    }

    // check end conditions
    if (morale <= 0) {
        endGame('morale');
        return;
    }

    if (currentDay > 14) {
        endGame('days');
        return;
    }

    updateDayCounter();
    fetchEventCard();
}

// --- Add an entry to the event log ---
function addToEventLog(title, choiceText) {
    const log = document.querySelector('.eventLogs');
    const entry = document.createElement('div');
    entry.className = 'eventLogDay';
    entry.textContent = `DAY ${currentDay}: ${title}`;
    log.appendChild(entry);

    const stored = JSON.parse(sessionStorage.getItem('eventLog') || '[]');
    stored.push({ day: currentDay, title });
    sessionStorage.setItem('eventLog', JSON.stringify(stored));
}

function restoreEventLog() {
    const stored = JSON.parse(sessionStorage.getItem('eventLog') || '[]');
    const log = document.querySelector('.eventLogs');
    stored.forEach(({ day, title }) => {
        const entry = document.createElement('div');
        entry.className = 'eventLogDay';
        entry.textContent = `DAY ${day}: ${title}`;
        log.appendChild(entry);
    });
}


// --- Confirm button ---
document.getElementById('confirmChoice').addEventListener('click', () => {
    chooseOption();
});

// --- Submit Early button ---
document.getElementById('submitEarly').addEventListener('click', () => {
    endGame('early');
});

// --- End the game and redirect to outcome page ---
async function endGame(reason) {
    // store final stats in sessionStorage so outcome.html can read them
    const dayScore = (14 - currentDay) / 14 * 100;
    const overallScore = parseFloat((progress * 0.6 + morale * 0.3 + dayScore * 0.1).toFixed(2));

    sessionStorage.setItem('finalMorale', morale);
    sessionStorage.setItem('finalProgress', progress);
    sessionStorage.setItem('currentDay', currentDay - 1); // currentDay was incremented at the end of the last round, so subtract 1 to get the actual day reached   
    sessionStorage.setItem('endReason', reason);
    sessionStorage.setItem('overallScore', overallScore);
    
    sessionStorage.removeItem('eventLog');
    sessionStorage.removeItem('currentEvent');
    sessionStorage.removeItem('morale');
    sessionStorage.removeItem('progress');
    
    try {
        await fetch('/api/session/end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionStorage.getItem('session_id'),
                overall_score: overallScore
            })
        });
    } catch (e) {
        console.error('Failed to end session:', e);
    }

    window.location.href = '/outcome';
}
