from flask import jsonify, request, render_template
from app import app, db
from app.models import EventCard, GameResult
import random

# --- Page routes --- serve each HTML page when the browser navigates to that URL

@app.route('/')
def index():
    return render_template('grp-project-name.html')

@app.route('/loading')
def loading():
    return render_template('loading.html')

@app.route('/game')
def game():
    return render_template('gameRound.html')

@app.route('/outcome')
def outcome():
    return render_template('outcome.html')

@app.route('/api/random-event')
def random_event():
    """Returns a random event card filtered to the player's current teammates."""
    ids_param = request.args.get('teammate_ids', '')
    seen_param = request.args.get('seen', '')

    if not ids_param:
        return jsonify({'error': 'No teammates provided'}), 400

    teammate_ids = [int(i) for i in ids_param.split(',')]
    seen_ids = [int(i) for i in seen_param.split(',') if seen_param]

    # filter to current teammates and exclude already seen cards
    events = EventCard.query.filter(
        EventCard.teammate_id.in_(teammate_ids),
        ~EventCard.id.in_(seen_ids)
    ).all()

    if not events:
        return jsonify({'error': 'No events found'}), 404

    event = random.choice(events)

    return jsonify({
        'id': event.id,
        'title': event.title,
        'description': event.description,
        'teammate': event.teammate.name,
        'options': [
            {'text': event.option_a, 'morale': event.option_a_morale, 'progress': event.option_a_progress},
            {'text': event.option_b, 'morale': event.option_b_morale, 'progress': event.option_b_progress},
            {'text': event.option_c, 'morale': event.option_c_morale, 'progress': event.option_c_progress},
        ]
    })

# Serves the leaderboard page
@app.route('/leaderboard')
def leaderboard():
    results = GameResult.query.order_by(
        GameResult.progress.desc(),
        GameResult.morale.desc()
    ).all()

    if not results:
        from collections import namedtuple
        FakeResult = namedtuple('FakeResult', ['username', 'group_name', 'outcome', 'progress', 'morale', 'days_taken'])
        results = [
            FakeResult('Jozelle', 'Team Ctrl+Alt+Defeat', 'HD', 95, 80, 12),
            FakeResult('Bob', 'Bobbers', 'Pass', 62, 25, 14),
            FakeResult('Alice', '404 Not Found', 'Fail', 38, 10, 14),
        ]
        
    return render_template('leaderboard.html', results=results)

# AJAX endpoint — returns fresh leaderboard data as JSON
@app.route('/api/leaderboard')
def leaderboard_data():
    results = GameResult.query.order_by(
        GameResult.progress.desc(),
        GameResult.morale.desc()
    ).all()
    data = [{
        'username': r.username,
        'group_name': r.group_name,
        'progress': r.progress,
        'morale': r.morale,
        'days_taken': r.days_taken,
        'outcome': r.outcome
    } for r in results]
    return jsonify(data)

# Saves a completed game result to the database
@app.route('/api/save-result', methods=['POST'])
def save_result():
    data = request.get_json()

    result = GameResult(
        username=data['username'],
        group_name=data['group_name'],
        progress=data['progress'],
        morale=data['morale'],
        days_taken=data['days_taken'],
        outcome=data['outcome']
    )

    db.session.add(result)
    db.session.commit()

    return jsonify({'message': 'Result saved successfully'}), 201