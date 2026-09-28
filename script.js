const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let hearts = [];

const colors = [
  "#ff1680",
  "#ff3b9d",
  "#f50057",
  "#e84393",
  "#ff69b4",
  "#b83280",
  "#d65a91"
];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = canvas.clientWidth;
  height = canvas.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  hearts = [];

  // বিভিন্ন উচ্চতায় অনেকগুলো হার্ট
  for (let i = 0; i < 100; i++) {
    hearts.push(createHeart(true));
  }
}

function createHeart(randomY = false) {
  return {
    x: Math.random() * width,
    y: randomY
      ? Math.random() * height
      : height + Math.random() * 100,

    size: 10 + Math.random() * 28,
    speed: 0.6 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 0.45 + Math.random() * 0.55,
    rotation: (Math.random() - 0.5) * 0.3,
    rotationSpeed: (Math.random() - 0.5) * 0.008
  };
}

function drawHeart(heart) {
  const {
    x, y, size, color, alpha, rotation
  } = heart;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size / 30, size / 30);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  // হার্টের আকৃতি
  ctx.beginPath();
  ctx.moveTo(0, 10);

  ctx.bezierCurveTo(-25, -5, -15, -20, 0, -8);
  ctx.bezierCurveTo(15, -20, 25, -5, 0, 10);

  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < hearts.length; i++) {
    const heart = hearts[i];

    drawHeart(heart);

    heart.y -= heart.speed;
    heart.x += heart.drift;
    heart.rotation += heart.rotationSpeed;

    // স্ক্রিনের ওপর চলে গেলে আবার নিচে পাঠানো
    if (heart.y < -50) {
      hearts[i] = createHeart();
    }

    // পাশ দিয়ে বেরিয়ে গেলে বিপরীত পাশে আনা
    if (heart.x < -50) heart.x = width + 30;
    if (heart.x > width + 50) heart.x = -30;
  }

  // মাঝে মাঝে নতুন হার্ট যোগ হবে
  if (Math.random() < 0.25 && hearts.length < 150) {
    hearts.push(createHeart());
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();