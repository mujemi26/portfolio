// Essential functionality for portfolio
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSectionId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Skill Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('skill-modal');
    if (!modal) return;
    const modalTitle = modal.querySelector('.skill-modal-title');
    const modalDesc = modal.querySelector('.skill-modal-desc');
    const closeBtn = modal.querySelector('.skill-modal-close');
    let lastFocused = null;

    function openModal(card) {
        modalTitle.textContent = card.querySelector('.skill-title').textContent;
        modalDesc.textContent = card.getAttribute('data-description');
        modal.style.display = 'flex';
        setTimeout(() => { modal.classList.add('active'); }, 10);
        lastFocused = document.activeElement;
        closeBtn.focus();
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 250);
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }
    document.querySelectorAll('.skill-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = btn.closest('.skill-card');
            if (card) openModal(card);
        });
        btn.style.cursor = 'pointer';
    });
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('mousedown', e => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', e => {
        if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) closeModal();
    });
});

// Floating Theme Toggle and Scroll to Top Button Logic
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const floatingThemeToggle = document.getElementById('floating-theme-toggle');
    const desktopThemeToggle = document.getElementById('theme-toggle');
    const floatingIcon = document.getElementById('floating-theme-toggle-icon');
    const desktopIcon = document.getElementById('theme-toggle-icon');
    const desktopIndicator = document.getElementById('theme-toggle-indicator');
    
    let lastScrollY = window.scrollY;
    let isScrollingUp = false;
    let scrollTimeout;
    
    // Function to hide floating buttons
    function hideFloatingButtons() {
        if (scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
        if (floatingThemeToggle) floatingThemeToggle.classList.remove('visible');
    }
    
    // Function to toggle floating buttons visibility based on scroll direction
    function toggleFloatingButtons() {
        const currentScrollY = window.scrollY;
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Determine scroll direction
        if (currentScrollY < lastScrollY) {
            // Scrolling UP
            isScrollingUp = true;
            if (scrollToTopBtn) scrollToTopBtn.classList.add('visible');
            if (floatingThemeToggle) floatingThemeToggle.classList.add('visible');
        } else {
            // Scrolling DOWN
            isScrollingUp = false;
            hideFloatingButtons();
        }
        
        lastScrollY = currentScrollY;
        
        // Set timeout to hide buttons when scrolling stops
        scrollTimeout = setTimeout(hideFloatingButtons, 1500); // Hide after 1.5 seconds of no scrolling
    }
    
    // Scroll to top functionality
    if (scrollToTopBtn) {
        window.addEventListener('scroll', toggleFloatingButtons);
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Theme toggle functionality
    function updateThemeIcons() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const icon = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        const text = isDark ? 'Dark' : 'Light';
        
        if (floatingIcon) floatingIcon.innerHTML = icon;
        if (desktopIcon) desktopIcon.innerHTML = icon;
        if (desktopIndicator) desktopIndicator.textContent = text;
    }
    
    function toggleTheme() {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        // Add fade effect
        document.body.classList.add('theme-fade');
        
        setTimeout(() => {
            if (current === 'dark') {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
            }
            
            updateThemeIcons();
            localStorage.setItem('theme', current);
            
            setTimeout(() => {
                document.body.classList.remove('theme-fade');
            }, 400);
        }, 120);
    }
    
    // Event listeners for theme toggles
    if (floatingThemeToggle) {
        floatingThemeToggle.addEventListener('click', toggleTheme);
    }
    if (desktopThemeToggle) {
        desktopThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize theme on load
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcons();
});

