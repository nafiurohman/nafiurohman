// script.js

// Inisialisasi AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// ========== DARK/LIGHT THEME TOGGLE ==========
function initThemeToggle() {
    // Buat toggle button untuk desktop
    const themeToggle = document.createElement('div');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle cursor-pointer';
    themeToggle.innerHTML = `
        <div class="theme-toggle-ball"></div>
        <i class="fas fa-sun theme-icon sun"></i>
        <i class="fas fa-moon theme-icon moon"></i>
    `;
    
    // Tambahkan ke navbar desktop - sebelum language toggle
    const navLinks = document.querySelector('.hidden.md\\:flex');
    if (navLinks) {
        const languageContainer = navLinks.querySelector('.flex.items-center.gap-2');
        if (languageContainer) {
            languageContainer.parentNode.insertBefore(themeToggle, languageContainer);
        }
    }
    
    // Buat toggle button untuk mobile
    const themeToggleMobile = document.createElement('div');
    themeToggleMobile.id = 'theme-toggle-mobile';
    themeToggleMobile.className = 'theme-toggle cursor-pointer';
    themeToggleMobile.innerHTML = `
        <div class="theme-toggle-ball"></div>
        <i class="fas fa-sun theme-icon sun"></i>
        <i class="fas fa-moon theme-icon moon"></i>
    `;
    
    // Tambahkan ke navbar mobile - sebelum language toggle
    const mobileNav = document.querySelector('.md\\:hidden.flex');
    if (mobileNav) {
        const languageToggleMobile = document.getElementById('language-toggle-mobile');
        if (languageToggleMobile) {
            mobileNav.insertBefore(themeToggleMobile, languageToggleMobile);
        }
    }
    
    // Variable untuk menyimpan state tema (dalam memori saja)
    let isDarkMode = false;
    
    // Fungsi untuk apply tema
    function applyTheme(isDark) {
        const html = document.documentElement;
        const body = document.body;
        
        if (isDark) {
            html.classList.add('dark');
            body.style.background = '#222';
            body.style.color = '#fff';
            themeToggle.classList.add('dark');
            if (themeToggleMobile) themeToggleMobile.classList.add('dark');
            isDarkMode = true;
        } else {
            html.classList.remove('dark');
            body.style.background = '';
            body.style.color = '';
            themeToggle.classList.remove('dark');
            if (themeToggleMobile) themeToggleMobile.classList.remove('dark');
            isDarkMode = false;
        }
    }
    
    // Fungsi toggle tema
    function toggleTheme() {
        applyTheme(!isDarkMode);
    }
    
    // Event listener untuk desktop
    themeToggle.addEventListener('click', toggleTheme);
    
    // Event listener untuk mobile
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
    
    // Set default ke light mode
    applyTheme(false);
}

// ========== MOBILE MENU TOGGLE ==========
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuButton || !mobileMenu) return;

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icon
        const icon = mobileMenuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Tutup menu saat klik link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== FORM VALIDATION & EMAIL INTEGRATION ==========
