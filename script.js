document.addEventListener('DOMContentLoaded', function() {
    initNavbar();

    if (document.getElementById('typing-text')) {
        initTypingEffect();
        initOrbitAnimations();
    }

    if (document.getElementById('product-grid')) {
        loadAllProducts(); // Memuat SEMUA produk
    }
});

// ===============================================
// === FUNGSI BERANDA / HOMEPAGE (INDEX.HTML) ===
// (Tidak diubah)
// ===============================================

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) { 
        hamburger.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
            hamburger.classList.toggle('active');
        });
    }
}

function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const phrases = [
        'Top Up Game',
        'Aplikasi Premium', 
        'Media Sososial'
    ];
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        if (!typingText) return; 
        
        const currentPhrase = phrases[currentPhraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50; 
        } else {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100; 
        }
        
        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; 
        } 
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500; 
        }
        
        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
}

function initOrbitAnimations() {
    const planets = document.querySelectorAll('.random-orbit');

    planets.forEach((planet, index) => {
        const startAngle = Math.random() * 360;
        const baseRadius = 100; 
        const radius = baseRadius + (index * 30); 

        const duration = 15 + Math.random() * 15;
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
        const delay = 0;

        planet.style.transform = `rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg)`;

        const animationName = `orbit${index}`;
        const keyframes = `
            @keyframes ${animationName} {
                from {
                    transform: rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg);
                }
                to {
                    transform: rotate(${startAngle + 360}deg) translateX(${radius}px) rotate(-${startAngle + 360}deg);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        planet.style.animation = `${animationName} ${duration}s linear infinite ${direction}`;
        planet.style.animationDelay = `${delay}s`;

        planet.addEventListener('mouseenter', () => {
            planet.style.animationPlayState = 'paused';
        });

        planet.addEventListener('mouseleave', () => {
            planet.style.animationPlayState = 'running';
        });
    });
}

// ===============================================
// === FUNGSI LIST PRODUK (PRODUK.HTML) BARU ===
// ===============================================

let allProducts = []; 
let groupedProducts = {}; 
let activeProduct = null; 

async function loadAllProducts() {
    try {
        const [appResponse, medsosResponse, topupResponse] = await Promise.all([
            fetch('produk.json'),
            fetch('medsos.json'),
            fetch('Topup.json') 
        ]);
        
        const appData = await appResponse.json();
        const medsosData = await medsosResponse.json();
        const topupData = await topupResponse.json();
        
        const categorizedData = [
            ...appData.map(p => ({ ...p, Category: 'premium' })),
            ...medsosData.map(p => ({ ...p, Category: 'sosmed' })),
            ...topupData.map(p => ({ ...p, Category: 'topup' })) 
        ];

        allProducts = categorizedData; 
        
        const grouped = groupProducts(allProducts);
        groupedProducts = grouped; 
        renderGroupedProducts(grouped); // Panggil render pertama kali saat load
        
        // Tambahkan event listener untuk filter dan search agar trigger render ulang
        document.getElementById('product-search').onkeyup = filterProducts;
        document.getElementById('category-filter').onchange = filterProducts;
        document.getElementById('sort-filter').onchange = filterProducts;


    } catch (error) {
        console.error('Gagal memuat produk:', error);
        document.getElementById('product-grid').innerHTML = 
            '<p style="color: red; text-align: center; grid-column: 1 / -1;">Gagal memuat data produk. Cek konsol untuk detail error.</p>';
    }

    window.onclick = function(event) {
        const productModal = document.getElementById('product-modal');
        const orderModal = document.getElementById('order-modal');

        if (event.target === productModal) {
            closeModal('product-modal');
        }
        if (event.target === orderModal) {
            closeModal('order-modal');
        }
    }
}


function groupProducts(products) {
    const groups = {};
    products.forEach(product => {
        let mainName;
        const lowerCaseName = product.Nama.toLowerCase();
        
        if (lowerCaseName.includes('alight motion')) {
             mainName = 'Alight Motion';
        } else if (lowerCaseName.includes('prime video')) {
             mainName = 'Prime Video';
        } else if (lowerCaseName.includes('ibis paint')) {
             mainName = 'Ibis Paint';
        } else if (lowerCaseName.includes('instagram')) {
             mainName = 'Instagram';
        } else if (lowerCaseName.includes('tiktok')) {
             mainName = 'TikTok';
        } 
        // === LOGIKA TOPUP BARU (Hapus kata "Diamond") ===
        else if (product.Nama.includes('Diamond MLBB Server Indonesia')) {
             mainName = 'MLBB Server Indonesia'; // Diubah
        } else if (product.Nama.includes('Diamond MLBB Server Global')) {
             mainName = 'MLBB Server Global'; // Diubah
        } else if (product.Nama.includes('Roblox')) { 
             mainName = 'Roblox';
        } else if (product.Nama.includes('Genshin Impact')) { 
             mainName = 'Genshin Impact';
        } else if (product.Nama.includes('Free Fire')) { 
             mainName = 'Free Fire';
        }
        // ===============================================
        else {
             mainName = product.Nama.split(' ')[0];
        }

        if (!groups[mainName]) {
            groups[mainName] = {
                mainName: mainName,
                image: product.Gambar,
                category: product.Category, 
                variants: []
            };
        }
        groups[mainName].variants.push(product);
    });

    return Object.values(groups);
}

window.filterProducts = function() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const sortValue = document.getElementById('sort-filter').value;
    const categoryValue = document.getElementById('category-filter').value;
    
    let filteredGroups = groupedProducts;

    if (categoryValue !== 'all') {
        filteredGroups = filteredGroups.filter(group => group.category === categoryValue);
    }

    if (searchTerm) {
        filteredGroups = filteredGroups.filter(group => 
            group.mainName.toLowerCase().includes(searchTerm) ||
            group.variants.some(v => v.Nama.toLowerCase().includes(searchTerm))
        );
    }
    
    if (sortValue !== 'default') {
        filteredGroups = sortGroupedProducts(filteredGroups, sortValue);
    }

    renderGroupedProducts(filteredGroups); // Panggil render ulang
}

// FUNGSI UNTUK MERENDER DAN MENGAKTIFKAN ANIMASI
function renderGroupedProducts(groups) {
    const gridContainer = document.getElementById('product-grid');
    if (!gridContainer) return; 

    // 1. Tambahkan class fade-out ke container
    gridContainer.classList.add('fade-out');
    
    // 2. Tunggu sebentar (durasi fade-out di CSS)
    setTimeout(() => {
        // Kosongkan container
        gridContainer.innerHTML = ''; 

        if (groups.length === 0) {
            gridContainer.innerHTML = '<p style="color: var(--muted); text-align: center; grid-column: 1 / -1;">Produk tidak ditemukan.</p>';
            // Hapus class fade-out agar tampilan bersih
            gridContainer.classList.remove('fade-out');
            return;
        }

        groups.forEach((group, index) => {
            const minPrice = group.variants.reduce((min, variant) => {
                return Math.min(min, priceToNumber(variant.Harga));
            }, Infinity);
            
            const displayPrice = minPrice === Infinity ? 'N/A' : formatPrice(minPrice);

            const card = document.createElement('div');
            card.className = 'product-card';
            card.onclick = () => showProductDetails(group); 

            // Tambahkan animasi CSS
            card.style.animationDelay = `${index * 0.05}s`; // Staggered delay
            card.classList.add('animate-in'); // Class untuk fade/slide in

            card.innerHTML = `
                <img src="Image/${group.image}" alt="${group.mainName}" class="card-image">
                <div class="card-info">
                    <h3>${group.mainName}</h3>
                    <p>Mulai dari</p>
                    <p class="card-price">Rp ${displayPrice}</p>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        // 3. Hapus class fade-out setelah konten baru dimuat
        gridContainer.classList.remove('fade-out');
        
    }, 200); // Durasi harus sinkron atau lebih besar dari CSS transition duration
}

