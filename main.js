import { NeatGradient } from "https://esm.sh/@firecms/neat@latest";

const config = {
    colors: [
        { color: '#85BB5B', enabled: true },
        { color: '#67EC69', enabled: true },
        { color: '#A5E659', enabled: true },
        { color: '#36AF3A', enabled: true },
        { color: '#4FFF6C', enabled: true },
    ],
    speed: 6.5,
    horizontalPressure: 4,
    verticalPressure: 10,
    waveFrequencyX: 1,
    waveFrequencyY: 1,
    waveAmplitude: 8,
    shadows: 4,
    highlights: 6,
    colorBrightness: 0.95,
    colorSaturation: -8,
    wireframe: false,
    colorBlending: 10,
    backgroundColor: '#87CB57',
    backgroundAlpha: 1,
    grainScale: 4,
    grainSparsity: 0,
    grainIntensity: 0.25,
    grainSpeed: 1,
    resolution: 1.25,
    yOffset: 0,
    yOffsetWaveMultiplier: 10,
    yOffsetColorMultiplier: 4.5,
    yOffsetFlowMultiplier: 11.1,
    flowDistortionA: 1.1,
    flowDistortionB: 0.8,
    flowScale: 1.6,
    flowEase: 0.32,
    flowEnabled: true,
    enableProceduralTexture: false,
    textureVoidLikelihood: 0.27,
    textureVoidWidthMin: 60,
    textureVoidWidthMax: 420,
    textureBandDensity: 1.2,
    textureColorBlending: 0.06,
    textureSeed: 333,
    textureEase: 0.22,
    proceduralBackgroundColor: '#0E0707',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: false,
    fresnelPower: 2,
    fresnelIntensity: 0.5,
    fresnelColor: '#FFFFFF',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.7,
    chromaticAberration: 0,
};

const gradient = new NeatGradient({
    ref: document.getElementById("gradient"),
    ...config
});

window.addEventListener("scroll", () => {
    gradient.yOffset = window.scrollY;
});

// Waitlist section gradient (same config)
const gradientWaitlist = new NeatGradient({
    ref: document.getElementById("gradient-waitlist"),
    ...config
});

window.addEventListener("scroll", () => {
    gradientWaitlist.yOffset = window.scrollY * 0.5;
});

// Nav scroll effect
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
});


// Hero rotating word animation
const rotatingWords = ['nutrition', 'progress', 'lifestyle', 'health'];
let wordIndex = 0;
const wordEl = document.getElementById('rotatingWord');

// Fix width to widest word so "your" doesn't shift
function setMaxWidth() {
  let max = 0;
  rotatingWords.forEach(word => {
    wordEl.textContent = word;
    max = Math.max(max, wordEl.offsetWidth);
  });
  wordEl.style.minWidth = max + 'px';
  wordEl.textContent = rotatingWords[0];
}
setMaxWidth();

function rotateWord() {
  wordEl.classList.add('word--exit');
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % rotatingWords.length;
    wordEl.textContent = rotatingWords[wordIndex];
    wordEl.classList.remove('word--exit');
    wordEl.classList.add('word--enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wordEl.classList.remove('word--enter');
      });
    });
  }, 350);
}

setInterval(rotateWord, 2500);

// Features bento cards — CSS animation triggered by IntersectionObserver
const bentoCards = [
  { id: 'card-meal-planning',  cls: 'bento-animate--right' },
  { id: 'card-grocery',        cls: 'bento-animate--left'  },
  { id: 'card-apple-health',   cls: 'bento-animate--right' },
  { id: 'card-ai-chat',        cls: 'bento-animate--left'  },
];

const bentoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('bento-animate--in');
      bentoObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

bentoCards.forEach(({ id, cls }) => {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add(cls);
    bentoObserver.observe(el);
  }
});

/* ============================================================
   BENTO ILLUSTRATION ANIMATIONS
   ============================================================ */

