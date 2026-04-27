// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAZRPoc-FkbdQ8ZNSkGIYFukU1TG-FJF6s",
  authDomain: "ojahub-c10d9.firebaseapp.com",
  projectId: "ojahub-c10d9",
  storageBucket: "ojahub-c10d9.firebasestorage.app",
  messagingSenderId: "896902243220",
  appId: "1:896902243220:web:7259724fe7865c281aa581",
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 TARGETS
let vendorList;
let detailSection;

let detailImg;
let detailName;
let detailDesc;
let detailLocation;

// 🔥 LOAD VENDORS + PRODUCTS
async function loadVendors() {
  try {
    const vendorSnapshot = await getDocs(collection(db, "vendors"));
    const productSnapshot = await getDocs(collection(db, "products"));

    const products = [];

    productSnapshot.forEach((productDoc) => {
      products.push(productDoc.data());
    });

    const vendors = [];

    vendorSnapshot.forEach((vendorDoc) => {
      vendors.push({
        id: vendorDoc.id,
        ...vendorDoc.data(),
      });
    });

    // 🔥 CATEGORY + A-Z
    vendors.sort((a, b) => {
      const catA = (a.category || "").toLowerCase();
      const catB = (b.category || "").toLowerCase();

      if (catA < catB) return -1;
      if (catA > catB) return 1;

      return (a.businessName || "").localeCompare(b.businessName || "");
    });

    let html = "";

    vendors.forEach((data) => {
      const vendorProducts = products.filter((p) => {
        const productVendor = (p.vendorName || "").trim().toLowerCase();

        const businessVendor = (data.businessName || "").trim().toLowerCase();

        return (
          p.vendorId === data.id ||
          productVendor === businessVendor ||
          productVendor.includes(businessVendor) ||
          businessVendor.includes(productVendor)
        );
      });

      html += `
      <div class="vendor-card"
      data-id="${data.id}"
      data-category="${(data.category || "").toLowerCase()}"
      data-name="${data.businessName || ""}"
      data-desc="${data.description || ""}"
      data-location="${data.city || ""}"
      data-image="${data.imageUrl || ""}"
      data-whatsapp="${data.whatsapp || ""}"
      data-products='${JSON.stringify(vendorProducts)}'
      >


          <img
            src="${
              data.imageUrl ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }"
            alt="${data.businessName || "Vendor"}"
          />

          <div class="card-content">

            <span class="card-content-tag">
              ${data.category || "Vendor"}
            </span>

            <h3>${data.businessName || "No Name"}</h3>

            <p class="tagline">
              ${data.description || "No description"}
            </p>

            <p class="location">
              📍 ${data.city || ""}
            </p>

            <button class="view-btn" type="button">
              View Details
            </button>

          </div>

        </div>
      `;
    });

    vendorList.innerHTML = html;

    attachViewDetails();
  } catch (error) {
    console.error(error);
  }
}

// 🔥 VIEW DETAILS
function attachViewDetails() {
  const cards = document.querySelectorAll(".vendor-card");

  cards.forEach((card) => {
    const button = card.querySelector(".view-btn");

    if (!button) return;

    button.addEventListener("click", () => {
      detailDesc.innerHTML = "";

      const vendorName = card.dataset.name || "";

      let phone = (card.dataset.whatsapp || "").replace(/\D/g, "");

      if (phone.startsWith("0")) {
        phone = "234" + phone.substring(1);
      }

      detailImg.src =
        card.dataset.image ||
        "https://via.placeholder.com/400x300?text=No+Image";

      detailName.textContent = vendorName;

      detailLocation.textContent = "📍 " + (card.dataset.location || "");

      detailDesc.innerHTML = `
      <p>${card.dataset.desc || "No description"}</p>

      <a href="../pages/claim_business/claim_business.html?vendorId=${card.dataset.id}"
      class="claim-btn">
      Claim This Business
      </a>
      `;

      const products = JSON.parse(card.dataset.products || "[]");

      let productHTML = "<h3 style='margin-top:20px;'>Products</h3>";

      if (products.length === 0) {
        productHTML += "<p>No products yet</p>";
      } else {
        // 🔥 4 PER ROW GRID
        productHTML += `
          <div class="product-grid">
        `;

        products.forEach((p) => {
          const message = `Hello, I saw this product on OjaHub.

Product: ${p.name || ""}
Price: ₦${p.price || ""}
Description: ${p.description || ""}

Is it still available?`;

          const encoded = encodeURIComponent(message);

          const link = phone ? `https://wa.me/${phone}?text=${encoded}` : "#";

          productHTML += `
            <div class="product-card">

              <img src="${
                p.imageUrl ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }">

              <span class="product-tag">
                ${p.category || "Product"}
              </span>

              <h4>${p.name || "No Name"}</h4>

              <p class="price">
                ₦${p.price || "0"}
              </p>

              <p class="desc">
                ${p.description || "No description"}
              </p>

              ${
                phone
                  ? `<a href="${link}" target="_blank" class="chat-btn">Chat on WhatsApp</a>`
                  : `<button class="chat-btn disabled">No WhatsApp</button>`
              }

            </div>
          `;
        });

        productHTML += `
          </div>
        `;
      }

      detailDesc.innerHTML += productHTML;

      vendorList.style.display = "none";
      detailSection.classList.remove("hidden");
    });
  });
}

// 🔥 FILTER
function filterVendors(category) {
  const cards = document.querySelectorAll(".vendor-card");

  cards.forEach((card) => {
    const cardCategory = card.dataset.category || "";

    if (category === "all" || cardCategory.includes(category)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// 🔥 DOM READY
document.addEventListener("DOMContentLoaded", () => {
  vendorList = document.getElementById("vendorList");

  detailSection = document.getElementById("vendorDetail");

  detailImg = document.getElementById("detailImg");

  detailName = document.getElementById("detailName");

  detailDesc = document.getElementById("detailDesc");

  detailLocation = document.getElementById("detailLocation");

  const backBtn = document.getElementById("backBtn");

  const buttons = document.querySelectorAll(".category-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      const category = (btn.dataset.category || "all").toLowerCase();

      filterVendors(category);
    });
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      detailSection.classList.add("hidden");
      vendorList.style.display = "flex";
    });
  }

  loadVendors();
});
