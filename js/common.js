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

      // Ensure videos autoplay when about page is loaded
      if (page === 'about.html') {
        // Call immediately
        ensureVideoAutoplay();

        // And also with a small delay to ensure DOM is fully processed
        setTimeout(() => {
          ensureVideoAutoplay();

          // Force play on all background videos
          document.querySelectorAll('.background-video').forEach(video => {
            // Force inline styles
            video.style.visibility = 'visible';
            video.style.display = 'block';
            video.style.opacity = '1'; // Full opacity
            video.style.zIndex = '0'; // Ensure proper z-index

            // Try to play
            if (video.paused) {
              video.play().catch(e => console.log("Delayed force play failed:", e));
            }
          });
        }, 300);
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
    // Create a center clickable element
    const centerElement = document.createElement('div');
    centerElement.className = 'event-card-center';
    card.appendChild(centerElement);

    // Function to handle both click and touch events
    const handleCardInteraction = function() {
      const image = card.querySelector('.event-images img').src;
      const title = card.querySelector('.event-title').textContent;
      const date = card.querySelector('.event-date').textContent;
      const description = card.querySelector('.event-description').textContent;

      openModal(image, title, date, description);
    };

    // Add multiple event listeners to the center element only
    centerElement.addEventListener('click', handleCardInteraction);
    centerElement.addEventListener('touchend', function(e) {
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

// Function to ensure videos autoplay
function ensureVideoAutoplay() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    // Set additional attributes to help with autoplay
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.muted = true; // Explicitly set muted property

    // Force inline styles to ensure visibility
    if (video.classList.contains('background-video')) {
      video.style.visibility = 'visible';
      video.style.display = 'block';
      video.style.opacity = '1'; // Full opacity
      video.style.zIndex = '0'; // Changed from -1 to 0 to ensure it's visible
    }

    // Try to play the video
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log("Video autoplay was prevented:", e);
        // Try again after a short delay
        setTimeout(() => {
          video.play().catch(e => console.log("Retry failed:", e));
        }, 1000);
      });
    }

    // Add additional event listeners to ensure video plays
    if (video.classList.contains('background-video')) {
      // Try playing multiple times with increasing delays
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (video.paused) {
            console.log(`Delayed play attempt ${i+1}`);
            video.play().catch(e => console.log(`Delayed play ${i+1} failed:`, e));
          }
        }, 500 + (i * 500)); // Increasing delays: 500ms, 1000ms, 1500ms, etc.
      }

      // Add event listeners for various user interactions
      ['click', 'scroll', 'mousemove', 'touchstart', 'focus', 'blur'].forEach(eventType => {
        document.addEventListener(eventType, () => {
          if (video.paused) {
            video.play().catch(e => console.log(`${eventType} play failed:`, e));
          }
        }, { once: true });
      });

      // Create a persistent play attempt that runs every second
      const persistentPlayInterval = setInterval(() => {
        if (video.paused) {
          console.log("Persistent play attempt");
          video.play().catch(e => console.log("Persistent play failed:", e));
        }
      }, 1000);

      // Store the interval ID on the video element to avoid memory leaks
      video._persistentPlayInterval = persistentPlayInterval;
    }
  });
}

