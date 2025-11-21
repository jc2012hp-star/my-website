document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('language-switcher');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentItem = 0;
    let currentLangData = {}; // Global variable to store current language data
    const intervalTime = 3000; // 3 seconds
    let carouselInterval;

    // Function to fetch and apply language
    const fetchLanguage = async (lang) => {
        try {
            // Path to the language files
            const response = await fetch(`../languages/${lang}.json`);
            if (!response.ok) {
                console.error(`Could not load ${lang}.json file. Check the path.`);
                return;
            }
            currentLangData = await response.json(); // Store fetched data globally
            applyLanguage(currentLangData);
            // Update title tag with translated text
            document.title = currentLangData[document.title.getAttribute('data-lang-key')] || document.title.textContent;
        } catch (error) {
            console.error('Error fetching language data:', error);
        }
    };

    // Function to apply language to the page
    const applyLanguage = (langData) => {
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (langData[key]) {
                // Use innerHTML to support HTML tags in the JSON file
                element.innerHTML = langData[key];
            } else if (element.tagName === 'TITLE') {
                // Special handling for title tag
                element.textContent = langData[key] || element.textContent;
            }
        });
        // Update title tag separately as it's not directly in the body
        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.hasAttribute('data-lang-key')) {
            titleElement.textContent = langData[titleElement.getAttribute('data-lang-key')] || titleElement.textContent;
        }
    };

    // Event listener for language switcher
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => fetchLanguage(event.target.value));
    }

    // Initial language load based on switcher's default value
    if (languageSwitcher) {
        fetchLanguage(languageSwitcher.value);
    } else {
        fetchLanguage('en'); // Default to English if switcher not found
    }

    // Carousel functionality
    function showItem(index) {
        // यह फंक्शन अब सीधे उपयोग नहीं किया जाएगा, लेकिन इसे संदर्भ के लिए रखा गया है।
        const carouselInner = document.querySelector('.carousel-inner');
        if (carouselInner) {
            const offset = -index * 100;
            carouselInner.style.transform = `translateX(${offset}%)`;
        }
    }

    const carouselInner = document.querySelector('.carousel-inner');
    let currentIndex; // currentIndex को यहां घोषित करें
    if (carouselInner && carouselItems.length > 0) {
        // पहले और आखिरी आइटम को क्लोन करें
        const firstClone = carouselItems[0].cloneNode(true);
        const lastClone = carouselItems[carouselItems.length - 1].cloneNode(true);

        // क्लोन को कैरोसेल में जोड़ें
        carouselInner.appendChild(firstClone);
        carouselInner.insertBefore(lastClone, carouselItems[0]);

        const allItems = document.querySelectorAll('.carousel-item');
        currentIndex = 1; // असली पहले आइटम से शुरू करें
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

        carouselInner.addEventListener('transitionend', () => {
            if (currentIndex >= allItems.length - 1) { // अगर आखिरी क्लोन पर है
                carouselInner.style.transition = 'none';
                currentIndex = 1;
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            if (currentIndex <= 0) { // अगर पहले क्लोन पर है
                carouselInner.style.transition = 'none';
                currentIndex = allItems.length - 2;
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        });
    }

    function nextItem() {
        if (!carouselInner) return;
        currentIndex++;
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function prevItem() {
        if (!carouselInner) return;
        currentIndex--;
        carouselInner.style.transition = 'transform 0.5s ease-in-out';
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function showItem(index) {
        // This function is now handled by currentIndex and transform property directly
    }

    function startCarousel() {
        carouselInterval = setInterval(nextItem, intervalTime);
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    if (document.querySelector('.carousel')) {
        const nextButton = document.querySelector('.carousel-control.next');
        const prevButton = document.querySelector('.carousel-control.prev');

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopCarousel();
                currentIndex++;
                carouselInner.style.transition = 'transform 0.5s ease-in-out';
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
                startCarousel();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopCarousel();
                currentIndex--;
                carouselInner.style.transition = 'transform 0.5s ease-in-out';
                carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
                startCarousel();
            });
        }

        startCarousel();
    }

    // Tabs functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default anchor behavior
                const tabId = button.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                tabContents.forEach(content => {
                    if ('#' + content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // Hamburger Menu for Responsive Navigation
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.getElementById('main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Mobile Dropdown Toggle Functionality
    const dropdownLinks = document.querySelectorAll('#main-nav .dropdown > a');

    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Check if we are in mobile view (hamburger is visible)
            const hamburger = document.querySelector('.hamburger');
            if (window.getComputedStyle(hamburger).display !== 'none') {
                event.preventDefault(); // Prevent link navigation only on mobile
                
                const parentLi = this.parentElement;
                const submenu = this.nextElementSibling;

                // Close other open submenus at the same level
                const siblingLis = parentLi.parentElement.children;
                for (let li of siblingLis) {
                    if (li !== parentLi && li.classList.contains('dropdown')) {
                        li.querySelector('ul')?.classList.remove('submenu-active');
                    }
                }

                // Toggle the current submenu
                submenu?.classList.toggle('submenu-active');
            }
        });
    });

    // Registration Form Modal
    const openBtn = document.getElementById('open-reg-form-btn');
    const closeBtn = document.getElementById('close-reg-form-btn');
    const regContainer = document.getElementById('registration-container');

    if (openBtn && closeBtn && regContainer) {
        const refreshCaptchaBtn = document.getElementById('refresh-captcha-btn');
        // --- Captcha Functionality ---
        const captchaQuestionEl = document.getElementById('captcha-question');
        let captchaAnswer;

        const generateCaptcha = () => {
            if (!captchaQuestionEl) return; // Don't run if captcha element doesn't exist

            const num1 = Math.ceil(Math.random() * 15);
            const num2 = Math.ceil(Math.random() * 10);
            
            // Randomly choose between addition and subtraction
            if (Math.random() > 0.5 && num1 > num2) {
                // Subtraction
                captchaAnswer = num1 - num2;
                captchaQuestionEl.innerText = `${num1} - ${num2} = ?`;
            } else {
                // Addition
                captchaAnswer = num1 + num2;
                captchaQuestionEl.innerText = `${num1} + ${num2} = ?`;
            }
        };

        if (refreshCaptchaBtn) {
            refreshCaptchaBtn.addEventListener('click', generateCaptcha);
        }
        // --- End of Captcha ---


        openBtn.addEventListener('click', () => {
            regContainer.classList.add('active');
        });

        closeBtn.addEventListener('click', () => {
            regContainer.classList.remove('active');
        });

        // Close form if user clicks outside of it
        regContainer.addEventListener('click', (event) => {
            if (event.target === regContainer) {
                regContainer.classList.remove('active');
            }
        });

        // Handle Registration Form Submission to WhatsApp
        const regForm = document.getElementById('student-registration-form');
        const thankYouMessage = document.getElementById('thank-you-message');
        if (regForm && thankYouMessage) {
            regForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission

                // --- Form Validation ---
                const name = this.elements['name'].value;
                const village = this.elements['village'].value;
                const phone = this.elements['phone'].value;
                const email = this.elements['email'].value;
                const course = this.elements['course'].value;
                const userAnswer = this.elements['captcha'].value;
                const honeypot = this.elements['website_url'].value; // Honeypot field

                if (!captchaAnswer) {
                    console.log("Captcha not initialized on this page.");
                }


                // Email validation regex
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address.');
                    return; // Stop submission
                }

                // Phone number validation (must be 10 digits)
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(phone)) {
                    alert('Please enter a valid 10-digit phone number.');
                    return; // Stop submission
                }

                // Captcha validation
                if (parseInt(userAnswer, 10) !== captchaAnswer) {
                    alert('Incorrect captcha answer. Please try again.');
                    generateCaptcha(); // Generate a new captcha
                    return; // Stop submission
                }

                // Honeypot validation (if it's filled, it's a bot)
                if (honeypot) {
                    alert('Spam detected. Submission failed.');
                    return; // Stop submission
                }
                // --- End of Validation ---


                // --- सर्वर पर डेटा भेजने के लिए नया कोड ---

                // **महत्वपूर्ण:** आपको यहां अपनी Google Apps Script का URL डालना होगा।
                const scriptURL = 'https://script.google.com/macros/s/AKfycbxDeljMkakVAe-vTU4B7d4VYFo5zwvkdXMo0gWhCbX4mxU1o6V07tVBl57tnlnf-haeCA/exec'; // <-- इस लाइन को बदलें
                const submitButton = this.querySelector('button[type="submit"]');

                // Disable button to prevent multiple submissions
                submitButton.disabled = true;
                submitButton.textContent = currentLangData['btn_submitting'] || 'Submitting...';

                fetch(scriptURL, { method: 'POST', body: new FormData(this)})
                    .then(response => response.json())
                    .then(data => {
                        if (data.result === 'success') {
                            // सफल होने पर धन्यवाद संदेश दिखाएं
                            regForm.style.display = 'none';
                            thankYouMessage.style.display = 'flex';

                            // कुछ सेकंड के बाद मॉडल को स्वचालित रूप से बंद करें
                            setTimeout(() => {
                                regContainer.classList.remove('active');
                                // अगली बार के लिए फॉर्म रीसेट करें
                                regForm.style.display = 'flex';
                                thankYouMessage.style.display = 'none';
                                regForm.reset();
                                generateCaptcha();
                                submitButton.disabled = false; // Re-enable button
                                submitButton.textContent = currentLangData['submit_reg'] || 'Submit Registration'; // Reset button text
                            }, 4000);
                        } else if (data.result === 'error' && data.message) {
                            // यदि कोई त्रुटि संदेश है, तो उसे दिखाएं (जैसे 'पहले से पंजीकृत')
                            alert(data.message);
                            submitButton.disabled = false;
                            submitButton.textContent = currentLangData['submit_reg'] || 'Submit Registration';
                            generateCaptcha(); // एक नया कैप्चा बनाएं
                        } else {
                            // सामान्य त्रुटि
                            throw new Error(data.error || currentLangData['error_unknown'] || 'An unknown error occurred.');
                        }
                    })
                    .catch(error => {
                        console.error(currentLangData['error_prefix'] || 'Error!', error.message);
                        alert(currentLangData['alert_submission_error'] || 'An error occurred. Please try again.');
                        submitButton.disabled = false; // Re-enable button
                        submitButton.textContent = currentLangData['submit_reg'] || 'Submit Registration'; // Reset button text
                    });
            });
        }

        // Generate initial captcha on page load
        generateCaptcha();
    }

    // --- Back to Top Button ---
    // Create and append the button to the body
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'backToTopBtn';
    backToTopButton.className = 'back-to-top-btn';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('title', 'Go to top');
    document.body.appendChild(backToTopButton);

    // Show or hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Scroll to the top when the button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // Close other open answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('show');
                }
            });

            // Toggle current answer
            question.classList.toggle('active');
            answer.classList.toggle('show');
        });
    });

    // --- Cookie Consent Banner ---
    const showCookieBanner = () => {
        // Check if consent has already been given
        if (localStorage.getItem('cookieConsent')) {
            return;
        }

        // Create banner elements
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';

        const message = document.createElement('p');
        // Use language data for the message
        const privacyPolicyLink = `<a href="privacy-policy.html" data-lang-key="nav_privacy_policy">${currentLangData['nav_privacy_policy'] || 'Privacy Policy'}</a>`;
        message.innerHTML = `${currentLangData['cookie_consent_message'] || 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.'} ${privacyPolicyLink}.`;

        const acceptButton = document.createElement('button');
        acceptButton.className = 'cookie-btn';
        acceptButton.textContent = currentLangData['cookie_accept_btn'] || 'Accept';

        const declineButton = document.createElement('button');
        declineButton.className = 'cookie-btn decline';
        declineButton.textContent = currentLangData['cookie_decline_btn'] || 'Decline';

        // Add event listener to the accept button
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
        });

        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined'); // Or any other value
            banner.classList.remove('show');
        });

        // Append elements to the banner and banner to the body
        banner.appendChild(message);
        banner.appendChild(acceptButton);        banner.appendChild(declineButton);
        document.body.appendChild(banner);

        // Use a timeout to allow the page to render before showing the banner
        setTimeout(() => banner.classList.add('show'), 500);
    };

    // Call the function to check and show the banner
    showCookieBanner();
});
