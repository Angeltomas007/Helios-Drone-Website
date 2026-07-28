// Prevent the browser from restoring a previous scroll position on
// reload/back-forward navigation — always start at the top of the page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

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

// Hero scroll-scrubbed frame sequence (only present on the homepage)
const heroCanvas = document.getElementById("hero-canvas");
if (heroCanvas) {
  const heroSection = document.querySelector(".hero");
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
}

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

// Portfolio page category filters (only present on portfolio.html)
const filterChips = document.querySelectorAll(".filter-chip");
if (filterChips.length) {
  const portfolioItems = document.querySelectorAll(".portfolio-gallery .gallery-item");
  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const category = chip.dataset.filter;
      portfolioItems.forEach((item) => {
        item.style.display = (category === "all" || item.dataset.category === category) ? "" : "none";
      });
    });
  });
}

// Contact form (only present on pages that include it)
const form = document.getElementById("contact-form");
if (form) {
  const formNote = document.getElementById("form-note");
  const formSubmitBtn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formSubmitBtn.disabled = true;
    formNote.textContent = currentLang === "en" ? "Sending…" : "Envoi en cours…";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const result = await response.json();
      if (result.success) {
        formNote.textContent = currentLang === "en"
          ? "Thank you! Your request has been received — we'll get back to you shortly."
          : "Merci ! Votre demande a bien été notée — nous revenons vers vous rapidement.";
        form.reset();
      } else {
        throw new Error(result.message || "submit failed");
      }
    } catch (err) {
      formNote.textContent = currentLang === "en"
        ? "Something went wrong — please email us directly or try again."
        : "Une erreur est survenue — écrivez-nous directement par email ou réessayez.";
    } finally {
      formSubmitBtn.disabled = false;
    }
  });
}

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
        { label: "Trouver la formule qu'il me faut", next: "wizard_q1" },
        { label: "Voir les formules", next: "packages" },
        { label: "Options en plus", next: "addons" },
        { label: "Obtenir un devis", next: "quote" },
      ],
    },
    wizard_q1: {
      bot: "Volontiers ! 4 petites questions. D'abord : quel type de prestation vous intéresse ?",
      options: [
        { label: "Immobilier", wizardKey: "type", wizardValue: "Immobilier", next: "wizard_q2" },
        { label: "Événementiel", wizardKey: "type", wizardValue: "Événementiel", next: "wizard_q2" },
        { label: "Inspection / Cartographie", wizardKey: "type", wizardValue: "Inspection / Cartographie", next: "wizard_q2" },
        { label: "Autre chose", wizardKey: "type", wizardValue: "un projet sur mesure", next: "wizard_q2" },
      ],
    },
    wizard_q2: {
      bot: "Combien de vidéos souhaitez-vous ?",
      options: [
        { label: "Une seule vidéo", wizardKey: "videos", wizardValue: "one", next: "wizard_q3" },
        { label: "Plusieurs formats (longue + courtes)", wizardKey: "videos", wizardValue: "multiple", next: "wizard_q3" },
        { label: "Je ne sais pas encore", wizardKey: "videos", wizardValue: "unsure", next: "wizard_q3" },
      ],
    },
    wizard_q3: {
      bot: "Pour quand en avez-vous besoin ?",
      options: [
        { label: "Urgent (sous 48h)", wizardKey: "timing", wizardValue: "urgent", next: "wizard_q4" },
        { label: "Dans le mois", wizardKey: "timing", wizardValue: "month", next: "wizard_q4" },
        { label: "Flexible", wizardKey: "timing", wizardValue: "flexible", next: "wizard_q4" },
      ],
    },
    wizard_q4: {
      bot: "Dernière question : une option en plus vous intéresse ?",
      options: [
        { label: "Vol FPV immersif", wizardKey: "extra", wizardValue: "fpv", next: "wizard_result" },
        { label: "Rien de spécial", wizardKey: "extra", wizardValue: "none", next: "wizard_result" },
        { label: "Je ne sais pas", wizardKey: "extra", wizardValue: "unsure", next: "wizard_result" },
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
        { label: "Find the right package for me", next: "wizard_q1" },
        { label: "View packages", next: "packages" },
        { label: "Add-on options", next: "addons" },
        { label: "Get a quote", next: "quote" },
      ],
    },
    wizard_q1: {
      bot: "Happy to help! 4 quick questions. First: what type of shoot are you interested in?",
      options: [
        { label: "Real Estate", wizardKey: "type", wizardValue: "Real Estate", next: "wizard_q2" },
        { label: "Events", wizardKey: "type", wizardValue: "Events", next: "wizard_q2" },
        { label: "Inspection / Mapping", wizardKey: "type", wizardValue: "Inspection / Mapping", next: "wizard_q2" },
        { label: "Something else", wizardKey: "type", wizardValue: "a custom project", next: "wizard_q2" },
      ],
    },
    wizard_q2: {
      bot: "How many videos do you need?",
      options: [
        { label: "Just one video", wizardKey: "videos", wizardValue: "one", next: "wizard_q3" },
        { label: "Several formats (long + short cuts)", wizardKey: "videos", wizardValue: "multiple", next: "wizard_q3" },
        { label: "Not sure yet", wizardKey: "videos", wizardValue: "unsure", next: "wizard_q3" },
      ],
    },
    wizard_q3: {
      bot: "When do you need it by?",
      options: [
        { label: "Urgent (within 48h)", wizardKey: "timing", wizardValue: "urgent", next: "wizard_q4" },
        { label: "Within a month", wizardKey: "timing", wizardValue: "month", next: "wizard_q4" },
        { label: "Flexible", wizardKey: "timing", wizardValue: "flexible", next: "wizard_q4" },
      ],
    },
    wizard_q4: {
      bot: "Last question: interested in an add-on?",
      options: [
        { label: "Immersive FPV flight", wizardKey: "extra", wizardValue: "fpv", next: "wizard_result" },
        { label: "Nothing extra", wizardKey: "extra", wizardValue: "none", next: "wizard_result" },
        { label: "Not sure", wizardKey: "extra", wizardValue: "unsure", next: "wizard_result" },
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

const goToContact = () => {
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = "index.html#contact";
  }
};

let wizardAnswers = {};

const addChatBubble = (role, text) => {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const buildWizardResult = () => {
  const a = wizardAnswers;
  const lines = [];
  if (currentLang === "en") {
    let pkg = "Single Edit (€900)";
    if (a.videos === "multiple") pkg = "Multi-Video Package (from €1,500)";
    else if (a.videos === "one" && a.timing === "flexible" && a.extra === "none") pkg = "Raw Cut (€500) or Single Edit (€900)";
    lines.push(`Based on your answers (${a.type || "your project"}), I'd suggest: ${pkg}.`);
    if (a.extra === "fpv") lines.push("Add the immersive FPV sequence: +€450.");
    if (a.timing === "urgent") lines.push("For a 48h turnaround, add express delivery: +€200.");
    lines.push("This is a starting point — send us your project details for an exact quote.");
  } else {
    let pkg = "Single Edit (900 €)";
    if (a.videos === "multiple") pkg = "Multi-Vidéos (à partir de 1 500 €)";
    else if (a.videos === "one" && a.timing === "flexible" && a.extra === "none") pkg = "Raw Cut (500 €) ou Single Edit (900 €)";
    lines.push(`D'après vos réponses (${a.type || "votre projet"}), je suggère : ${pkg}.`);
    if (a.extra === "fpv") lines.push("Ajoutez la séquence FPV immersive : +450 €.");
    if (a.timing === "urgent") lines.push("Pour une livraison en 48h, ajoutez l'option express : +200 €.");
    lines.push("C'est une base de départ — envoyez-nous le détail de votre projet pour un devis exact.");
  }
  return lines.join("\n\n");
};

const renderChatNode = (key, showUserLabel, userLabelOverride) => {
  if (key === "wizard_result") {
    if (showUserLabel && userLabelOverride) addChatBubble("user", userLabelOverride);
    addChatBubble("bot", buildWizardResult());
    chatQuickReplies.innerHTML = "";
    const resultOptions = currentLang === "en"
      ? [{ label: "Go to the form", action: "scrollContact" }, { label: "Start over", next: "start" }]
      : [{ label: "Aller au formulaire", action: "scrollContact" }, { label: "Recommencer", next: "start" }];
    resultOptions.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "chat-quick-reply";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        if (opt.action === "scrollContact") {
          addChatBubble("user", opt.label);
          chatWidget.classList.remove("open");
          goToContact();
          return;
        }
        wizardAnswers = {};
        renderChatNode(opt.next, true, opt.label);
      });
      chatQuickReplies.appendChild(btn);
    });
    return;
  }

  const node = chatContent[currentLang][key];
  if (showUserLabel) addChatBubble("user", userLabelOverride || node.userLabel);
  addChatBubble("bot", node.bot);

  chatQuickReplies.innerHTML = "";
  node.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "chat-quick-reply";
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      if (opt.wizardKey) wizardAnswers[opt.wizardKey] = opt.wizardValue;
      if (opt.action === "scrollContact") {
        addChatBubble("user", opt.label);
        chatWidget.classList.remove("open");
        goToContact();
        return;
      }
      renderChatNode(opt.next, true, opt.label);
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
  wizardAnswers = {};
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
