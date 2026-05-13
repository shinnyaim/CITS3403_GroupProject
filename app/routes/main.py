from flask import Blueprint, render_template, jsonify, request
from flask_login import current_user, login_required
from app import db
from app.models import EventCard, GameSession, Teammate
from datetime import datetime, timezone
import random

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/setup')
def home():
    return render_template('grp-project-name.html')

# --- Page routes --- serve each HTML page when the browser navigates to that URL
@main.route('/instructions')
def instructions():
    return render_template('How_to_play.html')

@main.route('/loading')
def loading():
    return render_template('loading.html')

@main.route('/game')
def game():
    return render_template('gameRound.html')

@main.route('/outcome')
def outcome():
    return render_template('outcome.html')

@main.route('/api/random-teammates')
def random_teammates():
    all_teammates = Teammate.query.all()
    if len(all_teammates) < 3:
        return jsonify({'error': 'Not enough teammates'}), 400

    chosen = random.sample(all_teammates, 3)
    return jsonify([
        {'id': t.id, 'name': t.name, 'role': t.role, 'description': t.description, 'emoji': t.emoji}
        for t in chosen
    ])

@main.route('/api/random-event')
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


@main.route('/api/session/start', methods=['POST'])
@login_required
def start_session():
    data = request.json
    group_name = data.get('group_name')
    teammate_ids = data.get('teammate_ids', [])

    session = GameSession(
        user_id=current_user.id,
        group_name=group_name,
        teammate_ids=','.join(map(str, teammate_ids)),
        started_at=datetime.now(timezone.utc)
    )

    db.session.add(session)
    db.session.commit()

    return jsonify({'session_id': session.id})

@main.route('/api/session/update', methods=['POST'])
def update_session():
    data = request.json
    session_id = data.get('session_id')
    session = db.session.get(GameSession, session_id)

    session.morale = data.get('morale', session.morale)
    session.progress = data.get('progress', session.progress)
    session.day = data.get('day', session.day)
    session.seen_event_ids = data.get('seen_event_ids', session.seen_event_ids)

    db.session.commit()
    return jsonify({'ok': True})

@main.route('/api/session/end', methods=['POST'])
def end_session():
    data = request.json
    session_id = data.get('session_id')
    
    session = db.session.get(GameSession, session_id)

    if not session:
        return jsonify({'error': 'Session not found'}), 404

    session.status = 'ended'
    db.session.commit()
    return jsonify({'ok': True})

@main.route('/api/sessions/get', methods=['GET'])
def get_sessions():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Login required'}), 401
    sessions = GameSession.query.filter_by(user_id=current_user.id).all()

    return jsonify([{
        'id': s.id,
        'group_name': s.group_name,
        'morale': s.morale,
        'progress': s.progress,
        'days': s.day,
        'status': s.status,
        'started_at': s.started_at.isoformat()
    } for s in sessions])


@main.route('/api/session/resume/<int:session_id>', methods=['GET'])
def resume_session(session_id):

    session = db.session.get(GameSession, session_id)

    if not session or session.user_id != current_user.id:
        return jsonify({'error': 'Session not found'}), 404

    teammate_ids = [int(i) for i in session.teammate_ids.split(',') if session.teammate_ids]
    teammates = Teammate.query.filter(Teammate.id.in_(teammate_ids)).all()

    return jsonify({
        'session_id': session.id,
        'group_name': session.group_name,
        'morale': session.morale,
        'progress': session.progress,
        'day': session.day,
        'seen_event_ids': session.seen_event_ids or '',
        'teammates': [{'id': t.id, 'name': t.name, 'role': t.role, 'description': t.description, 'emoji': t.emoji} for t in teammates]
    })
