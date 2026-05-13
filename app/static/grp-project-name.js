const groupNameForm = document.getElementById("groupNameForm");

if (groupNameForm) {
  groupNameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("grpName");
    const groupName = input?.value.trim();

    sessionStorage.setItem("groupName", groupName);
    window.location.href = "/loading";
  });
}