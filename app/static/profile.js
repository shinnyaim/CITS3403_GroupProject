// Load stats from sessionStorage (same system as gameRound)
let morale = sessionStorage.getItem("finalMorale") || 50;
let progress = sessionStorage.getItem("finalProgress") || 50;
let days = 14 - (sessionStorage.getItem("daysLeft") || 14);

function updateUI() {
    document.getElementById("moraleBar").style.width = morale + "%";
    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("daysBar").style.width = (days / 14) * 100 + "%";

    document.getElementById("moraleText").textContent = morale + "%";
    document.getElementById("progressText").textContent = progress + "%";
    document.getElementById("daysText").textContent = days + " / 14";
}

function resetProfile() {
    sessionStorage.clear();
    window.location.href = "/";
}

function goBack() {
    window.location.href = "/gameround";
}

updateUI();