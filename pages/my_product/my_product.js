// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

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
const auth = getAuth(app);

// 🔥 TARGET
const container = document.getElementById("productsContainer");

// 🔥 AUTH CHECK
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  loadProducts(user.uid);
});

// 🔥 LOAD PRODUCTS
async function loadProducts(uid) {
  container.innerHTML = "Loading...";

  try {
    const q = query(collection(db, "products"), where("vendorId", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>No products yet</p>";
      return;
    }

    let html = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      html += `
        <div class="product-card">
          <img src="${data.imageUrl || 'https://via.placeholder.com/400x300'}" />

          <div class="product-content">
            <h3>${data.name || "No Name"}</h3>

            <p class="product-price">₦${data.price || "0"}</p>

            <p class="product-desc">${data.desc || ""}</p>

            <button class="delete-btn" data-id="${docSnap.id}">
              Delete
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // 🔥 DELETE LOGIC
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");

        const confirmDelete = confirm("Delete this product?");
        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "products", id));
          alert("Deleted!");

          loadProducts(auth.currentUser.uid); // reload
        } catch (err) {
          alert("Error deleting product");
          console.error(err);
        }
      });
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "Error loading products";
  }
}