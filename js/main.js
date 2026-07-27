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

// i18n (FR default, EN via data-en / data-en-aria / data-en-placeholder / data-en-alt)
let currentLang = localStorage.getItem("helios-lang") || "fr";
const translatableText = document.querySelectorAll("[data-en]");
translatableText.forEach((el) => { el.dataset.fr = el.innerHTML; });
const translatableAria = document.querySelectorAll("[data-en-aria]");
translatableAria.forEach((el) => { el.dataset.frAria = el.getAttribute("aria-label"); });
const translatablePlaceholder = document.querySelectorAll("[data-en-placeholder]");
translatablePlaceholder.forEach((el) => { el.dataset.frPlaceholder = el.placeholder; });
const translatableAlt = document.querySelectorAll("[data-en-alt]");
translatableAlt.forEach((el) => { el.dataset.frAlt = el.alt; });

const pageTitleEl = document.getElementById("page-title");
const pageDescEl = document.getElementById("page-description");
const titleFr = pageTitleEl.textContent;
const titleEn = "Helios — Aerial Vision";
const descFr = pageDescEl.getAttribute("content");
const descEn = "Helios: aerial filming for real estate, events, inspection and mapping.";
const langButtons = document.querySelectorAll(".lang-btn");

const applyLanguage = (lang) => {
  currentLang = lang;
  document.documentElement.lang = lang;
  translatableText.forEach((el) => { el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.fr; });
  translatableAria.forEach((el) => { el.setAttribute("aria-label", lang === "en" ? el.dataset.enAria : el.dataset.frAria); });
  translatablePlaceholder.forEach((el) => { el.placeholder = lang === "en" ? el.dataset.enPlaceholder : el.dataset.frPlaceholder; });
  translatableAlt.forEach((el) => { el.alt = lang === "en" ? el.dataset.enAlt : el.dataset.frAlt; });
  pageTitleEl.textContent = lang === "en" ? titleEn : titleFr;
  pageDescEl.setAttribute("content", lang === "en" ? descEn : descFr);
  langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
  localStorage.setItem("helios-lang", lang);
  if (typeof resetChatLanguage === "function") resetChatLanguage();
};

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

// Hero scroll-scrubbed frame sequence
const heroSection = document.querySelector(".hero");
const heroCanvas = document.getElementById("hero-canvas");
const heroCtx = heroCanvas.getContext("2d");
const HERO_FRAME_COUNT = 72;
const heroFrames = [];
let heroFramesReady = false;
let heroCurrentFrame = 0;

// The yacht sits ~3% right of true center in the source footage; shift the
// crop window to compensate so it reads as centered on any viewport ratio.
const HERO_CENTER_OFFSET = 0.03;

const drawHeroFrame = (index) => {
  const img = heroFrames[index];
  if (!img || !img.complete || !img.naturalWidth) return;
  const cw = heroCanvas.width;
  const ch = heroCanvas.height;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (cw - dw) / 2 - dw * HERO_CENTER_OFFSET;
  const dy = (ch - dh) / 2;
  heroCtx.drawImage(img, dx, dy, dw, dh);
};

const resizeHeroCanvas = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  heroCanvas.width = heroCanvas.clientWidth * dpr;
  heroCanvas.height = heroCanvas.clientHeight * dpr;
  drawHeroFrame(heroCurrentFrame);
};

for (let i = 1; i <= HERO_FRAME_COUNT; i++) {
  const img = new Image();
  img.src = `assets/img/hero-frames/frame-${String(i).padStart(3, "0")}.jpg`;
  heroFrames.push(img);
}
heroFrames[0].addEventListener("load", () => { resizeHeroCanvas(); });
Promise.all(
  heroFrames.map((img) => img.complete ? Promise.resolve() : new Promise((res) => {
    img.addEventListener("load", res);
    img.addEventListener("error", res);
  }))
).then(() => { heroFramesReady = true; });

window.addEventListener("resize", resizeHeroCanvas);

