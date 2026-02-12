/**
 * Hudumika.co.ke - Main JavaScript
 * Shared functionality across all pages
 */

// Include HTML Components (Navigation & Footer)
function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then(response => response.text())
      .then(data => {
        el.innerHTML = data;
        // Re-initialize mobile menu after including nav
        initMobileMenu();
        initNavHighlighting();
      })
      .catch(error => console.error('Error including file:', error));
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Lazy Load Images
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Track WhatsApp Clicks (Analytics)
function trackWhatsAppClick() {
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
      // Google Analytics event (if GA is installed)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: 'whatsapp_cta'
        });
      }
      
      // Facebook Pixel event (if FB Pixel is installed)
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
      }
      
      console.log('WhatsApp CTA clicked');
    });
  }
}

// Add Scroll Effect to Navigation
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        nav.classList.add('shadow-lg');
      } else {
        nav.classList.remove('shadow-lg');
      }
    });
  }
}

// Initialize All Functions on DOM Load
document.addEventListener('DOMContentLoaded', function() {
  includeHTML();
  initMobileMenu();
  initSmoothScroll();
  initLazyLoad();
  trackWhatsAppClick();
  initNavScroll();
});

// Utility Functions
const Utils = {
  // Format phone number to Kenyan format
  formatPhone: function(phone) {
    // Remove all non-numeric characters
    phone = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (phone.startsWith('0')) {
      phone = '254' + phone.substring(1);
    }
    
    return phone;
  },
  
  // Debounce function for search inputs
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Copy to clipboard
  copyToClipboard: function(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      });
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied to clipboard!');
    }
  }
};

// Add this new function to main.js
function initNavHighlighting() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Remove any existing active classes
    link.classList.remove('text-blue-600', 'bg-blue-50');
    link.classList.add('text-gray-700');
    
    // Check if current page matches this link
    if (href === currentPath || 
        (currentPath === '/' && href === '/index.html') ||
        (currentPath.endsWith('index.html') && href === currentPath) ||
        (currentPath.startsWith('/articles') && href === '/articles/index.html') ||
        (currentPath.startsWith('/partners') && href === '/partners/index.html')) {
      link.classList.add('text-blue-600', 'bg-blue-50');
      link.classList.remove('text-gray-700');
    }
  });
}

// Expose Utils globally
window.Utils = Utils;
