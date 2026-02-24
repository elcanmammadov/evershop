// Bayraq SVG-ləri
const flagSVGs = {
  az: `<svg class="flag-icon" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#00b9e4" d="M0 0h640v160H0z"/>
      <path fill="#ed2939" d="M0 160h640v160H0z"/>
      <path fill="#3f9c35" d="M0 320h640v160H0z"/>
      <circle cx="304" cy="240" r="72" fill="#fff"/>
      <circle cx="320" cy="240" r="60" fill="#ed2939"/>
      <path fill="#fff" d="m352 208 7.7 21.5 20.3-9.8-9.8 20.3 21.5 7.7-21.5 7.7 9.8 20.3-20.3-9.8-7.7 21.5-7.7-21.5-20.3 9.8 9.8-20.3-21.5-7.7 21.5-7.7-9.8-20.3 20.3 9.8z"/>
  </svg>`,
  en: `<svg class="flag-icon" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
      <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
      <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
      <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
  </svg>`,
  ru: `<svg class="flag-icon" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#fff" d="M0 0h640v160H0z"/>
      <path fill="#0039a6" d="M0 160h640v160H0z"/>
      <path fill="#d52b1e" d="M0 320h640v160H0z"/>
  </svg>`,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { translations, flagSVGs };
}

("use strict");

let currentLang = "az";

/**
 * Dili yeniləmək
 */
function updateLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Dil tapılmadı: ${lang}`);
    return;
  }

  currentLang = lang;
  const t = translations[lang];

  // 1. data-i18n → textContent
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      element.textContent = t[key];
    }
  });

  // 2. data-i18n-placeholder → placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) {
      element.placeholder = t[key];
    }
  });

  // 3. File upload düyməsi və "fayl seçilməyib" mətni
  const fileUploadBtn = document.getElementById("fileUploadBtn");
  const fileUploadName = document.getElementById("fileUploadName");
  const fileInput = document.getElementById("fileUpload");

  if (fileUploadBtn && t["formFileBtn"]) {
    fileUploadBtn.textContent = t["formFileBtn"];
  }
  // Yalnız fayl seçilməyibsə default mətni yenilə
  if (
    fileUploadName &&
    fileInput &&
    !fileInput.files.length &&
    t["formFileNone"]
  ) {
    fileUploadName.textContent = t["formFileNone"];
  }

  // 4. Desktop dil düyməsi
  const currentLangBtn = document.getElementById("currentLangBtn");
  if (currentLangBtn && flagSVGs[lang]) {
    currentLangBtn.innerHTML =
      flagSVGs[lang] +
      `<span class="lang-text">${lang.toUpperCase()}</span>
      <span class="dropdown-icon" aria-hidden="true">▼</span>`;
  }

  // 5. Mobil dil düyməsi
  const mobileLangBtn = document.getElementById("mobileLangBtn");
  if (mobileLangBtn && flagSVGs[lang]) {
    mobileLangBtn.innerHTML =
      flagSVGs[lang] + `<span class="lang-text">${lang.toUpperCase()}</span>`;
  }

  // 6. HTML lang atributu
  document.documentElement.lang = lang;

  // 7. Yaddaşa saxla
  try {
    localStorage.setItem("preferredLanguage", lang);
  } catch (e) {
    console.warn("LocalStorage əlçatan deyil:", e);
  }
}

/**
 * Custom file upload düyməsi
 */
function setupFileUpload() {
  const fileUploadBtn = document.getElementById("fileUploadBtn");
  const fileInput = document.getElementById("fileUpload");
  const fileUploadName = document.getElementById("fileUploadName");

  if (!fileUploadBtn || !fileInput || !fileUploadName) return;

  // Düyməyə basıldıqda gizli input-u aç
  fileUploadBtn.addEventListener("click", function () {
    fileInput.click();
  });

  // Fayl seçildikdə adı göstər
  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      fileUploadName.textContent = fileInput.files[0].name;
    } else {
      const t = translations[currentLang];
      fileUploadName.textContent = t["formFileNone"] || "Fayl seçilməyib";
    }
  });
}

/**
 * Dil seçimi
 */
function setupLanguageHandlers() {
  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      const lang = this.dataset.lang;
      if (lang) {
        updateLanguage(lang);
        if (window.innerWidth <= 992) {
          const dropdown = this.closest(".has-dropdown");
          if (dropdown) dropdown.classList.remove("dropdown-active");
        }
      }
    });
  });

  const mobileLangBtn = document.getElementById("mobileLangBtn");
  if (mobileLangBtn) {
    mobileLangBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const langs = ["az", "en", "ru"];
      const currentIndex = langs.indexOf(currentLang);
      const nextIndex = (currentIndex + 1) % langs.length;
      updateLanguage(langs[nextIndex]);
    });
  }
}

/**
 * Mobil menyu
 */
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mainNav = document.getElementById("mainNav");
  if (!mobileMenuBtn || !mainNav) return;

  mobileMenuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const isActive = this.classList.toggle("active");
    mainNav.classList.toggle("active");
    this.setAttribute("aria-expanded", isActive);
  });

  const dropdownItems = document.querySelectorAll(".has-dropdown");
  dropdownItems.forEach((item) => {
    const link = item.querySelector(".nav-link");
    if (link) {
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          const isActive = item.classList.toggle("dropdown-active");
          this.setAttribute("aria-expanded", isActive);
          dropdownItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove("dropdown-active");
              const otherLink = otherItem.querySelector(".nav-link");
              if (otherLink) otherLink.setAttribute("aria-expanded", "false");
            }
          });
        }
      });
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".header")) {
      mainNav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      dropdownItems.forEach((item) => {
        item.classList.remove("dropdown-active");
        const link = item.querySelector(".nav-link");
        if (link) link.setAttribute("aria-expanded", "false");
      });
    }
  });

  window.addEventListener(
    "resize",
    debounce(function () {
      if (window.innerWidth > 992) {
        mainNav.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        dropdownItems.forEach((item) => {
          item.classList.remove("dropdown-active");
          const link = item.querySelector(".nav-link");
          if (link) link.setAttribute("aria-expanded", "false");
        });
      }
    }, 250),
  );
}

/**
 * Scroll effektləri
 */
function setupScrollEffects() {
  const header = document.querySelector(".header");
  const scrollToTop = document.getElementById("scrollToTop");

  window.addEventListener(
    "scroll",
    debounce(function () {
      const scrolled = window.scrollY > 100;
      if (header) header.classList.toggle("scrolled", scrolled);
      if (scrollToTop) scrollToTop.classList.toggle("show", scrolled);
    }, 100),
  );

  if (scrollToTop) {
    scrollToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * Kontakt forması
 */
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("firstName");
    const surname = formData.get("lastName");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const message = formData.get("message");

    const text = `Ad: ${name}\nSoyad: ${surname}\nTelefon: ${phone}\nEmail: ${email}\nMesaj: ${message}\n\nQeyd: Zəhmət olmasa faylı əlavə edin.`;
    const mailTo = "Sales@evershop.az";
    const subject = "Əlaqə Formu";
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${mailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    window.open(gmailURL, "_blank");
  });
}

/**
 * Sertifikatlar
 */
function setupCertificates() {
  document.querySelectorAll(".cert-item").forEach((item) => {
    item.addEventListener("click", function () {
      const pdf = this.getAttribute("data-pdf");
      if (pdf) window.open(pdf, "_blank");
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const pdf = this.getAttribute("data-pdf");
        if (pdf) window.open(pdf, "_blank");
      }
    });
  });
}

/**
 * Video autoplay
 */
function setupVideoAutoplay() {
  const video = document.querySelector(".hero-video");
  if (video) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
  }
}

/**
 * Debounce
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Lazy loading
 */
function setupLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) return;
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Performans
 */
function optimizePerformance() {
  const preloadLinks = [
    { href: "assets/css/style.css", as: "style" },
    {
      href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap",
      as: "style",
    },
  ];
  preloadLinks.forEach((link) => {
    const linkEl = document.createElement("link");
    linkEl.rel = "preload";
    linkEl.href = link.href;
    linkEl.as = link.as;
    document.head.appendChild(linkEl);
  });
}

/**
 * İnisialisasiya
 */
function init() {
  try {
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang && translations[savedLang]) {
      updateLanguage(savedLang);
    }
  } catch (e) {
    console.warn("LocalStorage əlçatan deyil:", e);
  }

  setupLanguageHandlers();
  setupMobileMenu();
  setupScrollEffects();
  setupContactForm();
  setupFileUpload();
  setupCertificates();
  setupVideoAutoplay();
  setupLazyLoading();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

if (document.readyState === "complete") {
  optimizePerformance();
} else {
  window.addEventListener("load", optimizePerformance);
}
