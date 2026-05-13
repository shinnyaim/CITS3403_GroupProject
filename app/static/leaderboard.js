function updateLeaderboard() {
    $.ajax({
        url: '/api/leaderboard',
        type: 'GET',
        success: function(data) {
            $('#leaderboardBody').empty();

            data.forEach(function(result, index) {
                var row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${result.username}</td>
                        <td>${result.group_name}</td>
                        <td>${result.outcome}</td>
                        <td>${result.progress}</td>
                        <td>${result.morale}</td>
                        <td>${result.days_taken}</td>
                        <td>${result.overall_score}</td>
                    </tr>
                `;
                $('#leaderboardBody').append(row);
            });
        },
        error: function() {
            console.log('Failed to fetch leaderboard data');
        }
    });
}

// Auto refresh every 30 seconds
setInterval(updateLeaderboard, 30000);