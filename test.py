import unittest
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