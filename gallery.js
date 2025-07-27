// Sample images (replace with your own or dynamically load)
const images = [
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', caption: 'Mountain Lake', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', caption: 'Forest Path', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80', caption: 'City Skyline', category: 'city' },
    { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80', caption: 'Urban Street', category: 'city' },
    { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', caption: 'Smiling Woman', category: 'people' },
    { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', caption: 'Friends', category: 'people' },
    { src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80', caption: 'River in Forest', category: 'nature' },
    { src: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80', caption: 'Night City', category: 'city' },
    { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80', caption: 'Portrait', category: 'people' },
];

let currentPage = 0;
const imagesPerPage = 6;
let currentFilter = 'all';

function getFilteredImages() {
    return currentFilter === 'all' ? images : images.filter(img => img.category === currentFilter);
}

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filtered = getFilteredImages();
    const start = currentPage * imagesPerPage;
    const end = start + imagesPerPage;
    galleryGrid.innerHTML = '';
    filtered.slice(start, end).forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${img.src}" alt="${img.caption}"><div class="caption">${img.caption}</div>`;
        div.addEventListener('click', () => openLightbox(filtered, start + idx));
        galleryGrid.appendChild(div);
    });
    document.getElementById('prevBtn').disabled = currentPage === 0;
    document.getElementById('nextBtn').disabled = end >= filtered.length;
}

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderGallery();
    }
});
document.getElementById('nextBtn').addEventListener('click', () => {
    const filtered = getFilteredImages();
    if ((currentPage + 1) * imagesPerPage < filtered.length) {
        currentPage++;
        renderGallery();
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        currentPage = 0;
        renderGallery();
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(imgArr, idx) {
    lightboxImages = imgArr;
    lightboxIndex = idx;
    showLightboxImage();
    lightbox.classList.add('active');
}

function showLightboxImage() {
    const img = lightboxImages[lightboxIndex];
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.caption;
}

document.querySelector('.lightbox .close').onclick = function() {
    lightbox.classList.remove('active');
};

lightbox.onclick = function(e) {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
};

document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') {
        if (lightboxIndex < lightboxImages.length - 1) {
            lightboxIndex++;
            showLightboxImage();
        }
    } else if (e.key === 'ArrowLeft') {
        if (lightboxIndex > 0) {
            lightboxIndex--;
            showLightboxImage();
        }
    } else if (e.key === 'Escape') {
        lightbox.classList.remove('active');
    }
});

// Initial render
renderGallery();