const background = document.getElementById("backgroundCanvas");
const character = document.getElementById("characterCanvas");

const bgCtx = background.getContext("2d");
const charCtx = character.getContext("2d");

document.addEventListener("resize", () => {
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    character.height = window.innerHeight;
    character.width = window.innerWidth;
});

bgCtx.fillStyle = "black";
bgCtx.fillRect(10, 10, 100, 100);

charCtx.fillStyle = "green";
charCtx.fillRect(20, 20, 100, 100);