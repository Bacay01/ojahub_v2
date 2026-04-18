// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔥 FIREBASE CONFIG
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

// 🔥 ELEMENTS
const form = document.getElementById("productForm");
const loading = document.getElementById("loading");
const preview =
  document.getElementById("preview") ||
  document.getElementById("previewDisplay");

const imageInput = document.getElementById("image");
const submitBtn = form.querySelector("button");

// 🔥 IMAGE PREVIEW
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

// 🔥 FORM SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  loading.innerText = "Uploading... ⏳";
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  try {
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const category = document.getElementById("category").value;
    const file = imageInput.files[0];

    // 🔥 VALIDATION
    if (!file) {
      alert("Please select an image");
      throw new Error("No image selected");
    }

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      throw new Error("User not logged in");
    }

    const currentUser =
      JSON.parse(localStorage.getItem("currentuser")) || {};

    // 🔥 CLOUDINARY UPLOAD
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ojahub_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/ds3zdc11c/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    const imageUrl = data.secure_url;

    // 🔥 SAVE PRODUCT
    await addDoc(collection(db, "products"), {
      name: name,
      price: Number(price),
      description: desc,
      category: category,
      imageUrl: imageUrl,

      vendorId: user.uid,
      vendorName: currentUser.businessName || "",

      createdAt: new Date()
    });

    loading.innerText = "";
    alert("Product uploaded successfully 🚀");

    form.reset();
    preview.style.display = "none";

    setTimeout(() => {
      window.location.href =
        "pages/my_product/my_product.html";
    }, 800);

  } catch (error) {
    console.error(error);
    loading.innerText = "";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Upload Product";
});

// 🔥 BACK
window.goBack = function () {
  window.location.href =
    "pages/dashboard/dashboard.html";
};