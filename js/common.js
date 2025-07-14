// Utility to load HTML into #main-content
function loadPage(page, callback) {
  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;
      if (callback) callback();
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