// ─────────────────────────────────────────────
// FIREBASE IMPORTS
// ─────────────────────────────────────────────
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZRPoc-FkbdQ8ZNSkGIYFukU1TG-FJF6s",
  authDomain: "ojahub-c10d9.firebaseapp.com",
  projectId: "ojahub-c10d9",
  storageBucket: "ojahub-c10d9.firebasestorage.app",
  messagingSenderId: "896902243220",
  appId: "1:896902243220:web:7259724fe7865c281aa581",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────────
// READ PRODUCT ID FROM URL  ?id=XXXX
// ─────────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  alert("No product ID provided.");
  window.location.href = "pages/my_product/my_product.html";
}

// ─────────────────────────────────────────────
// ELEMENTS
// ─────────────────────────────────────────────
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const statusInput = document.getElementById("status");
const descEditor = document.getElementById("desc");
const descHidden = document.getElementById("descHidden");
const imageInput = document.getElementById("image");
const uploadZone = document.getElementById("uploadZone");
const thumbContainer = document.getElementById("thumbContainer");
const existingStrip = document.getElementById("existingImagesStrip");
const existingThumbs = document.getElementById("existingThumbContainer");
const loadingMsg = document.getElementById("apLoadingMsg");
const saveBtn = document.getElementById("saveBtn");
const saveDraftBtn = document.getElementById("saveDraftBtn");

const previewImg = document.getElementById("previewDisplay");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const previewName = document.getElementById("previewName");
const previewPrice = document.getElementById("previewPrice");
const previewDesc = document.getElementById("previewDesc");
const previewCategory = document.getElementById("previewCategory");
const previewVendor = document.getElementById("previewVendor");
const previewStatus = document.getElementById("previewStatus");

const currentUser = JSON.parse(localStorage.getItem("currentuser")) || {};
if (currentUser.businessName)
  previewVendor.textContent = currentUser.businessName;

// ─────────────────────────────────────────────
// IMAGE STATE
// ─────────────────────────────────────────────
let existingImages = [];
let selectedFiles = [];

// ─────────────────────────────────────────────
// LOAD PRODUCT FROM FIRESTORE
// ─────────────────────────────────────────────
async function loadProduct() {
  try {
    const snap = await getDoc(doc(db, "products", productId));
    if (!snap.exists()) {
      alert("Product not found.");
      goBack();
      return;
    }
    const data = snap.data();

    nameInput.value = data.name || "";
    priceInput.value = data.price || "";
    descEditor.innerHTML = data.description || "";
    descHidden.value = data.description || "";

    if (data.category) categoryInput.value = data.category;
    if (data.status) statusInput.value = data.status;

    existingImages =
      Array.isArray(data.images) && data.images.length
        ? [...data.images]
        : data.imageUrl
          ? [data.imageUrl]
          : [];

    renderExistingThumbs();
    syncPreview();
  } catch (err) {
    console.error("Load error:", err);
    alert("Failed to load product. Please try again.");
  }
}

// ─────────────────────────────────────────────
// RENDER EXISTING IMAGE THUMBNAILS
// ─────────────────────────────────────────────
function renderExistingThumbs() {
  existingThumbs.innerHTML = "";

  if (existingImages.length === 0) {
    existingStrip.style.display = "none";
    previewImg.style.display = "none";
    previewPlaceholder.style.display = "flex";
    return;
  }

  existingStrip.style.display = "block";

  existingImages.forEach(function (url, i) {
    const wrap = document.createElement("div");
    wrap.className = "ap-thumb";

    const img = document.createElement("img");
    img.src = url;
    img.alt = "existing";

    const removeBtn = document.createElement("button");
    removeBtn.className = "ap-thumb-remove";
    removeBtn.innerHTML = "<i class='bi bi-x'></i>";
    removeBtn.title = "Remove this image";
    removeBtn.type = "button";
    removeBtn.onclick = function () {
      existingImages.splice(i, 1);
      renderExistingThumbs();
      syncPreviewImage();
    };

    wrap.appendChild(img);
    wrap.appendChild(removeBtn);
    existingThumbs.appendChild(wrap);
  });

  syncPreviewImage();
}

