// Agent Shell Website - Minimal JavaScript
// Mobile menu toggle and FAQ search functionality

(function() {
  'use strict';

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header nav');
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isActive = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isActive);
      menuToggle.textContent = isActive ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.site-header') && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });

    // Close menu when clicking a nav link on mobile
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.textContent = '☰';
        }
      });
    });
  }

  // FAQ search functionality
  const faqSearch = document.querySelector('.faq-search input');
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqSearch && faqItems.length > 0) {
    faqSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        const matches = question.includes(searchTerm) || answer.includes(searchTerm);
        
        if (matches || searchTerm === '') {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // FAQ accordion functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Close all other items
      faqQuestions.forEach(function(q) {
        if (q !== question) {
          q.classList.remove('active');
          q.nextElementSibling.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (isActive) {
        this.classList.remove('active');
        answer.classList.remove('active');
      } else {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });

  // Set active nav link based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-header nav a');
  
  navLinks.forEach(function(link) {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath || (currentPath === '/' && linkPath.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });

  // Theme management - automatic system preference detection with manual override
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme preference or detect system preference
  function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // No saved preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      // Auto - follow system preference
      html.removeAttribute('data-theme');
    }
    updateThemeToggleIcon();
  }
  
  // Update theme toggle icon
  function updateThemeToggleIcon() {
    if (!themeToggle) return;
    
    const currentTheme = html.getAttribute('data-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let effectiveTheme = currentTheme;
    if (!effectiveTheme) {
      effectiveTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    const icon = themeToggle.querySelector('.theme-toggle-icon');
    if (icon) {
      icon.textContent = effectiveTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Update aria-label for accessibility
    const nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  }
  
  // Initialize theme (run immediately, before page paint, to avoid flash)
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Update icon after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateThemeToggleIcon);
  } else {
    updateThemeToggleIcon();
  }
  
  // Theme toggle button click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let effectiveTheme = currentTheme;
      if (!effectiveTheme) {
        effectiveTheme = systemPrefersDark ? 'dark' : 'light';
      }
      
      // Toggle theme
      const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Listen for system theme changes (only if no manual preference set)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', function(e) {
    // Only auto-update if user hasn't set a manual preference
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

