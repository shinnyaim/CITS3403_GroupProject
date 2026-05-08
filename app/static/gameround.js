// --- Game State ---
let morale = 100;
let progress = 0;       // starts at 0 as per project spec
let daysLeft = 14;
let currentEvent = null;
let seenCardIds = [];   // tracks seen cards to avoid repeats
const teammates = JSON.parse(sessionStorage.getItem('teammates') || '[]');
const teammateIds = teammates.map(t => t.id);
let selectedOptionIndex = null;

// --- Timer State ---
const TIMER_SECONDS = 30;
let timerInterval = null;
let timeRemaining = TIMER_SECONDS;

// --- On page load ---
document.addEventListener('DOMContentLoaded', () => {
    updateGroupName();
    loadTeammates();
    updateBars();
    updateDayCounter();
    fetchEventCard();
});

function updateGroupName() {
    const groupName = sessionStorage.getItem('groupName') || 'BOBBERS';
    document.querySelector('.grpName').textContent = `GROUP: ${groupName.toUpperCase()}`;
}

function loadTeammates() {
    teammates.forEach((t, i) => {
        const card = document.getElementById(`teammate${i + 1}`);
        card.querySelector('.name').textContent = t.name;
        card.querySelector('.desc').textContent = t.description;
    });
}

// --- Fetch a random event card from the API ---
async function fetchEventCard() {
    const res = await fetch(`/api/random-event?teammate_ids=${teammateIds.join(',')}&seen=${seenCardIds.join(',')}`);
    const event = await res.json();

    if (event.error) {
        console.error('No event cards found:', event.error);
        return;
    }

    currentEvent = event;
    seenCardIds.push(event.id);   // mark this card as seen
    displayEventCard(event);
}

// --- Timer: start a 30-second countdown for the current card ---
function startTimer() {
    stopTimer();
    timeRemaining = TIMER_SECONDS;
    document.querySelector('.timer').textContent = timeRemaining + 's';

    timerInterval = setInterval(() => {
        timeRemaining--;
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

    daysLeft--;
    updateDayCounter();

    if (daysLeft <= 0) {
        endGame('days');
        return;
    }

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

    enableOptions();
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
function chooseOption() {
    if (selectedOptionIndex === null) return;
    stopTimer();

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
    disableOptions();   // prevent picking multiple options per day

    // check end conditions
    if (morale <= 0) {
        endGame('morale');
        return;
    }

    daysLeft--;
    updateDayCounter();

    if (daysLeft <= 0) {
        endGame('days');
        return;
    }

    fetchEventCard();
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
}

// --- Update day counter display ---
function updateDayCounter() {
    document.querySelector('.dayCounter').textContent = daysLeft + ' DAYS LEFT';
}

// --- Add an entry to the event log ---
function addToEventLog(title, choiceText) {
    const log = document.querySelector('.eventLogs');
    const entry = document.createElement('div');
    entry.className = 'eventLogDay';
    entry.textContent = `DAY ${14 - daysLeft}: ${title}`;
    log.appendChild(entry);
}

// --- Disable option buttons after a choice is made ---
function disableOptions() {
    document.querySelectorAll('.options').forEach(btn => btn.disabled = true);
}

// --- Enable option buttons for a new card ---
function enableOptions() {
    document.querySelectorAll('.options').forEach(btn => btn.disabled = false);
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
function endGame(reason) {
    // store final stats in sessionStorage so outcome.html can read them
    sessionStorage.setItem('finalMorale', morale);
    sessionStorage.setItem('finalProgress', progress);
    sessionStorage.setItem('daysLeft', daysLeft);
    sessionStorage.setItem('endReason', reason);

    window.location.href = '/outcome';
}
