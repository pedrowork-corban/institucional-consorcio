// === NAV SCROLL ===
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// === MOBILE MENU ===
function openMobileMenu() { document.getElementById('mobileNav').classList.add('open'); }
function closeMobileMenu() { document.getElementById('mobileNav').classList.remove('open'); }

// === SCROLL ANIMATIONS ===
const animEls = document.querySelectorAll('.anim');
const animObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); animObs.unobserve(e.target); } });
}, { threshold: 0.15 });
animEls.forEach(el => animObs.observe(el));

// === COUNTER ANIMATION ===
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, target = +el.dataset.target;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 35);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObs.observe(el));

// === SIMULATION TABS ===
const simTabs = document.querySelectorAll('.sim-tab');
let selectedCategory = 'Imóvel';
simTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    simTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    selectedCategory = tab.dataset.cat;
    updateSliderRange();
  });
});

// === SIMULATION TOGGLE ===
const toggleBtns = document.querySelectorAll('.sim-toggle-btn');
let simMode = 'credito';
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    simMode = btn.dataset.mode;
    updateSliderRange();
  });
});

// === SLIDER ===
const slider = document.getElementById('simSlider');
const sliderValue = document.getElementById('sliderValue');
const sliderMin = document.getElementById('sliderMin');
const sliderMax = document.getElementById('sliderMax');

const ranges = {
  'Imóvel': { credito: { min: 50000, max: 1000000, step: 10000 }, parcela: { min: 500, max: 8000, step: 100 } },
  'Veículos': { credito: { min: 20000, max: 500000, step: 5000 }, parcela: { min: 300, max: 5000, step: 50 } },
  'Serviços': { credito: { min: 10000, max: 200000, step: 2000 }, parcela: { min: 200, max: 3000, step: 50 } }
};

function formatMoney(v) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 0 });
}

function updateSliderRange() {
  const r = ranges[selectedCategory]?.[simMode] || ranges['Imóvel']['credito'];
  slider.min = r.min;
  slider.max = r.max;
  slider.step = r.step;
  slider.value = Math.floor((r.min + r.max) / 2 / r.step) * r.step;
  sliderMin.textContent = formatMoney(r.min);
  sliderMax.textContent = formatMoney(r.max);
  updateSliderDisplay();
}

function updateSliderDisplay() {
  const val = +slider.value;
  sliderValue.textContent = formatMoney(val);
  const pct = ((val - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.setProperty('--val', pct + '%');
}

slider.addEventListener('input', updateSliderDisplay);
updateSliderRange();

// === OPEN SIMULATION MODAL ===
function openSimModal() {
  const val = +slider.value;
  document.getElementById('modalCategory').textContent = selectedCategory;
  document.getElementById('modalMode').textContent = simMode === 'credito' ? 'Valor do crédito' : 'Valor da parcela';
  document.getElementById('modalValue').textContent = formatMoney(val);
  document.getElementById('simModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSimModal() {
  document.getElementById('simModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('simModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'simModal') closeSimModal();
});

// === CONTACT MODAL ===
function openContactModal() {
  document.getElementById('contactModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('contactModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'contactModal') closeContactModal();
});

// === SERVICE CARD SIMULATE ===
function openFormModal(tipo) {
  // Set the tab
  simTabs.forEach(t => {
    t.classList.remove('active');
    if (t.dataset.cat === tipo || (tipo === 'Carro' && t.dataset.cat === 'Veículos') || (tipo === 'Máquina Agrícola' && t.dataset.cat === 'Veículos')) {
      t.classList.add('active');
      selectedCategory = t.dataset.cat;
    }
  });
  if (tipo === 'Serviço') {
    simTabs.forEach(t => { t.classList.remove('active'); if(t.dataset.cat==='Serviços'){t.classList.add('active');selectedCategory='Serviços';} });
  }
  updateSliderRange();
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
}

// === PHONE MASK ===
function maskPhone(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
  else if (v.length > 2) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
  else if (v.length > 0) v = '(' + v;
  el.value = v;
}

// === FORM SUBMIT ===
function handleSimSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    nome: form.querySelector('#m_nome').value,
    email: form.querySelector('#m_email').value,
    telefone: form.querySelector('#m_tel').value,
    cidade: form.querySelector('#m_cidade').value,
    lance: form.querySelector('#m_lance').value,
    categoria: selectedCategory,
    modo: simMode,
    valor: slider.value
  };
  console.log('Simulação:', data);
  showToast('Simulação enviada com sucesso! Entraremos em contato.', 'ok');
  closeSimModal();
  form.reset();
}

// === FAQ ===
function toggleFaq(el) {
  const item = el.closest('.fitem');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.fitem').forEach(f => { f.classList.remove('open'); f.querySelector('.fa-wrap').style.maxHeight = '0'; });
  if (!wasOpen) {
    item.classList.add('open');
    const wrap = item.querySelector('.fa-wrap');
    wrap.style.maxHeight = wrap.scrollHeight + 'px';
  }
}

// === TOAST ===
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => { t.classList.remove('show'); }, 3500);
}

// === FOCUS HERO FORM ===
function focusHeroForm(e) {
  if (e) e.preventDefault();
  document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
}
