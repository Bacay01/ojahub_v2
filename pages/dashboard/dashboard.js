import { auth, db } from "../../js/firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 GET ELEMENTS
const vendorEmail = document.getElementById("vendorEmail");
const logoutBtn = document.getElementById("logoutBtn");

const businessName = document.getElementById("businessName");
const businessNameCard = document.getElementById("businessNameCard");
const category = document.getElementById("category");
const city = document.getElementById("city");
const whatsappLink = document.getElementById("whatsappLink");

const ownerName = document.getElementById("ownerName");
const phone = document.getElementById("phone");
const state = document.getElementById("state");
const address = document.getElementById("address");
const subCategory = document.getElementById("subCategory");
const description = document.getElementById("description");

const vendorImage = document.getElementById("vendorImage");

// 🔥 AUTH STATE
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  console.log("User UID:", user.uid);

  // ✅ SHOW EMAIL
  vendorEmail.textContent = user.email;

  try {
    const docRef = doc(db, "vendors", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Vendor Data:", data);

      // 🔥 UPDATE UI
      businessName.textContent = data.businessName || "N/A";
      businessNameCard.textContent = data.businessName || "N/A";
      category.textContent = data.category || "N/A";
      city.textContent = data.city || "N/A";

      ownerName.textContent = data.ownerName || "N/A";
      phone.textContent = data.phone || "N/A";
      state.textContent = data.state || "N/A";
      address.textContent = data.address || "N/A";
      subCategory.textContent = data.subCategory || "N/A";
      description.textContent = data.description || "No description yet.";

      // 🔥 WHATSAPP
      if (data.whatsapp) {
        whatsappLink.textContent = data.whatsapp;
        whatsappLink.href = `https://wa.me/${data.whatsapp}`;
        whatsappLink.target = "_blank";
      } else {
        whatsappLink.textContent = "N/A";
        whatsappLink.removeAttribute("href");
      }

      // 🔥 IMAGE (WITH FALLBACK)
      if (vendorImage) {
        if (data.imageUrl) {
          vendorImage.src = data.imageUrl;
        } else {
          vendorImage.src = `https://ui-avatars.com/api/?name=${data.businessName}`;
        }
      }

    } else {
      console.log("No document found for this user");
    }

  } catch (error) {
    console.error("Error loading vendor data:", error);
  }
});

// 🔥 LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "../login/login.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  });
}