import { departments } from './departments.js';

function getLang() {
  return localStorage.getItem('asv-lang') || 'fr';
}

function render() {
  const params = new URLSearchParams(location.search);
  const key = params.get('d');
  const dept = departments[key] || departments.worship;
  const lang = getLang();

  document.title = `${dept.name[lang]} — Arche Source de Vie`;

  const set = (sel, value) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = value;
  };

  set('[data-dept-tag]', dept.tag[lang]);
  set('[data-dept-name]', dept.name[lang]);
  set('[data-dept-intro]', dept.intro[lang]);
  set('[data-dept-icon]', dept.icon);
  set('[data-dept-mission]', dept.mission[lang]);
  set('[data-leader-name]', dept.leader.name);
  set('[data-leader-role]', dept.leader.role[lang]);
  set('[data-leader-initials]', dept.leader.initials);

  const list = document.querySelector('[data-dept-activities]');
  if (list) {
    list.innerHTML = '';
    dept.activities[lang].forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
}

// initial render after DOM ready
document.addEventListener('DOMContentLoaded', render);

// re-render when language changes (main.js stores in localStorage on button click)
const langBtn = document.querySelector('[data-lang-btn]');
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-lang-btn]')) {
    // main.js updates localStorage synchronously on its own click handler;
    // defer slightly so our render reads the updated value
    setTimeout(render, 0);
  }
});
