// Basic scroll-triggered animations and floating block generator
(function(){
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const revealItems = document.querySelectorAll('.reveal-item');

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
      }
    })
  },{threshold:0.15});

  reveals.forEach(r=>obs.observe(r));
  revealItems.forEach(r=>obs.observe(r));

  // Parallax for elements with data-speed
  const parallaxElems = document.querySelectorAll('[data-speed]');
  function onScroll(){
    const top = window.scrollY;
    parallaxElems.forEach(el=>{
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
      el.style.transform = `translateY(${top * speed}px)`;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Floating block particles
  const scene = document.getElementById('scene');
  function rand(min,max){return Math.random()*(max-min)+min}
  function spawnBlock(){
    const b = document.createElement('div');
    b.className='float-block';
    const size = Math.floor(rand(20,46));
    b.style.width = size+'px'; b.style.height = size+'px';
    b.style.left = rand(4,96)+'%';
    b.style.top = rand(10,90)+'%';
    b.style.opacity = rand(0.4,0.95);
    const dur = rand(7000,16000);
    b.style.transition = `transform ${dur}ms linear, opacity ${dur/2}ms ease`;
    scene.appendChild(b);
    // float animation via requestAnimationFrame -> translateY
    const dx = rand(-60,60);
    const dy = rand(-120,120);
    requestAnimationFrame(()=>{
      b.style.transform = `translate(${dx}px, ${dy}px) rotate(${rand(-360,360)}deg)`;
    });
    setTimeout(()=>{ b.style.opacity = '0'; }, dur*0.7);
    setTimeout(()=>{ b.remove(); }, dur+200);
  }
  // spawn initial burst
  for(let i=0;i<8;i++) spawnBlock();
  setInterval(()=>{ spawnBlock(); }, 2500);

  // small convenience: copy ip when CTA clicked
  const ctas = document.querySelectorAll('.cta');
  ctas.forEach(c=>c.addEventListener('click', (e)=>{
    const text = 'play.stasis.example';
    navigator.clipboard?.writeText(text).then(()=>{
      const old = c.textContent;
      c.textContent = 'IP Copied!';
      setTimeout(()=> c.textContent = old, 1400);
    }).catch(()=>{
      // fallback
      alert('IP: '+text);
    });
    e.preventDefault();
  }));
})();
