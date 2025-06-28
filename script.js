document.addEventListener('DOMContentLoaded', () => {
    const openingScreen = document.getElementById('openingScreen');
    const mainContent = document.getElementById('mainContent');
    const openInvitationBtn = document.getElementById('openInvitationBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toText = document.getElementById('toText');
    const countdownElement = document.getElementById('countdown');
    const googleMapsLink = document.getElementById('googleMapsLink');
    const guestbookForm = document.getElementById('guestbookForm');
    const messagesDisplay = document.getElementById('messagesDisplay');
    const noMessagesPlaceholder = document.getElementById('noMessagesPlaceholder');

    // --- Configuration (UPDATE THESE VALUES) ---
    const childName = "Danish Maleeq Jibrani";
    const fatherName = "Sarmadi";
    const motherName = "Bedah";
    const eventLocation = "Kediaman Bapak Sarmadi, Jl. Japos Raya, Pondok Jati Utara, Rtt 005/03";
    const mapsUrl = "#"; // *** NANTI ISI DENGAN LINK GOOGLE MAPS ANDA ***

    // Tanggal dan waktu acara untuk countdown: (Bulan DD, YYYY HH:MM:SS)
    // Ingat bahwa JavaScript bulan dimulai dari 0 (Januari=0, Desember=11)
    const eventDate = new Date("July 12, 2025 10:00:00").getTime(); 

    // --- Dynamic Content Injection ---
    document.title = `Undangan Walimatul Khitan ${childName}`;
    document.querySelector('.opening-name').textContent = childName;
    document.querySelector('.child-name').textContent = childName;
    document.querySelector('.parent-names').textContent = `Putra dari Bapak ${fatherName} & Ibu ${motherName}`;
    document.querySelector('.event-card:nth-child(3) p').textContent = eventLocation;
    document.querySelector('.guestbook-section p').textContent = `Berikan doa dan ucapan terbaik Anda untuk ${childName}.`;
    document.querySelector('.closing-section .family-name').textContent = `Keluarga Besar ${fatherName} & ${motherName}`;

    // Update Google Maps Link
    googleMapsLink.href = mapsUrl;

    // --- 1. Fitur Penamaan Tamu via URL (/to-nama) ---
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    if (toParam) {
        toText.textContent = `Kepada Yth: ${decodeURIComponent(toParam.replace(/\+/g, ' '))}`;
    }

    // --- 2. Event Listener untuk Tombol Buka Undangan ---
    openInvitationBtn.addEventListener('click', () => {
        openingScreen.classList.add('hidden'); // Sembunyikan layar pembuka
        setTimeout(() => {
            openingScreen.style.display = 'none'; // Hapus dari DOM setelah transisi layar pembuka
            mainContent.classList.add('visible'); // Tampilkan konten utama
            mainContent.classList.add('fade-in'); // Trigger fade-in animation for main content

            backgroundMusic.play().catch(e => console.error("Autoplay prevented:", e));

            document.body.addEventListener('click', () => {
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch(e => console.error("Autoplay prevented after interaction:", e));
                }
            }, { once: true });

            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas setelah dibuka
        }, 1000); // Sesuaikan dengan durasi transisi CSS (.opening-screen transition)
    });

    // --- 3. Hitungan Mundur (Countdown) ---
    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(updateCountdown);
            countdownElement.innerHTML = "Acara Telah Berlangsung!";
        } else {
            countdownElement.innerHTML = `
                <div>${days}<span>Hari</span></div>
                <div>${hours}<span>Jam</span></div>
                <div>${minutes}<span>Menit</span></div>
                <div>${seconds}<span>Detik</span></div>
            `;
        }
    }, 1000);

    // --- 4. Guestbook Form (Ucapan akan muncul di web, tapi tidak disimpan permanen) ---
    const messages = []; // Array untuk menyimpan ucapan sementara

    const renderMessages = () => {
        messagesDisplay.innerHTML = '<h4>Ucapan dari Tamu:</h4>';
        if (messages.length === 0) {
            messagesDisplay.appendChild(noMessagesPlaceholder);
            noMessagesPlaceholder.style.display = 'block';
        } else {
            noMessagesPlaceholder.style.display = 'none';
            messages.forEach((msg) => {
                const messageItem = document.createElement('div');
                messageItem.classList.add('message-item');
                messageItem.innerHTML = `<strong>${msg.name}</strong><p>${msg.message}</p>`;
                messagesDisplay.appendChild(messageItem);
            });
        }
    };

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const guestName = document.getElementById('guestName').value;
            const guestMessage = document.getElementById('guestMessage').value;

            if (guestName && guestMessage) {
                messages.push({ name: guestName, message: guestMessage });
                renderMessages();
                e.target.reset();
                alert('Terima kasih atas ucapan Anda!');
            }
        });
    }
    renderMessages();

    // --- Optional: Smooth scroll for fixed nav ---
    document.querySelectorAll('.fixed-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
