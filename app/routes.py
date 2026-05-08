from flask import jsonify, request, render_template
from app import app, db
from app.models import EventCard, Teammate
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

@app.route('/api/random-teammates')
def random_teammates():
    all_teammates = Teammate.query.all()
    chosen = random.sample(all_teammates, 3)
    return jsonify([
        {'id': t.id, 'name': t.name, 'role': t.role, 'description': t.description, 'emoji': t.emoji}
        for t in chosen
    ])


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