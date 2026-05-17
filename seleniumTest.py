import unittest
import threading
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from app import create_app


def run_server():
    app = create_app()
    app.run(port=5000, debug=False, use_reloader=False)


class SystemTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        from app import create_app, db
        from app.models import User  # adjust import to match your actual model path

        cls.flask_app = create_app()
        with cls.flask_app.app_context():
            if not User.query.filter_by(email="test@test.com").first():
                u = User(username="testuser", email="test@test.com")
                u.set_password("password123")
                db.session.add(u)
                db.session.commit()

        cls.server = threading.Thread(
            target=lambda: cls.flask_app.run(port=5000, debug=False, use_reloader=False)
        )
        cls.server.daemon = True
        cls.server.start()
        time.sleep(2)

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

    # -------------------------------
    # TEST 3: MOBILE RESPONSIVENESS
    # -------------------------------
    def test_mobile_responsiveness(self):
        #using iPhone SE size for baseline
        self.driver.set_window_size(375, 667)

        self.driver.get("http://127.0.0.1:5000")

        #wait for main UI to load
        title = WebDriverWait(self.driver, 5).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "game-title"))
        )

        #check key elements still exist
        start_btn = self.driver.find_element(By.ID, "startBtn")
        menu = self.driver.find_element(By.CLASS_NAME, "menu-list")

        self.assertTrue(title.is_displayed())
        self.assertTrue(start_btn.is_displayed())
        self.assertTrue(menu.is_displayed())

        # for ensuring no horizontal scroll
        body_width = self.driver.execute_script("return document.body.scrollWidth")
        viewport_width = self.driver.execute_script("return window.innerWidth")

        self.assertLessEqual(body_width, viewport_width + 5)
    
    # -----------------------------------------------------
    # TEST 4: TEST FULL USER FLOW: login -> see leaderboard
    # -----------------------------------------------------

    def test_login_then_view_dashboard(self):

        self.driver.get("http://127.0.0.1:5000/auth")

        # enter valid credentials (use a test account that exists)
        self.driver.find_element(By.ID, "email").send_keys("test@test.com")
        self.driver.find_element(By.ID, "password").send_keys("password123")
        self.driver.find_element(By.ID, "loginBtn").click()

        WebDriverWait(self.driver, 10).until(  # was 5
        lambda d: d.current_url == "http://127.0.0.1:5000/"
        )

        # assert we're logged in (example: start button exists)
        start_btn = self.driver.find_element(By.ID, "startBtn")
        self.assertTrue(start_btn.is_displayed())

    # -----------------------------------------------------
    # TEST 5: TEST SIGNUP FORM CREATES NEW USER
    # -----------------------------------------------------
    def test_signup_creates_account(self):
        self.driver.get("http://127.0.0.1:5000/auth")

        WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable((By.ID, "signupTab"))
        ).click()

        username_field = WebDriverWait(self.driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "#signupForm input[name='username']"))
        )

        timestamp = int(time.time())
        email = f"test_{timestamp}@test.com"
        username = f"testuser_{timestamp}"

        username_field.send_keys(username)
        self.driver.find_element(By.CSS_SELECTOR, "#signupForm input[name='email']").send_keys(email)
        self.driver.find_element(By.CSS_SELECTOR, "#signupForm input[name='password']").send_keys("password123")
        self.driver.find_element(By.ID, "signupBtn").click()

        # Signup redirects to /profile — wait for that
        WebDriverWait(self.driver, 10).until(
            lambda d: d.current_url == "http://127.0.0.1:5000/profile"
        )

        # Confirm we landed on the profile page (proves account was created and user is logged in)
        self.assertIn("/profile", self.driver.current_url)