/**
 * 8 PLUS Language School - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  initMobileNav();

  // Smooth scrolling for anchor links
  initSmoothScroll();

  // Active nav link highlighting
  initActiveNavHighlight();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggler = document.querySelector('.navbar-toggler');
  const navMenu = document.querySelector('.navbar-nav');

  if (toggler && navMenu) {
    toggler.addEventListener('click', function() {
      navMenu.classList.toggle('show');
      toggler.classList.toggle('active');

      // Update aria-expanded
      const isExpanded = navMenu.classList.contains('show');
      toggler.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!toggler.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('show');
        toggler.classList.remove('active');
        toggler.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('show');
        toggler.classList.remove('active');
        toggler.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Skip if it's just "#"
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Account for fixed navbar
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Highlight Active Navigation Link
 */
function initActiveNavHighlight() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(function(link) {
    const linkPage = link.getAttribute('href')?.split('/').pop();

    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = function() {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
