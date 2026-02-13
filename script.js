// script.js - Luxe Hotel - Vanilla JS for interactions

// Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Mobile menu toggle
(function(){
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  
  menuBtn?.addEventListener('click', ()=>{
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
  
  // Close menu when a link is clicked
  $$('#mobileMenu a').forEach(link => {
    link.addEventListener('click', ()=>{
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
})();

// Smooth scroll for anchor links
(function(){
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = $(href);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Room Booking Buttons
(function(){
  const bookRoomButtons = document.querySelectorAll('.btn-book-room');
  const roomTypeSelect = $('#roomType');
  
  bookRoomButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const roomType = this.getAttribute('data-room');
      if (roomTypeSelect) {
        roomTypeSelect.value = roomType;
      }
      // Smooth scroll to booking section
      const bookingSection = $('#booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// Hotel Booking System
(function(){
  const form = $('#bookingForm');
  if (!form) return;
  
  const checkInInput = $('#checkIn');
  const checkOutInput = $('#checkOut');
  const roomTypeSelect = $('#roomType');
  const nightsCountSpan = $('#nightsCount');
  const pricePerNightSpan = $('#pricePerNight');
  const totalPriceSpan = $('#totalPrice');
  const bookingStatus = $('#bookingStatus');
  
  // Room prices in Indian Rupees
  const roomPrices = {
    ac: 2000,
    nonac: 1000
  };
  
  // Set minimum check-in date to today
  const today = new Date().toISOString().split('T')[0];
  if (checkInInput) checkInInput.min = today;
  
  // Calculate number of nights and total price
  function calculatePrice(){
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const roomType = roomTypeSelect.value;
    
    if (!checkIn || !checkOut || !roomType) return;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate){
      bookingStatus.textContent = 'Check-out date must be after check-in date';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = roomPrices[roomType] || 0;
    const totalPrice = nights * pricePerNight;
    
    nightsCountSpan.textContent = nights;
    pricePerNightSpan.textContent = `₹${pricePerNight.toLocaleString('en-IN')}`;
    totalPriceSpan.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    bookingStatus.textContent = '';
    bookingStatus.className = 'form-status';
  }
  
  checkInInput?.addEventListener('change', calculatePrice);
  checkOutInput?.addEventListener('change', calculatePrice);
  roomTypeSelect?.addEventListener('change', calculatePrice);
  
  // Form submission
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const checkIn = checkInInput.value.trim();
    const checkOut = checkOutInput.value.trim();
    const guests = $('#guests').value;
    const roomType = roomTypeSelect.value;
    const guestName = $('#guestName').value.trim();
    const guestEmail = $('#guestEmail').value.trim();
    const guestPhone = $('#guestPhone').value.trim();
    
    // Validation
    if (!checkIn || !checkOut || !guests || !roomType || !guestName || !guestEmail || !guestPhone){
      bookingStatus.textContent = '✗ Please fill all required fields.';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)){
      bookingStatus.textContent = '✗ Please enter a valid email address.';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    if (!/^[\d\s\-\+\(\)]{10,}$/.test(guestPhone.replace(/\s/g, ''))){
      bookingStatus.textContent = '✗ Please enter a valid phone number (at least 10 digits).';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    // Processing
    bookingStatus.textContent = '⏳ Processing your booking...';
    bookingStatus.className = 'form-status';
    
    setTimeout(()=>{
      const refNum = Math.random().toString(36).substr(2, 9).toUpperCase();
      bookingStatus.innerHTML = `✓ <strong>Booking Confirmed!</strong><br>Guest: ${guestName}<br>Email confirmation sent to: ${guestEmail}<br>Reference: #${refNum}`;
      bookingStatus.className = 'form-status success';
      form.reset();
      nightsCountSpan.textContent = '0';
      pricePerNightSpan.textContent = '₹0';
      totalPriceSpan.textContent = '₹0';
      
      // Clear message after 6 seconds
      setTimeout(()=>{ 
        bookingStatus.textContent = '';
        bookingStatus.className = 'form-status';
      }, 6000);
    }, 1200);
  });
})();

// Newsletter subscription
(function(){
  const form = $('#newsForm');
  if (!form) return;
  
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();
    
    if (!email){
      input.style.borderColor = '#ef4444';
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      input.style.borderColor = '#ef4444';
      return;
    }
    
    // Success
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    btn.style.opacity = '0.7';
    input.value = '';
    input.style.borderColor = '';
    
    setTimeout(()=>{
      btn.textContent = originalText;
      btn.style.opacity = '1';
    }, 2500);
  });
})();

// Add scroll effect to header
(function(){
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;
  
  window.addEventListener('scroll', ()=>{
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50){
      header.style.boxShadow = '0 12px 40px rgba(107, 62, 38, 0.12)';
    } else {
      header.style.boxShadow = '0 8px 32px rgba(107, 62, 38, 0.08)';
    }
    
    lastScrollY = currentScrollY;
  });
})();

// Keyboard accessibility
document.addEventListener('keydown', (e)=>{
  // Close mobile menu with Escape
  if (e.key === 'Escape'){
    const menuBtn = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    if (menuBtn && mobileMenu && !mobileMenu.hidden){
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    }
  }
});

// Animation on scroll
(function(){
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe cards and sections
  $$('.room-card, .amenity-card, .dining-card, .contact-card, .quick-info-card, .address-block, .rating-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
})();

// Location & Map Enhancement
(function(){
  const directionsBtn = document.querySelector('.get-directions-btn');
  
  // Add click tracking for directions button
  directionsBtn?.addEventListener('click', ()=>{
    // Opens in new tab (handled by target="_blank")
    console.log('User opened directions to Hotel Tarasha');
  });
  
  // Animate map on scroll into view
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer){
    const mapObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (entry.isIntersecting){
          mapContainer.style.opacity = '1';
          mapContainer.style.transform = 'scale(1)';
        }
      });
    }, { threshold: 0.1 });
    
    mapContainer.style.opacity = '0';
    mapContainer.style.transform = 'scale(0.95)';
    mapContainer.style.transition = 'all 0.6s ease';
    mapObserver.observe(mapContainer);
  }
  
  // Rating animation on scroll
  const ratingSection = document.querySelector('.rating-section');
  if (ratingSection){
    const ratingObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const stars = entry.target.querySelector('.stars');
          if (stars && !stars.classList.contains('animated')){
            stars.classList.add('animated');
            stars.style.animation = 'pop-in 0.6s ease';
          }
        }
      });
    }, { threshold: 0.3 });
    
    ratingObserver.observe(ratingSection);
  }
})();

