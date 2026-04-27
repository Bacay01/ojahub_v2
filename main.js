// ===============================
// LOAD HEADER & FOOTER (SAFE)
// ===============================
// async function loadComponent(elementId, filePath) {
//   try {
//     const targetElement = document.getElementById(elementId);
//     if (!targetElement) return;

//     const response = await fetch(filePath);
//     if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

//     const html = await response.text();

//     const temp = document.createElement("div");
//     temp.innerHTML = html;

//     const component = temp.firstElementChild;

//     if (component) {
//       targetElement.replaceWith(component);
//     }
//   } catch (error) {
//     console.error(`Error loading ${filePath}:`, error);
//   }
// }

// async function loadComponent(elementId, filePath) {
//   const targetElement = document.getElementById(elementId);
//   if (!targetElement) return;

//   const response = await fetch(filePath);
//   const html = await response.text();

//   targetElement.innerHTML = html;
// }

// loadComponent("header", "/pages/components/header.html");
// loadComponent("footer", "/pages/components/footer.html");

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

// Load components first
Promise.all([
  loadComponent("header", "/pages/components/header.html"),
  loadComponent("footer", "/pages/components/footer.html"),
]).then(() => {
  // Fire event AFTER both are injected
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
    const INTERVAL = 4000; // ms between slides

    function goTo(index) {
      slides[current].classList.remove("active");
      slides[current].classList.add("exit");
      dots[current].classList.remove("active");

      // Clean up exit class after transition
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

    // Dot click
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.getAttribute("data-index"), 10);
        if (idx === current) return;
        goTo(idx);
        startAuto(); // reset timer on manual click
      });
    });

    // Pause on hover
    const wrapper = document.querySelector(".carousel-wrapper");
    if (wrapper) {
      wrapper.addEventListener("mouseenter", () => clearInterval(timer));
      wrapper.addEventListener("mouseleave", startAuto);
    }

    // Touch/swipe support
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

    // Kick off
    startAuto();
  })();
  // ===== END HERO SECTION JS =====

  // ===============================
  // CATEGORY + SEARCH FILTER
  // WITH PERSISTENT ACTIVE CATEGORY
  // ===============================
  const categoryButtons = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("searchInput");

  let currentCategory = "all";

  function getCards() {
    return document.querySelectorAll(".vendor-card");
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();

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

      // SAVE selected category
      localStorage.setItem("selectedCategory", currentCategory);

      applyFilters();
    });
  });

  // SEARCH INPUT
  searchInput.addEventListener("input", () => {
    applyFilters();
  });

  // AUTO LOAD CATEGORY
  window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const categoryFromURL = params.get("category");

    // Priority:
    // 1. URL category
    // 2. localStorage category
    // 3. default "all"
    currentCategory =
      categoryFromURL || localStorage.getItem("selectedCategory") || "all";

    applyFilters();
  });

  // ===============================
  // FULL PAGE DETAIL VIEW (MAIN FEATURE)
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

  // OPEN DETAIL VIEW (EVENT DELEGATION)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;

    const card = btn.closest(".vendor-card");
    if (!card) return;

    // Get values safely
    const name = card.dataset.name || "Business Name";
    const desc = card.dataset.desc || "No description available.";
    const location = card.dataset.location || "Location not available";
    const image =
      card.querySelector("img")?.src || "https://via.placeholder.com/800x500";
    const tag = card.querySelector(".tag")?.textContent || "Vendor";

    // Populate detail page
    detailImg.src = image;
    detailName.textContent = name;
    detailDesc.textContent = desc;
    detailLocation.textContent = "📍 " + location;
    detailTag.textContent = tag;

    // WhatsApp link (replace later with real numbers per vendor)
    detailWhatsapp.href = "https://wa.me/2348165410790";

    // Switch views
    vendorList.classList.add("hidden");
    vendorDetail.classList.remove("hidden");

    // Scroll to top for clean UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===============================
  // BACK BUTTON (RETURN TO LIST)
  // ===============================
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      vendorDetail.classList.add("hidden");
      vendorList.classList.remove("hidden");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
