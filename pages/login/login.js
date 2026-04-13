import { auth } from "../../js/firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const toggleLoginPassword = document.getElementById("toggleLoginPassword");
const loginPassword = document.getElementById("loginPassword");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

if (toggleLoginPassword && loginPassword) {
  toggleLoginPassword.addEventListener("click", function () {
    const type = loginPassword.getAttribute("type");

    if (type === "password") {
      loginPassword.setAttribute("type", "text");
      toggleLoginPassword.textContent = "🙈";
    } else {
      loginPassword.setAttribute("type", "password");
      toggleLoginPassword.textContent = "👁️";
    }
  });
}

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();

  if (email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
    window.location.href = "../dashboard/dashboard.html";
  } catch (error) {
    alert("Invalid email or password");
  }
});

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();

    if (email === "") {
      alert("Enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      const message = document.getElementById("message");

        message.textContent = "Reset link sent to your email";
        message.style.color = "green";
    } catch (error) {
      alert(error.message);
    }
  });
}