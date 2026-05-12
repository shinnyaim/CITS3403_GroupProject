document.addEventListener("DOMContentLoaded", () => {
  const tabs = {
    login: document.getElementById("loginTab"),
    signup: document.getElementById("signupTab")
  };

  const forms = {
    login: document.getElementById("loginForm"),
    signup: document.getElementById("signupForm")
  };

  if (!tabs.login || !tabs.signup || !forms.login || !forms.signup) return;

  function setMode(mode) {
    const isLogin = mode === "login";

    forms.login.style.display = isLogin ? "block" : "none";
    forms.signup.style.display = isLogin ? "none" : "block";

    tabs.login.classList.toggle("active", isLogin);
    tabs.signup.classList.toggle("active", !isLogin);
  }

  tabs.login.addEventListener("click", () => setMode("login"));
  tabs.signup.addEventListener("click", () => setMode("signup"));

  setMode("login");
});