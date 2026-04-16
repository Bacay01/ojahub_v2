// 🔥 FIREBASE AUTH
import { auth } from "../../js/firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔥 FIRESTORE
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const db = getFirestore();

// 🔥 DOM
const loginForm = document.getElementById("loginForm");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPassword = document.getElementById("loginPassword");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const message = document.getElementById("message");

// 🔥 SHOW / HIDE PASSWORD
if (toggleLoginPassword && loginPassword) {
  toggleLoginPassword.addEventListener("click", () => {
    const type = loginPassword.getAttribute("type");
    loginPassword.setAttribute(
      "type",
      type === "password" ? "text" : "password"
    );
  });
}

// 🔥 LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      showMessage("Please fill all fields", "red");
      return;
    }

    try {
      // 🔥 LOGIN USER
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔥 GET VENDOR DATA FROM FIRESTORE
      const snapshot = await getDocs(collection(db, "vendors"));

      let currentVendor = null;

      snapshot.forEach((doc) => {
        const data = doc.data();

        // MATCH BY EMAIL
        if ((data.email || "").toLowerCase() === user.email.toLowerCase()) {
          currentVendor = data;
        }
      });

      // 🔥 SAVE USER
      if (currentVendor) {
        localStorage.setItem("currentuser", JSON.stringify(currentVendor));
      } else {
        // fallback (if vendor not found)
        localStorage.setItem(
          "currentuser",
          JSON.stringify({
            email: user.email,
            businessName: "Unknown Vendor"
          })
        );
      }

      showMessage("Login successful", "green");

      setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 800);

    } catch (error) {
      console.error(error);
      showMessage("Invalid email or password", "red");
    }
  });
}

// 🔥 FORGOT PASSWORD
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    if (!email) {
      showMessage("Enter your email first", "red");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Reset link sent to your email", "green");
    } catch (error) {
      console.error(error);
      showMessage(error.message, "red");
    }
  });
}

// 🔥 MESSAGE FUNCTION
function showMessage(text, color) {
  if (message) {
    message.textContent = text;
    message.style.color = color;
  }
}