// Function to periodically check and ensure videos are playing
function setupVideoPlaybackMonitor() {
  // Check very frequently (every 100ms) if videos are playing
  setInterval(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // If video is paused and should be playing, restart it
      if (video.paused && video.classList.contains('background-video')) {
        console.log("Detected paused video, restarting playback");
        video.play().catch(e => console.log("Restart failed:", e));
      }
    });
  }, 100);

  // Add event listeners to ensure video plays on hover and continues playing after hover
  document.addEventListener('DOMContentLoaded', () => {
    const setupVideoHoverHandlers = () => {
      const container = document.querySelector('.about-full-container');
      if (container) {
        const video = container.querySelector('.background-video');
        if (video) {
          // Force video to be visible and playing
          video.style.visibility = 'visible';
          video.style.display = 'block';
          video.style.opacity = '1'; // Full opacity
          video.style.zIndex = '0'; // Ensure proper z-index

          // Ensure video plays when page loads
          video.play().catch(e => console.log("Initial play failed:", e));

          // Try multiple times to start the video
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              if (video.paused) {
                console.log(`Attempt ${i+1} to play video`);
                video.play().catch(e => console.log(`Play attempt ${i+1} failed:`, e));
              }
            }, i * 300);
          }

          // Ensure video plays when container is hovered (fallback)
          container.addEventListener('mouseover', () => {
            if (video.paused) {
              video.play().catch(e => console.log("Mouseover play failed:", e));
            }
          });

          // Ensure video continues playing when mouse leaves container
          container.addEventListener('mouseout', () => {
            if (video.paused) {
              video.play().catch(e => console.log("Mouseout play failed:", e));
            }
          });

          // Add more event listeners to try to play the video
          ['scroll', 'mousemove', 'touchstart', 'focus', 'blur'].forEach(eventType => {
            document.addEventListener(eventType, () => {
              if (video.paused) {
                video.play().catch(e => console.log(`${eventType} play failed:`, e));
              }
            }, { once: true });
          });
        }
      }
    };

    // Setup handlers immediately if DOM is already loaded
    setupVideoHoverHandlers();

    // Also setup handlers when about page is loaded via AJAX
    document.body.addEventListener('DOMNodeInserted', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('about-full-container')) {
        setupVideoHoverHandlers();
      }
    });

    // Also check periodically for the container and video
    const checkInterval = setInterval(() => {
      const container = document.querySelector('.about-full-container');
      if (container) {
        const video = container.querySelector('.background-video');
        if (video && video.paused) {
          console.log("Periodic check found paused video, playing");
          video.play().catch(e => console.log("Periodic play failed:", e));
        }
      }
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tablink').forEach(btn => {
    btn.addEventListener('click', handleTabClick);
  });

  // Setup periodic video playback monitoring
  setupVideoPlaybackMonitor();

  // Add a MutationObserver to detect when videos are added to the DOM
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          // Check if the added node is a video element
          if (node.nodeName === 'VIDEO') {
            console.log("Video element added to DOM, ensuring playback");
            // Force styles and play
            if (node.classList.contains('background-video')) {
              node.style.visibility = 'visible';
              node.style.display = 'block';
              node.style.opacity = '1'; // Full opacity
              node.style.zIndex = '0'; // Ensure proper z-index
              node.muted = true;
              node.play().catch(e => console.log("MutationObserver play failed:", e));
            }
          }
          // Check if the added node contains video elements
          else if (node.querySelectorAll) {
            const videos = node.querySelectorAll('video.background-video');
            videos.forEach(video => {
              console.log("Video found in added DOM node, ensuring playback");
              video.style.visibility = 'visible';
              video.style.display = 'block';
              video.style.opacity = '1'; // Full opacity
              video.style.zIndex = '0'; // Ensure proper z-index
              video.muted = true;
              video.play().catch(e => console.log("MutationObserver nested play failed:", e));
            });
          }
        }
      }
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });

  // Check if URL has a hash for direct navigation
  const hash = window.location.hash.substring(1);
  let pageToLoad = 'home.html';

  if (hash === 'about') {
    pageToLoad = 'about.html';
    document.querySelector('.tablink[data-page="about.html"]').classList.add('active');
    document.querySelector('.tablink[data-page="home.html"]').classList.remove('active');
  }

  // Load the appropriate page
  loadPage(pageToLoad, () => {
    if (pageToLoad === 'home.html') {
      const script = document.createElement('script');
      script.src = 'js/hydra-visual.js';
      document.body.appendChild(script);
    } else if (pageToLoad === 'about.html') {
      // Ensure videos autoplay when directly navigating to about page
      ensureVideoAutoplay();
    }
  });
  });
