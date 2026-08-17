/* ---------- Lock screen ---------- */
const lockScreen = document.getElementById('lock-screen');
const lockForm = document.getElementById('lock-form');
const lockInput = document.getElementById('lock-input');
const lockCard = document.querySelector('.lock-card');
const lockError = document.getElementById('lock-error');
const site = document.getElementById('site');

function b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveKey(passcode) {
  const salt = b64ToBytes(ENC_SALT);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passcode), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ENC_ITER, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

async function decryptImage(key, name) {
  const rec = ENC_IMAGES[name];
  const iv = b64ToBytes(rec.iv);
  const data = b64ToBytes(rec.data);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  const blob = new Blob([plain], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
}

async function unlockWithPasscode(passcode) {
  const key = await deriveKey(passcode);
  const firstName = Object.keys(ENC_IMAGES)[0];
  const firstUrl = await decryptImage(key, firstName);
  applyImage(firstName, firstUrl);
  const rest = Object.keys(ENC_IMAGES).slice(1);
  await Promise.all(rest.map(name =>
    decryptImage(key, name).then(url => applyImage(name, url))
  ));
}

function applyImage(name, url) {
  document.querySelectorAll(`[data-photo="${name}"]`).forEach(img => {
    img.src = url;
  });
}

lockForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const passcode = lockInput.value.trim();
  if (!passcode) return;
  try {
    await unlockWithPasscode(passcode);
    lockScreen.classList.add('hide');
    site.hidden = false;
    document.body.style.overflow = 'auto';
    setTimeout(initReveals, 100);
  } catch (err) {
    lockError.classList.add('show');
    lockCard.classList.remove('shake');
    void lockCard.offsetWidth;
    lockCard.classList.add('shake');
  }
});

/* ---------- Ambient falling petals ---------- */
function spawnPetals(container, count) {
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
spawnPetals(document.querySelector('.petals-lock'), 18);
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
