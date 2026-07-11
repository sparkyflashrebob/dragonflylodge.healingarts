/* Dragonfly Lodge Healing Arts - main.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is open on mobile
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Sticky Header Styling on Scroll
    const header = document.querySelector('.header-wrapper');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Simple Form Submission Alert (for demonstration purposes)
    const bookingForm = document.querySelector('.booking-inquiry-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Simulate API call
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Inquiry Sent!';
                submitBtn.style.backgroundColor = '#2A4235';
                
                // Show a clean visual confirmation message
                const successMsg = document.createElement('p');
                successMsg.className = 'fade-in';
                successMsg.style.color = '#3F5E4D';
                successMsg.style.fontSize = '0.8rem';
                successMsg.style.marginTop = '10px';
                successMsg.style.textAlign = 'center';
                successMsg.textContent = 'Thank you for your message. We will respond within 24 hours.';
                bookingForm.appendChild(successMsg);
                
                bookingForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    successMsg.remove();
                }, 5000);
            }, 1000);
        });
    }

    // 4. Highlight active page in navigation menu
    const currentPath = window.location.pathname.split('/').pop();
    const navAnchors = document.querySelectorAll('.nav-link');
    
    let matched = false;
    navAnchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            anchor.classList.add('active');
            matched = true;
        } else {
            // Check if current page is homepage and link is an anchor link like #about, #modalities
            if ((currentPath === '' || currentPath === 'index.html') && href.startsWith('#')) {
                // leave active checks to scroll observer if we want, or do basic match
            } else {
                anchor.classList.remove('active');
            }
        }
    });

    // If we are on index.html, watch scroll point to highlight #about, #modalities, #contact active states
    if (currentPath === '' || currentPath === 'index.html') {
        const homeSections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let currentActiveId = '';
            homeSections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentActiveId = section.getAttribute('id');
                }
            });
            
            if (currentActiveId) {
                navAnchors.forEach(anchor => {
                    const href = anchor.getAttribute('href');
                    if (href === `#${currentActiveId}`) {
                        anchor.classList.add('active');
                    } else if (href.startsWith('#')) {
                        anchor.classList.remove('active');
                    }
                });
            }
        });
    }
});
