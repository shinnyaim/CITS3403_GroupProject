from flask import jsonify, request, render_template
from app import app, db
from app.models import EventCard
import random

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