// end of script.js

// script.js - Luxe Hotel - Vanilla JS for interactions

// Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Mobile menu toggle
(function(){
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  
  menuBtn?.addEventListener('click', ()=>{
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
  
  // Close menu when a link is clicked
  $$('#mobileMenu a').forEach(link => {
    link.addEventListener('click', ()=>{
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });
})();

// Smooth scroll for anchor links
(function(){
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = $(href);
      if (target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Room Booking Buttons
(function(){
  const bookRoomButtons = document.querySelectorAll('.btn-book-room');
  const roomTypeSelect = $('#roomType');
  
  bookRoomButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const roomType = this.getAttribute('data-room');
      if (roomTypeSelect) {
        roomTypeSelect.value = roomType;
      }
      // Smooth scroll to booking section
      const bookingSection = $('#booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

// Hotel Booking System
(function(){
  const form = $('#bookingForm');
  if (!form) return;
  
  const checkInInput = $('#checkIn');
  const checkOutInput = $('#checkOut');
  const roomTypeSelect = $('#roomType');
  const nightsCountSpan = $('#nightsCount');
  const pricePerNightSpan = $('#pricePerNight');
  const totalPriceSpan = $('#totalPrice');
  const bookingStatus = $('#bookingStatus');
  
  // Room prices in Indian Rupees
  const roomPrices = {
    ac: 2000,
    nonac: 1000
  };
  
  // Set minimum check-in date to today
  const today = new Date().toISOString().split('T')[0];
  if (checkInInput) checkInInput.min = today;
  
  // Calculate number of nights and total price
  function calculatePrice(){
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    const roomType = roomTypeSelect.value;
    
    if (!checkIn || !checkOut || !roomType) return;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate){
      bookingStatus.textContent = 'Check-out date must be after check-in date';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const pricePerNight = roomPrices[roomType] || 0;
    const totalPrice = nights * pricePerNight;
    
    nightsCountSpan.textContent = nights;
    pricePerNightSpan.textContent = `₹${pricePerNight.toLocaleString('en-IN')}`;
    totalPriceSpan.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    bookingStatus.textContent = '';
    bookingStatus.className = 'form-status';
  }
  
  checkInInput?.addEventListener('change', calculatePrice);
  checkOutInput?.addEventListener('change', calculatePrice);
  roomTypeSelect?.addEventListener('change', calculatePrice);
  
  // Form submission
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const checkIn = checkInInput.value.trim();
    const checkOut = checkOutInput.value.trim();
    const guests = $('#guests').value;
    const roomType = roomTypeSelect.value;
    const guestName = $('#guestName').value.trim();
    const guestEmail = $('#guestEmail').value.trim();
    const guestPhone = $('#guestPhone').value.trim();
    
    // Validation
    if (!checkIn || !checkOut || !guests || !roomType || !guestName || !guestEmail || !guestPhone){
      bookingStatus.textContent = '✗ Please fill all required fields.';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)){
      bookingStatus.textContent = '✗ Please enter a valid email address.';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    if (!/^[\d\s\-\+\(\)]{10,}$/.test(guestPhone.replace(/\s/g, ''))){
      bookingStatus.textContent = '✗ Please enter a valid phone number (at least 10 digits).';
      bookingStatus.className = 'form-status error';
      return;
    }
    
    // Processing
    bookingStatus.textContent = '⏳ Processing your booking...';
    bookingStatus.className = 'form-status';
    
    setTimeout(()=>{
      const refNum = Math.random().toString(36).substr(2, 9).toUpperCase();
      bookingStatus.innerHTML = `✓ <strong>Booking Confirmed!</strong><br>Guest: ${guestName}<br>Email confirmation sent to: ${guestEmail}<br>Reference: #${refNum}`;
      bookingStatus.className = 'form-status success';
      form.reset();
      nightsCountSpan.textContent = '0';
      pricePerNightSpan.textContent = '₹0';
      totalPriceSpan.textContent = '₹0';
      
      // Clear message after 6 seconds
      setTimeout(()=>{ 
        bookingStatus.textContent = '';
        bookingStatus.className = 'form-status';
      }, 6000);
    }, 1200);
  });
})();

// Newsletter subscription
(function(){
  const form = $('#newsForm');
  if (!form) return;
  
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();
    
    if (!email){
      input.style.borderColor = '#ef4444';
      return;
    }
    
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      input.style.borderColor = '#ef4444';
      return;
    }
    
    // Success
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    btn.style.opacity = '0.7';
    input.value = '';
    input.style.borderColor = '';
    
    setTimeout(()=>{
      btn.textContent = originalText;
      btn.style.opacity = '1';
    }, 2500);
  });
})();

// Add scroll effect to header
(function(){
  const header = document.querySelector('.site-header');
  let lastScrollY = 0;
  
  window.addEventListener('scroll', ()=>{
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50){
      header.style.boxShadow = '0 12px 40px rgba(107, 62, 38, 0.12)';
    } else {
      header.style.boxShadow = '0 8px 32px rgba(107, 62, 38, 0.08)';
    }
    
    lastScrollY = currentScrollY;
  });
})();

// Keyboard accessibility
document.addEventListener('keydown', (e)=>{
  // Close mobile menu with Escape
  if (e.key === 'Escape'){
    const menuBtn = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    if (menuBtn && mobileMenu && !mobileMenu.hidden){
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    }
  }
});

// Animation on scroll
(function(){
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe cards and sections
  $$('.room-card, .amenity-card, .dining-card, .contact-card, .quick-info-card, .address-block, .rating-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
})();

// Location & Map Enhancement
(function(){
  const directionsBtn = document.querySelector('.get-directions-btn');
  
  // Add click tracking for directions button
  directionsBtn?.addEventListener('click', ()=>{
    // Opens in new tab (handled by target="_blank")
    console.log('User opened directions to Hotel Tarasha');
  });
  
  // Animate map on scroll into view
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer){
    const mapObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (entry.isIntersecting){
          mapContainer.style.opacity = '1';
          mapContainer.style.transform = 'scale(1)';
        }
      });
    }, { threshold: 0.1 });
    
    mapContainer.style.opacity = '0';
    mapContainer.style.transform = 'scale(0.95)';
    mapContainer.style.transition = 'all 0.6s ease';
    mapObserver.observe(mapContainer);
  }
  
  // Rating animation on scroll
  const ratingSection = document.querySelector('.rating-section');
  if (ratingSection){
    const ratingObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const stars = entry.target.querySelector('.stars');
          if (stars && !stars.classList.contains('animated')){
            stars.classList.add('animated');
            stars.style.animation = 'pop-in 0.6s ease';
          }
        }
      });
    }, { threshold: 0.3 });
    
    ratingObserver.observe(ratingSection);
  }
})();

// end of script.js
