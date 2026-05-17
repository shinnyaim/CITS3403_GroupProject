import unittest
from app.functions import (
    calculate_rank, 
    passwordsMatch,
    isValidEmail,
    checkCreds,
    canAccessSession,
    updateProgress)
from app import create_app, db
from app.models import User, GameSession, Teammate
from config import TestConfig
from datetime import datetime, timezone

class BasicTests(unittest.TestCase):
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
        
    def test_password_match_true(self):
        self.assertTrue(passwordsMatch("123", "123"))

    def test_passwords_match_false(self):
        self.assertFalse(passwordsMatch('123', '456'))

    def test_valid_email_true(self):
        self.assertTrue(isValidEmail("test@gmail.com"))

    def test_valid_email_false(self):
        self.assertFalse(isValidEmail("testemail.com"))
    
    def test_check_creds_true(self):
        self.assertTrue(checkCreds("pass123", "pass123"))

    def test_check_creds_false(self):
        self.assertFalse(checkCreds("pass123", "test"))

    def test_sess_true(self):
        self.assertTrue(canAccessSession(1, 1))

    def test_sess_false(self):
        self.assertFalse(canAccessSession(1, 2))

    def test_update_prog_normal(self):
        self.assertEqual(updateProgress(50, 10), 60)

    def test_update_prog_cap_at_100(self):
        self.assertEqual(updateProgress(95, 10), 100)
    
    # --- Rank tests ---
    def test_rank_none(self):
        self.assertEqual(calculate_rank(None), 'Novice')

    def test_rank_zero(self):
        self.assertEqual(calculate_rank(0), 'Novice')

    def test_rank_59(self):
        self.assertEqual(calculate_rank(59), 'Barely Made It')

    def test_rank_60(self):
        self.assertEqual(calculate_rank(60), 'Deadline Dodger')

    def test_rank_95(self):
        self.assertEqual(calculate_rank(95), 'Project Master')

