// Smooth intersection reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, {threshold: .15});
revealEls.forEach(el=>io.observe(el));

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', ()=>{
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.classList.toggle('show');
  mobileMenu.setAttribute('aria-modal', mobileMenu.classList.contains('show') ? 'true' : 'false');
});

// Contact form handler (no backend; demo only)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  if(!name || !email){
    statusEl.textContent = '이름과 이메일을 입력해주세요.';
    statusEl.style.color = '#b91c1c'; // 에러 색상은 유지
    return;
  }
  statusEl.textContent = '요청을 전송했어요. 담당자가 곧 연락드립니다.';
  // [수정] 성공 색상을 CSS 변수(var(--ink))로 변경
  statusEl.style.color = 'var(--ink)'; 
  form.reset();
  form.classList.add('sent');
});

// Canvas network animation (Hero)
(function(){
  const canvas = document.getElementById('networkCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, points, rafId;
  const MAX_POINTS = 80;
  const LINK_DIST = 140;
  const SPEED = 0.35;

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    init();
  }

  function init(){
    points = new Array(Math.floor((w*h)/18000)).fill(0).map(()=>makePoint());
    if(points.length > MAX_POINTS) points.length = MAX_POINTS;
  }

  function makePoint(){
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()*2-1)*SPEED,
      vy: (Math.random()*2-1)*SPEED
    };
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    // draw links
    for(let i=0;i<points.length;i++){
      const p = points[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;

      for(let j=i+1;j<points.length;j++){
        const q = points[j];
        const dx = p.x-q.x, dy = p.y-q.y;
        const dist = Math.hypot(dx,dy);
        if(dist < LINK_DIST){
          const alpha = 1 - (dist/LINK_DIST);
          // [수정] 선 색상을 새 팔레트(var(--brand))에 맞게 변경
          ctx.strokeStyle = `rgba(254, 147, 111, ${alpha*0.6})`; 
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      // draw point
      // [수정] 점 색상을 새 팔레트(var(--ink))에 맞게 변경 (어둡게)
      ctx.fillStyle = 'rgba(26, 26, 26, 0.7)'; 
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI*2);
      ctx.fill();
    }
    rafId = requestAnimationFrame(step);
  }

  const ro = new ResizeObserver(()=>resize());
  ro.observe(canvas);
  resize();
  step();
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ cancelAnimationFrame(rafId); }
    else { step(); }
  });
})();