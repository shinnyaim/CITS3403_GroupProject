from flask import Blueprint, jsonify, render_template, redirect, url_for, request, flash
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.models import User

auth = Blueprint('auth', __name__)

@auth.route('/auth', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'signup':
            username = request.form.get('username')
            email    = request.form.get('email')
            password = request.form.get('password')

            if User.query.filter_by(email=email).first():
                flash('Email already registered.', 'error')
                return redirect(url_for('auth.login'))

            user = User(username=username, email=email)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(url_for('main.index'))

        elif action == 'login':
            email    = request.form.get('email')
            password = request.form.get('password')
            user     = User.query.filter_by(email=email).first()

            if not user or not user.check_password(password):
                flash('Invalid email or password.', 'error')
                return redirect(url_for('auth.login'))

            login_user(user)
            next_page = request.form.get('next')
            return redirect(url_for(f'main.{next_page}') if next_page else url_for('main.index'))

    return render_template('auth.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

@auth.route('/api/me')
def me():
    if current_user.is_authenticated:
        return jsonify({'id': current_user.id, 'username': current_user.username})
    return jsonify({'id': None}), 401