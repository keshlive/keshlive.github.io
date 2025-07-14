// Countdown logic for KESH event
(function() {
  const countdownDate = new Date("2025-08-02T23:00:00+01:00").getTime();
  function updateCountdowns() {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const text = distance < 0
      ? "EXPIRED"
      : `Countdown to KESH: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    const hydraCountdown = document.getElementById("hydra-countdown");
    if (hydraCountdown) hydraCountdown.textContent = text;
  }
  if (document.getElementById("hydra-countdown")) {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    // Hydra-style modulation for countdown text
    function modulateCountdown() {
      const el = document.getElementById("hydra-countdown");
      if (!el) return;
      const t = Date.now() / 500;
      const scale = 1 + 0.08 * Math.sin(t/1.5);
      el.style.transform = `scale(${scale})`;
      requestAnimationFrame(modulateCountdown);
    }
    modulateCountdown();
    // Animate countdown position in an elliptical path
    function animateCountdownPosition() {
      const el = document.getElementById("hydra-countdown");
      if (!el) return;
      const t = Date.now() / 1200;
      const vw = window.innerWidth;
      const vh = window.innerHeight - 50; // minus tab bar
      const boxW = el.offsetWidth || 180;
      const boxH = el.offsetHeight || 50;
      const radiusX = (vw - boxW) / 2.2;
      const radiusY = (vh - boxH) / 2.2;
      const centerX = vw / 2 - boxW / 2;
      const centerY = vh / 2 - boxH / 2 + 50;
      const x = centerX + radiusX * Math.cos(t)*0.5;
      const y = centerY + radiusY * Math.sin(t)*0.5;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      requestAnimationFrame(animateCountdownPosition);
    }
    animateCountdownPosition();
  }
})(); 