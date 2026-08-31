/* ==========================================================================
   SCRIPT: COSMIC MIDNIGHT (18TH BIRTHDAY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCountdown();
    initCursor();
    initMusic();
});

/* 1. Canvas Particle Background (Bintang-bintang) */
function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray;

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
            if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
            if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
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
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(255, 255, 255, 0.4)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
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

/* 2. Countdown Logic */
function initCountdown() {
    const targetDate = new Date("Sep 1, 2026 00:00:00").getTime();
    const countdownScreen = document.getElementById('countdown-screen');
    const mainSite = document.getElementById('main-site');
    const bypassBtn = document.getElementById('bypass-btn');

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            revealWebsite();
        } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
            document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
        }
    }, 1000);

    bypassBtn.addEventListener('click', () => {
        clearInterval(timer);
        revealWebsite();
    });

    function revealWebsite() {
        countdownScreen.classList.add('hidden');
        
        setTimeout(() => {
            countdownScreen.style.display = 'none';
            mainSite.classList.add('visible');
            
            const audio = document.getElementById('bg-music');
            const icon = document.querySelector('#music-toggle i');
            audio.play().then(() => {
                icon.className = 'fas fa-pause';
            }).catch(e => console.log('Autoplay blocked.'));

            initTyping();
            initGSAP();
            initSwiper();
            fireMidnightConfetti();
        }, 2000);
    }
}

/* 3. Confetti Explosion at Midnight */
function fireMidnightConfetti() {
    const duration = 6 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#f472b6', '#ffffff', '#e2e8f0'], zIndex: 9999 });
        confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#f472b6', '#ffffff', '#e2e8f0'], zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

/* 4. Custom Cursor */
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`; dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 400, fill: "forwards" });
    });

    const clickables = document.querySelectorAll('button, .interactive-candle, .swiper-slide');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(2)';
            outline.style.borderColor = 'rgba(244, 114, 182, 0.8)';
            outline.style.backgroundColor = 'rgba(244, 114, 182, 0.15)';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.transform = 'translate(-50%, -50%) scale(1)';
            outline.style.backgroundColor = 'transparent';
        });
    });
}

/* 5. Smooth Typing Effect */
function initTyping() {
    const text = "A New Chapter Begins.";
    const element = document.querySelector('.typing-text');
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    setTimeout(typeWriter, 1500);
}

/* 6. GSAP Advanced Scroll Animations */
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.gsap-fade-up').forEach((el) => {
        gsap.fromTo(el, 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
        );
    });
}

/* 7. Swiper 3D Carousel Setup (FIXED FOR MOBILE) */
function initSwiper() {
    const isMobile = window.innerWidth <= 768;

    new Swiper(".mySwiper", {
        effect: "coverflow", 
        grabCursor: true, 
        centeredSlides: true, 
        slidesPerView: "auto",
        coverflowEffect: { 
            rotate: isMobile ? 0 : 10,   /* 0 untuk HP biar tegak lurus, 10 untuk Desktop */
            stretch: 0, 
            depth: isMobile ? 120 : 250, /* Kurangi efek kedalaman di HP */
            modifier: 1.2, 
            slideShadows: !isMobile      /* Hilangkan bayangan bawaan Swiper di HP */
        },
        loop: true, 
        autoplay: { delay: 3500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true }
    });
}

/* 8. Floating Music Control & Auto-Unlock */
function initMusic() {
    const btn = document.getElementById('music-toggle');
    const icon = btn ? btn.querySelector('i') : null;
    const audio = document.getElementById('bg-music');

    if (!audio) return;

    audio.volume = 1.0;

    function playAudio() {
        audio.play().then(() => {
            if (icon) icon.className = 'fas fa-pause';
        }).catch((err) => {
            console.log("Audio menunggu interaksi klik:", err);
        });
    }

    // Tombol musik mengambang (klik manual)
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (audio.paused) {
                playAudio();
            } else {
                audio.pause();
                if (icon) icon.className = 'fas fa-music';
            }
        });
    }

    // Buka audio otomatis saat sentuhan pertama di layar HP / klik tombol
    const unlockEvents = ['touchstart', 'touchend', 'click', 'pointerdown'];
    function unlockHandler() {
        if (audio.paused) {
            playAudio();
        }
        unlockEvents.forEach(evt => document.removeEventListener(evt, unlockHandler));
    }

    unlockEvents.forEach(evt => document.addEventListener(evt, unlockHandler, { passive: true }));
}

/* 9. Scroll Smoothly */
function scrollToSection(id) { 
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); 
}

/* 10. Interactive Candle Logic */
function blowCandle() {
    const flame = document.getElementById('candle-flame');
    const msg = document.getElementById('success-message');
    
    if (!flame.classList.contains('blown-out')) {
        flame.classList.add('blown-out'); 
        msg.classList.add('show');
        
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#f472b6', '#fbbf24', '#ffffff'], zIndex: 9999 });
    }
}