// --- Smooth intersection reveal (Code 1) ---
const revealEls = document.querySelectorAll('.reveal, #tech-canvas'); // '#about' 삭제
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');

      // 'About' 관련 로직 삭제
      
      // 1. Code 2의 로직 실행 (Tech)
      if (entry.target.id === 'tech-canvas') {
        isTechAnimationRunning = true;
        drawHeartbeat();
      }

      // Tech 캔버스를 제외한 요소는 한 번만 실행
      if (!entry.target.id.includes('tech-canvas')) {
        io.unobserve(entry.target);
      }
      
    } else {
      // 화면 밖으로 나가면 애니메이션 중지 (배터리 절약)
      // 'About' 관련 로직 삭제
      if (entry.target.id === 'tech-canvas') {
        isTechAnimationRunning = false;
      }
    }
  });
}, {threshold: .15}); // 15% 보일 때
revealEls.forEach(el=>io.observe(el));


// --- Mobile menu toggle (Code 1) ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', ()=>{
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.classList.toggle('show');
  mobileMenu.setAttribute('aria-modal', mobileMenu.classList.contains('show') ? 'true' : 'false');
});


// --- Contact form handler (Code 1) ---
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name')?.toString().trim();
  const email = data.get('email')?.toString().trim();
  if(!name || !email){
    statusEl.textContent = '이름과 이메일을 입력해주세요.';
    statusEl.style.color = '#b91c1c';
    return;
  }
  statusEl.textContent = '요청을 전송했어요. 담당자가 곧 연락드립니다.';
  statusEl.style.color = '#1B263B';
  form.reset();
  form.classList.add('sent');
});


// --- 4. Hero: Canvas network animation (Code 1) ---
// (즉시 실행 함수로 감싸서 변수 충돌 방지)
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
    if (!ctx) return; // 캔버스가 아직 준비되지 않았으면 종료
    ctx.clearRect(0,0,w,h);
    
    // 2. 검정색으로 변경
    const brandColor = "0, 0, 0"; // 검정색 RGB

    for(let i=0; i < points.length; i++){
      const p = points[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;

      for(let j=i+1; j < points.length; j++){
        const q = points[j];
        const dx = p.x-q.x, dy = p.y-q.y;
        const dist = Math.hypot(dx,dy);
        if(dist < LINK_DIST){
          const alpha = 1 - (dist/LINK_DIST);
          // 선 색상 변경
          ctx.strokeStyle = `rgba(${brandColor}, ${alpha*0.8})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      // 점 색상 변경
      ctx.fillStyle = `rgba(${brandColor}, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI*2);
      ctx.fill();
    }
    rafId = requestAnimationFrame(step);
  }

  // Code 1의 ResizeObserver 사용 (안정적)
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(()=>resize());
    ro.observe(canvas);
  } else {
    // Fallback
    window.addEventListener('resize', resize);
  }
  
  resize();
  step();
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ cancelAnimationFrame(rafId); }
    else { step(); }
  });
})();


// --- 'About' 섹션 관련 JS (startAboutSequence, stopAboutSequence) 모두 삭제 ---


// --- 1. Tech 섹션 (Code 2의 심전도 애니메이션) ---
const techCanvas = document.getElementById('tech-canvas');
let techCtx; // 전역으로 선언
let techXOffset = 0;
let isTechAnimationRunning = false;

if (techCanvas) {
  techCtx = techCanvas.getContext('2d');
}

function resizeTechCanvas() {
  if (!techCanvas) return;
  techCanvas.width = techCanvas.clientWidth;
  techCanvas.height = techCanvas.clientHeight;
}

function drawHeartbeat() {
  if (!isTechAnimationRunning || !techCtx) {
    // 애니메이션이 중지되면 requestAnimationFrame 호출 중단
    return;
  }

  requestAnimationFrame(drawHeartbeat);
  
  techCtx.clearRect(0, 0, techCanvas.width, techCanvas.height);
  techCtx.strokeStyle = '#FE936F'; // 2. 포인트 컬러
  techCtx.lineWidth = 3;
  techCtx.shadowBlur = 10;
  techCtx.shadowColor = 'rgba(254, 147, 111, 0.5)';
  
  techCtx.beginPath();
  
  const w = techCanvas.width;
  const h = techCanvas.height;
  const baseY = h / 2;
  const patternWidth = w / 3;
  const pulseHeight = h / 3;

  for (let x = 0; x <= w; x += 2) {
    const posInPattern = (x + techXOffset) % patternWidth;
    let y = baseY;

    if (posInPattern < 10) {
      y = baseY - (Math.sin(posInPattern / 10 * Math.PI) * (pulseHeight * 0.2));
    } else if (posInPattern > 15 && posInPattern < 20) {
      y = baseY + (pulseHeight * 0.1);
    } else if (posInPattern >= 20 && posInPattern < 25) {
      y = baseY - (pulseHeight * ((posInPattern - 20) / 5));
    } else if (posInPattern >= 25 && posInPattern < 30) {
      y = baseY + (pulseHeight * 0.3 * (1 - (posInPattern - 25) / 5));
    } else if (posInPattern > 40 && posInPattern < 55) {
      y = baseY - (Math.sin((posInPattern - 40) / 15 * Math.PI) * (pulseHeight * 0.4));
    }

    if (x === 0) {
      techCtx.moveTo(x, y);
    } else {
      techCtx.lineTo(x, y);
    }
  }
  
  techCtx.stroke();
  techXOffset = (techXOffset + 2) % w; // 속도 조절
}

// 초기 로드 및 리사이즈 이벤트
resizeTechCanvas();
window.addEventListener('resize', resizeTechCanvas);