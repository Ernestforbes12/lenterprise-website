document.addEventListener('DOMContentLoaded', function() {
    // Page Transition
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetHref = link.getAttribute('href');

            const trans = document.createElement('div');
            trans.classList.add('trans');
            document.body.appendChild(trans);

            setTimeout(() => {
                trans.classList.add('trans-active');
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 400);
            }, 10);
        });
    });

    // Loader
    const loader = document.getElementById("loader");
    if (loader) {
        loader.style.display = "none";
    }

    // Hero "Rent Now" Button Functionality
    const showBookingFormButtonHero = document.getElementById('show-booking-form-button');
    const bookingForm = document.getElementById('booking-form'); // Declared here
    const closeBookingFormButton = document.getElementById('close-booking-form');
    const bookNowButtons = document.querySelectorAll('.car-listing .car-details button');
    const carTypeSelect = document.getElementById('car-type');

    if (showBookingFormButtonHero && bookingForm) {
        showBookingFormButtonHero.addEventListener('click', function() {
            bookingForm.style.display = 'block';
        });
    }

    if (closeBookingFormButton && bookingForm) {
        closeBookingFormButton.addEventListener('click', function() {
            bookingForm.style.display = 'none';
            clearBookingFormErrors(); // Clear errors on exit button click
        });
    }

    // Close booking form when clicked outside
    if (bookingForm) {
        document.addEventListener('click', function(event) {
            if (!bookingForm.contains(event.target) &&
                event.target !== showBookingFormButtonHero &&
                !Array.from(bookNowButtons).includes(event.target) &&
                bookingForm.style.display === 'block'
            ) {
                bookingForm.style.display = 'none';
                clearBookingFormErrors(); // Clear errors when closing outside
            }
        });
    }

    // "Book Now" Buttons in Car Listings Functionality
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() { // Changed to a regular function
            if (bookingForm && carTypeSelect) {
                const carTypeValue = this.dataset.carType;
                if (carTypeValue) {
                    carTypeSelect.value = carTypeValue;
                    bookingForm.style.display = 'block';
                }
            }
        });
    });

    function clearBookingFormErrors() {
        const errorMessages = document.querySelectorAll('#booking-form .error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    const clearButton = document.querySelector('#booking-form button[type="reset"]'); // Target the Clear button within the form
    if (clearButton) {
        clearButton.addEventListener('click', clearBookingFormErrors);
    }

    // Booking Form Submission and Validation
    const rentalForm = document.getElementById('rental-form');
    if (rentalForm) {
        rentalForm.addEventListener('submit', function(event) {
            let isValid = true;
            const errors = {};

            // Required fields validation
            const requiredFields = rentalForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    errors[field.id] = 'This field is required.';
                } else {
                    delete errors[field.id];
                }
            });

            // Email Validation
            const emailField = document.getElementById('email'); // Now correctly targeting the email input
            if (emailField && emailField.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    errors['contact-email'] = 'Please enter a valid email address.'; // Using the correct error span ID
                } else {
                    delete errors['contact-email'];
                }
            }

            // Date and Time Validation
            const pickupDate = document.getElementById('pickup-date');
            const pickupTime = document.getElementById('pickup-time');
            const returnDate = document.getElementById('return-date');
            const returnTime = document.getElementById('return-time');

            if (pickupDate.value && returnDate.value) {
                const pickupDateTime = new Date(pickupDate.value + 'T' + (pickupTime.value || '00:00'));
                const returnDateTime = new Date(returnDate.value + 'T' + (returnTime.value || '00:00'));
                const now = new Date();
                now.setSeconds(0); // For more accurate comparison

                if (pickupDateTime < now) {
                    isValid = false;
                    errors['pickup-date'] = 'Pickup date and time cannot be in the past.';
                } else if (returnDateTime <= pickupDateTime) {
                    isValid = false;
                    errors['return-date'] = 'Return date and time must be after the pickup date and time.';
                } else {
                    delete errors['pickup-date'];
                    delete errors['return-date'];
                }
            } else if (pickupDate.value && !returnDate.value) {
                delete errors['return-date']; // Clear potential "required" error
            } else if (!pickupDate.value && returnDate.value) {
                delete errors['pickup-date']; // Clear potential "required" error
            }

            // Display Errors
            const errorContainer = document.createElement('div');
            errorContainer.classList.add('error-messages');
            rentalForm.querySelectorAll('.error-message').forEach(el => el.remove());

            for (const fieldId in errors) {
                const errorSpan = document.createElement('span');
                errorSpan.classList.add('error-message');
                errorSpan.style.color = 'red';
                errorSpan.style.display = 'block';
                errorSpan.textContent = errors[fieldId];
                const field = document.getElementById(fieldId);
                if (field) {
                    field.parentNode.insertBefore(errorSpan, field.nextSibling);
                }
            }

            // Prevent Submission if Errors Exist
            if (!isValid) {
                event.preventDefault();
            } else {
                console.log('Form is valid and ready to submit!');
                document.getElementById('booking-form').style.display = 'none';
                alert('Booking submitted successfully!');
                rentalForm.reset(); // Clear the form after successful submission
            }
        });
    }

    // Pickup and Return Location Logic
    const pickupLocation = document.getElementById("pickup-location");
    const returnLocation = document.getElementById("return-location");
    if (pickupLocation && returnLocation) {
        returnLocation.disabled = true;
        pickupLocation.addEventListener('change', () => {
            returnLocation.disabled = pickupLocation.value === "";
        });
    }

    // Flatpickr Initialization
    flatpickr(".datepicker", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            let isContactValid = true;
            const contactErrors = {};

            const emailInput = contactForm.querySelector('input[type="email"]');
            const emailErrorSpan = document.getElementById('contact-email-error'); // Get the error display element

            // Email Validation for contact form
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isContactValid = false;
                    contactErrors['contact-email'] = 'Please enter a valid email address.';
                } else if (emailErrorSpan) {
                    emailErrorSpan.textContent = ''; // Clear error message if valid
                }
            } else if (emailInput && emailInput.hasAttribute('required')) {
                isContactValid = false;
                contactErrors['contact-email'] = 'This field is required.';
            }

            // Display Contact Form Errors
            if (emailErrorSpan) {
                emailErrorSpan.textContent = contactErrors['contact-email'] || '';
            }

            if (!isContactValid) {
                e.preventDefault();
            } else {
                alert('Message sent successfully!');
                contactForm.reset();
                if (emailErrorSpan) {
                    emailErrorSpan.textContent = ''; // Clear error on successful submit
                }
            }
        });
    }
});