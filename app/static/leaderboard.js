async function updateLeaderboard() {
    const res = await fetch('/api/sessions/get_all');
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
            <td>${session.days_taken}</td>
            <td>${session.overall_score}%</td>
        `;
        tbody.appendChild(row);
    });
}

updateLeaderboard();
setInterval(updateLeaderboard, 30000);