// ─────────────────────────────────────────────
// RENDER NEW-FILE THUMBNAILS
// ─────────────────────────────────────────────
function renderNewThumbs() {
  thumbContainer.innerHTML = "";

  selectedFiles.forEach(function (f, i) {
    const url = URL.createObjectURL(f);
    const wrap = document.createElement("div");
    wrap.className = "ap-thumb";
    wrap.innerHTML = `<img src="${url}" alt="thumb">
      <button class="ap-thumb-remove" data-i="${i}" title="Remove" type="button">
        <i class="bi bi-x"></i>
      </button>`;
    thumbContainer.appendChild(wrap);
  });

  thumbContainer.querySelectorAll(".ap-thumb-remove").forEach(function (btn) {
    btn.onclick = function () {
      selectedFiles.splice(parseInt(btn.dataset.i), 1);
      renderNewThumbs();
      syncPreviewImage();
    };
  });

  syncPreviewImage();
}

// ─────────────────────────────────────────────
// SYNC PREVIEW IMAGE
// ─────────────────────────────────────────────
function syncPreviewImage() {
  if (existingImages.length > 0) {
    previewImg.src = existingImages[0];
    previewImg.style.display = "block";
    previewPlaceholder.style.display = "none";
  } else if (selectedFiles.length > 0) {
    previewImg.src = URL.createObjectURL(selectedFiles[0]);
    previewImg.style.display = "block";
    previewPlaceholder.style.display = "none";
  } else {
    previewImg.style.display = "none";
    previewPlaceholder.style.display = "flex";
  }
}

// ─────────────────────────────────────────────
// LIVE PREVIEW SYNC
// ─────────────────────────────────────────────
function syncPreview() {
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);
  const cat = categoryInput.value;
  const stat = statusInput.value;
  const desc = descEditor.innerText.trim();

  previewName.textContent = name || "Product Name";
  previewPrice.textContent = isNaN(price)
    ? "₦0.00"
    : "₦" + price.toLocaleString("en-NG", { minimumFractionDigits: 2 });
  previewDesc.textContent =
    desc ||
    "This is a short description of your product. It will appear here for buyers to preview.";

  const opt = categoryInput.options[categoryInput.selectedIndex];
  previewCategory.textContent = opt && opt.value ? opt.text : "--";

  previewStatus.textContent = stat
    ? stat.charAt(0).toUpperCase() + stat.slice(1)
    : "Published";
  previewStatus.className = stat === "draft" ? "badge-draft" : "badge-instock";

  syncPreviewImage();
}

nameInput.addEventListener("input", syncPreview);
priceInput.addEventListener("input", syncPreview);
categoryInput.addEventListener("change", syncPreview);
statusInput.addEventListener("change", syncPreview);
descEditor.addEventListener("input", function () {
  descHidden.value = descEditor.innerText.trim();
  syncPreview();
});

// ─────────────────────────────────────────────
// RICH TEXT TOOLBAR
// ─────────────────────────────────────────────
document.querySelectorAll(".rt-btn[data-cmd]").forEach(function (btn) {
  btn.addEventListener("mousedown", function (e) {
    e.preventDefault();
    document.execCommand(btn.dataset.cmd, false, null);
    descEditor.focus();
    btn.classList.toggle("active", document.queryCommandState(btn.dataset.cmd));
  });
});

document
  .getElementById("rtLinkBtn")
  .addEventListener("mousedown", function (e) {
    e.preventDefault();
    const url = prompt("Enter URL:");
    if (url) document.execCommand("createLink", false, url);
    descEditor.focus();
  });

