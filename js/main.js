// 모바일 메뉴 토글
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }
});

// 숫자 카운트업
function countUp(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1400;
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const v = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('ko-KR') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// 스크롤 등장 효과 + 카운트업 + 진행바
document.querySelectorAll('.section .container > *, .card').forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('show');
    if (el.classList.contains('count')) countUp(el);
    io.unobserve(el);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal, .count').forEach(el => io.observe(el));

// 전환율 진행바 (2.7 → 3.9)
const bar = document.querySelector('.bar');
if (bar) {
  const fill = bar.querySelector('i');
  const barIo = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      fill.style.width = (bar.dataset.from / bar.dataset.to * 100) + '%';
      barIo.disconnect();
    }
  });
  barIo.observe(bar);
}

// 현재 섹션 메뉴 강조
const links = [...nav.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
links.forEach(a => {
  const sec = document.querySelector(a.getAttribute('href'));
  if (sec) spy.observe(sec);
});
