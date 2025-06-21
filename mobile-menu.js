// ===== COMPLETELY NEW MOBILE MENU JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    // Check if elements exist
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuClose) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    console.log('Mobile menu elements found:', {
        btn: mobileMenuBtn,
        menu: mobileMenu,
        close: mobileMenuClose,
        links: mobileMenuLinks.length
    });
    
    // Prevent body scroll when menu is open
    function toggleBodyScroll(disable) {
        const body = document.body;
        if (disable) {
            const scrollY = window.scrollY;
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.top = `-${scrollY}px`;
        } else {
            const scrollY = body.style.top;
            body.style.overflow = '';
            body.style.position = '';
            body.style.width = '';
            body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('active');
        
        console.log('Toggling mobile menu. Current state:', isOpen ? 'open' : 'closed');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            toggleBodyScroll(false);
            console.log('Mobile menu closed');
        } else {
            // Open menu
            mobileMenu.classList.add('active');
            mobileMenuBtn.classList.add('active');
            toggleBodyScroll(true);
            console.log('Mobile menu opened');
        }
    }
    
    // Event listeners
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile menu button clicked');
        toggleMobileMenu();
    });
    
    mobileMenuClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile menu close button clicked');
        toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    mobileMenuLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`Mobile menu link ${index + 1} clicked:`, targetId);
            
            toggleMobileMenu();
            
            // Smooth scroll to target
            if (targetId && document.querySelector(targetId)) {
                setTimeout(() => {
                    document.querySelector(targetId).scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300); // Wait for menu to close
            }
        });
    });
    
    // Close menu when clicking on overlay
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu || e.target.classList.contains('mobile-menu-overlay')) {
            console.log('Mobile menu overlay clicked');
            toggleMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            console.log('Escape key pressed');
            toggleMobileMenu();
        }
    });
    
    // Test function to check if everything is working
    window.testMobileMenu = function() {
        console.log('Testing mobile menu...');
        console.log('Mobile menu button:', mobileMenuBtn);
        console.log('Mobile menu:', mobileMenu);
        console.log('Mobile menu close:', mobileMenuClose);
        console.log('Mobile menu links:', mobileMenuLinks);
        console.log('Current menu state:', mobileMenu.classList.contains('active') ? 'open' : 'closed');
    };
    
    // Log successful initialization
    console.log('Mobile menu JavaScript initialized successfully');
}); 