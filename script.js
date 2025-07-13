// Global variables
let isVoiceSearchActive = false;
let isARModeActive = false;
let dealTimer = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupSearch();
    setupVoiceSearch();
    setupARMode();
    setupPriceCharts();
    setupDealsTimer();
    setupFloatingActionButton();
    setupScrollAnimations();
    setupParallaxEffects();
    setupInteractiveElements();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
}

// Search Setup
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');

    // Search input functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 2) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });

    // Suggestion tags
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const query = this.textContent;
            searchInput.value = query;
            performSearch(query);
        });
    });
}

// Voice Search Setup
function setupVoiceSearch() {
    const voiceSearchBtn = document.querySelector('.voice-search-btn');
    const neuralSearchBtn = document.querySelector('.neural-search-btn');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        voiceSearchBtn.addEventListener('click', function() {
            if (!isVoiceSearchActive) {
                startVoiceSearch(recognition);
            } else {
                stopVoiceSearch(recognition);
            }
        });

        neuralSearchBtn.addEventListener('click', function() {
            simulateNeuralSearch();
        });

        recognition.onstart = function() {
            isVoiceSearchActive = true;
            voiceSearchBtn.innerHTML = '<i class="fas fa-stop"></i>';
            voiceSearchBtn.style.background = 'var(--error-500)';
        };

        recognition.onend = function() {
            isVoiceSearchActive = false;
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceSearchBtn.style.background = '';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.querySelector('.search-input').value = transcript;
            performSearch(transcript);
        };
    }
}

// AR Mode Setup
function setupARMode() {
    const arBtn = document.querySelector('.ar-btn');
    const arCta = document.querySelector('.ar-cta');

    arBtn.addEventListener('click', function() {
        toggleARMode();
    });

    arCta.addEventListener('click', function() {
        launchARExperience();
    });
}

// Price Charts Setup
function setupPriceCharts() {
    const charts = document.querySelectorAll('.mini-chart');
    
    charts.forEach((chart, index) => {
        drawPriceChart(chart, generatePriceData());
    });
}

// Deals Timer Setup
function setupDealsTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    let timeLeft = {
        hours: 23,
        minutes: 45,
        seconds: 12
    };

    dealTimer = setInterval(() => {
        timeLeft.seconds--;
        
        if (timeLeft.seconds < 0) {
            timeLeft.seconds = 59;
            timeLeft.minutes--;
        }
        
        if (timeLeft.minutes < 0) {
            timeLeft.minutes = 59;
            timeLeft.hours--;
        }
        
        if (timeLeft.hours < 0) {
            // Reset timer
            timeLeft = { hours: 23, minutes: 59, seconds: 59 };
        }

        hoursEl.textContent = timeLeft.hours.toString().padStart(2, '0');
        minutesEl.textContent = timeLeft.minutes.toString().padStart(2, '0');
        secondsEl.textContent = timeLeft.seconds.toString().padStart(2, '0');
    }, 1000);
}

// Floating Action Button Setup
function setupFloatingActionButton() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    let isMenuOpen = false;

    fabMain.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            fabMenu.classList.add('active');
            fabMain.innerHTML = '<i class="fas fa-times"></i>';
            fabMain.style.transform = 'rotate(45deg)';
        } else {
            fabMenu.classList.remove('active');
            fabMain.innerHTML = '<i class="fas fa-plus"></i>';
            fabMain.style.transform = 'rotate(0deg)';
        }
    });

    // FAB menu items
    const fabItems = document.querySelectorAll('.fab-item');
    fabItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('i').className;
            
            switch(true) {
                case icon.includes('microphone'):
                    document.querySelector('.voice-search-btn').click();
                    break;
                case icon.includes('cube'):
                    toggleARMode();
                    break;
                case icon.includes('bell'):
                    showPriceAlertModal();
                    break;
                case icon.includes('brain'):
                    simulateNeuralSearch();
                    break;
            }
            
            // Close menu
            fabMain.click();
        });
    });
}

