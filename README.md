Name of App
:---
'Description of app's purpose, explain design and use

| UWA ID   | Name           | GitHub User Name |
| :------- | :------------- | :--------------- |
| 24849627 | Jo Almero      | Jo               |
| 24464914 | Nafis Biswas   | Nafis            |
| 24436991 | Shin Nyaim Thu | Shin             |

Instructions for how to launch application
:---
...

Instructions for how to run the tests for the application.
:UNIT TESTING
For unit testing, we've setup a fake database. The functions are stored in functions.py while the unit tests are in test.py, where assertions are applied on
the functions.

To run all tests:
python -m unittest test.py

To run a specific function:
python -m unittest test.BasicTests.unit_test
Example: python -m unittest test.BasicTests.test_password_match_true

:SYSTEM TESTING (SELENIUM WebDriver)
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