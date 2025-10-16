document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    // ====================
    // FEATURE 1: Dark Mode Toggle
    // ====================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeState = localStorage.getItem('darkMode') === 'enabled';
    
    if (darkModeState) {
        document.body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });

    // ====================
    // FEATURE 2: Toast Notification System
    // ====================
    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ====================
    // FEATURE 3: Scroll Progress Indicator
    // ====================
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = (window.pageYOffset / documentHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // ====================
    // FEATURE 4: Particle Animation Background
    // ====================
    function createParticles() {
        const particleContainer = document.querySelector('.particle-container');
        if (!particleContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particleContainer.appendChild(particle);
        }
    }
    createParticles();

    // ====================
    // FEATURE 5: Typewriter Effect
    // ====================
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    }

    // ====================
    // FEATURE 6: Floating Action Button Menu
    // ====================
    const fabButton = document.querySelector('.fab-button');
    const fabMenu = document.querySelector('.fab-menu');
    
    fabButton.addEventListener('click', () => {
        fabMenu.classList.toggle('active');
        fabButton.classList.toggle('active');
    });

    // ====================
    // FEATURE 7: Live Chat Widget
    // ====================
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatButton.addEventListener('click', () => {
        chatWidget.classList.add('active');
        chatButton.style.display = 'none';
    });

    closeChat.addEventListener('click', () => {
        chatWidget.classList.remove('active');
        chatButton.style.display = 'flex';
    });

    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addChatMessage(message, 'user');
            chatInput.value = '';
            
            setTimeout(() => {
                addChatMessage('Thanks for your message! Our team will respond shortly.', 'bot');
            }, 1000);
        }
    }

    function addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ====================
    // FEATURE 8: Ripple Effect on Buttons
    // ====================
    document.querySelectorAll('.btn, .service-card, .feature-item').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ====================
    // FEATURE 9: 3D Card Tilt Effect
    // ====================
    document.querySelectorAll('.service-card, .stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // ====================
    // FEATURE 10: Cursor Trail Effect
    // ====================
    const cursorTrail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        cursorTrail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX, y = mouseY;
        
        cursorTrail.forEach((dot, index) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.style.transform = `scale(${(trailLength - index) / trailLength})`;
            
            const nextDot = cursorTrail[index + 1] || cursorTrail[0];
            x += (parseInt(nextDot.style.left) - x) * 0.3;
            y += (parseInt(nextDot.style.top) - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // ====================
    // FEATURE 11: Confetti Animation
    // ====================
    function createConfetti() {
        const colors = ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // ====================
    // FEATURE 12: Search Functionality
    // ====================
    const searchButton = document.getElementById('searchButton');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInputField = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchButton.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInputField.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    searchInputField.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = [];
        document.querySelectorAll('h1, h2, h3, p').forEach(element => {
            if (element.textContent.toLowerCase().includes(query)) {
                results.push({
                    text: element.textContent.substring(0, 100),
                    element: element
                });
            }
        });
        
        searchResults.innerHTML = results.slice(0, 5).map(result => 
            `<div class="search-result">${result.text}...</div>`
        ).join('') || '<div class="search-result">No results found</div>';
    });

    // ====================
    // FEATURE 13: Real-time Visitor Counter
    // ====================
    const visitorCounter = document.getElementById('visitorCounter');
    let visitorCount = parseInt(localStorage.getItem('visitorCount') || '1234');
    visitorCount++;
    localStorage.setItem('visitorCount', visitorCount);
    visitorCounter.textContent = visitorCount;

    // ====================
    // FEATURE 14: Theme Color Picker
    // ====================
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--accent-blue', e.target.value);
        localStorage.setItem('themeColor', e.target.value);
        showToast('Theme color updated! 🎨');
    });

    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-blue', savedColor);
        colorPicker.value = savedColor;
    }

    // ====================
    // FEATURE 15: Print Page
    // ====================
    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
        showToast('Opening print dialog... 🖨️');
    });

    // ====================
    // FEATURE 16: Share Functionality
    // ====================
    document.getElementById('shareButton').addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: 'Check out SecureGuard - Professional Security Solutions',
                    url: window.location.href
                });
                showToast('Thanks for sharing! 🎉');
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard! 📋');
        }
    });

    // ====================
    // FEATURE 17: Cookie Consent Banner
    // ====================
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');
    
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
    }
    
    acceptCookies.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        showToast('Cookie preferences saved! 🍪');
    });

    // ====================
    // FEATURE 18: Konami Code Easter Egg
    // ====================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        showToast('🎮 KONAMI CODE ACTIVATED! 🎮');
        createConfetti();
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    // ====================
    // FEATURE 19: FAQ Accordion
    // ====================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ====================
    // FEATURE 20: Testimonials Carousel
    // ====================
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const prevTestimonial = document.getElementById('prevTestimonial');
    const nextTestimonial = document.getElementById('nextTestimonial');

    function showTestimonial(index) {
        testimonials.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    if (prevTestimonial) {
        prevTestimonial.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (nextTestimonial) {
        nextTestimonial.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    // Auto-play testimonials
    setInterval(() => {
        if (testimonials.length > 0) {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }
    }, 5000);

    // ====================
    // FEATURE 21: Pricing Calculator
    // ====================
    const calculatePrice = document.getElementById('calculatePrice');
    if (calculatePrice) {
        calculatePrice.addEventListener('click', () => {
            const service = document.getElementById('serviceSelect').value;
            const duration = document.getElementById('durationSelect').value;
            const priceDisplay = document.getElementById('priceDisplay');
            
            const prices = {
                monitoring: { monthly: 99, yearly: 999 },
                consulting: { monthly: 199, yearly: 1999 },
                installation: { monthly: 299, yearly: 2999 }
            };
            
            const price = prices[service][duration];
            priceDisplay.textContent = `$${price}`;
            priceDisplay.style.animation = 'pulse 0.5s';
            setTimeout(() => priceDisplay.style.animation = '', 500);
        });
    }

    // ====================
    // FEATURE 22: Parallax Scrolling
    // ====================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ====================
    // FEATURE 23: Image Lazy Loading
    // ====================
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ====================
    // FEATURE 24: Scroll Reveal Animations (Enhanced)
    // ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // ====================
    // FEATURE 25: Reading Time Estimator
    // ====================
    const readingTime = document.getElementById('readingTime');
    if (readingTime) {
        const text = document.body.textContent;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        readingTime.textContent = `${minutes} min read`;
    }

    // ====================
    // Original Mobile Menu
    // ====================
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ====================
    // Enhanced Scroll Effects
    // ====================
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        const header = document.querySelector('.header');
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ====================
    // Service Cards Animation
    // ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);

    const serviceCards = document.querySelectorAll('.service-card');
    const featureItems = document.querySelectorAll('.feature-item');
    
    serviceCards.forEach(card => observer.observe(card));
    featureItems.forEach(item => observer.observe(item));

    // ====================
    // Contact Form with Confetti
    // ====================
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        let isValid = true;

        clearErrors();

        if (name.value.trim() === '') {
            showError('name', 'Please enter your name');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (phone.value.trim() === '') {
            showError('phone', 'Please enter your phone number');
            isValid = false;
        } else if (!phoneRegex.test(phone.value.trim()) || phone.value.trim().replace(/\D/g, '').length < 10) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (message.value.trim() === '') {
            showError('message', 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (isValid) {
            const submitButton = contactForm.querySelector('.btn-submit');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            setTimeout(function() {
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                createConfetti();
                showToast('🎉 Message sent successfully!');

                setTimeout(function() {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    formSuccess.classList.remove('show');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 5000);
            }, 1500);
        }
    });

    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                const errorElement = document.getElementById(input.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });

        input.addEventListener('blur', function() {
            if (input.hasAttribute('required') && input.value.trim() === '') {
                input.classList.add('error');
            }
        });
    });

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }

        field.focus();
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const errorInputs = document.querySelectorAll('.form-input.error');
        
        errorMessages.forEach(error => error.textContent = '');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    // ====================
    // Smooth Scroll
    // ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====================
    // Animated Stats Counter
    // ====================
    const statNumbers = document.querySelectorAll('.stat-number');
    const aboutSection = document.querySelector('.about');
    let counted = false;

    window.addEventListener('scroll', function() {
        if (aboutSection && !counted) {
            const sectionTop = aboutSection.getBoundingClientRect().top;
            const triggerPoint = window.innerHeight * 0.8;

            if (sectionTop < triggerPoint) {
                counted = true;
                animateStats();
            }
        }
    });

    function animateStats() {
        const statCards = document.querySelectorAll('.stat-card .stat-value');
        
        statCards.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const hasLessThan = text.includes('<');
            
            let number = parseFloat(text.replace(/[^\d.]/g, ''));
            
            if (isNaN(number)) return;

            let currentNumber = 0;
            const increment = number / 50;
            const duration = 2000;
            const stepTime = duration / 50;

            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= number) {
                    currentNumber = number;
                    clearInterval(counter);
                }

                let displayValue = currentNumber.toFixed(number % 1 !== 0 ? 1 : 0);
                
                if (hasLessThan) {
                    displayValue = '<' + displayValue + 'min';
                } else if (hasPlus) {
                    displayValue += '+';
                } else if (hasPercent) {
                    displayValue += '%';
                }

                stat.textContent = displayValue;
            }, stepTime);
        });
    }

    // Initial animations
    const serviceCards2 = document.querySelectorAll('.service-card');
    serviceCards2.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease forwards';
    });

    const featureItems2 = document.querySelectorAll('.feature-item');
    featureItems2.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeInUp 0.6s ease forwards';
    });

    // Welcome message
    setTimeout(() => {
        showToast('👋 Welcome to SecureGuard!');
    }, 1000);
});