// Scroll Animations Setup
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .tracking-card,
        .category-card,
        .feature-card,
        .deal-card,
        .trust-card
    `);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Parallax Effects Setup
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Interactive Elements Setup
function setupInteractiveElements() {
    // Category cards hover effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Deal cards progress animation
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Hologram product interaction
    const hologramProduct = document.querySelector('.product-3d');
    if (hologramProduct) {
        hologramProduct.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-20px) rotateY(45deg) scale(1.1)';
        });
        
        hologramProduct.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
    }
}

// Utility Functions

function performSearch(query) {
    console.log('Searching for:', query);
    
    // Simulate search with loading state
    const searchInput = document.querySelector('.search-input');
    const originalPlaceholder = searchInput.placeholder;
    
    searchInput.placeholder = 'Searching across dimensions...';
    searchInput.disabled = true;
    
    setTimeout(() => {
        searchInput.placeholder = originalPlaceholder;
        searchInput.disabled = false;
        
        // Show search results notification
        showNotification(`Found ${Math.floor(Math.random() * 1000) + 100} results for "${query}"`);
    }, 1500);
}

function startVoiceSearch(recognition) {
    try {
        recognition.start();
        showNotification('Listening... Speak now!');
    } catch (error) {
        console.error('Voice search error:', error);
        showNotification('Voice search not available');
    }
}

function stopVoiceSearch(recognition) {
    recognition.stop();
}

function simulateNeuralSearch() {
    showNotification('Neural interface activated! Reading brainwaves...');
    
    const searchInput = document.querySelector('.search-input');
    const neuralQueries = [
        'wireless headphones with noise cancellation',
        'gaming laptop under $2000',
        'smart home security system',
        'fitness tracker with heart rate monitor'
    ];
    
    setTimeout(() => {
        const randomQuery = neuralQueries[Math.floor(Math.random() * neuralQueries.length)];
        searchInput.value = randomQuery;
        performSearch(randomQuery);
        showNotification('Neural search complete! Thought detected and processed.');
    }, 2000);
}

function toggleARMode() {
    isARModeActive = !isARModeActive;
    const arBtn = document.querySelector('.ar-btn');
    
    if (isARModeActive) {
        arBtn.style.background = 'var(--primary-600)';
        arBtn.style.color = 'white';
        document.body.style.filter = 'hue-rotate(30deg) saturate(1.2)';
        showNotification('AR Mode Activated! Point your camera at products.');
    } else {
        arBtn.style.background = '';
        arBtn.style.color = '';
        document.body.style.filter = '';
        showNotification('AR Mode Deactivated');
    }
}

function launchARExperience() {
    showNotification('Launching AR Experience...');
    
    // Simulate AR launch
    const arDemo = document.querySelector('.ar-demo');
    arDemo.style.transform = 'scale(1.1)';
    arDemo.style.filter = 'brightness(1.2) contrast(1.1)';
    
    setTimeout(() => {
        arDemo.style.transform = '';
        arDemo.style.filter = '';
        showNotification('AR Experience Ready! Use gestures to interact.');
    }, 2000);
}

function drawPriceChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.05)');
    
    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    
    const stepX = width / (data.length - 1);
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const priceRange = maxPrice - minPrice;
    
    data.forEach((price, index) => {
        const x = index * stepX;
        const y = height - ((price - minPrice) / priceRange) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
}

function generatePriceData() {
    const data = [];
    let price = 1000 + Math.random() * 500;
    
    for (let i = 0; i < 20; i++) {
        price += (Math.random() - 0.5) * 50;
        data.push(Math.max(500, price));
    }
    
    return data;
}

function showPriceAlertModal() {
    showNotification('Price Alert Setup - Feature coming soon!');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: 'var(--primary-600)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-xl)',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease-out',
        maxWidth: '300px',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-input').focus();
    }
    
    // Ctrl/Cmd + Shift + V for voice search
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        document.querySelector('.voice-search-btn').click();
    }
    
    // Ctrl/Cmd + Shift + A for AR mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleARMode();
    }
});

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('Page load time exceeds 3 seconds');
            }
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An error occurred. Our quantum error correction is fixing it!');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (dealTimer) {
        clearInterval(dealTimer);
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        performSearch,
        generatePriceData,
        drawPriceChart,
        showNotification
    };
}