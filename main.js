// ===============================
// LOAD HEADER & FOOTER (ROBUST)
// ===============================

async function loadComponent(elementId, filePath) {
  try {
    const target = document.getElementById(elementId);
    if (!target) return;

    const res = await fetch(filePath);
    if (!res.ok) throw new Error(res.status);

    const html = await res.text();
    target.innerHTML = html;
  } catch (err) {
    console.error(`Failed to load ${filePath}:`, err);
  }
}

const isGitHub =
  window.location.hostname !== "127.0.0.1" &&
  window.location.hostname !== "localhost";

const componentBase = isGitHub
  ? "pages/components/"
  : (() => {
      const depth = window.location.pathname.split("/").filter(Boolean).length;
      return "../".repeat(Math.max(0, depth - 1)) + "pages/components/";
    })();

Promise.all([
  loadComponent("header", componentBase + "header.html"),
  loadComponent("footer", componentBase + "footer.html"),
]).then(() => {
  document.dispatchEvent(new Event("componentsLoaded"));
});

// ===============================
// MAIN APP (SAFE INIT)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // FEEDBACK BUTTON (SAFE)
  // ===============================
  const feedbackBtn = document.querySelector(".js-feedback-btn");

  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", () => {
      const options = document.querySelectorAll(".js-feedback-option:checked");

      let message = "OjaHub Feedback:%0A";

      options.forEach((option) => {
        message += "- " + option.value + "%0A";
      });

      if (options.length === 0) {
        message += "No option selected";
      }

      const phone = "2348165410790";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
    });
  }

  // ===== HERO SECTION — IMAGE CAROUSEL =====
  (function () {
    const track = document.getElementById("carouselTrack");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".carousel-slide"));
    const dots = Array.from(document.querySelectorAll("#carouselDots .dot"));
    let current = 0;
    let timer = null;
    const INTERVAL = 4000;

    function goTo(index) {
      slides[current].classList.remove("active");
      slides[current].classList.add("exit");
      dots[current].classList.remove("active");

      const prev = current;
      setTimeout(() => {
        slides[prev].classList.remove("exit");
      }, 900);

      current = (index + slides.length) % slides.length;

      slides[current].classList.add("active");
      dots[current].classList.add("active");
    }

    function next() {
      goTo(current + 1);
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, INTERVAL);
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.getAttribute("data-index"), 10);
        if (idx === current) return;
        goTo(idx);
        startAuto();
      });
    });

    const wrapper = document.querySelector(".carousel-wrapper");
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => clearInterval(timer));
      wrapper.addEventListener("mouseleave", startAuto);
    }

    let touchStartX = 0;
    if (wrapper) {
      wrapper.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].clientX;
        },
        { passive: true },
      );

      wrapper.addEventListener(
        "touchend",
        (e) => {
          const diff = touchStartX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            diff > 0 ? goTo(current + 1) : goTo(current - 1);
            startAuto();
          }
        },
        { passive: true },
      );
    }

    startAuto();
  })();
  // ===== END HERO SECTION JS =====

  // ===============================
  // CATEGORY + SEARCH FILTER
  // ===============================
  const categoryButtons = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("searchInput");

  let currentCategory = "all";

  function getCards() {
    return document.querySelectorAll(".vendor-card");
  }

  function applyFilters() {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.category === currentCategory) {
        btn.classList.add("active");
      }
    });

    getCards().forEach((card) => {
      const cardCategory = card.dataset.category.toLowerCase();
      const cardName = card.dataset.name.toLowerCase();
      const cardLocation = card.dataset.location.toLowerCase();
      const cardDesc = card.dataset.desc.toLowerCase();

      const matchesCategory =
        currentCategory === "all" || currentCategory === cardCategory;

      const matchesSearch =
        cardName.includes(searchTerm) ||
        cardLocation.includes(searchTerm) ||
        cardDesc.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // CATEGORY BUTTON CLICK
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentCategory = button.dataset.category;
      localStorage.setItem("selectedCategory", currentCategory);
      applyFilters();
    });
  });

  // SEARCH INPUT
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFilters();
    });
  }

  // AUTO LOAD CATEGORY
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");
  currentCategory =
    categoryFromURL || localStorage.getItem("selectedCategory") || "all";
  applyFilters();

  // ===============================
  // FULL PAGE DETAIL VIEW
  // ===============================
  const vendorList = document.getElementById("vendorList");
  const vendorDetail = document.getElementById("vendorDetail");

  const detailImg = document.getElementById("detailImg");
  const detailName = document.getElementById("detailName");
  const detailDesc = document.getElementById("detailDesc");
  const detailLocation = document.getElementById("detailLocation");
  const detailWhatsapp = document.getElementById("detailWhatsapp");
  const detailTag = document.getElementById("detailTag");

  const backBtn = document.getElementById("backBtn");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;

    const card = btn.closest(".vendor-card");
    if (!card) return;

    const name = card.dataset.name || "Business Name";
    const desc = card.dataset.desc || "No description available.";
    const location = card.dataset.location || "Location not available";
    const image =
      card.querySelector("img")?.src || "https://via.placeholder.com/800x500";
    const tag = card.querySelector(".tag")?.textContent || "Vendor";

    detailImg.src = image;
    detailName.textContent = name;
    detailDesc.textContent = desc;
    detailLocation.textContent = "📍 " + location;
    detailTag.textContent = tag;
    detailWhatsapp.href = "https://wa.me/2348165410790";

    vendorList.classList.add("hidden");
    vendorDetail.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===============================
  // BACK BUTTON
  // ===============================
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      vendorDetail.classList.add("hidden");
      vendorList.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// ===============================
// NAVBAR
// ===============================
function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("navOverlay");

  if (!hamburger || !mobileMenu || !overlay) return;

  function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("visible");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("visible");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  document
    .querySelectorAll(".mobile-nav-links .nav-link")
    .forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ===============================
// SET NAV + FOOTER LINKS AFTER COMPONENTS LOAD
// ===============================
document.addEventListener("componentsLoaded", () => {
  initNavbar();

  const r =
    window.location.hostname !== "127.0.0.1" &&
    window.location.hostname !== "localhost"
      ? "/ojahub_v2"
      : "";

  const links = {
    "nav-home": r + "/index.html",
    "nav-home2": r + "/index.html",
    "nav-market": r + "/marketplace.html",
    "nav-cat": r + "/categories.html",
    "nav-browse": r + "/marketplace.html",
    "nav-signup": r + "/pages/signup/signup.html",
    "mob-home": r + "/index.html",
    "mob-market": r + "/marketplace.html",
    "mob-cat": r + "/categories.html",
    "mob-browse": r + "/marketplace.html",
    "mob-signup": r + "/pages/signup/signup.html",
    "f-about": r + "/about.html",
    "f-how": r + "/how-it-works.html",
    "f-contact": r + "/contact.html",
    "f-market": r + "/marketplace.html",
    "f-cat": r + "/categories.html",
    "f-safe": r + "/buying-safe.html",
    "f-faq": r + "/faqs.html",
    "f-signup": r + "/pages/signup/signup.html",
    "f-guide": r + "/vendor-guidelines.html",
    "f-support": r + "/vendor-support.html",
    "f-help": r + "/help-center.html",
    "f-terms": r + "/terms.html",
    "f-privacy": r + "/privacy.html",
  };

  Object.entries(links).forEach(([id, href]) => {
    const el = document.getElementById(id);
    if (el) el.href = href;
  });
});
