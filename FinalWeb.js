// ===== MAIN JS FILE: FinalWeb.js =====
document.addEventListener('DOMContentLoaded', function () {
    // ===== PET FILTERING SYSTEM =====
    const filterButtons = document.querySelectorAll('.filter-button');
    const petCards = document.querySelectorAll('.pet-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.dataset.filter;

            petCards.forEach(card => {
                card.style.display = (filterValue === 'all' || card.classList.contains(filterValue)) ? 'block' : 'none';
            });
        });
    });

    // Initialize EmailJS
    (function () {
        emailjs.init("GvqA-Kd6KaTt1JdNo");
    })();

    // Variables to store latitude and longitude
    let userLat = '';
    let userLng = '';

    // ===== REAL-TIME USER LOCATION FOR MAP AND EMAILJS =====
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLat = position.coords.latitude; // Assign to outer variable
            userLng = position.coords.longitude; // Assign to outer variable

            const mapIframe = document.querySelector('.contact-map iframe');
            if (mapIframe) {
                // Corrected map URL structure
                mapIframe.src = `https://maps.google.com/maps?q=${userLat},${userLng}&z=15&output=embed`;
            }
        }, function (error) {
            console.warn("Location access denied or unavailable:", error);
            // Optionally, set default or 'N/A' if location is denied/unavailable
            userLat = 'Location not available';
            userLng = 'Location not available';
        }, {
            enableHighAccuracy: true, // Request high accuracy
            timeout: 5000,           // Time out after 5 seconds
            maximumAge: 0            // Do not use cached position
        });
    } else {
        console.warn("Geolocation is not supported by this browser.");
        userLat = 'Geolocation not supported';
        userLng = 'Geolocation not supported';
    }


    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[name="name"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const phone = this.querySelector('input[name="phone"]').value.trim();
            const message = this.querySelector('textarea[name="message"]').value.trim();
            const preferredMethod = this.querySelector('input[name="contactMethod"]:checked')?.value;

            if (!name || !email || !phone || !message || !preferredMethod) {
                alert('Please fill in all required fields!');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address!');
                return;
            }

            const serviceID = "service_073xsjm";
            const templateID = "template_rrth80q";

            const params = {
                from_name: name,
                from_email: email,
                phone: phone,
                message: message,
                contact_method: preferredMethod,
                user_latitude: userLat, // Include latitude
                user_longitude: userLng // Include longitude
            };

            console.log("🟡 Sending to EmailJS with data:", params);

            emailjs.send(serviceID, templateID, params)
                .then((res) => {
                    console.log("✅ Success response from EmailJS:", res);
                    alert("Thank you! Your message has been sent successfully.");
                    this.reset();
                })
                .catch((err) => {
                    console.error("❌ EmailJS error:", err);
                    alert("Failed to send message. Check console for error.");
                });
        });
    }

    // ===== ADOPT BUTTON =====
    const adoptButtons = document.querySelectorAll('.pet-button');
    adoptButtons.forEach(button => {
        button.addEventListener('click', function () {
            const petName = this.closest('.pet-info').querySelector('h3').textContent;
            alert(`Thank you for your interest in adopting ${petName}! You’ll now be redirected to the Contact section to provide your details.`);
        });
    });

    // ===== FOOTER YEAR =====
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }

    // ===== TESTIMONIAL CAROUSEL =====
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        showSlide(currentIndex);
    }

    // ===== DARK MODE TOGGLE =====
    const darkModeBtn = document.createElement('button');
    darkModeBtn.textContent = '🌙';
    darkModeBtn.className = 'dark-toggle';
    document.body.appendChild(darkModeBtn);

    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        darkModeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

    // ===== PET OF THE DAY =====
    if (petCards.length) {
        const randomIndex = Math.floor(Math.random() * petCards.length);
        const selectedPet = petCards[randomIndex];
        selectedPet.classList.add('pet-of-the-day');

        const badge = document.createElement('div');
        badge.className = 'pet-badge';
        badge.textContent = '🌟 Pet of the Day';
        selectedPet.appendChild(badge);
    }

    // ===== FAVORITE PET (HEART ICON TOGGLE) =====
    petCards.forEach(card => {
        const heart = document.createElement('span');
        heart.className = 'favorite-heart';
        heart.innerHTML = '♡';
        card.appendChild(heart);

        heart.addEventListener('click', function () {
            this.classList.toggle('favorited');
            this.innerHTML = this.classList.contains('favorited') ? '❤️' : '♡';
        });
    });
});