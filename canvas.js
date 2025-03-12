function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

function smoothstep(edge0, edge1, x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return (x ** 2 * (3 - 2 * x));
}

let permutation = [
    ];

for (let i = 0; i < 256; i++) {
    permutation.push(Math.floor(Math.random() * 255));
}

let p = permutation;

function grad(hash, x, y) {
    let h = hash & 7;
    let u = h < 4 ? x : y;
    let v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
}

function perlin(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    let xf = x - Math.floor(x);
    let yf = y - Math.floor(y);

    let u = smoothstep(0, 1, xf);
    let v = smoothstep(0, 1, yf);

    let aa = p[p[X] + Y];
    let ab = p[p[X] + Y + 1];
    let ba = p[p[X + 1] + Y];
    let bb = p[p[X + 1] + Y + 1];

    let g1 = grad(aa, xf, yf);
    let g2 = grad(ba, xf - 1, yf);
    let g3 = grad(ab, xf, yf - 1);
    let g4 = grad(bb, xf - 1, yf - 1);

    let x1 = (1 - u) * g1 + u * g2;
    let x2 = (1 - u) * g3 + u * g4;
    return (1 - v) * x1 + v * x2;
}

const sky = document.getElementById("skyCanvas");
const background = document.getElementById("backgroundCanvas");
const character = document.getElementById("characterCanvas");

const skyCtx = sky.getContext("2d");
const bgCtx = background.getContext("2d");
const charCtx = character.getContext("2d");

function setCanvasSize() {
    sky.height = window.innerHeight;
    sky.width = window.innerWidth;
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    character.height = window.innerHeight;
    character.width = window.innerWidth;
}

window.addEventListener("resize", setCanvasSize);
setCanvasSize();

let pixelation = 5;
let size = 50; // 0 - 100
let center1 = 60; // 0 - 100
let center2 = 25; // 0 - 100
let speed = 3;

// Background Loop logic
setInterval(() => {
    skyCtx.fillStyle = "rgb(156, 235, 255)";
    skyCtx.fillRect(0, 0, sky.width, sky.height);

    bgCtx.clearRect(0, 0, background.width, background.height);
    bgCtx.fillStyle = "rgb(156, 235, 255)";
    bgCtx.fillRect(0, 0, background.width, background.height);
    let rSize = (size/100)*(background.height/2);

    for (let i = 0; i < background.width / pixelation; i++) {
        bgCtx.fillStyle = "black";
        let x = i + (Date.now() / 1000 * speed);
        let y = ((perlin(x / 100, 100) + perlin(-x / 10, 100) / 100) * rSize) + background.height / (100 / center1); // 2 layers of noise for more detail
        let y2 = ((perlin(x / 500, 50) + perlin(x / 10, 50) / 10) * (rSize/2)) + background.height / (100 / center1); // 2 layers of noise for more detail
        let dy = y - y2;

        bgCtx.fillRect(i * pixelation, background.height - y, pixelation, y);

        bgCtx.fillStyle = "white";
        if (dy > 0) {
            bgCtx.fillRect(i * pixelation, background.height - y, pixelation, dy);
        };
    }

    bgCtx.fillStyle = "rgb(46, 46, 46)";

    for (let i = 0; i < background.width / pixelation; i++) {
        let x = i + (Date.now() / 1000 * speed);
        let y = ((perlin(x / 100, 0) + perlin(x / 10, 0)/50) * rSize) + background.height / (100 / center2); // 2 layers of noise for more detail

        bgCtx.fillRect(i * pixelation, background.height - y, pixelation, y);
    }
}, 0);