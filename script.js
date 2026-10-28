document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});


// WHATSAPP  link builder 


const OWNER_WHATSAPP_NUMBER = '254741655821';

function buildWhatsAppLink(booking) {
  const lines = [
    'New booking request — Glam & Glow Beauty parlour',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Service: ${booking.service}`,
    `Stylist: ${booking.stylist}`,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
  ];
  if (booking.notes) lines.push(`Notes: ${booking.notes}`);

  const message = lines.join('\n');
  return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


// BOOKING STORAGE — saving 


const BOOKINGS_KEY = 'salon_bookings';

function getBookings() {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function addBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
}

function cancelBooking(id) {
  const bookings = getBookings().filter((booking) => booking.id !== id);
  saveBookings(bookings);
}

function generateBookingId() {
  return 'bk_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// BOOKING VALIDATION


function validateBooking(booking) {
  const errors = {};

  if (!booking.name) {
    errors.name = 'Please tell us your name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!/^[0-9+\-\s]{7,}$/.test(booking.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!booking.service) {
    errors.service = 'Choose a service.';
  }

  if (!booking.stylist) {
    errors.stylist = 'Choose a stylist.';
  }

  if (!booking.date) {
    errors.date = 'Choose a date.';
  }

  if (!booking.time) {
    errors.time = 'Choose a time.';
  }

  // Double-booking check: same date + time + stylist already exists
  const existingBookings = getBookings();
  const isDoubleBooked = existingBookings.some(
    (existing) =>
      existing.date === booking.date &&
      existing.time === booking.time &&
      existing.stylist === booking.stylist
  );
  if (booking.date && booking.time && booking.stylist && isDoubleBooked) {
    errors.time = 'That stylist is already booked at this time. Please choose another time or stylist.';
  }

  return errors;
}

function showFieldErrors(errors) {
  document.querySelectorAll('.field-error').forEach((el) => {
    const field = el.dataset.for;
    el.textContent = errors[field] || '';
  });
}

// booking validate and save

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#booking-form');
  if (!form) return;

  const statusBox = document.querySelector('#form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const booking = {
      id: generateBookingId(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      stylist: formData.get('stylist'),
      date: formData.get('date'),
      time: formData.get('time'),
      notes: formData.get('notes'),
    };

    const errors = validateBooking(booking);
    showFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      statusBox.textContent = 'Please fix the highlighted fields.';
      statusBox.className = 'form-status is-error';
      return;
    }

    addBooking(booking);

    fetch('http://localhost:3001/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });

    statusBox.textContent = `Thanks, ${booking.name}! Your booking is saved. You can also tap the WhatsApp icon to message us directly.`;
    statusBox.className = 'form-status is-success';
  });

  const whatsappButton = document.querySelector('#whatsapp-btn');
  if (whatsappButton) {
    whatsappButton.addEventListener('click', () => {
      const formData = new FormData(form);
      const booking = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        stylist: formData.get('stylist'),
        date: formData.get('date'),
        time: formData.get('time'),
        notes: formData.get('notes'),
      };

      if (!booking.name || !booking.phone || !booking.service || !booking.date || !booking.time) {
        statusBox.textContent = 'Please fill in your name, phone, service, date and time first.';
        statusBox.className = 'form-status is-error';
        return;
      }

      window.open(buildWhatsAppLink(booking), '_blank');
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('#bookings-list');
  const emptyState = document.querySelector('#empty-state');
  if (!list) return;

  renderBookings(list, emptyState);
});

function renderBookings(list, emptyState) {
  const bookings = getBookings();

  list.innerHTML = '';

  if (bookings.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  bookings.forEach((booking) => {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.innerHTML = `
      <div class="details">
        <strong>${booking.service}</strong>
        <p>${booking.date} at ${booking.time} with ${booking.stylist}</p>
        <p>${booking.name} · ${booking.phone}</p>
      </div>
      <button class="btn-cancel" data-id="${booking.id}">Cancel</button>
    `;
    list.appendChild(card);
  });

  list.addEventListener('click', (event) => {
    if (!event.target.classList.contains('btn-cancel')) return;
    const id = event.target.getAttribute('data-id');
    cancelBooking(id);
    renderBookings(list, emptyState);
  });
}
// gallery page
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');
  const galleryImages = document.querySelectorAll('.gallery-grid img');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    const thumb = galleryImages[currentIndex];
    lightboxImg.src = thumb.src;
    lightboxImg.alt = thumb.alt;
  }

  galleryImages.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('is-open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  function showPrev() {
    const newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(newIndex);
  }

  function showNext() {
    const newIndex = (currentIndex + 1) % galleryImages.length;
    showImage(newIndex);
  }

  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', showPrev);
  nextButton.addEventListener('click', showNext);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showPrev();
    if (event.key === 'ArrowRight') showNext();
  });
});

// owner page: show bookings from the server

document.addEventListener('DOMContentLoaded', () => {
  const list = document.querySelector('#admin-bookings-list');
  if (!list) return;

  const password = prompt('Enter the owner password');

  fetch('http://localhost:3001/bookings', {
    headers: { 'x-admin-password': password }
  })
    .then((res) => {
      if (!res.ok) {
        list.innerHTML = '<p>Wrong password.</p>';
        return null;
      }
      return res.json();
    })
    .then((bookings) => {
      if (!bookings) return;

      if (bookings.length === 0) {
        list.innerHTML = '<p>No bookings yet.</p>';
        return;
      }

      bookings.forEach((booking) => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
          <div class="details">
            <strong>${escapeHtml(booking.service)}</strong>
            <p>${escapeHtml(booking.date)} at ${escapeHtml(booking.time)} with ${escapeHtml(booking.stylist)}</p>
            <p>${escapeHtml(booking.name)} · ${escapeHtml(booking.phone)}</p>
          </div>
        `;
        list.appendChild(card);
      });
    })
    .catch(() => {
      list.innerHTML = '<p>Could not reach the server. Is it running?</p>';
    });
});