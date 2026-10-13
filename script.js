'use strict';

const BELT_COLOR_NAMES = ['yellow', 'orange', 'green', 'blue', 'bluebrown'];
const BELT_LABEL = {
  yellow: 'YELLOW',
  orange: 'ORANGE',
  green: 'GREEN',
  blue: 'BLUE',
  bluebrown: 'BLUE/BROWN'
};

const filterInputs = Array.from(document.querySelectorAll('.filters input[type="checkbox"]'));
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalImageFallback = document.getElementById('modalImageFallback');
const startBtnMobile = document.getElementById('startFlashcardsMobile');
const stopBtnMobile = document.getElementById('stopFlashcardsMobile');
const card = document.getElementById('card');
const frontName = document.getElementById('frontName');
const frontMeta = document.getElementById('frontMeta');
const backContent = document.getElementById('backContent');
const btnPrev = document.getElementById('btnPrev');
const btnFlip = document.getElementById('btnFlip');
const btnNext = document.getElementById('btnNext');
const progressHint = document.getElementById('progressHint');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let deck = [];
let idx = 0;
let flipped = false;
let touchX = null;

function collectTechniques() {
  const items = [];

  BELT_COLOR_NAMES.forEach((belt) => {
    document.querySelectorAll(`[data-belt="${belt}"] .tech-link`).forEach((link) => {
      items.push({
        belt,
        name: link.dataset.name || link.textContent.trim(),
        href: link.getAttribute('href')
      });
    });
  });

  return items;
}

function getActiveBelts() {
  return filterInputs.filter((input) => input.checked).map((input) => input.value);
}

function applyListFilter() {
  const activeBelts = new Set(getActiveBelts());

  document.querySelectorAll('#lists [data-belt]').forEach((list) => {
    list.closest('section').hidden = !activeBelts.has(list.dataset.belt);
  });
}

function setImageState(image, fallback, isAvailable) {
  image.hidden = !isAvailable;
  fallback.hidden = isAvailable;
}

function showModal(name, href, belt) {
  modalTitle.textContent = name;
  modal.dataset.belt = BELT_COLOR_NAMES.includes(belt) ? belt : '';
  modalImg.alt = name;
  setImageState(modalImg, modalImageFallback, true);
  modalImg.src = href;

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function createTechniqueImage(technique) {
  const slab = document.createElement('div');
  const image = document.createElement('img');
  const fallback = document.createElement('p');

  slab.className = 'img-slab';
  image.src = technique.href;
  image.alt = technique.name;
  image.loading = 'lazy';
  image.decoding = 'async';
  fallback.className = 'image-fallback';
  fallback.textContent = 'Technique image unavailable.';
  fallback.hidden = true;

  image.addEventListener('error', () => setImageState(image, fallback, false), { once: true });
  slab.append(image, fallback);
  return slab;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function setControlsEnabled(enabled) {
  [btnPrev, btnFlip, btnNext].forEach((button) => {
    button.disabled = !enabled;
  });
  card.setAttribute('aria-disabled', String(!enabled));
}

function setFlipped(value) {
  flipped = value;
  card.classList.toggle('is-flipped', flipped);
  card.setAttribute('aria-pressed', String(flipped));
}

function render() {
  const technique = deck[idx];
  if (!technique) return;

  frontName.textContent = technique.name;
  frontMeta.textContent = BELT_LABEL[technique.belt] || technique.belt.toUpperCase();
  backContent.replaceChildren(createTechniqueImage(technique));
  progressHint.textContent = `${idx + 1} / ${deck.length}`;
  card.dataset.belt = technique.belt;
  card.setAttribute('aria-label', `${technique.name}. Activate to flip the flashcard.`);
  setFlipped(flipped);
}

function start() {
  const activeBelts = new Set(getActiveBelts());
  deck = shuffle(collectTechniques().filter((technique) => activeBelts.has(technique.belt)));

  if (!deck.length) {
    window.alert('Select at least one belt to start.');
    return;
  }

  idx = 0;
  startBtnMobile.hidden = true;
  stopBtnMobile.hidden = false;
  document.body.classList.add('studying');
  setControlsEnabled(true);
  setFlipped(false);
  render();

  if (window.matchMedia('(max-width: 900px)').matches) {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  card.focus({ preventScroll: true });
}

function stop() {
  deck = [];
  idx = 0;
  backContent.replaceChildren();
  startBtnMobile.hidden = false;
  stopBtnMobile.hidden = true;
  frontName.textContent = 'Select belts and press “Start Flashcards”.';
  frontMeta.textContent = 'Tap card to flip (mobile) • Space to flip (desktop) • ←/→ to navigate';
  progressHint.textContent = '0 / 0';
  delete card.dataset.belt;
  card.setAttribute('aria-label', 'Flashcard. Select belts and start a study session.');
  document.body.classList.remove('studying');
  setFlipped(false);
  setControlsEnabled(false);
  startBtnMobile.focus();
}

function next() {
  if (!deck.length) return;

  const advance = () => {
    idx = (idx + 1) % deck.length;
    render();
  };

  if (flipped && !reduceMotion.matches) {
    setFlipped(false);
    window.setTimeout(advance, 230);
  } else {
    setFlipped(false);
    advance();
  }
}

function previous() {
  if (!deck.length) return;

  const retreat = () => {
    idx = (idx - 1 + deck.length) % deck.length;
    render();
  };

  if (flipped && !reduceMotion.matches) {
    setFlipped(false);
    window.setTimeout(retreat, 230);
  } else {
    setFlipped(false);
    retreat();
  }
}

function flip() {
  if (deck.length) setFlipped(!flipped);
}

filterInputs.forEach((input) => input.addEventListener('change', applyListFilter));
document.getElementById('closeModal').addEventListener('click', () => modal.close());

document.getElementById('lists').addEventListener('click', (event) => {
  const link = event.target.closest('a.tech-link');
  if (!link) return;

  event.preventDefault();
  const beltList = link.closest('[data-belt]');
  showModal(link.dataset.name || link.textContent.trim(), link.href, beltList.dataset.belt);
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  modal.close();
});
modalImg.addEventListener('load', () => setImageState(modalImg, modalImageFallback, true));
modalImg.addEventListener('error', () => setImageState(modalImg, modalImageFallback, false));

startBtnMobile.addEventListener('click', start);
stopBtnMobile.addEventListener('click', stop);
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', previous);
btnFlip.addEventListener('click', flip);
card.addEventListener('click', flip);
card.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
    flip();
  }
});

window.addEventListener('keydown', (event) => {
  const targetIsInteractive = event.target instanceof Element
    && event.target.closest('a, button, input, select, textarea, [contenteditable="true"]');
  if (!deck.length || modal.open || targetIsInteractive) return;

  if (event.key === ' ') {
    event.preventDefault();
    flip();
  } else if (event.key === 'ArrowRight') {
    next();
  } else if (event.key === 'ArrowLeft') {
    previous();
  }
});

card.addEventListener('touchstart', (event) => {
  touchX = event.changedTouches[0].clientX;
}, { passive: true });

card.addEventListener('touchend', (event) => {
  if (touchX === null) return;

  const deltaX = event.changedTouches[0].clientX - touchX;
  touchX = null;
  if (Math.abs(deltaX) < 40) return;
  if (deltaX < 0) next(); else previous();
}, { passive: true });

applyListFilter();
setControlsEnabled(false);
