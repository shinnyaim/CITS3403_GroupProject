Group Project Simulator
:---

| UWA ID   | Name           | GitHub User Name |
| :------- | :------------- | :--------------- |
| 24849627 | Jo Almero      | Jo               |
| 24464914 | Nafis Biswas   | Nafis            |
| 24436991 | Shin Nyaim Thu | Shin             |

**Game Summary and Design**

Group Project Simulator is a Flask-based web game that simulates the experience of completing a university group assignment with stereotypical teammate personalities.

Players interact with random event cards and must choose how to respond to group conflicts, poor teamwork, and deadline pressure.

The game includes:
- random teammate assignment
- morale and progress tracking
- multiple endings
- persistent save sessions
- leaderboard system
- player profile with previous games statistics

The game is inspired by narrative choice games such as:
- Episode
- BitLife
- Reigns

**Features**

- User authentication (sign up/login/logout)
- Persistent player profiles
- Leaderboard system
- Random teammate assignment
- Event-card decision gameplay
- Multiple endings based on player performance
- Responsive frontend using Bootstrap

**Tech Stack**

Backend:

- Python
- Flask
- SQLAlchemy
- Flask-Login

Frontend:

- HTML
- CSS 
- Javascript
- JQuery
- Bootstrap

Database:

- SQLite

Testing:

- unittest
- Selenium WebDriver

**Installation**

1. Clone repository

git clone <repository-url>
cd CITS3403_GroupProject

2. Create virtual environment

python -m venv venv

3. Activate virtual environment

for Windows: venv\Scripts\activate
for Mac/Linux: source venv/bin/activate

4. Install dependencies

pip install -r requirements.txt

5. Run application

python run.py

Opens browser:

http://127.0.0.1:5000


**Instructions for how to run the tests for the application.**

**:UNIT TESTING**
For unit testing, we've setup a fake database. The functions are stored in functions.py while the unit tests are in test.py, where assertions are applied on
the functions.

To run all tests:
python -m unittest test.py

To run a specific function:
python -m unittest test.BasicTests.unit_test
Example: python -m unittest test.BasicTests.test_password_match_true

**:SYSTEM TESTING (SELENIUM WebDriver)**
Sytem tests verify the application's behaviour in a real browser using Selenium WebDriver. These tests simulate user interactions with the web interface

For installation:
pip install selenium

To run all system tests:
python -m unittest tests.test_system -v

Running a specific test:
python -m unittest tests.test_system.SystemTests.test_invalid_login_shows_error -v

python -m unittest tests.test_system.SystemTests.
test_leaderboard_has_players -v

python -m unittest tests.test_system.SystemTests.
test_mobile_responsiveness -v

python -m unittest tests.test_system.SystemTests.
test_login_then_view_dashboard -v

python -m unittest tests.test_system.SystemTests.
test_signup_creates_account -v

How system tests work:
1. Flask development server starts automatically on port 5000
2. Chrome browser opens and navigates to the application
3. Selenium commands interact with the webpage (typing, clicking, waiting)
4. Test assertions verify that expected behaviour occurred
5. Browser closes and resources are cleaned up

Expected output for successful tests:
test_invalid_login_shows_error (tests.test_system.SystemTests) ... ok
.
.
.
.

Ran 5 tests in ...s

OK

**Authentication**

Authentication is handled using FlaskLogin.

Current implemented features:

- Login
- Signup
- Logout
- Session management

**Gameplay**

Players:

1. Create/login to account
2. Start a run
3. Receive random teammates
4. Respond to event cards
5. Balance morale and progress
6. Submit before deadline

Game ends when:

- 14 days expire
- Morale reaches zero
- Early submission chosen

**License**

This project was created for educational purposes.