function priceToNumber(price) {
    let cleanPrice = String(price).replace(/[.,]/g, ''); 
    cleanPrice = cleanPrice.replace('k', '000'); 
    cleanPrice = cleanPrice.replace('p', ''); 
    return parseInt(cleanPrice) || 0;
};

function formatPrice(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function sortGroupedProducts(groups, sortBy) {
    return groups.sort((a, b) => {
        if (sortBy === 'name-asc') {
            return a.mainName.localeCompare(b.mainName);
        } else if (sortBy === 'price-asc') {
            const priceA = a.variants.reduce((min, v) => Math.min(min, priceToNumber(v.Harga)), Infinity);
            const priceB = b.variants.reduce((min, v) => Math.min(min, priceToNumber(v.Harga)), Infinity);
            return priceA - priceB;
        } else if (sortBy === 'price-desc') {
            const priceA = a.variants.reduce((min, v) => Math.min(min, priceToNumber(v.Harga)), Infinity);
            const priceB = b.variants.reduce((min, v) => Math.min(min, priceToNumber(v.Harga)), Infinity);
            return priceB - priceA;
        }
        return 0;
    });
}

function formatVariantName(variantSpecificName) {
    let formattedName = variantSpecificName
        .replace(/\b7h\b/g, '7 Hari')
        .replace(/\b1b\b/g, '1 Bulan')
        .replace(/\b2b\b/g, '2 Bulan')
        .replace(/\b3b\b/g, '3 Bulan')
        .replace(/\b1y\b/g, '1 Tahun')
        .replace(/^7h$/i, '7 Hari')
        .replace(/^1b$/i, '1 Bulan')
        .replace(/^2b$/i, '2 Bulan')
        .replace(/^3b$/i, '3 Bulan')
        .replace(/^1y$/i, '1 Tahun');

    return formattedName || variantSpecificName;
}


function showProductDetails(group) {
    activeProduct = group; 
    const modalDetails = document.getElementById('modal-details');
    const selectedInfo = document.getElementById('selected-variant-info');
    if (!modalDetails) return;
    
    let htmlContent = `<h3>${group.mainName} - Pilih Varian</h3>`;
    
    if (group.category === 'topup') {
        
        if (group.mainName === 'Free Fire') {
            const variantsByType = group.variants.reduce((acc, variant) => {
                let type;
                if (variant.Varian.toLowerCase().includes('membership')) {
                    type = 'Membership';
                } else {
                    type = 'Diamond';
                }

                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(variant);
                return acc;
            }, {});

            const displayOrder = ['Membership', 'Diamond'];

            displayOrder.forEach(typeKey => {
                const variants = variantsByType[typeKey];
                if (!variants) return;

                htmlContent += `<div class="variant-group">`;
                htmlContent += `<h4 class="variant-title">${typeKey}</h4>`; 
                htmlContent += `<div class="variant-grid">`;

                variants.forEach((variant) => {
                    const displayPrice = formatPrice(priceToNumber(variant.Harga));
                    
                    let amount;
                    let itemType;
                    
                    if (typeKey === 'Membership') {
                        amount = variant.Varian.split(' Membership')[0].trim();
                        itemType = 'Membership';
                    } else {
                        amount = variant.Varian.split(' Diamond')[0].trim();
                        itemType = 'Diamond';
                    }
                    
                    htmlContent += `
                        <div class="variant-card" onclick="selectVariant(this, '${variant.Nama}', '${variant.Varian}', '${variant.Harga}', '${variant.Note}')">
                            <p class="variant-name variant-topup-amount">${amount}</p>
                            <p class="variant-name variant-topup-item">${itemType}</p>
                            <p class="variant-price">Rp ${displayPrice}</p>
                            <i class="fas fa-check-circle variant-check-icon"></i>
                        </div>
                    `;
                });
                
                htmlContent += `</div>`;
                htmlContent += `</div>`;
            });
        
        } else if (group.mainName === 'Genshin Impact') {
            const variantsByGenshinType = group.variants.reduce((acc, variant) => {
                let type;
                if (variant.Varian.toLowerCase().includes('welkin moon')) {
                    type = 'Blessing of the Welkin Moon';
                } else {
                    type = 'Genesis Crystal';
                }

                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(variant);
                return acc;
            }, {});
            
            const displayOrder = ['Blessing of the Welkin Moon', 'Genesis Crystal'];

            displayOrder.forEach(typeKey => {
                const variants = variantsByGenshinType[typeKey];
                if (!variants) return;

                htmlContent += `<div class="variant-group">`;
                htmlContent += `<h4 class="variant-title">${typeKey}</h4>`; 
                htmlContent += `<div class="variant-grid">`;

                variants.forEach((variant) => {
                    const displayPrice = formatPrice(priceToNumber(variant.Harga));
                    
                    let amount;
                    let itemType;
                    
                    if (variant.Varian.toLowerCase().includes('moon')) {
                        amount = variant.Varian.split(' ')[0];
                        itemType = 'Welkin Moon';
                    } else {
                        amount = variant.Varian.split(' GC')[0].split('-')[0].trim();
                        itemType = 'Genesis Crystal';
                    }
                    
                    htmlContent += `
                        <div class="variant-card" onclick="selectVariant(this, '${variant.Nama}', '${variant.Varian}', '${variant.Harga}', '${variant.Note}')">
                            <p class="variant-name variant-topup-amount">${amount}</p>
                            <p class="variant-name variant-topup-item">${itemType}</p>
                            <p class="variant-price">Rp ${displayPrice}</p>
                            <i class="fas fa-check-circle variant-check-icon"></i>
                        </div>
                    `;
                });
                
                htmlContent += `</div>`;
                htmlContent += `</div>`;
            });
        
        } else if (group.mainName === 'Roblox') {
            // Logika Roblox
            const variantsByRobloxType = group.variants.reduce((acc, variant) => {
                let type;
                if (variant.Varian.toLowerCase().includes('premium')) {
                    type = 'Robux + Premium';
                } else if (variant.Varian.toLowerCase().includes('special')) {
                    type = 'Special Robux';
                } else {
                    type = 'Robux Biasa';
                }

                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(variant);
                return acc;
            }, {});
            
            const displayOrder = ['Robux Biasa', 'Special Robux', 'Robux + Premium'];
            
            displayOrder.forEach(typeKey => {
                const variants = variantsByRobloxType[typeKey];
                if (!variants) return;

                htmlContent += `<div class="variant-group">`;
                htmlContent += `<h4 class="variant-title">${typeKey}</h4>`; 
                htmlContent += `<div class="variant-grid">`;

                variants.forEach((variant) => {
                    const displayPrice = formatPrice(priceToNumber(variant.Harga));
                    
                    const robuxAmount = variant.Varian.split(' Robux')[0].split('+')[0].trim();
                    const itemType = variant.Varian.includes('+') ? `Robux + Prem` : `Robux`;
                    
                    htmlContent += `
                        <div class="variant-card" onclick="selectVariant(this, '${variant.Nama}', '${variant.Varian}', '${variant.Harga}', '${variant.Note}')">
                            <p class="variant-name variant-topup-amount">${robuxAmount}</p>
                            <p class="variant-name variant-topup-item">${itemType}</p>
                            <p class="variant-price">Rp ${displayPrice}</p>
                            <i class="fas fa-check-circle variant-check-icon"></i>
                        </div>
                    `;
                });
                
                htmlContent += `</div>`;
                htmlContent += `</div>`;
            });
        
        } else {
            // Logika MLBB (Pengelompokan Server)
            const variantsByServer = group.variants.reduce((acc, variant) => {
                const serverMatch = variant.Varian.match(/\(([^)]+)\)$/);
                let serverKey = serverMatch ? serverMatch[1].toUpperCase() : 'DIAMOND BIASA';
                
                if (group.mainName === 'MLBB Server Indonesia') {
                    serverKey = 'SERVER INDONESIA';
                }
                
                if (!acc[serverKey]) {
                    acc[serverKey] = [];
                }
                acc[serverKey].push(variant);
                return acc;
            }, {});


            for (const [serverKey, variants] of Object.entries(variantsByServer)) {
                htmlContent += `<div class="variant-group">`;
                htmlContent += `<h4 class="variant-title">${serverKey.replace(/\//g, ' / ')}</h4>`; 
                htmlContent += `<div class="variant-grid">`;
                
                variants.forEach((variant) => {
                    const displayPrice = formatPrice(priceToNumber(variant.Harga));
                    
                    let diamondAmount = variant.Varian.split(' Diamond')[0].split(' Diamonds')[0].trim();
                    
                    htmlContent += `
                        <div class="variant-card" onclick="selectVariant(this, '${variant.Nama}', '${variant.Varian}', '${variant.Harga}', '${variant.Note}')">
                            <p class="variant-name variant-topup-amount">${diamondAmount}</p>
                            <p class="variant-name variant-topup-item">Diamond</p>
                            <p class="variant-price">Rp ${displayPrice}</p>
                            <i class="fas fa-check-circle variant-check-icon"></i>
                        </div>
                    `;
                });
                
                htmlContent += `</div>`;
                htmlContent += `</div>`;
            }
        }

    } else {
        // === LOGIKA LAMA UNTUK PREMIUM DAN MEDSOS (Pengelompokan Varian) ===
        const variantsByVarian = group.variants.reduce((acc, variant) => {
            const key = variant.Varian.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Lainnya';
            
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(variant);
            return acc;
        }, {});
        
        for (const [varianKey, variants] of Object.entries(variantsByVarian)) {
            htmlContent += `<div class="variant-group">`;
            htmlContent += `<h4 class="variant-title">${varianKey}</h4>`;
            htmlContent += `<div class="variant-grid">`;
            
            variants.forEach((variant) => {
                const displayPrice = formatPrice(priceToNumber(variant.Harga));
                
                let variantSpecificName = variant.Nama.replace(group.mainName, '').trim() || 'Varian Dasar';
                variantSpecificName = formatVariantName(variantSpecificName);

                htmlContent += `
                    <div class="variant-card" onclick="selectVariant(this, '${variant.Nama}', '${variant.Varian}', '${variant.Harga}', '${variant.Note}')">
                        <p class="variant-name">${variantSpecificName}</p>
                        <p class="variant-price">Rp ${displayPrice}</p>
                        <i class="fas fa-check-circle variant-check-icon"></i>
                    </div>
                `;
            });
            
            htmlContent += `</div>`;
            htmlContent += `</div>`;
        }
    }

    // Tambahkan bagian detail varian terpilih dan tombol order
    htmlContent += `<div id="selected-variant-info" class="selected-variant-info">
                        <p><strong>Varian Terpilih:</strong> <span id="selected-variant-name-display">-</span></p>
                        <p><strong>Catatan:</strong> <span id="selected-variant-note-display">Silakan pilih varian di atas.</span></p>
                    </div>`;

    modalDetails.innerHTML = htmlContent;
    
    // Perbarui link Order di modal details
    const orderButton = document.querySelector('#product-modal .modal-order-btn');
    if (orderButton) {
        orderButton.onclick = () => openOrderModal(null); 
        orderButton.disabled = true; 
        orderButton.textContent = 'Pilih Varian Dahulu';
    }
    
    openModal('product-modal');
}


