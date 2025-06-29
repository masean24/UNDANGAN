let musicPlaying = false;
const music = document.getElementById('backgroundMusic');
const musicBtn = document.getElementById('musicBtn');

// Target event date for countdown (15 Juli 2025, 09:00:00 WIB)
const eventDate = new Date("Jul 15, 2025 09:00:00").getTime();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    music.volume = 0.3; 
    
    // Get recipient name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const recipientName = urlParams.get('to');
    
    if (recipientName) {
        // Replace + with spaces and capitalize
        const formattedName = decodeURIComponent(recipientName.replace(/\+/g, ' '));
        document.getElementById('coverRecipientName').textContent = formattedName;
        document.getElementById('recipientName').textContent = formattedName; 
    } else {
        document.getElementById('coverRecipientName').textContent = "Bapak/Ibu/Saudara/i";
        document.getElementById('recipientName').textContent = "Bapak/Ibu/Saudara/i";
    }
    
    // Load saved ucapan
    loadUcapan();
});

// Function to open the main invitation
function openInvitation() {
    document.getElementById('cover-page').style.display = 'none'; // Sembunyikan halaman cover
    document.querySelector('.main-content').style.display = 'block'; // Tampilkan konten utama undangan
    document.getElementById('musicBtn').style.display = 'flex'; // Tampilkan kontrol musik
    document.querySelector('.bottom-nav').style.display = 'flex'; // Tampilkan navigasi bawah

    // Coba putar musik secara otomatis setelah pengguna berinteraksi
    if (!musicPlaying) {
        music.play().then(() => {
            musicPlaying = true;
            musicBtn.innerHTML = '🔊'; // Ganti ikon menjadi speaker jika musik diputar
            musicBtn.style.opacity = '1';
        }).catch(e => {
            console.log('Music autoplay prevented after interaction:', e);
            musicBtn.innerHTML = '🎵'; // Tetap tampilkan ikon not musik jika gagal putar
        });
    }

    // Mulai hitungan mundur saat undangan dibuka
    startCountdown();
}

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicBtn.innerHTML = '🎵';
        musicBtn.style.opacity = '0.7';
        musicPlaying = false;
    } else {
        music.play().catch(e => {
            console.log('Music autoplay prevented by browser');
        });
        musicBtn.innerHTML = '🔊';
        musicBtn.style.opacity = '1';
        musicPlaying = true;
    }
}

function showSection(sectionId, clickedElement) {
    // Hide all sections in main content
    const sections = document.querySelectorAll('.main-content .section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active nav item
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    clickedElement.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function submitUcapan(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const senderName = formData.get('senderName');
    const ucapanMessage = formData.get('ucapanMessage');

    const ucapan = {
        id: Date.now(),
        sender: senderName,
        message: ucapanMessage,
        timestamp: new Date().toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // Get existing ucapan from localStorage or initialize empty array
    const storedUcapanJSON = localStorage.getItem('ucapanList');
    let savedUcapan = storedUcapanJSON ? JSON.parse(storedUcapanJSON) : [];
    
    savedUcapan.unshift(ucapan); // Add new ucapan to the beginning of the array
    
    // Save updated ucapan list to localStorage
    localStorage.setItem('ucapanList', JSON.stringify(savedUcapan));

    const resultDiv = document.getElementById('ucapanResult');
    resultDiv.innerHTML = `
        <div style="background: #d4f7d4; color: #2d5a2d; border: 2px solid #90ee90; border-radius: 15px; padding: 20px;">
            <h4 style="margin-bottom: 10px; font-size: 18px; color: #2d5a2d;">✅ Jazakallahu Khairan, ${senderName}!</h4>
            <p style="margin-bottom: 10px;">Ucapan dan doa Anda telah tersimpan dengan baik.</p>
            <p style="font-style: italic; color: #3a7a3a;">"Semoga Allah membalas kebaikan Anda dan doa Anda menjadi berkah untuk Muhammad Arif! 🤲"</p>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    
    event.target.reset(); // Reset the form fields
    
    loadUcapan(); // Reload ucapan display from localStorage
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

function loadUcapan() {
    const ucapanContainer = document.getElementById('ucapanContainer');
    const storedUcapanJSON = localStorage.getItem('ucapanList');
    const ucapanList = storedUcapanJSON ? JSON.parse(storedUcapanJSON) : [];
    
    if (ucapanList.length === 0) {
        ucapanContainer.innerHTML = `
            <div class="no-ucapan">
                <div class="icon">💌</div>
                <p>Belum ada ucapan dan doa. Jadilah yang pertama memberikan ucapan tulus Anda untuk Muhammad Arif!</p>
            </div>
        `;
        return;
    }

    ucapanContainer.innerHTML = ucapanList.map(ucapan => `
        <div class="ucapan-card">
            <div class="ucapan-sender">💝 ${ucapan.sender}</div>
            <div class="ucapan-message">"${ucapan.message}"</div>
            <div class="ucapan-time">${ucapan.timestamp}</div>
        </div>
    `).join('');
}

// Countdown Timer Logic
function startCountdown() {
    // Update the count down every 1 second
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;
            
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
        // Display the result in the corresponding elements
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl && hoursEl && minutesEl && secondsEl) { // Check if elements exist
            daysEl.innerHTML = (days < 10 ? "0" : "") + days;
            hoursEl.innerHTML = (hours < 10 ? "0" : "") + hours;
            minutesEl.innerHTML = (minutes < 10 ? "0" : "") + minutes;
            secondsEl.innerHTML = (seconds < 10 ? "0" : "") + seconds;
        }
            
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            const countdownElement = document.getElementById("countdown");
            if (countdownElement) { 
                countdownElement.innerHTML = "🎉 Acara Sedang Berlangsung! 🎉";
                countdownElement.style.fontSize = "22px";
                countdownElement.style.color = "#7a5e43";
                countdownElement.style.fontWeight = "bold";
                countdownElement.style.display = "block"; 
                countdownElement.style.textAlign = "center"; /* Pastikan teks rata tengah */
            }
        }
    }, 1000);
}

// Function to save event to Google Calendar
function saveEventToCalendar() {
    const eventTitle = encodeURIComponent("Walimatul Khitan Muhammad Arif");
    const eventLocation = encodeURIComponent("Masjid Al-Ikhlas, Jl. Mawar No. 123, Jakarta Selatan");
    const eventDescription = encodeURIComponent("Syukuran Walimatul Khitan putra kami Muhammad Arif. Semoga menjadi anak yang sholeh dan berbakti kepada orang tua.");
    
    // Event Start Time: 15 Juli 2025, 09:00 WIB
    // Event End Time: 15 Juli 2025, 12:00 WIB
    const startDate = new Date(2025, 6, 15, 9, 0, 0); // Month is 0-indexed (July is 6)
    const endDate = new Date(2025, 6, 15, 12, 0, 0); 
    
    const formatForGoogleCalendar = (date) => {
        const pad = (num) => num < 10 ? '0' + num : num;
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T` +
               `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    };

    const formattedStart = formatForGoogleCalendar(startDate);
    const formattedEnd = formatForGoogleCalendar(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formattedStart}/${formattedEnd}&details=${eventDescription}&location=${eventLocation}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank'); // Open in new tab
}

// Auto-generated by model: These lines are for ripple effect and are better in script.js
document.addEventListener('click', function(e) {
    const navItem = e.target.closest('.nav-item');
    if (navItem) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            opacity: 1;
        `;
        
        const rect = navItem.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        
        navItem.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Auto-generated by model: These lines are for ripple effect and are better in script.js
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
