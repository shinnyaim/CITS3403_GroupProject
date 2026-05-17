
// ==========================================
// MODULE 1: TAB SWITCHING (LOGIN / SIGNUP)
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
});

// ==========================================
// MODULE 2: DISPLAY FLASH MESSAGES FOR SELENIUM
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
// MODULE 3: FORM SUBMISSION (NORMAL POST)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const loginFormEl = document.querySelector("#loginForm form");
  const errorBox = document.getElementById("loginError");
  
  if (!loginFormEl || !errorBox) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      errorBox.classList.remove("show");
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      errorBox.classList.remove("show");
    });
  }


});