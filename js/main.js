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

    // 3. Form Submission Handling with Web3forms API
    const web3forms = document.querySelectorAll('form[data-web3forms]');
    web3forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Submit';

            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            // Remove any existing messages
            const existingMsg = form.querySelector('.form-feedback');
            if (existingMsg) {
                existingMsg.remove();
            }

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let jsonRes = await response.json();
                    if (response.status == 200) {
                        // Success!
                        if (submitBtn) {
                            submitBtn.textContent = 'Success!';
                            submitBtn.style.backgroundColor = '#2A4235';
                        }

                        const successMsg = document.createElement('p');
                        successMsg.className = 'form-feedback fade-in';
                        successMsg.style.color = '#3F5E4D';
                        successMsg.style.fontSize = '0.85rem';
                        successMsg.style.marginTop = '10px';
                        successMsg.style.textAlign = 'center';

                        // Customize text based on whether it is a booking or newsletter
                        const subjectInput = form.querySelector('input[name="subject"]');
                        if (subjectInput && subjectInput.value.includes('Newsletter')) {
                            successMsg.textContent = 'Thank you for subscribing to the Dragonfly Journey!';
                        } else {
                            successMsg.textContent = 'Thank you for your message. We will respond within 24 hours.';
                        }
                        form.appendChild(successMsg);
                        form.reset();

                        setTimeout(() => {
                            if (submitBtn) {
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                                submitBtn.style.backgroundColor = '';
                            }
                            successMsg.remove();
                        }, 5000);
                    } else {
                        // Error from API (e.g. invalid key)
                        console.error(jsonRes);
                        throw new Error(jsonRes.message || 'Form submission failed.');
                    }
                })
                .catch(error => {
                    console.error(error);
                    if (submitBtn) {
                        submitBtn.textContent = 'Error';
                        submitBtn.style.backgroundColor = '#8B0000';
                    }

                    const errorMsg = document.createElement('p');
                    errorMsg.className = 'form-feedback fade-in';
                    errorMsg.style.color = '#8B0000';
                    errorMsg.style.fontSize = '0.85rem';
                    errorMsg.style.marginTop = '10px';
                    errorMsg.style.textAlign = 'center';
                    errorMsg.textContent = 'Something went wrong. Please check your connection and try again.';
                    form.appendChild(errorMsg);

                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.backgroundColor = '';
                        }
                        errorMsg.remove();
                    }, 5000);
                });
        });
    });

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
