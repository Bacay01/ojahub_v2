// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAZRPoc-FkbdQ8ZNSkGIYFukU1TG-FJF6s",
  authDomain: "ojahub-c10d9.firebaseapp.com",
  projectId: "ojahub-c10d9",
  storageBucket: "ojahub-c10d9.firebasestorage.app",
  messagingSenderId: "896902243220",
  appId: "1:896902243220:web:7259724fe7865c281aa581"
};

// 🔥 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 TARGETS
const vendorList = document.getElementById("vendorList");
const detailSection = document.getElementById("vendorDetail");
const backBtn = document.getElementById("backBtn");

const detailImg = document.getElementById("detailImg");
const detailName = document.getElementById("detailName");
const detailDesc = document.getElementById("detailDesc");
const detailLocation = document.getElementById("detailLocation");

// 🔥 LOAD EVERYTHING
async function loadVendors() {
  const vendorSnapshot = await getDocs(collection(db, "vendors"));
  const productSnapshot = await getDocs(collection(db, "products"));

  const products = [];

  productSnapshot.forEach((doc) => {
    products.push(doc.data());
  });

  let html = '<div class="vendor-grid">';

  vendorSnapshot.forEach((doc) => {
    const data = doc.data();

    const vendorProducts = products.filter(
      (p) => (p.vendorName || "").trim().toLowerCase() === (data.businessName || "").trim().toLowerCase()
    );

    html += `
      <div class="vendor-card"
        data-category="${(data.category || "").toLowerCase()}"
        data-name="${data.businessName || ""}"
        data-desc="${data.description || ""}"
        data-location="${data.city || ""}"
        data-image="${data.imageUrl || ""}"
        data-whatsapp="${data.whatsapp || ""}"
        data-products='${JSON.stringify(vendorProducts)}'
      >
        <img src="${data.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}" alt="${data.businessName || "Vendor"}" />

        <div class="card-content">
          <span class="card-content-tag">${data.category || "Vendor"}</span>

          <h3>${data.businessName || "No Name"}</h3>

          <p class="tagline">${data.description || "No description"}</p>

          <p class="location">📍 ${data.city || ""}</p>

          <button class="view-btn" type="button">View Details</button>
        </div>
      </div>
    `;
  });

  html += "</div>";
  vendorList.innerHTML = html;

  attachViewDetails();
}

loadVendors();

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

      // 🔥 FIX NIGERIAN NUMBER
      if (phone.startsWith("0")) {
        phone = "234" + phone.substring(1);
      }

      detailImg.src = card.dataset.image || "https://via.placeholder.com/400x300?text=No+Image";
      detailName.textContent = vendorName;
      detailLocation.textContent = "📍 " + (card.dataset.location || "");

      detailDesc.innerHTML = `<p>${card.dataset.desc || "No description"}</p>`;

      const products = JSON.parse(card.dataset.products || "[]");

      let productHTML = "<h3 style='margin-top:20px;'>Products</h3>";

      if (products.length === 0) {
        productHTML += "<p>No products yet</p>";
      } else {
        productHTML += `<div class="product-grid">`;

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
              <img src="${p.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}" alt="${p.name || "Product"}" />

              <h4>${p.name || "No Name"}</h4>
              <p>₦${p.price || "0"}</p>

              ${
                phone
                  ? `<a href="${link}" target="_blank" class="chat-btn">Chat on WhatsApp</a>`
                  : `<button type="button" class="chat-btn disabled">No WhatsApp</button>`
              }
            </div>
          `;
        });

        productHTML += "</div>";
      }

      detailDesc.innerHTML += productHTML;

      vendorList.style.display = "none";
      detailSection.classList.remove("hidden");
    });
  });
}

// 🔥 BACK BUTTON
if (backBtn) {
  backBtn.addEventListener("click", () => {
    detailSection.classList.add("hidden");
    vendorList.style.display = "block";
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

// 🔥 CATEGORY BUTTONS
const buttons = document.querySelectorAll(".category-btn");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = (btn.dataset.category || "all").toLowerCase();
    filterVendors(category);
  });
});