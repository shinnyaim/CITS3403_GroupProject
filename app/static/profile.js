let morale = parseInt(sessionStorage.getItem("finalMorale")) || 50;
let progress = parseInt(sessionStorage.getItem("finalProgress")) || 50;
let daysLeft = parseInt(sessionStorage.getItem("daysLeft")) || 7;

function updateUI() {
  document.getElementById("moraleBar").style.width = morale + "%";
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("daysBar").style.width = (daysLeft / 14) * 100 + "%";

  document.getElementById("moraleText").textContent = morale + "%";
  document.getElementById("progressText").textContent = progress + "%";
  document.getElementById("daysText").textContent = `${daysLeft} / 14`;
}

function resetProfile() {
  sessionStorage.clear();
  window.location.href = "/";
}

function goBack() {
  window.location.href = "/gameround";
}

updateUI();