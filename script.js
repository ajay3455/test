document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

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

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        const header = document.querySelector('.header');
        if (window.pageYOffset > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

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
});
