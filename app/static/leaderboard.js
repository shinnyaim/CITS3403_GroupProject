function toggleNav() {
    const nav = document.getElementById('mainNav');
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
}

let filter = sessionStorage.getItem('filter') || 'overall';
let player = sessionStorage.getItem('player') 

async function updateLeaderboard(currentFilter) {
  try {
    sessionStorage.setItem('filter', currentFilter);

    const filterTitle = document.getElementById('filterTitle');
    filterTitle.textContent = currentFilter.toUpperCase();

    const res = await fetch('/api/sessions/get_all/' + currentFilter);

    if (!res.ok) {
        throw new Error('Failed to load leaderboard');
    }

    const sessions = await res.json();
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    sessions.forEach((session, i) => {
        if (player && session.username !== player) return; // Filter by player if set
        const row = document.createElement('tr');
        row.className = 'playerRow';
        row.innerHTML = `
            <td>${i + 1}</td>
            <td class="username">${session.username}</td>  <!-- ← ADD class="username" -->
            <td>${session.group_name}</td>
            <td>${session.progress}%</td>
            <td>${session.morale}%</td>
            <td>${session.currentDay}</td>
            <td>${session.overall_score}%</td>
        `;
        tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Leaderboard loading error:', err);
    const tbody = document.getElementById('leaderboardBody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7">Error loading leaderboard.</td></tr>';
    }
  }
}

updateLeaderboard(filter); 

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
setInterval(() => updateLeaderboard(sessionStorage.getItem('filter') || 'overall'), 30000);
