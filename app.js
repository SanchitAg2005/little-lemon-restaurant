// Little Lemon Restaurant - JavaScript functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileNavigation();
    initSmoothScrolling();
    initBookingForm();
    initDateValidation();
});

// Mobile Navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('active');
            
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isOpen);
            
            // Animate hamburger
            const hamburgers = navToggle.querySelectorAll('.hamburger');
            hamburgers.forEach((hamburger, index) => {
                if (!isOpen) {
                    if (index === 0) hamburger.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) hamburger.style.opacity = '0';
                    if (index === 2) hamburger.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    hamburger.style.transform = '';
                    hamburger.style.opacity = '';
                }
            });
        });

        // Close menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                
                // Reset hamburger
                const hamburgers = navToggle.querySelectorAll('.hamburger');
                hamburgers.forEach(hamburger => {
                    hamburger.style.transform = '';
                    hamburger.style.opacity = '';
                });
            });
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function (for hero CTA button)
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Booking form functionality
function initBookingForm() {
    const form = document.querySelector('.booking-form');
    const inputs = form.querySelectorAll('.form-control');
    
    // Add real-time validation to all inputs
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // Handle form submission
    form.addEventListener('submit', handleFormSubmission);
}

// Initialize date validation
function initDateValidation() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Set minimum date to today
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        dateInput.setAttribute('min', todayString);
        
        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxDateString = maxDate.toISOString().split('T')[0];
        dateInput.setAttribute('max', maxDateString);
    }
}

// Field validation functions
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    clearError(field);

    switch (fieldName) {
        case 'date':
            if (!value) {
                errorMessage = 'Please select a date for your reservation.';
                isValid = false;
            } else {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errorMessage = 'Please select a future date.';
                    isValid = false;
                }
            }
            break;

        case 'time':
            if (!value) {
                errorMessage = 'Please select a time for your reservation.';
                isValid = false;
            }
            break;

        case 'guests':
            if (!value) {
                errorMessage = 'Please select the number of guests.';
                isValid = false;
            }
            break;

        case 'name':
            if (!value) {
                errorMessage = 'Please enter your full name.';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            }
            break;

        case 'email':
            if (!value) {
                errorMessage = 'Please enter your email address.';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
            break;

        case 'phone':
            if (!value) {
                errorMessage = 'Please enter your phone number.';
                isValid = false;
            } else if (!isValidPhone(value)) {
                errorMessage = 'Please enter a valid phone number.';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid US phone number (10 digits)
    return cleaned.length === 10 || cleaned.length === 11;
}

// Show error message
function showError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const errorElement = document.getElementById(field.name + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.removeAttribute('role');
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('[aria-required="true"]');
    
    let isFormValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        // Focus on first invalid field
        const firstError = form.querySelector('.form-control.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Collect form data
        const formData = new FormData(form);
        const bookingData = {
            date: formData.get('date'),
            time: formData.get('time'),
            guests: formData.get('guests'),
            occasion: formData.get('occasion') || 'Not specified',
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dietary: formData.get('dietary') || 'None',
            specialRequests: formData.get('special-requests') || 'None'
        };
        
        // Show confirmation
        showConfirmation(bookingData);
        
        // Hide form
        form.style.display = 'none';
        
        // Reset loading state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
    }, 1500); // Simulate 1.5 second processing time
}

// Show booking confirmation
function showConfirmation(bookingData) {
    const confirmationDiv = document.querySelector('.confirmation-message');
    const detailsDiv = confirmationDiv.querySelector('.confirmation-details');
    
    // Format the date
    const date = new Date(bookingData.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create confirmation details HTML
    const detailsHTML = `
        <div style="text-align: left;">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>Party Size:</strong> ${bookingData.guests} ${bookingData.guests === '1' ? 'guest' : 'guests'}</p>
            <p><strong>Occasion:</strong> ${bookingData.occasion}</p>
            <p><strong>Name:</strong> ${bookingData.name}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Phone:</strong> ${bookingData.phone}</p>
            ${bookingData.dietary !== 'None' ? `<p><strong>Dietary Restrictions:</strong> ${bookingData.dietary}</p>` : ''}
            ${bookingData.specialRequests !== 'None' ? `<p><strong>Special Requests:</strong> ${bookingData.specialRequests}</p>` : ''}
        </div>
        <p style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ddd; font-style: italic;">
            We will send a confirmation email to ${bookingData.email} shortly. 
            If you need to make any changes, please call us at (555) 123-4567.
        </p>
    `;
    
    detailsDiv.innerHTML = detailsHTML;
    confirmationDiv.classList.remove('hidden');
    
    // Scroll to confirmation
    confirmationDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus on confirmation for screen readers
    confirmationDiv.focus();
}

// Reset form function
function resetForm() {
    const form = document.querySelector('.booking-form');
    const confirmationDiv = document.querySelector('.confirmation-message');
    
    // Reset form
    form.reset();
    form.style.display = 'block';
    
    // Clear all errors
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.removeAttribute('role');
    });
    
    const errorFields = form.querySelectorAll('.form-control.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    });
    
    // Hide confirmation
    confirmationDiv.classList.add('hidden');
    
    // Reset date minimum
    initDateValidation();
    
    // Scroll back to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Focus on first field
    const firstField = form.querySelector('.form-control');
    if (firstField) {
        firstField.focus();
    }
}

// Add active navigation highlighting on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - headerHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Handle form input formatting
document.addEventListener('input', function(e) {
    // Format phone number as user types
    if (e.target.name === 'phone') {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = `(${value}`;
            } else if (value.length <= 6) {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        
        e.target.value = formattedValue;
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav__menu');
        const navToggle = document.querySelector('.nav__toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    }
});

// Add loading animation to submit button
function addLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .btn.loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            top: 50%;
            left: 50%;
            margin-left: -10px;
            margin-top: -10px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize loading animation
addLoadingAnimation();

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // If image fails to load, hide it gracefully
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});

// Enhance accessibility
function enhanceAccessibility() {
    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.cssText = `
            position: absolute;
            left: 6px;
            top: 7px;
            width: auto;
            height: auto;
            overflow: visible;
            background: var(--color-primary);
            color: var(--color-secondary);
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.cssText = `
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.id = 'main-content';
    }
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Expose global functions
window.scrollToSection = scrollToSection;
window.resetForm = resetForm;