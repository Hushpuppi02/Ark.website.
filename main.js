import { translations } from './i18n.js';

const LOGO_LIGHT = '/logo-light.jpg';
const LOGO_DARK = '/logo-dark.jpg';

/* ---------------- Language ---------------- */
function getLang() {
  return localStorage.getItem('asv-lang') || 'fr';
}
function applyLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('asv-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const entry = translations[key];
    if (entry && entry[lang]) el.textContent = entry[lang];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const entry = translations[key];
    if (entry && entry[lang]) el.setAttribute('placeholder', entry[lang]);
  });

  // language toggle button label shows the OTHER language
  const langBtn = document.querySelector('[data-lang-btn]');
  if (langBtn) langBtn.querySelector('.lang-label').textContent = lang === 'fr' ? 'EN' : 'FR';
}

/* ---------------- Theme ---------------- */
function getTheme() {
  return localStorage.getItem('asv-theme') || 'light';
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('asv-theme', theme);

  const logo = theme === 'dark' ? LOGO_DARK : LOGO_LIGHT;
  document.querySelectorAll('[data-logo]').forEach((img) => { img.src = logo; });

  const SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  const MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const tBtn = document.querySelector('[data-theme-btn]');
  if (tBtn) tBtn.innerHTML = theme === 'dark' ? SUN : MOON;
}

/* ---------------- Init ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  applyLang(getLang());

  // theme toggle
  const themeBtn = document.querySelector('[data-theme-btn]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // language toggle
  const langBtn = document.querySelector('[data-lang-btn]');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(getLang() === 'fr' ? 'en' : 'fr');
    });
  }

  // mobile menu
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // active nav link based on current path
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-links] a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && href === 'index.html')) a.classList.add('active');
  });

  // scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  }

  // contact form (front-end only)
  // contact form - Envoi vers WhatsApp
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Récupération des champs du formulaire
      const nameInput = form.querySelector('input[type="text"][required]');
      const emailInput = form.querySelector('input[type="email"]');
      const subjectInput = form.querySelector('input[data-i18n-placeholder="contact.subject"]');
      const messageInput = form.querySelector('textarea');

      const name = nameInput ? nameInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const subject = subjectInput ? subjectInput.value : 'Pas de sujet';
      const message = messageInput ? messageInput.value : '';

      // 2. Construction du texte du message WhatsApp
      const whatsappText = `⛪ *Arche Source de Vie - Nouveau Message* ⛪\n\n` +
                           `👤 *Nom:* ${name}\n` +
                           `📧 *Email:* ${email}\n` +
                           `📌 *Sujet:* ${subject}\n\n` +
                           `💬 *Message:* \n${message}`;

      // 3. Encodage du texte pour l'URL
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappNumber = "27611535926"; // Ton numéro au format international sans le "+"

      // 4. Ouverture du lien WhatsApp dans un nouvel onglet
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');

      // 5. Affichage du message de confirmation sur le site
      const msg = document.querySelector('[data-form-msg]');
      const lang = getLang();
      if (msg) {
        msg.textContent = translations['contact.sent'][lang];
        msg.style.display = 'block';
      }
      
      form.reset();
    });
  }
});
