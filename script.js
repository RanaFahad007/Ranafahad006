// ---------- Image Gallery Script ----------

// DOM Elements
const filterBtns = document.querySelectorAll('.filter-btn');
const gallery = document.getElementById('gallery');
const galleryItems = [...document.querySelectorAll('.gallery-item')];

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('lightbox-close');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0; // track current image index for navigation

/* ------------------ Filtering ------------------ */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    // update active button styling
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // filter items
    galleryItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || filter === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* ------------------ Lightbox ------------------ */
function openLightbox(index) {
  currentIndex = index;
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightbox.classList.add('show');
}

function closeLightbox() {
  lightbox.classList.remove('show');
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightboxImage();
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = galleryItems[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
}

// Attach click listeners to gallery items to open lightbox
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

// Lightbox controls
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

// Close lightbox on overlay click (but not on image click)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ------------------ Keyboard Navigation ------------------ */
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  switch (e.key) {
    case 'ArrowLeft':
      showPrev();
      break;
    case 'ArrowRight':
      showNext();
      break;
    case 'Escape':
      closeLightbox();
      break;
  }
});