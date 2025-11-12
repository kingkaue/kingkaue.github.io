// Mobile menu toggle
const menu = document.querySelector("#mobile-menu");
const menuLinks = document.querySelector(".navbar_menu");

menu.addEventListener("click", function () {
  menu.classList.toggle("is-active");
  menuLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".navbar_links").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-active");
    menuLinks.classList.remove("active");
  });
});

// Universal smooth scroll functionality
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigationHandlers();
    this.handleInitialPageLoad();
    this.setupGlobalLinkHandler();
  }

  // Setup navigation for all internal links
  setupNavigationHandlers() {
    // Handle all internal links with hashes
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      
      // Check if it's an internal anchor link
      if (href && href.includes('#') && !href.startsWith('http')) {
        this.handleAnchorClick(e, link, href);
      }
    });
  }

  // Handle anchor link clicks
  handleAnchorClick(e, link, href) {
    const [pagePath, anchorId] = href.split('#');
    const currentPage = window.location.pathname;
    
    // If link points to current page or root with anchor
    if ((!pagePath || pagePath === currentPage || 
         (pagePath === 'index.html' && (currentPage === '/' || currentPage.endsWith('/index.html')))) && 
        anchorId) {
      
      e.preventDefault();
      this.scrollToAnchor(anchorId);
    }
    // If link points to different page with anchor
    else if (pagePath && anchorId) {
      e.preventDefault();
      this.navigateToPageWithAnchor(pagePath, anchorId);
    }
  }

  // Scroll to anchor on current page
  scrollToAnchor(anchorId, instant = false) {
    const targetElement = document.getElementById(anchorId);
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: instant ? 'auto' : 'smooth'
      });
    }
  }

  // Navigate to another page and scroll to anchor
  navigateToPageWithAnchor(pagePath, anchorId) {
    // Store the target anchor for the next page
    sessionStorage.setItem('targetAnchor', anchorId);
    sessionStorage.setItem('scrollBehavior', 'smooth');
    
    // Navigate to the page
    window.location.href = pagePath + '#' + anchorId;
  }

  // Handle page load with anchor in URL
  handleInitialPageLoad() {
    if (window.location.hash) {
      const anchorId = window.location.hash.substring(1);
      
      // Check if we have stored scroll behavior
      const scrollBehavior = sessionStorage.getItem('scrollBehavior');
      const storedAnchor = sessionStorage.getItem('targetAnchor');
      
      if (storedAnchor === anchorId && scrollBehavior === 'smooth') {
        // Use smooth scroll for navigation from other pages
        setTimeout(() => {
          this.scrollToAnchor(anchorId);
          // Clear stored values
          sessionStorage.removeItem('targetAnchor');
          sessionStorage.removeItem('scrollBehavior');
        }, 100);
      } else {
        // Instant scroll for direct URL access or page refresh
        setTimeout(() => {
          this.scrollToAnchor(anchorId, true);
        }, 100);
      }
    }
  }

  // Global link handler for any dynamic content
  setupGlobalLinkHandler() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.hash && link.pathname === window.location.pathname) {
        e.preventDefault();
        this.scrollToAnchor(link.hash.substring(1));
      }
    });
  }
}

// Initialize smooth scroll manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new SmoothScrollManager();
});

// Handle browser back/forward navigation
window.addEventListener('hashchange', function() {
  if (window.location.hash) {
    const anchorId = window.location.hash.substring(1);
    setTimeout(() => {
      const manager = new SmoothScrollManager();
      manager.scrollToAnchor(anchorId, true);
    }, 100);
  }
});