window.selectedVariant = null; 

// FUNGSI UNTUK MENANGANI PEMILIHAN VARIAN (DITAMBAH ANIMASI)
window.selectVariant = function(element, name, varian, harga, note) {
    document.querySelectorAll('.variant-card').forEach(card => {
        card.classList.remove('active');
    });

    element.classList.add('active');

    window.selectedVariant = { name, varian, harga, note };
    
    const displayPrice = formatPrice(priceToNumber(harga));
    
    // Logic untuk display Varian Terpilih
    let mainAppName = name.includes('Mobile Legend') ? 'Mobile Legends' : name.split(' ')[0];
    mainAppName = name.includes('Roblox') ? 'Roblox' : mainAppName; 
    mainAppName = name.includes('Genshin Impact') ? 'Genshin Impact' : mainAppName; 
    mainAppName = name.includes('Free Fire') ? 'Free Fire' : mainAppName;
    
    let displaySelectedName;

    if (name.includes('Mobile Legend') || name.includes('Roblox') || name.includes('Genshin Impact') || name.includes('Free Fire')) {
        displaySelectedName = varian; 
        if (name.includes('Mobile Legend')) {
            // Kita ingin menampilkan "MLBB Server Indonesia 10 (10+0) Diamond"
            // Jadi kita harus mengambil nama card utamanya dari groupProducts
            mainAppName = name.includes('Server Indonesia') ? 'MLBB Server Indonesia' : 'MLBB Server Global';
            displaySelectedName = varian.replace(/\s*\([^)]+\)$/, '').trim(); // Hapus nama server/negara dari varian di display
        }
    } else {
        displaySelectedName = name.replace(mainAppName, '').trim();
        displaySelectedName = formatVariantName(displaySelectedName);
    }
    
    const nameDisplayElement = document.getElementById('selected-variant-name-display');
    const noteDisplayElement = document.getElementById('selected-variant-note-display');
    
    // === APLIKASIKAN ANIMASI PADA PERUBAHAN TEKS ===
    
    // 1. Tambahkan class fade-out untuk animasi
    nameDisplayElement.classList.remove('fade-in-down');
    noteDisplayElement.classList.remove('fade-in-down');
    nameDisplayElement.classList.add('fade-out-up');
    noteDisplayElement.classList.add('fade-out-up');

    setTimeout(() => {
        // 2. Update konten setelah fade-out
        nameDisplayElement.innerHTML = `${mainAppName} ${displaySelectedName} | <span style="color: #00ffaa;">Rp ${displayPrice}</span>`;
        
        const noteDisplay = note || 'Tanya seller untuk detail ketentuan nya'; 
        noteDisplayElement.textContent = noteDisplay;
        
        // 3. Hapus class fade-out dan tambahkan fade-in
        nameDisplayElement.classList.remove('fade-out-up');
        noteDisplayElement.classList.remove('fade-out-up');
        nameDisplayElement.classList.add('fade-in-down');
        noteDisplayElement.classList.add('fade-in-down');
        
        // 4. Hapus class fade-in setelah selesai (untuk re-trigger)
        setTimeout(() => {
            nameDisplayElement.classList.remove('fade-in-down');
            noteDisplayElement.classList.remove('fade-in-down');
        }, 300);
        
    }, 200); // Jeda selama durasi fade-out (200ms)

    
    const orderButton = document.querySelector('#product-modal .modal-order-btn');
    if (orderButton) {
        orderButton.disabled = false;
        orderButton.textContent = 'Order Sekarang';
    }
}

function openOrderModal(waMessage) {
    closeModal('product-modal'); 

    if (!window.selectedVariant) {
        console.error("Varian belum dipilih.");
        return;
    }

    const { name, varian, harga } = window.selectedVariant;
    const displayPrice = formatPrice(priceToNumber(harga));
    
    const message = encodeURIComponent(`Halo, saya ingin order produk:\nNama: ${name}\nVarian: ${varian}\nHarga: Rp ${displayPrice}`);
    const waLink = `https://wa.me/6285176755290?text=${message}`;
    
    const waCard = document.querySelector('#order-modal .contact-grid a.contact-card');
    if (waCard) { 
        waCard.href = waLink;
    }

    openModal('order-modal'); 
    window.selectedVariant = null; 
}


window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        const isAnotherModalOpen = document.getElementById('product-modal').style.display === 'block' ||
                                   document.getElementById('order-modal').style.display === 'block';
        if (!isAnotherModalOpen) {
             document.body.style.overflow = 'auto'; 
        }
    }
}