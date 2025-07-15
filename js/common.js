// Utility to load HTML into #main-content
function loadPage(page, callback) {
  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      if (callback) callback();

      // Initialize event cards if we're on the events page
      if (page === 'events.html') {
        initEventCards();
      }
    });
}

function setActiveTab(tabBtn) {
  document.querySelectorAll('.tablink').forEach(el => el.classList.remove('active'));
  tabBtn.classList.add('active');
}

function handleTabClick(e) {
  const page = e.currentTarget.getAttribute('data-page');
  setActiveTab(e.currentTarget);
  loadPage(page, () => {
    if (page === 'home.html') {
      const script = document.createElement('script');
      script.src = 'js/hydra-visual.js';
      document.body.appendChild(script);
    }
  });
}

// Create modal element for event popups
function createModal() {
  // Check if modal already exists
  if (document.querySelector('.modal-overlay')) {
    return;
  }

  // Create modal elements
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';

  const modalTitle = document.createElement('div');
  modalTitle.className = 'modal-title';

  const modalClose = document.createElement('button');
  modalClose.className = 'modal-close';
  modalClose.innerHTML = '&times;';
  modalClose.setAttribute('aria-label', 'Close');

  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';

  const modalImage = document.createElement('img');
  modalImage.className = 'modal-image';

  const modalDate = document.createElement('div');
  modalDate.className = 'modal-date';

  const modalDescription = document.createElement('div');
  modalDescription.className = 'modal-description';

  // Assemble modal structure
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(modalClose);

  modalBody.appendChild(modalImage);
  modalBody.appendChild(modalDate);
  modalBody.appendChild(modalDescription);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);

  modalOverlay.appendChild(modalContent);

  // Add to document
  document.body.appendChild(modalOverlay);

  // Add event listeners for closing
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Also close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// Initialize event cards with click handlers
function initEventCards() {
  createModal();

  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      const image = card.querySelector('.event-images img').src;
      const title = card.querySelector('.event-title').textContent;
      const date = card.querySelector('.event-date').textContent;
      const description = card.querySelector('.event-description').textContent;

      openModal(image, title, date, description);
    });
  });
}

// Open modal with event details
function openModal(image, title, date, description) {
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalImage = modalOverlay.querySelector('.modal-image');
  const modalTitle = modalOverlay.querySelector('.modal-title');
  const modalDate = modalOverlay.querySelector('.modal-date');
  const modalDescription = modalOverlay.querySelector('.modal-description');

  modalImage.src = image;
  modalTitle.textContent = title;
  modalDate.textContent = date;
  modalDescription.textContent = description;

  // Show modal with animation
  setTimeout(() => {
    modalOverlay.classList.add('active');
  }, 10);
}

// Close modal
function closeModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  modalOverlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tablink').forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });
  // Load home.html by default
  loadPage('home.html', () => {
    const script = document.createElement('script');
    script.src = 'js/hydra-visual.js';
    document.body.appendChild(script);
  });
});
