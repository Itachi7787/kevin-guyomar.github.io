// Navigation entre les pages (une seule page visible, choisie via l'adresse #...)
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-links a");

function showPage() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id) || pages[0];
  pages.forEach((p) => p.classList.toggle("active", p === target));
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + target.id)
  );
}

// Change de page sans que le navigateur fasse défiler l'écran
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2 || !document.querySelector(id)) return;
    e.preventDefault();
    if (location.hash !== id) history.pushState(null, "", id);
    showPage();
  })
);

window.addEventListener("hashchange", showPage);
window.addEventListener("popstate", showPage);
showPage();

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  })
);

// Fond étoilé animé (étoiles bleues qui scintillent et dérivent lentement)
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const colors = ["#60a5fa", "#93c5fd", "#bfdbfe", "#3b82f6", "#ffffff"];
let stars = [];

function createStars() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.floor((window.innerWidth * window.innerHeight) / 4000);
  stars = Array.from({ length: count }, () => {
    const depth = Math.random(); // 0 = loin, 1 = proche
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.3 + depth * 1.4,
      speed: 0.05 + depth * 0.35,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.5 + Math.random() * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
}

function drawStars(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const s of stars) {
    if (!reduceMotion) {
      s.y -= s.speed;
      if (s.y < -2) {
        s.y = window.innerHeight + 2;
        s.x = Math.random() * window.innerWidth;
      }
    }
    const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + (time / 1000) * s.twinkle));
    ctx.globalAlpha = reduceMotion ? 0.8 : alpha;
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = s.r * 4;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reduceMotion) requestAnimationFrame(drawStars);
}

createStars();
window.addEventListener("resize", () => {
  createStars();
  if (reduceMotion) drawStars(0);
});
requestAnimationFrame(drawStars);
