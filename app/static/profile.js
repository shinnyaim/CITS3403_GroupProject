// TEMPORARY FRONTEND DATA

let morale = 58;
let progress = 72;
let daysLeft = 8;

// UPDATE BARS

function updateBars() {

    document.getElementById("moraleBar").style.width = morale + "%";
    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("daysBar").style.width =
        (daysLeft / 14) * 100 + "%";

    document.getElementById("moraleText").textContent =
        morale + "%";

    document.getElementById("progressText").textContent =
        progress + "%";

    document.getElementById("daysText").textContent =
        `${daysLeft} / 14`;
}

// AVATAR SELECTION

const avatarOptions = document.querySelectorAll(".avatarOption");
const mainAvatar = document.querySelector(".mainAvatar");

avatarOptions.forEach(avatar => {

    avatar.addEventListener("click", () => {

        document
            .querySelector(".selectedAvatar")
            ?.classList.remove("selectedAvatar");

        avatar.classList.add("selectedAvatar");

        mainAvatar.src = avatar.src;
    });

});

// BUTTONS

function resumeRun() {
    window.location.href = "/gameround";
}

function newRun() {
    window.location.href = "/teamselection";
}

function viewLeaderboard() {
    window.location.href = "/leaderboard";
}

function logout() {
    window.location.href = "/";
}

updateBars();