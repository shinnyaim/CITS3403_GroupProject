from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(64), unique=True, nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'
    
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


class GameSession(db.Model):
    id             = db.Column(db.Integer, primary_key=True)
    user_id        = db.Column(db.Integer, db.ForeignKey('user.id'))
    group_name     = db.Column(db.String(100))
    
    morale         = db.Column(db.Integer, default=100)
    progress       = db.Column(db.Integer, default=0)
    day            = db.Column(db.Integer, default=1)
    status         = db.Column(db.String(20), default='in_progress')
    overall_score  = db.Column(db.Float, default=0.0)
    
    teammate_ids   = db.Column(db.String(100))
    seen_event_ids = db.Column(db.String(100))
    event_log      = db.Column(db.Text)
    current_event  = db.Column(db.Text)
    started_at     = db.Column(db.DateTime)

    user = db.relationship('User', backref='sessions')





class Teammate(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(50), nullable=False)
    role        = db.Column(db.String(100))
    description = db.Column(db.Text)
    image       = db.Column(db.String(200))
    emoji       = db.Column(db.String(10))
    events      = db.relationship('EventCard', back_populates='teammate')

class EventCard(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    teammate_id = db.Column(db.Integer, db.ForeignKey('teammate.id'))
    teammate    = db.relationship('Teammate', back_populates='events')

    option_a          = db.Column(db.String(200))
    option_a_morale   = db.Column(db.Integer, default=0)
    option_a_progress = db.Column(db.Integer, default=0)

    option_b          = db.Column(db.String(200))
    option_b_morale   = db.Column(db.Integer, default=0)
    option_b_progress = db.Column(db.Integer, default=0)

    option_c          = db.Column(db.String(200))
    option_c_morale   = db.Column(db.Integer, default=0)
    option_c_progress = db.Column(db.Integer, default=0)

class PlayerProfile(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    avatar       = db.Column(db.String(50), default='sprite3.png')
    games_played = db.Column(db.Integer, default=0)
    total_morale = db.Column(db.Integer, default=0)
    best_grade   = db.Column(db.String(10), default='N/A')
    fastest_days = db.Column(db.Integer, default=14)
    rank_title  = db.Column(db.String(100), default='Novice')
    total_wins    = db.Column(db.Integer, default=0)
