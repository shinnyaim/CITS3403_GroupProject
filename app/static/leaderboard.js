let filter = sessionStorage.getItem('filter') || 'overall';
let player = sessionStorage.getItem('player') 

async function updateLeaderboard(currentFilter) {
    sessionStorage.setItem('filter', currentFilter);

    const filterTitle = document.getElementById('filterTitle');
    filterTitle.textContent = currentFilter.toUpperCase();

    const res = await fetch('/api/sessions/get_all/' + currentFilter);
    const sessions = await res.json();
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    sessions.forEach((session, i) => {
        if (player && session.username !== player) return; // Filter by player if set
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${session.username}</td>
            <td>${session.group_name}</td>
            <td>${session.progress}%</td>
            <td>${session.morale}%</td>
            <td>${session.currentDay}</td>
            <td>${session.overall_score}%</td>
        `;
        tbody.appendChild(row);
    });
}


function searchPlayer() {
    const input = document.getElementById('playerSearch').value.trim();
    if (input) {
        sessionStorage.setItem('player', input);
    } else {
        sessionStorage.removeItem('player');
    }
    player = sessionStorage.getItem('player');
    updateLeaderboard(sessionStorage.getItem('filter') || 'overall');
}

updateLeaderboard(filter);
setInterval(() => updateLeaderboard(sessionStorage.getItem('filter') || 'overall'), 30000);