function initFormValidation() {
    const contactForm = document.getElementById('whatsappForm');
    if (!contactForm) return;

    // ✅ GANTI DENGAN CREDENTIALS ANDA
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_j6gf7zn', // GANTI
        TEMPLATE_ID: 'template_w21gl5h', // GANTI  
        PUBLIC_KEY: 'OgQ8rYgFyjR6-Fl9w' // GANTI
    };

    // Validasi email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validasi nomor telepon Indonesia (opsional)
    function isValidPhone(phone) {
        if (!phone.trim()) return true;
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }

    // Tampilkan error
    function showError(input, message) {
        const formGroup = input.parentElement;
        
        // Hapus error sebelumnya
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Tambah kelas error
        input.classList.add('border-red-500', 'dark:border-red-400');
        
        // Buat elemen error
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message text-red-500 dark:text-red-400 text-xs mt-1';
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
    }

    // Hapus error
    function removeError(input) {
        const formGroup = input.parentElement;
        const existingError = formGroup.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        input.classList.remove('border-red-500', 'dark:border-red-400');
    }

    // Validasi form
    function validateForm() {
        let isValid = true;
        
        // Validasi nama
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Nama lengkap harus diisi');
            isValid = false;
        } else if (nameInput.value.trim().length <= 5) {
            showError(nameInput, 'Nama harus minimal 5 karakter');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        // Validasi email
        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email harus diisi');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Format email tidak valid');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        // Validasi nomor telepon (opsional)
        const phoneInput = document.getElementById('phone');
        if (phoneInput.value.trim() && !isValidPhone(phoneInput.value.trim())) {
            showError(phoneInput, 'Format nomor WhatsApp tidak valid (contoh: +62 812-3456-7890)');
            isValid = false;
        } else {
            removeError(phoneInput);
        }
        
        // Validasi pesan
        const messageInput = document.getElementById('message');
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Pesan harus diisi');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Pesan harus minimal 10 karakter');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        return isValid;
    }

    // Fungsi untuk mengirim email menggunakan EmailJS
    function sendEmail(formData) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...';
        submitButton.disabled = true;

        // Data untuk template
        const templateParams = {
            to_email: 'nafiurohman25@gmail.com',
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || 'Tidak diisi',
            message: formData.message,
            subject: `Pesan dari ${formData.name} - Portfolio`,
            date: new Date().toLocaleString('id-ID'),
            website: 'Portfolio M. Nafiurohman'
        };

        console.log('Mengirim email dengan data:', templateParams);

        // Kirim email menggunakan EmailJS
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.PUBLIC_KEY)
            .then(function(response) {
                console.log('✅ EMAIL TERKIRIM!', response);
                showNotification('Pesan berhasil dikirim! Saya akan membalasnya segera.', 'success');
                contactForm.reset();
            })
            .catch(function(error) {
                console.log('❌ GAGAL MENGIRIM EMAIL:', error);
                showNotification('Gagal mengirim pesan. Silakan coba lagi atau email langsung ke nafiurohman25@gmail.com', 'error');
            })
            .finally(function() {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
    }

    // Submit form
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            
            const formData = { name, email, phone, message };
            sendEmail(formData);
        } else {
            showNotification('Mohon periksa form yang Anda isi.', 'error');
        }
    });

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                if (this.id === 'name' && this.value.trim().length < 5) {
                    showError(this, 'Nama harus minimal 5 karakter');
                } else if (this.id === 'email' && !isValidEmail(this.value.trim())) {
                    showError(this, 'Format email tidak valid');
                } else if (this.id === 'phone' && this.value.trim() && !isValidPhone(this.value.trim())) {
                    showError(this, 'Format nomor WhatsApp tidak valid');
                } else if (this.id === 'message' && this.value.trim().length < 10) {
                    showError(this, 'Pesan harus minimal 10 karakter');
                } else {
                    removeError(this);
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                removeError(this);
            }
        });
    });

    // Update UI untuk email
    function updateFormUI() {
        const phoneLabel = contactForm.querySelector('label[for="phone"]');
        const phoneInput = document.getElementById('phone');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('span');
        
        if (phoneLabel) {
            phoneLabel.innerHTML = 'WhatsApp Number <span class="text-gray-400 text-sm">(Optional)</span>';
            phoneLabel.setAttribute('data-i18n', 'phone_label_optional');
        }
        
        if (phoneInput) {
            phoneInput.placeholder = '+62 812-3456-7890 (Optional)';
        }
        
        if (submitText) {
            submitText.textContent = 'Send Message';
            submitText.setAttribute('data-i18n', 'send_message');
        }
        
        // Update icon di submit button
        const icon = submitButton.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-paper-plane mr-2';
        }
    }

    updateFormUI();
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat notifikasi
    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animasi masuk
    setTimeout(() => {
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Hapus setelah 5 detik
    setTimeout(() => {
        notification.classList.remove('translate-x-0', 'opacity-100');
        notification.classList.add('translate-x-full', 'opacity-0');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ========== LANGUAGE TOGGLE ==========
function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const languageToggleMobile = document.getElementById('language-toggle-mobile');
    const languageLabels = document.querySelectorAll('.language-label');

    // Data terjemahan
    const translations = {
        'en': {
            'home': 'Home',
            'about': 'About',
            'portfolio': 'Portfolio',
            'contact': 'Contact',
            'language': 'EN',
            'hero_description': 'Informatics student at Hayam Wuruk University Perbanas Surabaya passionate about digital technology, specializing in front-end web development with a keen eye for design and user experience.',
            'contact_whatsapp': 'Contact Via WhatsApp',
            'view_portfolio': 'View Portfolio',
            'about_title': 'About Me',
            'about_description': 'As a 5th semester Informatics student at Hayam Wuruk Perbanas University Surabaya, I combine technical expertise with creative vision. My passion lies in crafting digital solutions that blend functionality with aesthetic appeal, specializing in responsive front-end development. My multimedia background in videography, photography, and graphic design enhances my ability to create compelling user experiences.',
            'personal_data_title': 'Personal Information',
            'education_title': 'Education',
            'multimedia': 'Multimedia',
            'informatics': 'Informatics',
            'present': 'Present',
            'skills_title': 'Professional Skills',
            'technical_skills': 'Technical Skills',
            'design_skills': 'Design Skills',
            'video_editing': 'Video Editing',
            'soft_skills': 'Soft Skills',
            'portfolio_title': 'My Portfolio',
            'portfolio_description': 'Selected projects demonstrating my technical capabilities and design approach.',
            'project1_title': 'Bezn Studio Landing Page',
            'project1_description': 'A modern, performance-optimized landing page featuring smooth scroll animations, responsive design, and conversion-focused layout for a creative studio.',
            'project2_title': 'SmartInvest Platform',
            'project2_description': 'Investment analysis platform implementing the Weighted Product Method (WPM) for asset selection with interactive data visualization dashboard.',
            'project3_title': 'D. Travelin App Design',
            'project3_description': 'Comprehensive travel application UI/UX design with user-centered approach, featuring intuitive navigation and personalized recommendation system.',
            'view_project': 'View Project',
            'contact_title': 'Get In Touch',
            'contact_info': 'Contact Information',
            'connect_with_me': 'Connect With Me',
            'name_label': 'Full Name',
            'email_label': 'Email',
            'message_label': 'Message',
            'send_message': 'Send via WhatsApp',
            'rights_reserved': 'All rights reserved.'
        },
        'id': {
            'home': 'Beranda',
            'about': 'Tentang',
            'portfolio': 'Portfolio',
            'contact': 'Kontak',
            'language': 'ID',
            'hero_description': 'Mahasiswa Informatika di Universitas Hayam Wuruk Perbanas Surabaya yang bersemangat dalam teknologi digital, khususnya dalam pengembangan web front-end dengan perhatian pada desain dan pengalaman pengguna.',
            'contact_whatsapp': 'Hubungi via WhatsApp',
            'view_portfolio': 'Lihat Portfolio',
            'about_title': 'Tentang Saya',
            'about_description': 'Sebagai mahasiswa Informatika semester 5 di Universitas Hayam Wuruk Perbanas Surabaya, saya menggabungkan keahlian teknis dengan visi kreatif. Passion saya terletak pada pembuatan solusi digital yang memadukan fungsionalitas dengan daya tarik estetika, khususnya dalam pengembangan front-end responsif. Latar belakang multimedia saya dalam videografi, fotografi, dan desain grafis meningkatkan kemampuan saya dalam menciptakan pengalaman pengguna yang menarik.',
            'personal_data_title': 'Informasi Pribadi',
            'education_title': 'Pendidikan',
            'multimedia': 'Multimedia',
            'informatics': 'Informatika',
            'present': 'Sekarang',
            'skills_title': 'Keterampilan Profesional',
            'technical_skills': 'Keterampilan Teknis',
            'design_skills': 'Keterampilan Desain',
            'video_editing': 'Editing Video',
            'soft_skills': 'Keterampilan Lunak',
            'portfolio_title': 'Portfolio Saya',
            'portfolio_description': 'Proyek terpilih yang menunjukkan kemampuan teknis dan pendekatan desain saya.',
            'project1_title': 'Landing Page Bezn Studio',
            'project1_description': 'Landing page modern yang dioptimalkan untuk performa dengan animasi scroll yang halus, desain responsif, dan layout yang fokus pada konversi untuk studio kreatif.',
            'project2_title': 'Platform SmartInvest',
            'project2_description': 'Platform analisis investasi yang menerapkan Metode Weighted Product (WPM) untuk pemilihan aset dengan dashboard visualisasi data interaktif.',
            'project3_title': 'Desain Aplikasi D. Travelin',
            'project3_description': 'Desain UI/UX aplikasi perjalanan yang komprehensif dengan pendekatan berpusat pada pengguna, menampilkan navigasi intuitif dan sistem rekomendasi yang dipersonalisasi.',
            'view_project': 'Lihat Proyek',
            'contact_title': 'Hubungi Saya',
            'contact_info': 'Informasi Kontak',
            'connect_with_me': 'Terhubung Dengan Saya',
            'name_label': 'Nama Lengkap',
            'email_label': 'Email',
            'message_label': 'Pesan',
            'send_message': 'Kirim via WhatsApp',
            'rights_reserved': 'Hak cipta dilindungi.'
        }
    };

    let currentLanguage = 'en';

    function toggleLanguage() {
        currentLanguage = currentLanguage === 'en' ? 'id' : 'en';
        updateLanguage();
    }

    function updateLanguage() {
        // Update semua elemen dengan data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLanguage][key]) {
                element.textContent = translations[currentLanguage][key];
            }
        });
        
        // Update label bahasa
        languageLabels.forEach(label => {
            label.textContent = translations[currentLanguage]['language'];
        });
        
        // Update toggle button
        const toggleBall = document.getElementById('toggle-ball');
        if (toggleBall) {
            if (currentLanguage === 'en') {
                toggleBall.style.transform = 'translateX(0)';
            } else {
                toggleBall.style.transform = 'translateX(1.5rem)';
            }
        }
    }

    // Event listeners
    if (languageToggle) {
        languageToggle.addEventListener('click', toggleLanguage);
    }

    if (languageToggleMobile) {
        languageToggleMobile.addEventListener('click', toggleLanguage);
    }

    // Inisialisasi bahasa
    updateLanguage();
}

// ========== ACTIVE NAV LINK HIGHLIGHTING ==========
function initActiveNavHighlight() {
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const scrollPosition = window.scrollY + 100;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'dark:text-blue-400');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('text-blue-600', 'dark:text-blue-400');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();
}

// ========== TYPING EFFECT ==========
function initTypingEffect() {
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        heroTitle.classList.add('typing-effect');
        
        setTimeout(() => {
            heroTitle.classList.remove('typing-effect');
            heroTitle.style.borderRight = 'none';
        }, 3500);
    }
}

// ========== UPDATE CURRENT YEAR ==========
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ========== INITIALIZATION ==========
function init() {
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initLanguageToggle();
    initActiveNavHighlight();
    initTypingEffect();
    updateCurrentYear();
    
    // Tambahkan styles untuk notifikasi
    const style = document.createElement('style');
    style.textContent = `
        .custom-notification {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .custom-notification.translate-x-0 {
            transform: translateX(0);
            opacity: 1;
        }
        
        .error-message {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// Jalankan saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle resize
window.addEventListener('resize', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});