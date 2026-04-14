// ===============================
// LOAD HEADER & FOOTER (SAFE)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "../components/header.html");
  loadComponent("footer", "../components/footer.html");
});

// FIREBASE
import { auth, db } from "../../js/firebase.js";

import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let businessName = document.getElementById("businessName").value.trim();
  let ownerName = document.getElementById("ownerName").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let category = document.getElementById("category").value;
  let subCategory = document.getElementById("subCategory").value.trim();
  let description = document.getElementById("description").value.trim();
  let city = document.getElementById("city").value.trim();
  let state = document.getElementById("state").value.trim();
  let address = document.getElementById("address").value.trim();
  let whatsapp = document.getElementById("whatsapp").value.trim();
  let terms = document.getElementById("terms").checked;

  if (
    !businessName ||
    !ownerName ||
    !email ||
    !password ||
    !phone ||
    !category ||
    !subCategory ||
    !description ||
    !city ||
    !state ||
    !address ||
    !whatsapp
  ) {
    alert("Please fill all fields");
    return;
  }

  if (!terms) {
    alert("Please agree to the terms");
    return;
  }

  let formatted = whatsapp.replace(/\s+/g, "");

  if (formatted.startsWith("0")) {
    formatted = "234" + formatted.slice(1);
  }

  let whatsappLink = `https://wa.me/${formatted}?text=${encodeURIComponent("Hello, I saw your business on OjaHub")}`;

  try {
    // 🔐 CREATE USER
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // 💾 SAVE TO FIRESTORE
    await setDoc(doc(db, "vendors", user.uid), {
      uid: user.uid,
      businessName,
      ownerName,
      email,
      phone,
      category,
      subCategory,
      description,
      city,
      state,
      address,
      whatsapp,
      whatsappLink,
      createdAt: new Date().toISOString(),
    });

    alert("Account created successfully 🎉");

    form.reset();
  } catch (error) {
    alert(error.message);
  }
});

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type = passwordInput.getAttribute("type");

  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    togglePassword.textContent = "🙈";
  } else {
    passwordInput.setAttribute("type", "password");
    togglePassword.textContent = "👁️";
  }
});
