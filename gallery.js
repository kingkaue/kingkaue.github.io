// gallery.js - Reusable gallery system
class MediaGallery {
    constructor(containerId, galleryData) {
        this.container = document.getElementById(containerId);
        this.galleryData = galleryData;
        this.currentSlide = 0;
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Gallery container with ID '${this.containerId}' not found`);
            return;
        }

        console.log(`Initializing gallery: ${this.container.id} with ${this.galleryData.length} items`);
        this.createGalleryStructure();
        this.createGalleryItems();
        this.setupEventListeners();
        this.updateCounter();
    }

    createGalleryStructure() {
        this.container.innerHTML = `
            <div class="gallery-main">
                <!-- Gallery items will be inserted here -->
            </div>
            
            <div class="gallery-controls">
                <button class="gallery-control prev-btn">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="gallery-control next-btn">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            
            <div class="gallery-counter">
                <span class="current-slide">1</span> / <span class="total-slides">${this.galleryData.length}</span>
            </div>
            
            <div class="gallery-thumbnails">
                <!-- Thumbnails will be inserted here -->
            </div>
        `;

        this.galleryMain = this.container.querySelector('.gallery-main');
        this.thumbnailsContainer = this.container.querySelector('.gallery-thumbnails');
        this.currentSlideElement = this.container.querySelector('.current-slide');
        this.totalSlidesElement = this.container.querySelector('.total-slides');
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.nextBtn = this.container.querySelector('.next-btn');
    }

    createGalleryItems() {
        this.galleryData.forEach((item, index) => {
            // Create main gallery item
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${index === 0 ? 'active' : ''}`;
            galleryItem.dataset.index = index;
            
            if (item.type === 'image') {
                galleryItem.innerHTML = `
                    <img src="${item.src}" alt="${item.title}" loading="lazy">
                `;
            } else if (item.type === 'video') {
                galleryItem.innerHTML = `
                    <div class="gallery-video">
                        <iframe src="${item.src}" title="${item.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `;
            } else if (item.type === 'gif') {
                galleryItem.innerHTML = `
                    <img src="${item.src}" alt="${item.title}" class="gallery-gif">
                `;
            }
            
            this.galleryMain.appendChild(galleryItem);
            
            // Create thumbnail
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.dataset.index = index;
            thumbnail.innerHTML = `
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            `;
            
            thumbnail.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }

    goToSlide(index) {
        // Hide all slides
        this.galleryMain.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Remove active class from all thumbnails
        this.thumbnailsContainer.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Show selected slide
        this.galleryMain.querySelector(`.gallery-item[data-index="${index}"]`).classList.add('active');
        this.thumbnailsContainer.querySelector(`.thumbnail[data-index="${index}"]`).classList.add('active');
        
        this.currentSlide = index;
        this.updateCounter();
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.galleryData.length) {
            nextIndex = 0;
        }
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.galleryData.length - 1;
        }
        this.goToSlide(prevIndex);
    }

    updateCounter() {
        this.currentSlideElement.textContent = this.currentSlide + 1;
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.offsetParent !== null) { // Only if gallery is visible
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.galleryMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.galleryMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left
            } else {
                this.prevSlide(); // Swipe right
            }
        }
    }
}

// Initialize all galleries on the page automatically
function initAllGalleries() {
    console.log('Looking for galleries to initialize...');
    
    // Look for elements with data-gallery attribute
    const galleryContainers = document.querySelectorAll('[data-gallery]');
    
    console.log(`Found ${galleryContainers.length} gallery containers`);
    
    galleryContainers.forEach(container => {
        const galleryId = container.id;
        const expectedDataVar = `${galleryId}Data`;
        const galleryData = window[expectedDataVar];
        
        console.log(`Gallery ID: ${galleryId}, Looking for data: ${expectedDataVar}`);
        console.log('Available data:', galleryData);
        
        if (galleryData && Array.isArray(galleryData)) {
            console.log(`Initializing gallery ${galleryId} with ${galleryData.length} items`);
            new MediaGallery(galleryId, galleryData);
        } else {
            console.warn(`No gallery data found for ${galleryId}. Expected variable: ${expectedDataVar}`);
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllGalleries);
} else {
    initAllGalleries();
}