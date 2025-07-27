// Gallery Class - Main functionality
class ImageGallery {
    constructor() {
        this.currentPage = 0;
        this.itemsPerPage = this.getItemsPerPage();
        this.currentFilter = 'all';
        this.allItems = [];
        this.filteredItems = [];
        this.lightboxIndex = 0;
        this.isLightboxOpen = false;
        
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.filterItems('all');
        this.updateNavigation();
        
        // Initialize with smooth entrance animation
        this.animateGalleryEntrance();
    }

    cacheDOMElements() {
        this.gallery = document.getElementById('gallery');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxTitle = document.getElementById('lightbox-title');
        this.lightboxDescription = document.getElementById('lightbox-description');
        this.closeBtn = document.querySelector('.close-btn');
        this.prevLightbox = document.querySelector('.prev-lightbox');
        this.nextLightbox = document.querySelector('.next-lightbox');
        
        this.allItems = Array.from(document.querySelectorAll('.gallery-item'));
    }

    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveFilter(e.target);
                this.filterItems(filter);
            });
        });

        // Gallery navigation
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Lightbox controls
        this.allItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.view-btn');
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openLightbox(index);
            });
            
            // Click on image to open lightbox
            item.addEventListener('click', () => this.openLightbox(index));
        });

        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevLightbox.addEventListener('click', () => this.previousImage());
        this.nextLightbox.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Click outside lightbox to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Resize handler for responsive behavior
        window.addEventListener('resize', () => {
            this.itemsPerPage = this.getItemsPerPage();
            this.updateNavigation();
        });

        // Touch/Swipe support for mobile
        this.setupTouchNavigation();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, options);

        this.allItems.forEach(item => {
            this.observer.observe(item);
        });
    }

    getItemsPerPage() {
        const width = window.innerWidth;
        if (width <= 480) return 1;
        if (width <= 768) return 2;
        if (width <= 1024) return 6;
        return 9;
    }

    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    filterItems(filter) {
        this.currentFilter = filter;
        this.currentPage = 0;

        // Add fade-out animation
        this.allItems.forEach(item => {
            item.classList.add('fade-out');
        });

        setTimeout(() => {
            if (filter === 'all') {
                this.filteredItems = [...this.allItems];
            } else {
                this.filteredItems = this.allItems.filter(item => 
                    item.dataset.category === filter
                );
            }

            // Hide all items first
            this.allItems.forEach(item => {
                item.style.display = 'none';
                item.classList.remove('fade-out');
            });

            // Show filtered items with animation
            this.filteredItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                }, index * 100);
            });

            this.updateNavigation();
        }, 300);
    }

    updateNavigation() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        
        // Update navigation button states
        this.prevBtn.style.opacity = this.currentPage === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentPage >= totalPages - 1 ? '0.5' : '1';
        
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage >= totalPages - 1;

        // Show current page items
        this.showCurrentPage();
    }

    showCurrentPage() {
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        this.filteredItems.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.style.display = 'block';
                setTimeout(() => item.classList.add('fade-in'), index * 50);
            } else {
                item.style.display = 'none';
            }
        });
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.animatePageTransition(-1);
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            this.animatePageTransition(1);
        }
    }

    animatePageTransition(direction) {
        const gallery = this.gallery;
        const translateX = direction * 20;
        
        gallery.style.transform = `translateX(${translateX}px)`;
        gallery.style.opacity = '0.7';
        
        setTimeout(() => {
            this.updateNavigation();
            gallery.style.transform = 'translateX(0)';
            gallery.style.opacity = '1';
        }, 200);
    }

    openLightbox(index) {
        this.lightboxIndex = this.getFilteredIndex(index);
        this.isLightboxOpen = true;
        
        const item = this.filteredItems[this.lightboxIndex] || this.allItems[index];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;
        const viewBtn = overlay.querySelector('.view-btn');
        const highResSrc = viewBtn.dataset.src;
        
        this.lightboxImg.src = highResSrc;
        this.lightboxImg.alt = img.alt;
        this.lightboxTitle.textContent = title;
        this.lightboxDescription.textContent = description;
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        this.preloadAdjacentImages();
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        this.isLightboxOpen = false;
    }

    previousImage() {
        const currentItems = this.currentFilter === 'all' ? this.allItems : this.filteredItems;
        this.lightboxIndex = this.lightboxIndex > 0 ? this.lightboxIndex - 1 : currentItems.length - 1;
        this.updateLightboxImage();
    }

    nextImage() {
        const currentItems = this.currentFilter === 'all' ? this.allItems : this.filteredItems;
        this.lightboxIndex = this.lightboxIndex < currentItems.length - 1 ? this.lightboxIndex + 1 : 0;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const currentItems = this.currentFilter === 'all' ? this.allItems : this.filteredItems;
        const item = currentItems[this.lightboxIndex];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;
        const viewBtn = overlay.querySelector('.view-btn');
        const highResSrc = viewBtn.dataset.src;
        
        // Add transition effect
        this.lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            this.lightboxImg.src = highResSrc;
            this.lightboxImg.alt = img.alt;
            this.lightboxTitle.textContent = title;
            this.lightboxDescription.textContent = description;
            this.lightboxImg.style.opacity = '1';
        }, 150);
        
        this.preloadAdjacentImages();
    }

    getFilteredIndex(originalIndex) {
        if (this.currentFilter === 'all') return originalIndex;
        
        const originalItem = this.allItems[originalIndex];
        return this.filteredItems.findIndex(item => item === originalItem);
    }

    preloadAdjacentImages() {
        const currentItems = this.currentFilter === 'all' ? this.allItems : this.filteredItems;
        const prevIndex = this.lightboxIndex > 0 ? this.lightboxIndex - 1 : currentItems.length - 1;
        const nextIndex = this.lightboxIndex < currentItems.length - 1 ? this.lightboxIndex + 1 : 0;
        
        [prevIndex, nextIndex].forEach(index => {
            const item = currentItems[index];
            if (item) {
                const viewBtn = item.querySelector('.view-btn');
                const img = new Image();
                img.src = viewBtn.dataset.src;
            }
        });
    }

    handleKeyboard(e) {
        if (!this.isLightboxOpen) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    setupTouchNavigation() {
        let startX, startY, distX, distY;
        const threshold = 100;
        
        this.lightbox.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        });
        
        this.lightbox.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.lightbox.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            distX = touch.pageX - startX;
            distY = touch.pageY - startY;
            
            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
                if (distX > 0) {
                    this.previousImage();
                } else {
                    this.nextImage();
                }
            }
        });
        
        // Gallery swipe navigation
        this.gallery.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.pageX;
        });
        
        this.gallery.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            distX = touch.pageX - startX;
            
            if (Math.abs(distX) > threshold) {
                if (distX > 0) {
                    this.previousPage();
                } else {
                    this.nextPage();
                }
            }
        });
    }

    animateGalleryEntrance() {
        this.allItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Lazy loading for images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Smooth scroll to top function
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Performance optimization
const optimizePerformance = () => {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
    
    // Optimize for high DPI displays
    if (window.devicePixelRatio > 1) {
        const images = document.querySelectorAll('.gallery-item img');
        images.forEach(img => {
            const src = img.src;
            if (src.includes('picsum.photos')) {
                // Use higher resolution for retina displays
                const newSrc = src.replace(/(\d+)x(\d+)/, (match, width, height) => {
                    return `${width * 2}x${height * 2}`;
                });
                img.src = newSrc;
            }
        });
    }
};

// Error handling for images
const handleImageErrors = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.src = 'https://via.placeholder.com/400x300/cccccc/999999?text=Image+Not+Found';
            img.alt = 'Image not available';
        });
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the gallery
    const gallery = new ImageGallery();
    
    // Initialize utility functions
    lazyLoadImages();
    optimizePerformance();
    handleImageErrors();
    
    // Add loading states
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.parentElement.classList.add('loaded');
        });
    });
    
    // Smooth entrance animation for the entire page
    document.body.classList.add('loaded');
    
    // Add a back to top button for long galleries
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: #333;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 100;
    `;
    
    backToTopBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button based on scroll
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    console.log('Image Gallery initialized successfully!');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageGallery;
}