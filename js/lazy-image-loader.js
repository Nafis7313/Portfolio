/**
 * Lazy Image Loader
 * Handles lazy loading of images with blur-up effect and skeleton loading
 */
class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      // Root element to observe from
      root: null,
      // Root margin to start loading before visible
      rootMargin: '200px 0px',
      // Threshold for visibility
      threshold: 0.01,
      // Selector for lazy images
      selector: '[data-src]',
      // Enable/disable skeleton loading
      skeleton: true,
      // Enable/disable blur-up effect
      blurUp: true,
      // Class to add when image is loaded
      loadedClass: 'lazy-loaded',
      // Override options with provided options
      ...options
    };

    this.observer = null;
    this.images = [];
    this.initialized = false;
  }

  /**
   * Initialize the lazy loader
   */
  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      this.loadAllImages();
      return;
    }

    // Create observer
    this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
      root: this.options.root,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    });

    // Get all images to be lazy loaded
    this.images = document.querySelectorAll(this.options.selector);

    // Add skeleton loading placeholders if enabled
    if (this.options.skeleton) {
      this.addSkeletonLoaders();
    }

    // Observe images
    this.images.forEach(image => {
      // Only observe if not already loaded
      if (!image.classList.contains(this.options.loadedClass)) {
        this.observer.observe(image);
      }
    });

    this.initialized = true;
  }

  /**
   * Handle intersection events
   * @param {Array} entries Intersection entries
   */
  onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stop observing this image
        this.observer.unobserve(entry.target);
        // Load the image
        this.loadImage(entry.target);
      }
    });
  }

  /**
   * Load an image
   * @param {HTMLElement} image The image element to load
   */
  loadImage(image) {
    const src = image.getAttribute('data-src');
    if (!src) return;

    // Create a new image element to load the image
    const img = new Image();

    // When the image is loaded, update the target element
    img.onload = () => {
      // For actual <img> elements
      if (image.tagName.toLowerCase() === 'img') {
        image.src = src;

        // Remove placeholder and add loaded class for animation
        const parent = image.parentNode;
        const placeholder = parent.querySelector('.lazy-placeholder');

        // Add loaded class to trigger animations
        image.classList.add(this.options.loadedClass);

        // Fade out placeholder if it exists
        if (placeholder) {
          placeholder.classList.add('fade-out');
          setTimeout(() => {
            if (placeholder.parentNode) {
              placeholder.parentNode.removeChild(placeholder);
            }
          }, 500);
        }
      }
      // For background images
      else {
        // For background images, set the background image
        image.style.backgroundImage = `url(${src})`;
        image.classList.add(this.options.loadedClass);
      }

      // Remove data-src to mark as loaded
      image.removeAttribute('data-src');
    };

    // Handle errors
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      image.removeAttribute('data-src');
    };

    // Start loading
    img.src = src;
  }

  /**
   * Add skeleton loading placeholders to images
   */
  addSkeletonLoaders() {
    this.images.forEach(image => {
      // Only add skeleton if not already loaded
      if (!image.classList.contains(this.options.loadedClass) && image.tagName.toLowerCase() === 'img') {
        const parent = image.parentNode;
        // Check if parent has position relative or absolute
        const parentPosition = window.getComputedStyle(parent).position;
        if (parentPosition !== 'relative' && parentPosition !== 'absolute') {
          parent.style.position = 'relative';
        }

        // Check if placeholder already exists
        if (!parent.querySelector('.lazy-placeholder')) {
          // Create placeholder
          const placeholder = document.createElement('div');
          placeholder.className = 'lazy-placeholder';

          // Add blur-up effect if enabled and low-quality placeholder is available
          if (this.options.blurUp && image.hasAttribute('data-placeholder')) {
            const lowQualitySrc = image.getAttribute('data-placeholder');
            placeholder.style.backgroundImage = `url(${lowQualitySrc})`;
            placeholder.classList.add('blur-up');
          } else {
            placeholder.classList.add('skeleton-loading');
          }

          // Insert placeholder before image
          parent.insertBefore(placeholder, image);
        }
      }
    });
  }

  /**
   * Force load all images
   */
  loadAllImages() {
    this.images.forEach(image => {
      this.loadImage(image);
    });
  }

  /**
   * Stop observing all images
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.images = [];
    this.initialized = false;
  }
}

// Create global instance
window.lazyImageLoader = new LazyImageLoader();

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.lazyImageLoader) {
    window.lazyImageLoader.init();
  }
});
