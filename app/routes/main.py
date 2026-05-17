from flask import Blueprint, render_template, jsonify, request
from flask_login import current_user, login_required
from app import db
from app.models import EventCard, GameSession, Teammate, User, PlayerProfile
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

@main.route('/profile')
@login_required
def profile():

    best_session = (
        GameSession.query
        .filter_by(user_id=current_user.id, status='ended')
        .order_by(GameSession.overall_score.desc())
        .first()
    )

    return render_template(
        'profile.html',
        best_session=best_session
    )

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
    session.day = data.get('currentDay', session.day)
    session.seen_event_ids = data.get('seen_event_ids', session.seen_event_ids)
    session.event_log = data.get('event_log', session.event_log)
    session.current_event = data.get('current_event', session.current_event)

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
    session.overall_score = data.get('overall_score')
    db.session.commit()
    return jsonify({'ok': True})

@main.route('/api/sessions/get', methods=['GET'])
def get_sessions():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Login required'}), 401
    all_sessions = GameSession.query.filter_by(user_id=current_user.id).all()

    return jsonify([{
        'session_id': session.id,
        'group_name': session.group_name,
        'morale': session.morale,
        'progress': session.progress,
        'currentDay': session.day,
        'status': session.status,
        'started_at': session.started_at.isoformat(),
        'overall_score': session.overall_score
    } for session in all_sessions])


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
        'currentDay': session.day + 1,  # add 1 because we want to show the next day when resuming
        'seen_event_ids': session.seen_event_ids or '',
        'event_log': session.event_log or '[]',
        'current_event': session.current_event or 'null',
        'teammates': [{'id': t.id, 'name': t.name, 'role': t.role, 'description': t.description, 'emoji': t.emoji} for t in teammates]
    })


@main.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html')


@main.route('/api/sessions/get_all/overall')
def leaderboard_data():
    all_sessions = GameSession.query.filter_by(status='ended').order_by(GameSession.overall_score.desc()).all()
    return jsonify([{
        'username': session.user.username,
        'group_name': session.group_name,
        'progress': session.progress,
        'morale': session.morale,
        'currentDay': session.day,
        'overall_score': session.overall_score or 0,
        'session_id': session.id
    } for session in all_sessions])

@main.route('/api/sessions/get_all/progress')
def leaderboard_progress():
    all_sessions = GameSession.query.filter_by(status='ended').order_by(GameSession.progress.desc()).all()
    return jsonify([{
        'username': session.user.username,
        'group_name': session.group_name,
        'progress': session.progress,
        'morale': session.morale,
        'currentDay': session.day,
        'overall_score': session.overall_score or 0,
        'session_id': session.id
    } for session in all_sessions])

@main.route('/api/sessions/get_all/morale')
def leaderboard_morale():
    all_sessions = GameSession.query.filter_by(status='ended').order_by(GameSession.morale.desc()).all()
    return jsonify([{
        'username': session.user.username,
        'group_name': session.group_name,
        'progress': session.progress,
        'morale': session.morale,
        'currentDay': session.day,
        'overall_score': session.overall_score or 0,
        'session_id': session.id
    } for session in all_sessions])

@main.route('/api/sessions/get_all/days')
def leaderboard_days():
    all_sessions = GameSession.query.filter_by(status='ended').order_by(GameSession.day.desc()).all()
    return jsonify([{
        'username': session.user.username,
        'group_name': session.group_name,
        'progress': session.progress,
        'morale': session.morale,
        'currentDay': session.day,
        'overall_score': session.overall_score or 0,
        'session_id': session.id
    } for session in all_sessions])

@main.route('/api/user/profile', methods=['GET'])
@login_required
def get_user_profile():
    player_profile = PlayerProfile.query.filter_by(user_id=current_user.id).first()
    if not player_profile:
        player_profile = PlayerProfile(user_id=current_user.id)
        db.session.add(player_profile)
        db.session.commit()

        # get best session
        best_session = (
            GameSession.query.filter_by(user_id=current_user.id, status='ended')
            .order_by(GameSession.overall_score.desc())
            .first()
        )

        #calculate stats from all sessions
        all_sessions = GameSession.query.filter_by(user_id=current_user.id, status='ended').all()

        games_played = len(all_sessions)
        best_grade = 'N/A'
        avg_morale = 0
        fastest_days = 14

        if all_sessions:
            scores = [s.overall_score for s in all_sessions if s.overall_score]
            morales = [s.morale for s in all_sessions if s.morale]
            days = [s.day for s in all_sessions if s.day]

            # Convert score to grade (assuming 0-100 scale like in UWA)
            best_score = max(scores) if scores else 0
            if best_score >= 90:
                best_grade = 'HD'
            elif best_score >= 80:
                best_grade = 'D'
            elif best_score >= 70:
                best_grade = 'C'
            elif best_score >= 60:
                best_grade = 'P'
            else:
                best_grade = 'F'
            
            avg_morale = int(sum(morales) / len(morales)) if morales else 0

            fastest_days = min(days) if days else 14
        
        response = {
            'username': current_user.username,
            'email': current_user.email,
            'avatar': player_profile.avatar,
            'rank': player_profile.rank_title,
            'stats': {
                'gamesPlayed': games_played,
                'bestGrade': best_grade,
                'avgMorale': avg_morale,
                'fastestDays': fastest_days
            },
            'bestRun': None
        }
        # Add best run details if exists
        if best_session:
            response['bestRun'] = {
                'groupName': best_session.group_name,
                'morale': best_session.morale,
                'progress': best_session.progress,
                'daysLeft': 14 - best_session.day,
                'overallScore': best_session.overall_score,
                'status': best_session.status,
                'startedAt': best_session.started_at.isoformat() if best_session.started_at else None
            }
    
        return jsonify(response)

@main.route('/api/user/avatar', methods=['POST'])
@login_required
def save_avatar():
    """
    Save avatar preference to database
    """
    data = request.json
    avatar = data.get('avatar')
 
    if not avatar:
        return jsonify({'error': 'No avatar provided'}), 400
 
    # Get or create PlayerProfile
    player_profile = PlayerProfile.query.filter_by(user_id=current_user.id).first()
    if not player_profile:
        player_profile = PlayerProfile(user_id=current_user.id, avatar=avatar)
        db.session.add(player_profile)
    else:
        player_profile.avatar = avatar
 
    db.session.commit()
    return jsonify({'ok': True, 'avatar': avatar})