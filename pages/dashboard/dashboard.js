import { auth, db } from "../../js/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 ELEMENTS
const vendorEmail = document.getElementById("vendorEmail");
const logoutBtn = document.getElementById("logoutBtn");

const businessName = document.getElementById("businessName");
const businessNameCard = document.getElementById("businessNameCard");

const ownerName = document.getElementById("ownerName");
const category = document.getElementById("category");
const city = document.getElementById("city");
const phone = document.getElementById("phone");
const state = document.getElementById("state");
const address = document.getElementById("address");
const subCategory = document.getElementById("subCategory");
const description = document.getElementById("description");

const whatsappLink = document.getElementById("whatsappLink");
const vendorImage = document.getElementById("vendorImage");

// 🔥 AUTH CHECK
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  try {
    // Email
    if (vendorEmail) {
      vendorEmail.textContent = user.email;
    }

    // Fetch vendor profile
    const docRef = doc(db, "vendors", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Vendor profile not found");
      return;
    }

    const data = docSnap.data();

    // 🔥 BASIC INFO
    if (businessName) {
      businessName.textContent =
        data.businessName || "N/A";
    }

    if (businessNameCard) {
      businessNameCard.textContent =
        data.businessName || "N/A";
    }

    if (ownerName) {
      ownerName.textContent =
        data.ownerName || "N/A";
    }

    if (category) {
      category.textContent =
        data.category || "N/A";
    }

    if (city) {
      city.textContent =
        data.city || "N/A";
    }

    if (phone) {
      phone.textContent =
        data.phone || "N/A";
    }

    if (state) {
      state.textContent =
        data.state || "N/A";
    }

    if (address) {
      address.textContent =
        data.address || "N/A";
    }

    if (subCategory) {
      subCategory.textContent =
        data.subCategory || "N/A";
    }

    if (description) {
      description.textContent =
        data.description ||
        "No description yet.";
    }

    // 🔥 WhatsApp
    if (whatsappLink) {
      if (data.whatsapp) {
        whatsappLink.href = data.whatsapp;
        whatsappLink.target = "_blank";
        whatsappLink.textContent =
          "Chat on WhatsApp";
      } else {
        whatsappLink.removeAttribute("href");
        whatsappLink.textContent =
          "No WhatsApp";
      }
    }

    // 🔥 Vendor Image
    if (vendorImage) {
      vendorImage.src =
        data.imageUrl ||
        "https://via.placeholder.com/300x300?text=OjaHub";
    }

  } catch (error) {
    console.error("Dashboard Error:", error);
    alert("Failed to load dashboard");
  }
});

// 🔥 LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href =
        "../login/login.html";
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  });
}