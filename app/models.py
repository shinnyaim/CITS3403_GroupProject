from app import db

class Teammate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(100))                        
    description = db.Column(db.Text)                     
    image = db.Column(db.String(200))                    
    emoji = db.Column(db.String(10))
    events = db.relationship('EventCard', back_populates='teammate')


class EventCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)

    # foreign key — same pattern as student.group_id in slides
    teammate_id = db.Column(db.Integer, db.ForeignKey('teammate.id'))
    teammate = db.relationship('Teammate', back_populates='events')

    # options for the event card and its effects on morale and progress
    option_a = db.Column(db.String(200))
    option_a_morale = db.Column(db.Integer, default=0)
    option_a_progress = db.Column(db.Integer, default=0)

    option_b = db.Column(db.String(200))
    option_b_morale = db.Column(db.Integer, default=0)
    option_b_progress = db.Column(db.Integer, default=0)

    option_c = db.Column(db.String(200))
    option_c_morale = db.Column(db.Integer, default=0)
    option_c_progress = db.Column(db.Integer, default=0)
                