descEditor.addEventListener("keyup", function () {
  document.querySelectorAll(".rt-btn[data-cmd]").forEach(function (btn) {
    if (
      ["bold", "italic", "underline", "strikeThrough"].includes(btn.dataset.cmd)
    ) {
      btn.classList.toggle(
        "active",
        document.queryCommandState(btn.dataset.cmd),
      );
    }
  });
});

// ─────────────────────────────────────────────
// IMAGE UPLOAD — NEW FILES
// ─────────────────────────────────────────────
imageInput.addEventListener("change", function (e) {
  const remaining = 5 - existingImages.length;
  const newFiles = Array.from(e.target.files).filter(
    (f) => f.size <= 5 * 1024 * 1024,
  );
  selectedFiles = [...selectedFiles, ...newFiles].slice(0, remaining);
  renderNewThumbs();
  imageInput.value = "";
});

uploadZone.addEventListener("dragover", function (e) {
  e.preventDefault();
  uploadZone.classList.add("dragover");
});
uploadZone.addEventListener("dragleave", function () {
  uploadZone.classList.remove("dragover");
});
uploadZone.addEventListener("drop", function (e) {
  e.preventDefault();
  uploadZone.classList.remove("dragover");
  const remaining = 5 - existingImages.length;
  const newFiles = Array.from(e.dataTransfer.files).filter(
    (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024,
  );
  selectedFiles = [...selectedFiles, ...newFiles].slice(0, remaining);
  renderNewThumbs();
});

// ─────────────────────────────────────────────
// CLOUDINARY UPLOAD
// ─────────────────────────────────────────────
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", "ojahub_upload");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/ds3zdc11c/image/upload",
    { method: "POST", body: fd },
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("Image upload failed");
  return data.secure_url;
}

// ─────────────────────────────────────────────
// SAVE HANDLER
// ─────────────────────────────────────────────
async function handleSave(forceDraft = false) {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const desc = descEditor.innerText.trim();
  const category = categoryInput.value;
  const status = forceDraft ? "draft" : statusInput.value;

  if (!name) return alert("Please enter a product name.");
  if (!price) return alert("Please enter a price.");
  if (!category) return alert("Please select a category.");
  if (existingImages.length === 0 && selectedFiles.length === 0)
    return alert("Please keep or add at least one image.");

  // Lock UI
  loadingMsg.textContent = selectedFiles.length
    ? "Uploading images… ⏳"
    : "Saving changes… ⏳";
  saveBtn.disabled = true;
  saveDraftBtn.disabled = true;
  saveBtn.innerHTML = `<span class="ap-spinner"></span> Saving…`;

  try {
    // Upload any new files to Cloudinary first
    const newUrls = [];
    for (const file of selectedFiles) {
      const url = await uploadToCloudinary(file);
      newUrls.push(url);
    }

    const allImages = [...existingImages, ...newUrls];

    // Write to Firestore and WAIT for the server to confirm
    await updateDoc(doc(db, "products", productId), {
      name,
      price: Number(price),
      description: desc,
      category,
      status,
      imageUrl: allImages[0] || "",
      images: allImages,
      updatedAt: new Date(),
    });

    loadingMsg.textContent = "";

    // ── Navigate back with ?updated=1 so my_product.js
    //    knows to skip the cache and force a fresh server fetch ──
    window.location.href = "pages/my_product/my_product.html?updated=1";
  } catch (err) {
    console.error("Save error:", err);
    loadingMsg.textContent = "Something went wrong. Please try again.";
    saveBtn.disabled = false;
    saveDraftBtn.disabled = false;
    saveBtn.innerHTML = `<i class="bi bi-check2-circle"></i> Save Changes`;
  }
}

saveBtn.addEventListener("click", function () {
  handleSave(false);
});
saveDraftBtn.addEventListener("click", function () {
  handleSave(true);
});

// ─────────────────────────────────────────────
// BACK  (cancel — no update flag)
// ─────────────────────────────────────────────
window.goBack = function () {
  window.location.href = "pages/my_product/my_product.html";
};

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
loadProduct();
