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
UNIT TESTING
For unit testing, we've setup a fake database. The functions are stored in functions.py while the unit tests are in test.py, where assertions are applied on
the functions.

To run all tests:
python -m unittest test.py

To run a specific function:
python -m unittest test.BasicTests.unit_test
Example: python -m unittest test.BasicTests.test_password_match_true
