document.getElementById("year").textContent = new Date().getFullYear();

// Navbar background on scroll
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("nav-links");
const navToggle = document.getElementById("nav-toggle");

const onScroll = () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
};
document.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile nav toggle
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Hero parallax
const heroBg = document.getElementById("hero-bg");
document.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }
}, { passive: true });

// Reveal on scroll
const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

// Gallery lightbox
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightbox-close");
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightbox.classList.add("open");
  });
});
lightboxClose.addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("open");
});

// Contact form (static placeholder submit — wire to a backend/service later)
const form = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formNote.textContent = "Merci ! Votre demande a bien été notée — nous revenons vers vous rapidement.";
  form.reset();
});

// Stat counters
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const counters = document.querySelectorAll("[data-count-to]");
const animateCount = (el) => {
  const target = parseInt(el.dataset.countTo, 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((el) => countObserver.observe(el));

// Subtle cursor tilt on cards (pointer devices only)
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".service-card, .gallery-item").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      card.style.transition = "transform 0s";
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
}
