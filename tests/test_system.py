import unittest
import threading
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from app import create_app


# -----------------------
# START FLASK SERVER ONCE
# -----------------------
def run_server():
    app = create_app()
    app.run(port=5000, debug=False, use_reloader=False)


class SystemTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.server = threading.Thread(target=run_server)
        cls.server.daemon = True
        cls.server.start()
        time.sleep(2)  # give Flask time to boot

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://127.0.0.1:5000")

    def tearDown(self):
        self.driver.quit()

    # -----------------------
    # TEST 1: INVALID LOGIN
    # -----------------------
    def test_invalid_login_shows_error(self):
        self.driver.get("http://127.0.0.1:5000/auth")

        self.driver.find_element(By.ID, "email").send_keys("wrong@test.com")
        self.driver.find_element(By.ID, "password").send_keys("wrongpass")
        self.driver.find_element(By.ID, "loginBtn").click()

        error = WebDriverWait(self.driver, 5).until(
            EC.visibility_of_element_located((By.ID, "loginError"))
        )

        self.assertIn("invalid", error.text.lower())

    # -----------------------
    # TEST 2: LEADERBOARD
    # -----------------------
    def test_leaderboard_has_players(self):
        self.driver.get("http://127.0.0.1:5000/leaderboard")

        rows = WebDriverWait(self.driver, 5).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "playerRow"))
        )

        self.assertGreater(len(rows), 0)

        first_user = rows[0].find_element(By.CLASS_NAME, "username").text
        self.assertTrue(len(first_user) > 0)