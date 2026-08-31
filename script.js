/* ==========================================================================
   SCRIPT: COSMIC MIDNIGHT (18TH BIRTHDAY) - COMPLETE & FIXED
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initCursor();
    initMusic();
});

/* 1. Canvas Particle Background */
function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = Math.random() * innerWidth;
            let y = Math.random() * innerHeight;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size, 'rgba(255, 255, 255, 0.4)'));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth; canvas.height = innerHeight; init();
    });

    init(); animate();
}

/* 2. Audio Controller (Direct & Robust) */
function initMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');

    if (!audio) {
        console.error("Audio tag not found!");
        return;
    }

    audio.volume = 1.0;

    function playAudioSafe() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (btn) {
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = 'fas fa-pause';
                }
                console.log("Audio playing successfully!");
            }).catch(e => {
                console.warn("Audio play blocked / waiting for user interaction:", e);
            });
        }
    }

    function toggleAudio() {
        const icon = btn ? btn.querySelector('i') : null;
        if (audio.paused) {
            audio.play().then(() => {
                if (icon) icon.className = 'fas fa-pause';
            }).catch(e => alert("Gagal memutar audio: " + e.message));
        } else {
            audio.pause();
            if (icon) icon.className = 'fas fa-music';
        }
    }

    if (btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            toggleAudio();
        };
    }

    // Putar lagu saat klik/tap pertama di mana saja
    function startOnFirstClick() {
        if (audio.paused) {
            playAudioSafe();
        }
        document.removeEventListener('click', startOnFirstClick);
        document.removeEventListener('touchstart', startOnFirstClick);
    }

    document.addEventListener('click', startOnFirstClick);
    document.addEventListener('touchstart', startOnFirstClick);
}

/* 3. Countdown & Website Reveal */
function initCountdown() {
    const targetDate = new Date("Sep 1, 2026 00:00:00").getTime();
    const countdownScreen = document.getElementById('countdown-screen');
    const mainSite = document.getElementById('main-site');
    const bypassBtn = document.getElementById('bypass-btn');

    // Karena sekarang sudah tanggal 1 Sept 2026, langsung buka web
    const now = new Date().getTime();
    if (now >= targetDate) {
        revealWebsite();
    } else {
        const timer = setInterval(() => {
            const current = new Date().getTime();
            const distance = targetDate - current;

            if (distance < 0) {
                clearInterval(timer);
                revealWebsite();
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const hEl = document.getElementById('hours');
                const mEl = document.getElementById('minutes');
                const sEl = document.getElementById('seconds');
                if (hEl) hEl.innerText = hours.toString().padStart(2, '0');
                if (mEl) mEl.innerText = minutes.toString().padStart(2, '0');
                if (sEl) sEl.innerText = seconds.toString().padStart(2, '0');
            }
        }, 1000);
    }

    if (bypassBtn) {
        bypassBtn.addEventListener('click', () => {
            revealWebsite();
        });
    }

    function revealWebsite() {
        const audio = document.getElementById('bg-music');
        if (audio && audio.paused) {
            audio.play().catch(() => {});
        }

        if (countdownScreen) countdownScreen.classList.add('hidden');
        
        setTimeout(() => {
            if (countdownScreen) countdownScreen.style.display = 'none';
            if (mainSite) mainSite.classList.add('visible');

            initTyping();
            initGSAP();
            initSwiper();
            fireMidnightConfetti();
        }, 1000);
    }
}

/* 4. Confetti */
function fireMidnightConfetti() {
    if (typeof confetti !== 'function') return;
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#f472b6', '#ffffff', '#e2e8f0'], zIndex: 9999 });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#f472b6', '#ffffff', '#e2e8f0'], zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

/* 5. Custom Cursor */
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (!dot || !outline) return;

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 400, fill: "forwards" });
    });
}

/* 6. Typing Effect */
function initTyping() {
    const text = "A New Chapter Begins.";
    const element = document.querySelector('.typing-text');
    if (!element) return;
    element.innerHTML = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    setTimeout(typeWriter, 500);
}

/* 7. GSAP Animation */
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.gsap-fade-up').forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });
}

/* 8. Swiper 3D Carousel */
function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    const isMobile = window.innerWidth <= 768;

    new Swiper(".mySwiper", {
        effect: "coverflow", 
        grabCursor: true, 
        centeredSlides: true, 
        slidesPerView: "auto",
        coverflowEffect: { 
            rotate: isMobile ? 0 : 10,
            stretch: 0, 
            depth: isMobile ? 100 : 220,
            modifier: 1.2, 
            slideShadows: !isMobile
        },
        loop: true, 
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true }
    });
}

/* 9. Scroll */
function scrollToSection(id) { 
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' }); 
}

/* 10. Candle Interaction */
function blowCandle() {
    const flame = document.getElementById('candle-flame');
    const msg = document.getElementById('success-message');
    
    if (flame && !flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out'); 
        if (msg) msg.classList.add('show');
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'], zIndex: 9999 });
        }
    }
}