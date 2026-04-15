import { auth } from "../../js/firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPassword = document.getElementById("loginPassword");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const message = document.getElementById("message");

// SHOW / HIDE PASSWORD
if (toggleLoginPassword && loginPassword) {
  toggleLoginPassword.addEventListener("click", function () {
    const type = loginPassword.getAttribute("type");

    if (type === "password") {
      loginPassword.setAttribute("type", "text");
    } else {
      loginPassword.setAttribute("type", "password");
    }
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
      showMessage("Please fill all fields", "red");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
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

// FORGOT PASSWORD
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    if (email === "") {
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

function showMessage(text, color) {
  if (message) {
    message.textContent = text;
    message.style.color = color;
  }
}