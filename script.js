(() => {
  const weddingTarget = new Date("2026-11-21T20:30:00-03:00").getTime();
  const countdown = document.getElementById("countdown");
  const audio = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");
  const petalsContainer = document.getElementById("petals");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateCountdown() {
    if (!countdown) return;

    let diff = Math.max(0, weddingTarget - Date.now());
    const days = Math.floor(diff / 86_400_000);
    diff -= days * 86_400_000;

    const hours = Math.floor(diff / 3_600_000);
    diff -= hours * 3_600_000;

    const minutes = Math.floor(diff / 60_000);
    diff -= minutes * 60_000;

    const seconds = Math.floor(diff / 1_000);
    const values = [days, hours, minutes, seconds];

    countdown.querySelectorAll("strong").forEach((node, index) => {
      node.textContent = String(values[index]).padStart(index === 0 ? 1 : 2, "0");
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  if (musicBtn && audio) {
    musicBtn.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          await audio.play();
          musicBtn.classList.add("is-playing");
          musicBtn.setAttribute("aria-pressed", "true");
          musicBtn.setAttribute("aria-label", "Pausar música");
          const label = musicBtn.querySelector(".music-control__label");
          if (label) label.textContent = "Pausar música";
        } else {
          audio.pause();
          musicBtn.classList.remove("is-playing");
          musicBtn.setAttribute("aria-pressed", "false");
          musicBtn.setAttribute("aria-label", "Reproducir música");
          const label = musicBtn.querySelector(".music-control__label");
          if (label) label.textContent = "Reproducir música";
        }
      } catch (error) {
        musicBtn.setAttribute("aria-label", "Reproducir música");
        window.alert("El navegador bloqueó la reproducción automática. Tocá nuevamente el botón de música.");
      }
    });
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    elements.forEach((element) => observer.observe(element));
  }

  function createPetals() {
    if (!petalsContainer || prefersReducedMotion) return;

    const fragment = document.createDocumentFragment();
    const totalPetals = window.innerWidth < 760 ? 14 : 24;

    for (let index = 0; index < totalPetals; index += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${10 + Math.random() * 10}s`;
      petal.style.animationDelay = `${-Math.random() * 16}s`;
      petal.style.opacity = `${0.12 + Math.random() * 0.25}`;
      petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
      fragment.appendChild(petal);
    }

    petalsContainer.appendChild(fragment);
  }

  setupRevealAnimations();
  createPetals();
})();
