const background = document.getElementById("backgroundCanvas");
const ctx = background.getContext("2d");

document.addEventListener("resize", () => {
    background.height = window.innerHeight;
    background.width = window.innerWidth;
});

ctx.fillStyle = "black";
ctx.fillRect(10, 10, 100, 100);