let heroScrollTicking = false;
document.addEventListener("scroll", () => {
  if (heroScrollTicking) return;
  heroScrollTicking = true;
  requestAnimationFrame(() => {
    heroScrollTicking = false;
    if (!heroFramesReady) return;
    const progress = Math.min(Math.max(window.scrollY / heroSection.offsetHeight, 0), 1);
    const frameIndex = Math.min(HERO_FRAME_COUNT - 1, Math.floor(progress * HERO_FRAME_COUNT));
    if (frameIndex !== heroCurrentFrame) {
      heroCurrentFrame = frameIndex;
      drawHeroFrame(frameIndex);
    }
  });
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
  formNote.textContent = currentLang === "en"
    ? "Thank you! Your request has been received — we'll get back to you shortly."
    : "Merci ! Votre demande a bien été notée — nous revenons vers vous rapidement.";
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

// Pricing assistant (scripted Q&A, not a real chatbot)
const chatContent = {
  fr: {
    start: {
      bot: "Bonjour ! Je réponds aux questions de base sur nos tarifs (hors TVA). Que voulez-vous savoir ?",
      options: [
        { label: "Voir les formules", next: "packages" },
        { label: "Options en plus", next: "addons" },
        { label: "Obtenir un devis", next: "quote" },
      ],
    },
    packages: {
      userLabel: "Voir les formules",
      bot: "Nous proposons 3 formules (tarifs HT) :\n\n• Raw Cut — 500 €\nUne vidéo, montage minimal : rushs coupés et assemblés, sans étalonnage. Notre tarif minimum.\n\n• Single Edit — 900 €\nUne vidéo entièrement montée : étalonnage couleur et son inclus.\n\n• Multi-Vidéos — à partir de 1 500 €\nPlusieurs vidéos du même tournage (version longue + formats courts), montées et étalonnées.",
      options: [
        { label: "Options en plus", next: "addons" },
        { label: "Obtenir un devis", next: "quote" },
        { label: "Recommencer", next: "start" },
      ],
    },
    addons: {
      userLabel: "Options en plus",
      bot: "En complément de n'importe quelle formule :\n\n• Séquence FPV immersive — +450 €\n• Montage vidéo supplémentaire (mêmes rushs) — +250 €\n• Journée de tournage additionnelle — +600 €\n• Livraison express 48h — +200 €",
      options: [
        { label: "Voir les formules", next: "packages" },
        { label: "Obtenir un devis", next: "quote" },
        { label: "Recommencer", next: "start" },
      ],
    },
    quote: {
      userLabel: "Obtenir un devis",
      bot: "Le plus simple : décrivez votre projet dans le formulaire de contact, ou écrivez-moi directement sur WhatsApp — je reviens vers vous avec un devis adapté.",
      options: [
        { label: "Aller au formulaire", action: "scrollContact" },
        { label: "Recommencer", next: "start" },
      ],
    },
  },
  en: {
    start: {
      bot: "Hi! I can answer basic questions about our pricing (excl. VAT). What would you like to know?",
      options: [
        { label: "View packages", next: "packages" },
        { label: "Add-on options", next: "addons" },
        { label: "Get a quote", next: "quote" },
      ],
    },
    packages: {
      userLabel: "View packages",
      bot: "We offer 3 packages (prices excl. VAT):\n\n• Raw Cut — €500\nOne video, minimal editing: footage trimmed and assembled, no color grading. Our minimum rate.\n\n• Single Edit — €900\nOne fully edited video: color grading and sound included.\n\n• Multi-Video Package — from €1,500\nSeveral videos from the same shoot (long version + short cuts), edited and color graded.",
      options: [
        { label: "Add-on options", next: "addons" },
        { label: "Get a quote", next: "quote" },
        { label: "Start over", next: "start" },
      ],
    },
    addons: {
      userLabel: "Add-on options",
      bot: "On top of any package:\n\n• Immersive FPV sequence — +€450\n• Extra video edit (same footage) — +€250\n• Additional filming day — +€600\n• 48h express delivery — +€200",
      options: [
        { label: "View packages", next: "packages" },
        { label: "Get a quote", next: "quote" },
        { label: "Start over", next: "start" },
      ],
    },
    quote: {
      userLabel: "Get a quote",
      bot: "Easiest way: describe your project in the contact form, or message me directly on WhatsApp — I'll get back to you with a tailored quote.",
      options: [
        { label: "Go to the form", action: "scrollContact" },
        { label: "Start over", next: "start" },
      ],
    },
  },
};

const chatWidget = document.querySelector(".chat-widget");
const chatToggle = document.getElementById("chat-toggle");
const chatMessages = document.getElementById("chat-messages");
const chatQuickReplies = document.getElementById("chat-quick-replies");
let chatStarted = false;

const renderChatNode = (key, showUserLabel) => {
  const node = chatContent[currentLang][key];
  if (showUserLabel && node.userLabel) {
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user";
    userBubble.textContent = node.userLabel;
    chatMessages.appendChild(userBubble);
  }
  const botBubble = document.createElement("div");
  botBubble.className = "chat-bubble bot";
  botBubble.textContent = node.bot;
  chatMessages.appendChild(botBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  chatQuickReplies.innerHTML = "";
  node.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "chat-quick-reply";
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      if (opt.action === "scrollContact") {
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user";
        userBubble.textContent = opt.label;
        chatMessages.appendChild(userBubble);
        chatWidget.classList.remove("open");
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        return;
      }
      renderChatNode(opt.next, true);
    });
    chatQuickReplies.appendChild(btn);
  });
};

chatToggle.addEventListener("click", () => {
  chatWidget.classList.toggle("open");
  if (chatWidget.classList.contains("open") && !chatStarted) {
    chatStarted = true;
    renderChatNode("start", false);
  }
});

function resetChatLanguage() {
  if (!chatStarted) return;
  chatMessages.innerHTML = "";
  chatQuickReplies.innerHTML = "";
  renderChatNode("start", false);
}

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

applyLanguage(currentLang);
