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


// 🔥 AUTH CHECK
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  // 🔥 SHOW EMAIL
  vendorEmail.textContent = user.email;

  try {

    const docRef = doc(db, "vendors", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      console.log("Vendor Data:", data);

      // 🔥 BASIC INFO
      businessName.textContent = data.businessName || "N/A";
      businessNameCard.textContent = data.businessName || "N/A";
      category.textContent = data.category || "N/A";
      city.textContent = data.city || "N/A";

      // 🔥 DETAILS
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

      // 🔥 IMAGE FIX
      if (vendorImage) {

  vendorImage.removeAttribute("src");

  const img =
    data.imageUrl ||
    data.logoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.businessName || "OjaHub")}`;

  setTimeout(() => {
    vendorImage.src = img + "?v=" + Date.now();
  }, 100);

}

    } else {

      console.log("No vendor document found");

      if (vendorImage) {
        vendorImage.src = `https://ui-avatars.com/api/?name=OjaHub&background=1a5cff&color=fff`;
      }

    }

  } catch (error) {
    console.error("Dashboard Error:", error);
  }

});


// 🔥 LOGOUT
if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {
      await signOut(auth);
      window.location.href = "../login/login.html";

    } catch (error) {
      console.error("Logout Error:", error);
    }

  });

}