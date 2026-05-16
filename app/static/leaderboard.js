let filter = sessionStorage.getItem('filter') || 'overall';

async function updateLeaderboard(currentFilter) {
    sessionStorage.setItem('filter', currentFilter);

    const filterTitle = document.getElementById('filterTitle');
    filterTitle.textContent = currentFilter.toUpperCase();

    const res = await fetch('/api/sessions/get_all/' + currentFilter);
    const sessions = await res.json();
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    sessions.forEach((session, i) => {
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


updateLeaderboard(filter); 
setInterval(() => updateLeaderboard(sessionStorage.getItem('filter') || 'overall'), 30000);
