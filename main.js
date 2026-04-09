// Load header and footer

// components/main.js
async function loadComponent(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const html = await response.text();

    const targetElement = document.getElementById(elementId);
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const component = temp.firstElementChild;
    targetElement.parentNode.replaceChild(component, targetElement);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

loadComponent("header", "pages/components/header.html");
loadComponent("footer", "pages/components/footer.html");

// Load header and footer stops here

document.querySelector(".js-feedback-btn").addEventListener("click", () => {
  const options = document.querySelectorAll(".js-feedback-option:checked");

  let message = "OjaHub Feedback:%0A";

  options.forEach((option) => {
    message += "- " + option.value + "%0A";
  });

  if (options.length === 0) {
    message += "No option selected";
  }

  const phone = "2348165410790";
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
});

// MARKETPLACE SECTION

/* ===== VENDOR DATA ===== */
/* Each vendor object holds all the info needed for both card and detail panel */
const vendors = [
  {
    id: 1,
    name: "TIJ Laundry",
    category: "Services",
    subcat: "Laundry",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=80&q=80",
    description:
      "Reliable laundry service for clean, fresh, and well-ironed clothing. We pick up and deliver with care.",
    verified: true,
    whatsapp: "2348012345678",
    price: "Price on request",
  },
  {
    id: 2,
    name: "Achievers Business Services",
    category: "Services",
    subcat: "Business Support",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=80",
    description:
      "Professional business support services including documentation, printing, and advisory for startups and SMEs.",
    verified: true,
    whatsapp: "2348023456789",
    price: "Price on request",
  },
  {
    id: 3,
    name: "Pinexa Labs",
    category: "Services",
    subcat: "Web & Digital Systems",
    location: "Under G, Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=80&q=80",
    description:
      "Web design, app development, and digital systems for individuals and organizations in Ogbomosho and beyond.",
    verified: true,
    whatsapp: "2348034567890",
    price: "From ₦30,000",
  },
  {
    id: 4,
    name: "SK Electrical Work",
    category: "Services",
    subcat: "Electrical / Solar",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80",
    description:
      "Trusted electrical installation, repairs, and solar panel setup. Serving homes and businesses in Ogbomosho.",
    verified: false,
    whatsapp: "2348045678901",
    price: "Price on request",
  },
  {
    id: 5,
    name: "Midefix I-repair",
    category: "Services",
    subcat: "Repair / Service",
    location: "Under-G Road, Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=80&q=80",
    description:
      "Fast and affordable smartphone and gadget repairs. Screen replacement, battery swaps, and more.",
    verified: true,
    whatsapp: "2348056789012",
    price: "From ₦2,000",
  },
  {
    id: 6,
    name: "Mild Interiors",
    category: "Services",
    subcat: "Interior Design & Electrical",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=80",
    description:
      "Interior design and electrical installation services. We transform spaces with style and functionality.",
    verified: false,
    whatsapp: "2348067890123",
    price: "Price on request",
  },
  {
    id: 7,
    name: "May'rie Gift & Print World",
    category: "Others",
    subcat: "Gifts & Printing",
    location: "Ibadan / Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=80&q=80",
    description:
      "Custom gifts, branded merchandise, and quality print solutions for every occasion and budget.",
    verified: true,
    whatsapp: "2348078901234",
    price: "From ₦1,500",
  },
  {
    id: 8,
    name: "EASYCREATIVITY EXPRESS LAUNDRY",
    category: "Services",
    subcat: "Laundry Service",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=80&q=80",
    description:
      "Express laundry and dry cleaning service for busy individuals. Same-day and next-day delivery available.",
    verified: false,
    whatsapp: "2348089012345",
    price: "From ₦500",
  },
  {
    id: 9,
    name: "Sweetcrumbles",
    category: "Food",
    subcat: "Bakery & Pastry",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80",
    description:
      "Delicious custom cakes, pastries, and small chops for events, birthdays, and everyday celebrations.",
    verified: true,
    whatsapp: "2348090123456",
    price: "From ₦3,500",
  },
  {
    id: 10,
    name: "Fash by Temi",
    category: "Fashion",
    subcat: "Clothing & Styling",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=80&q=80",
    description:
      "Trendy Ankara and casual outfits made to order. Stylish, affordable, and tailored for the modern woman.",
    verified: true,
    whatsapp: "2348011223344",
    price: "From ₦8,000",
  },
  {
    id: 11,
    name: "GlowUp Beauty Studio",
    category: "Beauty",
    subcat: "Hair & Makeup",
    location: "Ibadan",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&q=80",
    description:
      "Professional makeup, hair styling, and beauty treatments for weddings, events, and everyday glam.",
    verified: true,
    whatsapp: "2348022334455",
    price: "From ₦5,000",
  },
  {
    id: 12,
    name: "PhoneZone Gadgets",
    category: "Phones",
    subcat: "Phones & Accessories",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=80&q=80",
    description:
      "New and Tokunbo smartphones, accessories, and gadgets at the best prices in Ogbomosho.",
    verified: false,
    whatsapp: "2348033445566",
    price: "From ₦45,000",
  },
  {
    id: 13,
    name: "Nourish Kitchen",
    category: "Food",
    subcat: "Home Cooking / Catering",
    location: "Ogbomosho",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&q=80",
    description:
      "Freshly prepared local and continental dishes, meal preps, and catering services for events of all sizes.",
    verified: true,
    whatsapp: "2348044556677",
    price: "From ₦1,200",
  },
  {
    id: 14,
    name: "Nio_surprise",
    category: "Others",
    subcat: "Handmade Crafts",
    location: "Ogbomosho / Ibadan",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&q=80",
    description:
      "Unique handmade crafts, gift items, and custom decorative pieces. Perfect for gifts and home décor.",
    verified: false,
    whatsapp: "2348055667788",
    price: "Price on request",
  },
  {
    id: 15,
    name: "Bellaura Crafts",
    category: "Others",
    subcat: "Crafts & Accessories",
    location: "Ibadan",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&q=80",
    description:
      "Handcrafted accessories, jewellery, and custom fashion items made with love and creativity.",
    verified: true,
    whatsapp: "2348066778899",
    price: "From ₦2,500",
  },
];

/* ===== STATE ===== */
let activeCategory = "All";
let activeVendorId = vendors[0].id;
let searchQuery = "";

/* ===== FILTER VENDORS ===== */
function getFilteredVendors() {
  return vendors.filter((v) => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery) ||
      v.category.toLowerCase().includes(searchQuery) ||
      v.location.toLowerCase().includes(searchQuery) ||
      v.subcat.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
}

/* ===== GROUP BY CATEGORY ===== */
function groupByCategory(list) {
  const groups = {};
  list.forEach((v) => {
    if (!groups[v.category]) groups[v.category] = [];
    groups[v.category].push(v);
  });
  return groups;
}

/* ===== RENDER VENDOR CARD ===== */
function renderCard(v) {
  const isActive = v.id === activeVendorId;
  return `
      <div class="vendor-card${isActive ? " active" : ""}" data-id="${v.id}" onclick="selectVendor(${v.id})">
        <div class="card-img-wrap">
          <img src="${v.image}" alt="${v.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <div class="card-avatar">
              <img src="${v.avatar}" alt="${v.name}" loading="lazy" />
            </div>
            <div class="card-info">
              <div class="card-name">${v.name}</div>
              <div class="card-meta">${v.category} · ${v.subcat}</div>
            </div>
          </div>
          <div class="card-location">📍 ${v.location}</div>
          <div class="card-badges">
            <span class="badge-whatsapp">✓ Replies on WhatsApp</span>
            <span class="badge-price">${v.price}</span>
          </div>
          <button class="btn-view" onclick="event.stopPropagation(); selectVendor(${v.id})">View Details</button>
        </div>
      </div>
    `;
}

/* ===== RENDER VENDOR LIST (left panel) ===== */
function renderVendors() {
  const panel = document.getElementById("vendorsPanel");
  const list = getFilteredVendors();

  if (list.length === 0) {
    panel.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No vendors found</div>
          <div class="empty-state-sub">Try a different search or category</div>
        </div>`;
    return;
  }

  /* If a category filter is active, don't group — just show all in one grid */
  if (activeCategory !== "All") {
    panel.innerHTML = `
        <div class="category-section">
          <div class="category-section-title">
            ${activeCategory} <span class="count">${list.length}</span>
          </div>
          <div class="vendor-grid">${list.map(renderCard).join("")}</div>
        </div>`;
  } else {
    /* Group by category when showing all */
    const groups = groupByCategory(list);
    panel.innerHTML =
      Object.entries(groups)
        .map(
          ([cat, items]) => `
        <div class="category-section">
          <div class="category-section-title">
            ${cat === "Services" ? "Services & Repairs" : cat} <span class="count">${items.length}</span>
          </div>
          <div class="vendor-grid">${items.map(renderCard).join("")}</div>
        </div>
      `,
        )
        .join("") +
      `
        <div id="ctaBannerInline">
          <div class="cta-banner">
            <div class="cta-banner-text">
              <strong>Support local businesses</strong>
              <span>Find trusted vendors in Ogbomosho and Ibadan</span>
            </div>
            <button class="btn-cta-browse">Browse Categories ▾</button>
          </div>
        </div>`;
  }
}

/* ===== RENDER DETAIL PANEL (right panel) ===== */
function renderDetail(vendor) {
  const panel = document.getElementById("detailPanel");
  if (!vendor) {
    panel.innerHTML = `<div class="empty-state" style="padding:3rem 1.5rem;"><div class="empty-state-title">Select a vendor to see details</div></div>`;
    return;
  }
  panel.innerHTML = `
      <div class="detail-img-wrap">
        <img src="${vendor.image}" alt="${vendor.name}" />
      </div>
      <div class="detail-body">
        <div class="detail-category-label">${vendor.category}</div>
        <div class="detail-name">${vendor.name}</div>
        <div class="detail-tags-row">
          ${vendor.verified ? `<span class="badge-verified">✓ Verified</span>` : ""}
          <span class="badge-location">📍 ${vendor.location}</span>
        </div>
        <div class="detail-info-row">
          <div class="detail-info-item">
            <span>🏷</span>
            <span>${vendor.category} · ${vendor.subcat}</span>
          </div>
          <div class="detail-info-item">
            <span>📍</span>
            <span>Location: ${vendor.location}</span>
          </div>
          <div class="detail-info-item">
            <span>💰</span>
            <span>${vendor.price}</span>
          </div>
        </div>
        <p class="detail-description">${vendor.description}</p>
        <div class="detail-tags-row" style="margin-bottom:18px;">
          <span class="badge-whatsapp" style="font-size:12px; padding:4px 12px;">✓ Replies on WhatsApp</span>
        </div>
        <button class="btn-whatsapp" onclick="openWhatsApp('${vendor.whatsapp}', '${vendor.name}')">
          <span class="whatsapp-dot"></span>
          Chat on WhatsApp
        </button>
      </div>
    `;
}

/* ===== SELECT VENDOR ===== */
function selectVendor(id) {
  activeVendorId = id;
  const vendor = vendors.find((v) => v.id === id);
  /* Re-render list to update active card state */
  renderVendors();
  renderDetail(vendor);
  /* On mobile, scroll detail panel into view */
  if (window.innerWidth <= 900) {
    document
      .getElementById("detailPanel")
      .scrollIntoView({ behavior: "smooth" });
  }
}

/* ===== OPEN WHATSAPP ===== */
function openWhatsApp(number, name) {
  const msg = encodeURIComponent(
    `Hi! I found your business "${name}" on OjaHub. I'd like to inquire.`,
  );
  window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
}

/* ===== FILTER PILLS ===== */
document.getElementById("filterBar").addEventListener("click", function (e) {
  if (!e.target.matches(".filter-pill")) return;
  activeCategory = e.target.dataset.cat;
  document
    .querySelectorAll(".filter-pill")
    .forEach((p) => p.classList.remove("active"));
  e.target.classList.add("active");
  renderVendors();
});

/* ===== SEARCH ===== */
document.getElementById("searchInput").addEventListener("input", function (e) {
  searchQuery = e.target.value.trim().toLowerCase();
  renderVendors();
});

/* ===== INITIAL RENDER ===== */
renderVendors();
renderDetail(vendors[0]);
