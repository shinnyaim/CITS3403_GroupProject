Name of App
GROUP PROJECT SIMULATOR

Description of app's purpose, explain design and use:
The app takes on a choice-based game while incorporating events and exaggerated stereotypical teammates of a school project. Two unique features of the app are
Event cards - cards that presents a typical incident that would occur in a group project (example: someonebody overwrites somebody's work), and Teammates, pre-written exaggerated characters that can influence the player's decision making when selecting a choice. Teammates are randomly generated before the start of each game.

During gameplay, users can either play all 14 rounds, which represents a Day, or submit early. Each round will present a event card along with three options that can affect the users' scores: Progress (how much work has been done) and Morale (the group's morale). Each options carry certain points of Progress and Morale, which can affect the user's outcome once they have completed all 14 days or have chosen to submit early. Additionally, each round will have a count down of 30 seconds. If the user doesn't select a choice, no points will be added and the app will resume the following round/Day.

The user can view their's and other players' scores on the Leaderboard, allowing them to compare and encourage users to try and beat their competitors' scores. They have the ability to filter the ranking either through Morale, Progress or Overall score (which is a combination of Morale, Progress and number of days the user took to complete each game log). Additionally, users can view their previous game logs and resume on current game logs.

The app takes on a pixel theme with blocky text to offer a more indie game-like feel. The overrall design is intended to provide a casual and entertaining experience while presenting a light-hearted exaggeration of a real-life group project situations.

| UWA ID   | Name           | GitHub User Name |
| :------- | :------------- | :--------------- |
| 24849627 | Jo Almero      | Jo               |
| 24464914 | Nafis Biswas   | Nafis            |
| 24436991 | Shin Nyaim Thu | Shin             |

Instructions for how to launch application
:---
...

Instructions for how to run the tests for the application.
UNIT TESTING:
For unit testing, we've setup a fake database. The functions are stored in functions.py while the unit tests are in test.py, where assertions are applied on
the functions.

To run all tests:
python -m unittest test.py

To run a specific function:
python -m unittest test.BasicTests.unit_test
Example: python -m unittest test.BasicTests.test_password_match_true