// ---- Utility ----
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Card 1: Meal Planning — cells check on loop ----
function initMealAnim() {
  const container = document.getElementById('meal-anim');
  if (!container) return;

  const allCells = Array.from(container.querySelectorAll('.meal-anim__cell'));
  const breakfast = allCells.filter(c => c.dataset.row === '0');
  const lunch     = allCells.filter(c => c.dataset.row === '1');
  const dinner    = allCells.filter(c => c.dataset.row === '2');

  function resetAll() {
    allCells.forEach(c => c.classList.remove('is-checked', 'is-popping'));
  }

  async function checkRow(row) {
    for (const cell of row) {
      cell.classList.add('is-popping', 'is-checked');
      await delay(280);
      cell.classList.remove('is-popping');
    }
  }

  async function runLoop() {
    resetAll();
    await checkRow(breakfast);
    await delay(300);
    await checkRow(lunch);
    await delay(300);
    await checkRow(dinner);
    await delay(1200);
    resetAll();
    await delay(500);
    runLoop();
  }

  runLoop();
}

// ---- Card 2: Grocery List — items appear and get checked on loop ----
function initGroceryAnim() {
  const container = document.getElementById('grocery-anim');
  if (!container) return;

  const items = Array.from(container.querySelectorAll('.grocery-anim__item'));
  const progressFill = document.getElementById('grocery-progress-fill');

  function resetAll() {
    items.forEach(item => {
      item.classList.remove('is-visible', 'is-checked');
    });
    if (progressFill) progressFill.style.width = '0%';
  }

  async function runLoop() {
    resetAll();
    await delay(300);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Item slides in
      item.classList.add('is-visible');
      await delay(450);

      // Checkbox gets checked with bounce
      item.classList.add('is-checked');

      // Progress bar advances
      const pct = Math.round(((i + 1) / items.length) * 100);
      if (progressFill) progressFill.style.width = pct + '%';

      await delay(500);
    }

    // Hold completed state
    await delay(1400);
    runLoop();
  }

  runLoop();
}

// ---- Card 3: Apple Health Rings — animate on loop ----
function initRingsAnim() {
  const container = document.getElementById('rings-anim');
  if (!container) return;

  const rings = container.querySelectorAll('.rings-anim__ring');

  async function runLoop() {
    // Reset — remove playing, restore dashoffset manually
    container.classList.remove('rings-anim--playing');
    rings.forEach(r => {
      r.style.animation = 'none';
      // Force reflow
      r.getBoundingClientRect();
    });

    await delay(400);

    // Restore to 0-animation state by removing inline override
    rings.forEach(r => {
      r.style.animation = '';
    });

    // Start playing
    container.classList.add('rings-anim--playing');

    // Wait for all rings to finish (slowest: steps 1.4s + 0.1s delay = 1.5s)
    await delay(1500 + 1000); // rings done + hold

    // Pause, then loop
    await delay(1200);
    runLoop();
  }

  runLoop();
}

// ---- Card 4: AI Chat — sequence on loop ----
function initChatAnim() {
  const container = document.getElementById('chat-anim');
  if (!container) return;

  const bubbleUser   = document.getElementById('chat-bubble-user');
  const bubbleAi     = document.getElementById('chat-bubble-ai');
  const typingEl     = document.getElementById('chat-typing');

  function resetAll() {
    bubbleUser.classList.remove('is-visible');
    bubbleAi.classList.remove('is-visible');
    typingEl.classList.remove('is-visible');
  }

  async function runLoop() {
    resetAll();
    await delay(500);

    // Step 1: user message appears (slide from right)
    bubbleUser.classList.add('is-visible');
    await delay(900);

    // Step 2: AI response appears (slide from left)
    bubbleAi.classList.add('is-visible');
    await delay(1200);

    // Step 3: typing dots appear (user typing follow-up)
    typingEl.classList.add('is-visible');
    await delay(1800);

    // Reset and loop
    resetAll();
    await delay(700);
    runLoop();
  }

  runLoop();
}

// ---- IntersectionObserver to start each animation when card is visible ----
function observeAndStart(cardId, initFn) {
  const card = document.getElementById(cardId);
  if (!card) return;

  let started = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        initFn();
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.05 });

  obs.observe(card);
}

observeAndStart('card-meal-planning', initMealAnim);
observeAndStart('card-grocery',       initGroceryAnim);
observeAndStart('card-apple-health',  initRingsAnim);
observeAndStart('card-ai-chat',       initChatAnim);

// ---- FAQ cascade animation — cards slide in from left one by one ----
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
faqItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-40px)';
  item.style.transition = `opacity 0.45s ease ${i * 0.1}s, transform 0.45s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`;
});

const faqObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      faqObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

faqItems.forEach(item => faqObserver.observe(item));
