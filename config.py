# HAD TO INSTALL:
# pip install python-dotenv
# to verify:
# pip show python-dotenv

import os

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv()
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')    

    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not set in environment variables")
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///game.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DeploymentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(basedir, 'test.db')

class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    TESTING = True
    WTF_CSRF_ENABLED = False