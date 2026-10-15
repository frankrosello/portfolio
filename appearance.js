'use strict';
const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)');
const appearance = document.querySelector('#appearance');
let appearanceChoice = 'system';
try {
  const saved = localStorage.getItem('fr-portfolio-appearance');
  if (['system', 'light', 'dark'].includes(saved)) appearanceChoice = saved;
} catch {}
appearance.value = appearanceChoice;
function applyAppearance() {
  const mode = appearanceChoice === 'system' ? (deviceTheme.matches ? 'dark' : 'light') : appearanceChoice;
  document.documentElement.dataset.mode = mode;
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
}
appearance.addEventListener('change', () => {
  appearanceChoice = appearance.value;
  try { localStorage.setItem('fr-portfolio-appearance', appearanceChoice); } catch {}
  applyAppearance();
});
deviceTheme.addEventListener('change', applyAppearance);
applyAppearance();