// About Me Typing Animation with Real Keyboard Sound
document.addEventListener('DOMContentLoaded', function() {
    const aboutText = document.getElementById('about-text');
    
    if (!aboutText) return;
    
    const fullText = aboutText.textContent.trim();
    const introText = "Hello! I'm Muhammad Gamal, a DevOps Engineer passionate about building and";
    const animatedText = fullText.substring(introText.length).trim();
    
    // Debug: Log the text parts to see what's happening
    console.log('Full text:', fullText);
    console.log('Intro text:', introText);
    console.log('Animated text:', animatedText);
    
    // Set initial state to show only intro text
    aboutText.textContent = introText;
    
    let typingInterval;
    let currentIndex = 0;
    let isTyping = false;
    let isHovering = false;
    let keyboardAudio;
    let isAudioPlaying = false;
    let hasStartedTyping = false; // Track if typing has started at least once
    
    // Pre-load the keyboard sound
    function loadKeyboardSound() {
        keyboardAudio = new Audio('assets/CreamyKeyboard.mp3');
        keyboardAudio.volume = 0.25; // Set volume to 25%
        keyboardAudio.preload = 'auto';
        
        // Listen for when audio ends
        keyboardAudio.addEventListener('ended', () => {
            isAudioPlaying = false;
        });
    }
    
    // Play keyboard sound with proper controls
    function playKeyboardSound() {
        // Only play if not already playing
        if (isAudioPlaying) {
            return;
        }
        
        isAudioPlaying = true;
        
        try {
            if (keyboardAudio) {
                keyboardAudio.currentTime = 0;
                keyboardAudio.play().catch(error => {
                    isAudioPlaying = false;
                });
            }
        } catch (error) {
            isAudioPlaying = false;
        }
    }
    
    // Stop keyboard sound
    function stopKeyboardSound() {
        try {
            if (keyboardAudio && !keyboardAudio.paused) {
                keyboardAudio.pause();
                keyboardAudio.currentTime = 0;
            }
            isAudioPlaying = false;
        } catch (error) {
            isAudioPlaying = false;
        }
    }
    
    function startTyping() {
        if (isTyping || !isHovering) return;
        
        isTyping = true;
        
        // If this is the first time, start from beginning
        if (!hasStartedTyping) {
            currentIndex = 0;
            aboutText.textContent = introText;
            hasStartedTyping = true;
        }
        
        aboutText.classList.add('typing');
        activateKeyboardAnimation(); // Activate keyboard animation
        
        function typeNextCharacter() {
            if (currentIndex < animatedText.length && isHovering) {
                const currentChar = animatedText[currentIndex];
                aboutText.textContent = introText + animatedText.substring(0, currentIndex + 1);
                currentIndex++;
                
                // Play keyboard sound only for actual characters (not spaces or punctuation)
                if (currentChar !== ' ' && currentChar !== ',' && currentChar !== '.' && currentChar !== '!') {
                    playKeyboardSound();
                }
                
                // Add typing glow effect
                aboutText.classList.add('typing-active');
                setTimeout(() => {
                    aboutText.classList.remove('typing-active');
                }, 50);
                
                // Schedule next character immediately for smooth typing
                let nextDelay = 50; // Faster typing to keep up with sound
                
                // Only slightly longer delays for punctuation
                if (currentChar === ' ' || currentChar === ',' || currentChar === '.') {
                    nextDelay = 80; // Brief pause for readability
                } else if (currentChar === '!') {
                    nextDelay = 100; // Slightly longer for exclamation
                }
                
                // Minimal randomness to keep it smooth
                nextDelay += Math.random() * 15 - 7; // ±7ms variation (reduced)
                
                setTimeout(typeNextCharacter, nextDelay);
            } else {
                stopTyping();
                stopKeyboardSound(); // Stop sound when typing completes
            }
        }
        
        // Start the typing sequence immediately
        typeNextCharacter();
    }
    
    function stopTyping() {
        if (!isTyping) return;
        
        isTyping = false;
        clearInterval(typingInterval);
        aboutText.classList.remove('typing');
        deactivateKeyboardAnimation(); // Deactivate keyboard animation
        
        // Keep the current text as is - don't reset anything
        // The text will remain at whatever point it reached
    }
    
    function handleMouseEnter() {
        isHovering = true;
        startTyping();
    }
    
    function handleMouseLeave() {
        isHovering = false;
        stopTyping();
        stopKeyboardSound(); // Stop the keyboard sound when leaving
    }
    
    // Load the keyboard sound
    loadKeyboardSound();
    
    // Keyboard animation elements
    const keyboardAnimation = document.getElementById('keyboard-animation');
    const keyboardGif = document.getElementById('keyboard-gif');
    let staticImageData = null;
    let isInitialized = false;
    
    // Create a static version by loading the GIF and capturing first frame
    function createStaticVersion() {
        if (keyboardGif && !isInitialized) {
            // Show the GIF immediately so user can see it
            keyboardGif.style.opacity = '1';
            
            // When GIF loads, capture first frame
            keyboardGif.onload = function() {
                // Create a canvas to capture first frame
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = keyboardGif.naturalWidth;
                canvas.height = keyboardGif.naturalHeight;
                
                // Draw first frame
                ctx.drawImage(keyboardGif, 0, 0);
                
                // Convert to data URL and store
                staticImageData = canvas.toDataURL('image/png');
                
                // Set as background to show static version
                keyboardGif.style.backgroundImage = `url(${staticImageData})`;
                keyboardGif.style.backgroundSize = 'cover';
                keyboardGif.style.backgroundPosition = 'center';
                keyboardGif.style.opacity = '1';
                
                isInitialized = true;
            };
        }
    }
    
    // Initialize static version
    createStaticVersion();
    
    // Function to activate keyboard animation
    function activateKeyboardAnimation() {
        if (keyboardAnimation) {
            keyboardAnimation.classList.add('active');
            // Show animated GIF
            if (keyboardGif) {
                keyboardGif.style.backgroundImage = 'none';
                keyboardGif.style.opacity = '1';
            }
            // Add visual feedback
            keyboardAnimation.style.transform = 'scale(1.05)';
            keyboardAnimation.style.filter = 'brightness(1.2)';
        }
    }
    
    // Function to deactivate keyboard animation
    function deactivateKeyboardAnimation() {
        if (keyboardAnimation) {
            keyboardAnimation.classList.remove('active');
            // Show static version
            if (keyboardGif && staticImageData) {
                keyboardGif.style.backgroundImage = `url(${staticImageData})`;
                keyboardGif.style.opacity = '1';
            }
            // Reset visual feedback
            keyboardAnimation.style.transform = 'scale(1)';
            keyboardAnimation.style.filter = 'brightness(1)';
        }
    }
    
    // Mouse enter event - only on the text element
    aboutText.addEventListener('mouseenter', handleMouseEnter);
    
    // Mouse leave event - only on the text element
    aboutText.addEventListener('mouseleave', handleMouseLeave);
    
    // Keyboard animation event listeners
    if (keyboardAnimation) {
        keyboardAnimation.addEventListener('mouseenter', handleMouseEnter);
        keyboardAnimation.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Touch events for mobile
    aboutText.addEventListener('touchstart', () => {
        isHovering = true;
        startTyping();
    });
    
    aboutText.addEventListener('touchend', () => {
        isHovering = false;
        setTimeout(stopTyping, 100);
    });
    
    // Touch events for keyboard animation on mobile
    if (keyboardAnimation) {
        keyboardAnimation.addEventListener('touchstart', () => {
            isHovering = true;
            startTyping();
        });
        
        keyboardAnimation.addEventListener('touchend', () => {
            isHovering = false;
            setTimeout(stopTyping, 100);
        });
    }
});

// Mobile-specific optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile device for performance optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .section:hover {
                    transform: translateY(-2px) scale(1.01) !important;
                }
                .skill-card:hover {
                    transform: translateY(-1px) scale(1.01) !important;
                }
                .course-card:hover {
                    transform: translateY(-1px) scale(1.01) !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Optimize scroll performance on mobile
        let ticking = false;
        function updateScroll() {
            // Mobile scroll optimizations
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Improve touch interactions
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
    }
    
    // Optimize floating buttons for mobile
    const floatingThemeToggle = document.getElementById('floating-theme-toggle');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    if (isMobile) {
        // Increase touch targets for floating buttons
        if (floatingThemeToggle) {
            floatingThemeToggle.style.minWidth = '44px';
            floatingThemeToggle.style.minHeight = '44px';
        }
        if (scrollToTopBtn) {
            scrollToTopBtn.style.minWidth = '44px';
            scrollToTopBtn.style.minHeight = '44px';
        }
        
        // Reduce floating button visibility delay on mobile
        let scrollTimeout;
        function mobileScrollHandler() {
            const currentScrollY = window.scrollY;
            
            clearTimeout(scrollTimeout);
            
            if (currentScrollY > 300) {
                if (scrollToTopBtn) scrollToTopBtn.classList.add('visible');
                if (floatingThemeToggle) floatingThemeToggle.classList.add('visible');
            } else {
                if (scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
                if (floatingThemeToggle) floatingThemeToggle.classList.remove('visible');
            }
            
            // Shorter timeout for mobile
            scrollTimeout = setTimeout(() => {
                if (scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
                if (floatingThemeToggle) floatingThemeToggle.classList.remove('visible');
            }, 1000);
        }
        
        window.addEventListener('scroll', mobileScrollHandler, { passive: true });
    }
});