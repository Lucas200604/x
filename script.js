// ============================================
// COUNTDOWN TIMER
// ============================================
const targetDate = new Date('2026-01-08T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        // Unlock content
        unlockContent();
        return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function unlockContent() {
    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');

    // Animate unlock
    lockScreen.style.animation = 'fadeOut 1.5s ease forwards';

    setTimeout(() => {
        lockScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeIn 2s ease';
        initializeContent();
    }, 1500);
}

// Check if already unlocked on page load
function checkUnlockStatus() {
    const now = new Date().getTime();
    if (now >= targetDate) {
        unlockContent();
    } else {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// ============================================
// GALLERY FUNCTIONALITY
// ============================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        // Animate on scroll
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';

        setTimeout(() => {
            item.style.transition = 'all 0.8s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ============================================
// MESSAGES SECTION - Intersection Observer
// ============================================
function initMessageAnimation() {
    const messageCards = document.querySelectorAll('.message-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.2
    });

    messageCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

// ============================================
// REASONS CARDS - Flip Interaction
// ============================================
function initReasonCards() {
    const reasonCards = document.querySelectorAll('.reason-card');

    reasonCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

// ============================================
// LOVE LETTER - Envelope Interaction
// ============================================
function initLoveLetter() {
    const envelope = document.getElementById('envelope');
    const letterPaper = document.getElementById('letterPaper');

    envelope.addEventListener('click', () => {
        envelope.classList.add('open');

        setTimeout(() => {
            letterPaper.classList.add('visible');
        }, 600);
    });

    // Close letter if clicked outside
    document.addEventListener('click', (e) => {
        if (letterPaper.classList.contains('visible') &&
            !letterPaper.contains(e.target) &&
            !envelope.contains(e.target)) {
            letterPaper.classList.remove('visible');
            setTimeout(() => {
                envelope.classList.remove('open');
            }, 300);
        }
    });
}

// ============================================
// INTERACTIVE SKY OF WISHES - Canvas
// ============================================
class SkyOfWishes {
    constructor() {
        this.canvas = document.getElementById('skyCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.wishes = [
            '✨ 1 año',
            '💫 Sueños',
            '🌟 Metas',
            '⭐ Recuerdos inolvidables',
            '💕 Crecer juntos',
            '🌠 Cumplir nuestros sueños'
        ];

        this.resize();
        this.init();
        this.animate();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        // Create static stars
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random()
            });
        }

        // Create heart constellation
        this.createHeartConstellation();
    }

    createHeartConstellation() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const size = 50;

        // Heart shape points
        const heartPoints = [];
        for (let t = 0; t < Math.PI * 2; t += 0.3) {
            const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
            const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
            heartPoints.push({ x, y, radius: 2, opacity: 1, color: '#ff426f' });
        }

        this.stars.push(...heartPoints);
    }

    addEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.createShootingStar(x, y);
        });

        window.addEventListener('resize', () => this.resize());
    }

    createShootingStar(x, y) {
        const angle = Math.random() * Math.PI / 4 - Math.PI / 8; // Slight random angle
        const wish = this.wishes[Math.floor(Math.random() * this.wishes.length)];

        this.shootingStars.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            length: 60,
            opacity: 1,
            wish: wish,
            showWish: true
        });
    }

    drawStars() {
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color || `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();

            // Twinkling effect
            star.opacity += (Math.random() - 0.5) * 0.1;
            star.opacity = Math.max(0.3, Math.min(1, star.opacity));
        });
    }

    drawShootingStars() {
        this.shootingStars = this.shootingStars.filter(star => star.opacity > 0);

        this.shootingStars.forEach(star => {
            // Draw shooting star trail
            const gradient = this.ctx.createLinearGradient(
                star.x, star.y,
                star.x - star.vx * star.length,
                star.y - star.vy * star.length
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = gradient;
            this.ctx.stroke();

            // Draw wish text
            if (star.showWish && star.opacity > 0.7) {
                this.ctx.font = '14px var(--font-body)';
                this.ctx.fillStyle = `rgba(255, 215, 0, ${star.opacity})`;
                this.ctx.fillText(star.wish, star.x + 10, star.y - 10);
            }

            // Update position
            star.x += star.vx;
            star.y += star.vy;
            star.opacity -= 0.01;

            // Gravity effect
            star.vy += 0.05;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStars();
        this.drawShootingStars();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 1s ease';
        observer.observe(section);
    });
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INITIALIZE ALL CONTENT
// ============================================
function initializeContent() {
    initGallery();
    initMessageAnimation();
    initReasonCards();
    initLoveLetter();
    new SkyOfWishes();
    initScrollAnimations();
    initSmoothScroll();
}

// ============================================
// PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkUnlockStatus();
});

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }
`;
document.head.appendChild(style);
