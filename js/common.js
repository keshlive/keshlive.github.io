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

    // Function to handle both click and touch events
    const handleCardInteraction = function() {
      const image = card.querySelector('.event-images img').src;
      const title = card.querySelector('.event-title').textContent;
      const date = card.querySelector('.event-date').textContent;
      const description = card.querySelector('.event-description').textContent;

      openModal(image, title, date, description);
    };

    // Add multiple event listeners for better cross-device compatibility
    card.addEventListener('click', handleCardInteraction);
    card.addEventListener('touchend', function(e) {
      e.preventDefault(); // Prevent default touch behavior
      handleCardInteraction();
    });
  });
}

// Open modal with event details
function openModal(image, title, date, description) {
  const modalOverlay = document.querySelector('.modal-overlay');

  // If modal doesn't exist for some reason, create it first
  if (!modalOverlay) {
    createModal();
    return openModal(image, title, date, description);
  }

  const modalImage = modalOverlay.querySelector('.modal-image');
  const modalTitle = modalOverlay.querySelector('.modal-title');
  const modalDate = modalOverlay.querySelector('.modal-date');
  const modalDescription = modalOverlay.querySelector('.modal-description');

  // Ensure image is loaded before showing modal
  modalImage.onload = function() {
    // Show modal with animation after image is loaded
    setTimeout(() => {
      modalOverlay.classList.add('active');

      // Force browser to recognize the modal is active (helps with some desktop browsers)
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 50);
    }, 10);
  };

  // Set content
  modalImage.src = image;
  modalTitle.textContent = title;
  modalDate.textContent = date;
  modalDescription.textContent = description;

  // In case the image is already cached and onload doesn't fire
  if (modalImage.complete) {
    modalImage.onload();
  }
}

// Close modal
function closeModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    // Remove active class to hide the modal with animation
    modalOverlay.classList.remove('active');

    // Ensure body overflow is restored
    document.body.style.overflow = '';
  }
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
