import unittest
from app.functions import passwordsMatch
from app import create_app, db
from app.models import User, GameSession, Teammate
from config import TestConfig
from datetime import datetime, timezone

class ResumeGameTestGame(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self._seed_data()
        self.client = self.app.test_client()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def _seed_data(self):
        # THIS JUST CREATES A TEST USER
        user = User(username='testplayer', email='test@test.com')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()

        teammate = Teammate(
            name='Josh',
            role='The Ghost',
            description='Disappears without warning',
            emoji='👻'
        )
        db.session.add(teammate)
        db.session.commit()

        #CREATES AN ACTIVE GAME SESSION FOR THE USER
        session = GameSession(
            user_id=user.id,
            group_name='Team Test',
            teammate_ids=str(teammate.id),
            morale=70,
            progress=30,
            day=5,
            status='active',
            started_at=datetime.now(timezone.utc)
        )
        db.session.add(session)
        db.session.commit()

    def _login(self):
    #HELPER FUNCTION FOR TEST USER TO LOGIN
        return self.client.post('/auth/login', data={
            'username': 'testplayer',
            'password': 'password123'
        }, follow_redirects=True)
        
    def test_password_match_true(self):
        self.assertTrue(passwordsMatch("123', '123"))

    def test_passwords_match_false(self):
        self.assertFalse(passwordsMatch('123', '456'))
