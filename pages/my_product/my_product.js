import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
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

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 GET CURRENT USER
const currentUser = JSON.parse(localStorage.getItem("currentuser"));

if (!currentUser) {
  console.log("No user found");
}
// 🔥 LOAD PRODUCTS
async function loadMyProducts() {
  const container = document.getElementById("productsContainer");

  if (!currentUser) {
    container.innerHTML = "<p>Please login first</p>";
    return;
  }

  const snapshot = await getDocs(collection(db, "products"));

  let html = "";

  snapshot.forEach((doc) => {
  const data = doc.data();

  // 🔥 ADD THESE LINES HERE
  console.log("PRODUCT:", data);
  console.log("USER:", currentUser);

  console.log("Checking:", data.vendorName, currentUser.businessName);

  if (
  !data.vendorName || 
  data.vendorName.trim().toLowerCase() ===
  (currentUser.businessName || "").trim().toLowerCase()
) {
      html += `
  <div class="product-card">
    <img src="${data.imageUrl || ""}" />

    <div class="product-content">
      <h4>${data.name || ""}</h4>
      <p class="price">₦${data.price || ""}</p>
      <p>${data.description || ""}</p>

      <div class="actions">
        <button class="delete-btn" onclick="deleteProduct('${doc.id}')">
          Delete
        </button>
      </div>
    </div>
  </div>
`;
    }
  });

  container.innerHTML = html || "<p>No products found</p>";
}

// LOAD
loadMyProducts();


window.deleteProduct = async function (id) {
  const confirmDelete = confirm("Delete this product?");

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "products", id));

    alert("Deleted successfully");

    loadMyProducts(); // reload products
  } catch (error) {
    console.error(error);
    alert("Error deleting product");
  }
};


window.goBack = function () {
  window.location.href = "pages/dashboard/dashboard.html";
};