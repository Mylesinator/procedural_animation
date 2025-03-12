function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

function smoothstep(edge0, edge1, x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return (x ** 2 * (3-2*x));
}

let permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

for (let i = 0; i < 256; i++) {
    permutation.push(permutation[i]);
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

const background = document.getElementById("backgroundCanvas");
const character = document.getElementById("characterCanvas");

const bgCtx = background.getContext("2d");
const charCtx = character.getContext("2d");

function setCanvasSize() {
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    character.height = window.innerHeight;
    character.width = window.innerWidth;
}

window.addEventListener("resize", setCanvasSize);
setCanvasSize();

let pixelation = 5;
let size = 50; // 0 - 100
let center1 = 50; // 0 - 100
let center2 = 25; // 0 - 100
let speed = 3;

// Background Loop logic
setInterval(() => {
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

    for (let i = 0; i < background.width/pixelation; i++) {
        let x = i + (Date.now() / 1000 * speed);
        let y = ((perlin(x / 100, 0) + perlin(x / 10, 0)/50) * rSize) + background.height/(100/center2); // 2 layers of noise for more detail

        bgCtx.fillRect(i*pixelation, background.height-y, pixelation, y);
    }
}, 0);
