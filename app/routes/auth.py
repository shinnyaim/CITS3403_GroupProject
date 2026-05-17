from flask import Blueprint, jsonify, render_template, redirect, url_for, request, flash
from flask_login import current_user, login_user, logout_user, login_required
from app import db
from app.models import User
from app.forms import LoginForm, SignupForm

auth = Blueprint('auth', __name__)


@auth.route('/auth', methods=['GET', 'POST'])
def auth_page():

    login_form = LoginForm()
    signup_form = SignupForm()

    # --------------------
    # SIGNUP FLOW
    # --------------------
    if signup_form.validate_on_submit() and request.form.get('action') == 'signup':

        username = signup_form.username.data
        email = signup_form.email.data
        password = signup_form.password.data

        if User.query.filter_by(email=email).first():
            flash('Email already registered.', 'error')
            return redirect(url_for('auth.auth_page'))

        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        login_user(user)
        return redirect(url_for('main.profile'))


    # --------------------
    # LOGIN FLOW
    # --------------------
    if login_form.validate_on_submit() and request.form.get('action') == 'login':

        email = login_form.email.data
        password = login_form.password.data

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            flash('Invalid email or password.', 'error')
            return redirect(url_for('auth.auth_page'))

        login_user(user)

        next_page = request.form.get('next')
        return redirect(next_page if next_page else url_for('main.index'))


    return render_template(
        'auth.html',
        login_form=login_form,
        signup_form=signup_form
    )


# --------------------
# LOGOUT
# --------------------
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


# --------------------
# CURRENT USER API
# --------------------
@auth.route('/api/me')
def me():
    if current_user.is_authenticated:
        return jsonify({
            'id': current_user.id,
            'username': current_user.username
        })

    return jsonify({'id': None}), 401