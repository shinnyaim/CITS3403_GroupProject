function saveGameResult(username, groupName, progress, morale, daysTaken, outcome, chaosScore) {
    $.ajax({
        url: '/api/save-result',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: username,
            group_name: groupName,
            progress: progress,
            morale: morale,
            days_taken: daysTaken,
            outcome: outcome,
            chaos_score: chaosScore
        }),
        success: function() {
            // Redirect to outcome page after saving
            window.location.href = '/outcome';
        },
        error: function() {
            console.log('Failed to save result');
        }
    });
}