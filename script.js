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

/* The "No" button teleports to a random spot anywhere in the viewport
   before any press can register, so it can never actually be pressed. */
let noMoves = 0;
function dodge() {
noMoves++;
// A transformed ancestor (.reveal) would otherwise turn "fixed" into
// "fixed relative to that ancestor" -- move the button to <body> first
// so it's always positioned relative to the real viewport.
if (btnNo.parentElement !== document.body) {
document.body.appendChild(btnNo);
}
const rect = btnNo.getBoundingClientRect();
const w = rect.width || 90;
const h = rect.height || 50;
const margin = 14;
const maxLeft = Math.max(margin, window.innerWidth - w - margin);
const maxTop = Math.max(margin, window.innerHeight - h - margin);
// Keep it in the lower two-thirds of the screen so it never covers the headline.
const minTop = Math.min(maxTop, window.innerHeight * 0.4);
const left = margin + Math.random() * (maxLeft - margin);
const top = minTop + Math.random() * Math.max(0, maxTop - minTop);
btnNo.style.position = 'fixed';
btnNo.style.zIndex = '50';
btnNo.style.left = left + 'px';
btnNo.style.top = top + 'px';
btnNo.style.margin = '0';
btnNo.style.transform = 'none';
const phrases = ["nope", "try again", "nice try", "not an option", "keep trying", "still no", "not happening", "not today"];
btnNo.textContent = phrases[Math.min(noMoves - 1, phrases.length - 1)];
}
btnNo.addEventListener('mouseenter', dodge);
btnNo.addEventListener('pointerenter', dodge);
btnNo.addEventListener('pointerdown', (e) => { e.preventDefault(); dodge(); });
btnNo.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodge(); }, { passive: false });
btnNo.addEventListener('focus', () => { dodge(); btnNo.blur(); });
window.addEventListener('resize', () => { if (noMoves > 0) dodge(); });

btnYes.addEventListener('click', () => {
celebration.hidden = false;
document.body.style.overflow = 'hidden';
burstConfetti();
});

/* ---------- Song ---------- */
const song = document.getElementById('song');
const musicToggle = document.getElementById('music-toggle');
let musicPausedByUser = false;

function updateMusicUI() {
if (!musicToggle || !song) return;
musicToggle.classList.toggle('playing', !song.paused);
}

function tryStartMusic() {
if (!song || musicPausedByUser) return;
const p = song.play();
if (p && p.catch) p.catch(() => {});
}

if (song) {
song.addEventListener('play', updateMusicUI);
song.addEventListener('pause', updateMusicUI);
['click', 'touchstart', 'scroll'].forEach(evt => {
document.addEventListener(evt, tryStartMusic, { once: true, passive: true });
});
}

if (musicToggle) {
musicToggle.addEventListener('click', () => {
if (!song) return;
if (song.paused) {
musicPausedByUser = false;
tryStartMusic();
} else {
musicPausedByUser = true;
song.pause();
}
});
}

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
