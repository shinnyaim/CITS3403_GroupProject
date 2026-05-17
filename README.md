| UWA ID   | Name           | GitHub User Name |
| :------- | :------------- | :--------------- |
| 24849627 | Jo Almero      | jozellerebecca   |
| 24464914 | Nafis Biswas   | nafisbiswas      |
| 24436991 | Shin Nyaim Thu | shinnyaim        |

**Name of App:**

GROUP PROJECT SIMULATOR

**Description of app's purpose, explain design and use:**

The app takes on a choice-based game while incorporating events and exaggerated stereotypical teammates of a school project. 
Two unique features of the app are:
- Event cards - cards that presents a typical incident that would occur in a group project (example: someonebody overwrites somebody's work)
- Teammates - pre-written exaggerated characters that can influence the player's decision making when selecting a choice. Teammates are randomly generated before the start of each game.

During gameplay, users can either play all 14 rounds, which represents a Day, or choose to submit early. Each round will present a event card along with three options that can affect the users' scores.

There are two measurements shown through bars which are
- Progress (how much work has been done)
- Morale (the group's morale).

Each options carry certain points of Progress and Morale, which can affect the user's outcome once they have completed all 14 days or have chosen to submit early. Additionally, each round will have a count down of 30 seconds. If the user doesn't select a choice, no points will be added and the app will resume the following round/Day.

The user can view their's and other players' scores on the Leaderboard, allowing them to compare and encourage users to try and beat their competitors' scores. They have the ability to filter the ranking either through Morale, Progress or Overall score (which is a combination of Morale, Progress and number of days the user took to complete each game log). 

Additionally, users can view their previous game logs and resume on current game logs.

**Design:**

The app takes on a pixel theme with blocky text to offer a more indie game-like feel. The overrall design is intended to provide a casual and entertaining experience while presenting a light-hearted exaggeration of a real-life group project situations.

**Tech Stack:**

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

**Instructions for how to launch application:**

1. The user first needs to clone the repo into their IDE
2. The user will need to generate their own secret key
3. User should first check if .env is on .gitignore
4. Install dotenv by: pip install python-dotenv
5. Create a .env file on the root branch
6. Generate a secret key by using this command on their terminal: python -c "import secrets; print(secrets.token_hex(32))"
7. Put the secret key in the .env file by: SECRET_KEY= generated key
8. Create a virtual environment through this command: python -m venv venv
9. Activate the virtual environment by Windows: venv\Scripts\activate , for Mac/Linux: source venv/bin/activate
10. Install dependencies: pip install -r requirements.txt
11. Run the application through the command: python run.py
12. Click on the URL that will appear in the terminal: http://127.0.0.1:5000
13. To quit, enter CTRL+C

**Instructions for how to run the tests for the application:**

UNIT TESTING:
For unit testing, we've setup a fake database. The functions are stored in functions.py while the unit tests are in unitTest.py, where assertions are applied on
the functions.

To run all tests:

python -m unittest unitTest.py

To run a specific function:

python -m unittest unitTest.BasicTests.unit_test
Example: python -m unittest unitTest.BasicTests.test_password_match_true

**Instructions for Selenium testing:**

SYSTEM TESTING:
These tests verify the application's behaviour in a real browser using Selenium WebDriver, simulating user interactions with the web interface.

To install:

pip install selenium

To run all tests:

python -m unittest seleniumTest.test_system -v

To run a specific function:

python -m unittest tests.test_system.SystemTests.system_test
Example: python -m unittest seleniumTest.SystemTests.test_invalid_login_shows_error -v

**License**

This project was created for educational purposes
