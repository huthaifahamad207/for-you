/* ---------- Ambient falling petals ---------- */
function spawnPetals(container, count) {
if (!container) return;
for (let i = 0; i < count; i++) {
const petal = document.createElement('div');
petal.className = 'petal';
petal.style.left = Math.random() * 100 + '%';
petal.style.animationDuration = (8 + Math.random() * 10) + 's';
petal.style.animationDelay = (Math.random() * 10) + 's';
petal.style.opacity = 0.3 + Math.random() * 0.4;
const size = 6 + Math.random() * 8;
petal.style.width = size + 'px';
petal.style.height = size + 'px';
container.appendChild(petal);
}
}
spawnPetals(document.querySelector('.petals'), 22);

/* ---------- Scroll reveals ---------- */
function initReveals() {
const items = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('in');
io.unobserve(entry.target);
}
});
}, { threshold: 0.15 });
items.forEach(item => io.observe(item));
}
initReveals();

/* ---------- The Question ---------- */
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const celebration = document.getElementById('celebration');
const confettiLayer = document.getElementById('confetti-layer');

let noMoves = 0;
function dodge() {
noMoves++;
const maxX = 90, maxY = 40;
const x = (Math.random() - 0.5) * maxX * 2;
const y = (Math.random() - 0.5) * maxY * 2;
btnNo.style.transform = `translate(${x}px, ${y}px)`;
const phrases = ["nope", "try again", "nice try", "not an option", "keep trying", "still no"];
if (noMoves <= phrases.length) btnNo.textContent = phrases[noMoves - 1];
}
btnNo.addEventListener('mouseenter', dodge);
btnNo.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });

btnYes.addEventListener('click', () => {
celebration.hidden = false;
document.body.style.overflow = 'hidden';
burstConfetti();
});

function burstConfetti() {
const emojis = ['💗', '🌸', '✨', '💐', '🩷'];
for (let i = 0; i < 60; i++) {
const el = document.createElement('div');
el.className = 'confetto';
el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
el.style.left = Math.random() * 100 + '%';
el.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
el.style.animationDelay = (Math.random() * 1.2) + 's';
el.style.fontSize = (14 + Math.random() * 16) + 'px';
confettiLayer.appendChild(el);
}
}
