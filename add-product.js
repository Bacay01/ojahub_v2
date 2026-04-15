// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

// 🔥 SELECT ELEMENTS
const form = document.getElementById("productForm");
const loading = document.getElementById("loading");
const preview = document.getElementById("preview");

// 🔥 IMAGE PREVIEW
document.getElementById("image").addEventListener("change", (e) => {
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

  try {
    // 🔥 GET FORM VALUES
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const desc = document.getElementById("desc").value;
    const category = document.getElementById("category").value;
    const file = document.getElementById("image").files[0];

    // 🚨 VALIDATION
    if (!file) {
      alert("Please select an image");
      return;
    }

    // 🔥 CLOUDINARY UPLOAD
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ojahub_upload"); // 🔥 your preset

    const cloudName = "ds3zdc11c"; // 🔥 your cloud name

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    console.log("Cloudinary response:", data);

    // 🚨 CHECK UPLOAD SUCCESS
    if (!data.secure_url) {
      throw new Error("Image upload failed");
    }

    const imageUrl = data.secure_url;
    const vendorName = localStorage.getItem("vendorName");

await addDoc(collection(db, "products"), {
  name: name,
  price: Number(price),
  description: desc,
  category: category,
  imageUrl: imageUrl,
  vendorName: vendorName,
  createdAt: new Date()
});

    console.log("Saved to Firestore ✅");

    // ✅ SUCCESS UI
    loading.innerText = "";
    alert("Product uploaded successfully 🚀");

    form.reset();
    preview.style.display = "none";

  } catch (error) {
    console.error("Error:", error);
    loading.innerText = "";
    alert("Upload failed ❌");
  }
});