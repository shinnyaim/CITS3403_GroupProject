// ==========================================
// TAB SWITCHING (LOGIN / SIGNUP)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Exit if elements don't exist
  if (!loginTab || !signupTab || !loginForm || !signupForm) {
    console.warn("Auth tab elements not found");
    return;
  }

  function switchMode(mode) {
    const isLogin = mode === "login";

    loginForm.style.display = isLogin ? "block" : "none";
    signupForm.style.display = isLogin ? "none" : "block";

    loginTab.classList.toggle("active", isLogin);
    signupTab.classList.toggle("active", !isLogin);
  }

  loginTab.addEventListener("click", () => switchMode("login"));
  signupTab.addEventListener("click", () => switchMode("signup"));

  switchMode("login");

  // ==========================================
  // CLIENT-SIDE VALIDATION
  // ==========================================

  const loginFormEl = document.querySelector("#loginForm form");
  const signupFormEl = document.querySelector("#signupForm form");
  const errorBox = document.getElementById("loginError");

  if (loginFormEl) {
    loginFormEl.addEventListener("submit", (e) => {
      const email = loginFormEl.email.value.trim();
      const password = loginFormEl.password.value;

      let errors = [];

      if (!email.includes("@")) {
        errors.push("Enter a valid email address.");
      }

      if (password.length < 6) {
        errors.push("Password must be at least 6 characters.");
      }

      if (errors.length > 0) {
        e.preventDefault();
        alert("Login failed:\n\n" + errors.join("\n"));
      }
    });
  }

  // SIGNUP validation 
  if (signupFormEl) {
    signupFormEl.addEventListener("submit", (e) => {
      const username = signupFormEl.username.value.trim();
      const email = signupFormEl.email.value.trim();
      const password = signupFormEl.password.value;

      let errors = [];

      if (username.length < 3) {
        errors.push("Username must be at least 3 characters.");
      }

      if (!email.includes("@")) {
        errors.push("Please enter a valid email address.");
      }

      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
      }

      if (errors.length > 0) {
        e.preventDefault();
        alert("Sign up failed:\n\n" + errors.join("\n"));
      }
    });
  }
});


// ==========================================
// DISPLAY FLASH MESSAGES
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const errorBox = document.getElementById("loginError");

  if (!errorBox) {
    console.warn("Error box not found");
    return;
  }

  const errorText = errorBox.innerText.trim();

  if (errorText) {
    errorBox.classList.add("show");
  }
});


// ==========================================
// CLEAR ERROR ON INPUT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.querySelector("#loginForm form");
  const errorBox = document.getElementById("loginError");

  if (!loginFormEl || !errorBox) return;

  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      errorBox.classList.remove("show");
    });
  });
});