/* =============================================
   WEBSITE UCAPAN ULANG TAHUN — MAIN SCRIPT
   Theme: Dark Elegant + Neon Pink/Gold
   
   Modules:
   1. HeartsCanvas   — Floating hearts background
   2. MusicController — Background music toggle
   3. Landing         — Envelope opening animation
   4. HeroAnimation   — Hero text entrance
   5. ScrollAnimations — GSAP ScrollTrigger reveals
   6. GalleryLightbox — Photo zoom modal
   7. FlipCards       — Reason cards interaction
   8. BalloonPop      — Interactive balloon game
   9. SaveMemory      — Print / save page
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════
       1. HEARTS CANVAS — Floating Background
       ═══════════════════════════════════════ */
    const HeartsCanvas = (() => {
        const canvas = document.getElementById('hearts-canvas');
        if (!canvas) return { init() { }, stop() { } };

        const ctx = canvas.getContext('2d');
        let hearts = [];
        let rafId = null;
        let running = false;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Heart colors (pink/gold palette)
        const COLORS = [
            [255, 45, 123],   // pink
            [255, 107, 157],  // light pink
            [255, 215, 0],    // gold
            [255, 182, 193],  // soft pink
            [192, 132, 252],  // lavender
        ];

        class Heart {
            constructor(spreadY) {
                this.reset(spreadY);
            }

            reset(spreadY = false) {
                this.x = Math.random() * canvas.width;
                this.y = spreadY
                    ? Math.random() * canvas.height
                    : canvas.height + 20 + Math.random() * 40;
                this.size = Math.random() * 10 + 5;
                this.vy = -(Math.random() * 0.6 + 0.2);
                this.vx = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.35 + 0.08;
                this.rotation = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.015;
                this.wobbleAmp = Math.random() * 0.4 + 0.1;
                this.wobbleSpeed = Math.random() * 0.015 + 0.005;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            }

            update() {
                this.y += this.vy;
                this.x += this.vx + Math.sin(this.y * this.wobbleSpeed) * this.wobbleAmp;
                this.rotation += this.spin;

                if (this.y < -30) this.reset(false);
            }

            draw() {
                const s = this.size;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;

                // Draw heart shape using bezier curves
                ctx.beginPath();
                ctx.moveTo(0, s * 0.35);
                ctx.bezierCurveTo(
                    -s * 0.5, -s * 0.25,
                    -s * 1.0, s * 0.15,
                    0, s * 1.0
                );
                ctx.bezierCurveTo(
                    s * 1.0, s * 0.15,
                    s * 0.5, -s * 0.25,
                    0, s * 0.35
                );
                ctx.fill();
                ctx.restore();
            }
        }

        function animate() {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < hearts.length; i++) {
                hearts[i].update();
                hearts[i].draw();
            }
            rafId = requestAnimationFrame(animate);
        }

        function init(count) {
            resize();
            const n = count || (window.innerWidth < 768 ? 15 : 25);
            hearts = [];
            for (let i = 0; i < n; i++) {
                hearts.push(new Heart(true));
            }
            canvas.classList.add('active');
            running = true;
            animate();
        }

        function stop() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            canvas.classList.remove('active');
        }

        window.addEventListener('resize', () => {
            resize();
        });

        return { init, stop };
    })();


    /* ═══════════════════════════════════════
       2. MUSIC CONTROLLER
       ═══════════════════════════════════════ */
    const MusicController = (() => {
        const btn = document.getElementById('music-toggle');
        const audio = document.getElementById('bg-music');
        if (!btn || !audio) return { show() { }, tryAutoplay() { } };

        let isPlaying = false;

        function setPlaying(state) {
            isPlaying = state;
            btn.classList.toggle('playing', state);
            btn.setAttribute('aria-label', state ? 'Pause musik' : 'Play musik');
        }

        function toggle() {
            if (isPlaying) {
                audio.pause();
                setPlaying(false);
            } else {
                audio.play().then(() => setPlaying(true)).catch(() => {
                    console.info('[Music] Autoplay blocked — user needs to tap the music button.');
                });
            }
        }

        function show() {
            btn.classList.add('visible');
        }

        function tryAutoplay() {
            audio.volume = 0.35;
            audio.play()
                .then(() => setPlaying(true))
                .catch(() => setPlaying(false));
        }

        btn.addEventListener('click', toggle);

        return { show, tryAutoplay };
    })();


    /* ═══════════════════════════════════════
       3. LANDING / ENVELOPE ANIMATION
       ═══════════════════════════════════════ */
    const Landing = (() => {
        const section = document.getElementById('landing');
        const openBtn = document.getElementById('open-btn');
        const envelope = document.getElementById('envelope');
        const mainContent = document.getElementById('main-content');
        if (!section || !openBtn || !envelope || !mainContent) return;

        let opened = false;

        function open() {
            if (opened) return;
            opened = true;

            // Step 1: Open envelope flap
            envelope.classList.add('open');

            // Step 2: Confetti burst after a brief delay
            setTimeout(() => {
                fireConfetti({
                    particleCount: 120,
                    spread: 80,
                    startVelocity: 35,
                    origin: { y: 0.6 },
                    colors: ['#ff2d7b', '#ff6b9d', '#ffd700', '#ff69b4', '#c084fc', '#ffe55a']
                });
            }, 500);

            // Step 3: Fade out landing section
            setTimeout(() => {
                section.classList.add('opened');

                // Step 4: Show main content after transition
                setTimeout(() => {
                    mainContent.classList.remove('hidden');
                    section.style.display = 'none';
                    document.body.style.overflow = '';

                    // Step 5: Activate background hearts
                    HeartsCanvas.init();

                    // Step 6: Show music button & attempt autoplay
                    MusicController.show();
                    MusicController.tryAutoplay();

                    // Step 7: Run hero entrance animation
                    HeroAnimation.start();

                    // Step 8: Initialize scroll-triggered animations
                    ScrollAnimations.init();
                }, 850);
            }, 3000); // 8 detik untuk membaca surat
        }

        openBtn.addEventListener('click', open);
        envelope.addEventListener('click', open);

        // Prevent scrolling while landing is visible
        document.body.style.overflow = 'hidden';
    })();


    /* ═══════════════════════════════════════
       4. HERO ANIMATION
       ═══════════════════════════════════════ */
    const HeroAnimation = (() => {
        function start() {
            if (typeof gsap === 'undefined') return;

            const tl = gsap.timeline({ delay: 0.2 });

            tl.to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            })
                .to('.hero-title .word', {
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    stagger: 0.1,
                    ease: 'power3.out'
                }, '-=0.35')
                .to('.hero-date', {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.15')
                .to('.hero-divider', {
                    opacity: 1,
                    scaleX: 1,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.25')
                .to('.hero-message', {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.25');
        }

        return { start };
    })();


    /* ═══════════════════════════════════════
       5. SCROLL-TRIGGERED ANIMATIONS
       ═══════════════════════════════════════ */
    const ScrollAnimations = (() => {
        function init() {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
            gsap.registerPlugin(ScrollTrigger);

            // ── Section Headers ──
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.from(header.children, {
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 25,
                    duration: 0.55,
                    stagger: 0.12,
                    ease: 'power2.out'
                });
            });

            // ── Gallery Items ──
            gsap.utils.toArray('.gallery-item').forEach((item, i) => {
                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 87%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: (i % 3) * 0.1,
                    ease: 'power2.out'
                });
            });

            // ── Timeline Items ──
            gsap.utils.toArray('.timeline-item').forEach(item => {
                const isLeft = item.classList.contains('left');
                gsap.set(item, { x: isLeft ? -50 : 50 });

                gsap.to(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                });
            });

            // ── Timeline Progress Line ──
            const timelineContainer = document.querySelector('.timeline-container');
            const progressLine = document.querySelector('.timeline-progress');
            if (timelineContainer && progressLine) {
                ScrollTrigger.create({
                    trigger: timelineContainer,
                    start: 'top 75%',
                    end: 'bottom 25%',
                    onUpdate: self => {
                        progressLine.style.height = (self.progress * 100) + '%';
                    }
                });
            }

            // ── Flip Cards ──
            gsap.utils.toArray('.flip-card').forEach((card, i) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 87%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    delay: (i % 3) * 0.1,
                    ease: 'power2.out'
                });
            });

            // ── Love Letter Paragraphs ──
            gsap.utils.toArray('.letter-body p').forEach((p, i) => {
                gsap.to(p, {
                    scrollTrigger: {
                        trigger: p,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.55,
                    delay: i * 0.06,
                    ease: 'power2.out'
                });
            });
        }

        return { init };
    })();


    /* ═══════════════════════════════════════
       6. GALLERY LIGHTBOX
       ═══════════════════════════════════════ */
    (() => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lbImg = lightbox.querySelector('.lightbox-img');
        const lbCaption = lightbox.querySelector('.lightbox-caption');
        const lbClose = lightbox.querySelector('.lightbox-close');

        function openLightbox(imgSrc, imgAlt, caption) {
            lbImg.src = imgSrc;
            lbImg.alt = imgAlt;
            lbCaption.textContent = caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Attach click to all gallery image wrappers
        document.querySelectorAll('.gallery-img-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const item = wrapper.closest('.gallery-item');
                const img = wrapper.querySelector('img');
                if (!item || !img) return;
                openLightbox(img.src, img.alt, item.dataset.caption);
            });
        });

        // Close handlers
        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    })();


    /* ═══════════════════════════════════════
       7. FLIP CARDS
       ═══════════════════════════════════════ */
    (() => {
        document.querySelectorAll('.flip-card').forEach(card => {
            function flip() {
                card.classList.toggle('flipped');
            }
            card.addEventListener('click', flip);
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    flip();
                }
            });
        });
    })();


    /* ═══════════════════════════════════════
       8. BALLOON POP GAME
       ═══════════════════════════════════════ */
    (() => {
        const container = document.getElementById('balloons-container');
        const countEl = document.getElementById('popped-count');
        const totalEl = document.getElementById('total-balloons');
        const finalMsg = document.getElementById('balloon-final-message');
        if (!container || !countEl || !totalEl || !finalMsg) return;

        /* EDIT DI SINI: Ganti pesan-pesan di dalam balon */
        const MESSAGES = [
            'Kamu adalah alasan aku tersenyum setiap hari 😊',
            'Aku bersyukur setiap detik bersamamu 🙏',
            'Kamu lebih indah dari seribu matahari terbenam 🌅',
            'Pelukanmu adalah tempat ternyamanku 🤗',
            'Tertawa bersamamu adalah melodi terfavorit 🎵',
            'Kamu membuat dunia ini jadi lebih berwarna 🌈',
            'Setiap momen bersamamu sangat berharga 💎',
            'Aku jatuh cinta padamu setiap hari, lagi dan lagi 💕',
        ];

        const BALLOON_COLORS = [
            '#ff2d7b', '#ff6b9d', '#ffd700', '#ff69b4',
            '#c084fc', '#fb7185', '#f472b6', '#fbbf24'
        ];

        let popped = 0;
        const total = MESSAGES.length;
        totalEl.textContent = total;

        // Utility: lighten a hex color
        function lighten(hex, pct) {
            const n = parseInt(hex.replace('#', ''), 16);
            const amt = Math.round(2.55 * pct);
            const r = Math.min(255, (n >> 16) + amt);
            const g = Math.min(255, ((n >> 8) & 0xff) + amt);
            const b = Math.min(255, (n & 0xff) + amt);
            return `rgb(${r},${g},${b})`;
        }

        // Create balloons
        MESSAGES.forEach((msg, i) => {
            const color = BALLOON_COLORS[i % BALLOON_COLORS.length];
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.setAttribute('role', 'button');
            balloon.setAttribute('tabindex', '0');
            balloon.setAttribute('aria-label', `Balon ${i + 1} — ketuk untuk membuka`);

            balloon.innerHTML = `
                <div class="balloon-body" style="background:radial-gradient(circle at 30% 30%,${lighten(color, 35)},${color});"></div>
                <div class="balloon-knot" style="border-top-color:${color};" aria-hidden="true"></div>
                <div class="balloon-string" aria-hidden="true"></div>
            `;

            function pop() {
                if (balloon.classList.contains('popped')) return;
                balloon.classList.add('popped');
                popped++;
                countEl.textContent = popped;

                // Mini confetti at balloon position
                const rect = balloon.getBoundingClientRect();
                fireConfetti({
                    particleCount: 25,
                    spread: 55,
                    startVelocity: 20,
                    scalar: 0.7,
                    origin: {
                        x: (rect.left + rect.width / 2) / window.innerWidth,
                        y: (rect.top + rect.height / 3) / window.innerHeight
                    },
                    colors: [color, '#ffd700', '#ffffff']
                });

                // Show message after pop animation
                setTimeout(() => {
                    const msgEl = document.createElement('div');
                    msgEl.className = 'balloon-message';
                    msgEl.textContent = msg;
                    balloon.style.position = 'relative';
                    balloon.appendChild(msgEl);

                    // Fade out message after 3.5s
                    setTimeout(() => {
                        msgEl.style.transition = 'opacity 0.6s ease';
                        msgEl.style.opacity = '0';
                        setTimeout(() => msgEl.remove(), 600);
                    }, 3500);
                }, 450);

                // All balloons popped?
                if (popped === total) {
                    setTimeout(celebrateAllPopped, 1200);
                }
            }

            balloon.addEventListener('click', pop);
            balloon.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pop();
                }
            });

            container.appendChild(balloon);
        });

        function celebrateAllPopped() {
            finalMsg.classList.remove('hidden');
            finalMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Big fireworks confetti
            const end = Date.now() + 3500;
            const interval = setInterval(() => {
                if (Date.now() > end) return clearInterval(interval);
                fireConfetti({
                    particleCount: 40,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.65 },
                    colors: ['#ff2d7b', '#ffd700', '#ff69b4', '#c084fc']
                });
                fireConfetti({
                    particleCount: 40,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.65 },
                    colors: ['#ff2d7b', '#ffd700', '#ff69b4', '#c084fc']
                });
            }, 280);
        }
    })();


    /* ═══════════════════════════════════════
       9. SAVE AS MEMORY (Print)
       ═══════════════════════════════════════ */
    (() => {
        const btn = document.getElementById('save-btn');
        if (!btn) return;
        btn.addEventListener('click', () => window.print());
    })();


    /* ═══════════════════════════════════════
       UTILITY: Safe confetti wrapper
       ═══════════════════════════════════════ */
    function fireConfetti(opts) {
        if (typeof confetti === 'function') {
            try { confetti(opts); } catch (e) { /* silently ignore */ }
        }
    }

    // Expose fireConfetti globally for potential reuse
    window._fireConfetti = fireConfetti;


    /* ═══════════════════════════════════════
       10. HEART CURSOR TRAIL (BUCIN EFFECT)
       ═══════════════════════════════════════ */
    (() => {
        const cursorContainer = document.createElement('div');
        cursorContainer.style.position = 'fixed';
        cursorContainer.style.top = '0';
        cursorContainer.style.left = '0';
        cursorContainer.style.width = '100%';
        cursorContainer.style.height = '100%';
        cursorContainer.style.pointerEvents = 'none';
        cursorContainer.style.zIndex = '9999';
        document.body.appendChild(cursorContainer);

        let lastTime = 0;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < 50) return; // Limit heart creation rate
            lastTime = now;

            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'absolute';
            heart.style.left = e.clientX + 'px';
            heart.style.top = e.clientY + 'px';
            heart.style.fontSize = Math.floor(Math.random() * 10 + 10) + 'px';
            heart.style.opacity = '1';
            heart.style.transform = 'translate(-50%, -50%) scale(1)';
            heart.style.transition = 'all 1s ease-out';

            cursorContainer.appendChild(heart);

            // Animate
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40 + 20;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance - 50; // Float up

                heart.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1.5) rotate(${Math.random() * 40 - 20}deg)`;
                heart.style.opacity = '0';
            }, 10);

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, 1000);
        });
    })();

});
