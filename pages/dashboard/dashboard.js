import { auth, db } from "../../js/firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

onAuthStateChanged(auth, async function(user){
  if(user){
    vendorEmail.textContent = user.email;

    const docRef = doc(db, "vendors", user.uid);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const data = docSnap.data();

      businessName.textContent = data.businessName || "N/A";
      businessNameCard.textContent = data.businessName || "N/A";
      category.textContent = data.category || "N/A";
      city.textContent = data.city || "N/A";
      ownerName.textContent = data.ownerName || "N/A";
      phone.textContent = data.phone || "N/A";
      state.textContent = data.state || "N/A";
      address.textContent = data.address || "N/A";
      subCategory.textContent = data.subCategory || "N/A";
      description.textContent = data.description || "No description yet.";

      if(data.whatsappLink){
        whatsappLink.textContent = "Chat on WhatsApp";
        whatsappLink.href = data.whatsappLink;
      }else{
        whatsappLink.textContent = "N/A";
        whatsappLink.removeAttribute("href");
      }
    }
  }else{
    window.location.href = "../login/login.html";
  }
});

logoutBtn.addEventListener("click", async function(){
  try{
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "../login/login.html";
  }catch(error){
    alert("Logout failed");
  }
});