// ═══════════════════════════════════════════════════════════
// OJAHUB — HOMEPAGE FEATURED VENDORS (live from Firebase)
// ═══════════════════════════════════════════════════════════
// HOW TO USE:
//   1. In index.html, give your vendor grid div this id:
//        <div class="vendor-grid" id="vendorGrid"> ... </div>
//      and DELETE all the hardcoded cards inside it.
//
//   2. Add this script tag at the bottom of index.html
//      (AFTER the existing <script src="main.js"></script>):
//        <script type="module" src="featured-vendors.js"></script>
//
//   3. That's it — 9 random vendors from Firebase will load
//      automatically, styled exactly like your hardcoded cards.
// ═══════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
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

// ── Avatar system (same logic as marketplace.js) ─────────
const AVATAR_PALETTE = [
  ["#FF6D00", "#fff"],
  ["#1565C0", "#fff"],
  ["#2E7D32", "#fff"],
  ["#6A1B9A", "#fff"],
  ["#AD1457", "#fff"],
  ["#00838F", "#fff"],
  ["#E65100", "#fff"],
  ["#283593", "#fff"],
];

function getInitials(name) {
  name = name || "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "OJ";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function nameToColor(name) {
  name = name || "";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function makeAvatarUrl(businessName) {
  businessName = businessName || "";
  var initials = getInitials(businessName);
  var pair = nameToColor(businessName);
  var bg = pair[0],
    fg = pair[1];

  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">' +
    '<rect width="400" height="240" fill="' +
    bg +
    '"/>' +
    '<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">' +
    '<circle cx="2" cy="2" r="1.5" fill="' +
    fg +
    '" fill-opacity="0.08"/>' +
    "</pattern>" +
    '<rect width="400" height="240" fill="url(#dots)"/>' +
    '<text x="200" y="118" font-family="Arial,sans-serif" font-size="80" font-weight="800" fill="' +
    fg +
    '" text-anchor="middle" dominant-baseline="middle" letter-spacing="4">' +
    initials +
    "</text>" +
    '<text x="200" y="218" font-family="Arial,sans-serif" font-size="12" font-weight="600" fill="' +
    fg +
    '" fill-opacity="0.45" text-anchor="middle">OjaHub Marketplace</text>' +
    "</svg>";

  try {
    return "data:image/svg+xml;base64," + btoa(svg);
  } catch (e) {
    return (
      "data:image/svg+xml;base64," +
      btoa(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="' +
          bg +
          '"/></svg>',
      )
    );
  }
}

function getVendorImage(data) {
  return (
    data.imageUrl ||
    data.logoUrl ||
    data.profileImage ||
    makeAvatarUrl(data.businessName || "")
  );
}

// ── Pick N random items from array ───────────────────────
function pickRandom(arr, n) {
  return arr
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, n);
}

// ── Detect base path (works on localhost AND GitHub Pages) ─
function getBasePath() {
  const isGitHub =
    window.location.hostname !== "127.0.0.1" &&
    window.location.hostname !== "localhost";
  return isGitHub ? "/ojahub_v2" : "";
}

// ── Build one card using your exact homepage CSS classes ──
function buildCard(data) {
  const name = data.businessName || "No Name";
  const category = data.category || "Vendor";
  const subCat = data.subCategory ? " · " + data.subCategory : "";
  const city = data.city || "";
  const imgSrc = getVendorImage(data);
  const hasWA = !!(data.whatsapp || "").replace(/\D/g, "");
  const base = getBasePath();

  // "View Details" goes to marketplace.html and auto-opens this vendor
  const detailUrl =
    base + "/marketplace.html?vendor=" + encodeURIComponent(data.id);

  return (
    '<div class="featured-vendors-card anim anim-up">' +
    '<img class="featured-vendors-card-img" src="' +
    imgSrc +
    '" alt="' +
    name +
    '" />' +
    '<div class="featured-vendors-card-body">' +
    '<span class="verified-badge">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">' +
    '<polyline points="20 6 9 17 4 12"/>' +
    "</svg>" +
    " Verified · " +
    city +
    "</span>" +
    '<p class="featured-vendors-card-name">' +
    name +
    "</p>" +
    '<p class="featured-vendors-card-category">' +
    category +
    subCat +
    "</p>" +
    '<p class="featured-vendors-card-location">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>' +
    '<circle cx="12" cy="10" r="3"/>' +
    "</svg>" +
    " " +
    city +
    "</p>" +
    '<div class="featured-vendors-card-tags">' +
    (hasWA
      ? '<span class="tag replies-tag">Replies on WhatsApp</span>'
      : '<span class="tag price-tag">No WhatsApp</span>') +
    '<span class="tag price-tag">Price on request</span>' +
    "</div>" +
    "</div>" +
    '<div class="featured-vendors-card-footer">' +
    '<a href="' +
    detailUrl +
    '" class="btn-veiw-details">' +
    '<i class="fa-regular fa-eye"></i> View Details' +
    "</a>" +
    "</div>" +
    "</div>"
  );
}

// ── Main: fetch vendors, pick 9, render ──────────────────
async function loadFeaturedVendors() {
  const grid = document.getElementById("vendorGrid");
  if (!grid) return;

  // Show skeleton placeholders while loading
  grid.innerHTML = '<div class="featured-vendors-card skeleton"></div>'.repeat(
    9,
  );

  try {
    const snapshot = await getDocs(collection(db, "vendors"));
    const vendors = [];
    snapshot.forEach((d) => vendors.push({ id: d.id, ...d.data() }));

    if (vendors.length === 0) {
      grid.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px 0">No vendors yet.</p>';
      return;
    }

    const featured = pickRandom(vendors, Math.min(9, vendors.length));
    grid.innerHTML = featured.map(buildCard).join("");

    // Re-run the intersection observer from main.js so cards animate in
    const newCards = grid.querySelectorAll(".anim");
    if (newCards.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );
      newCards.forEach((el) => observer.observe(el));
    }
  } catch (err) {
    console.error("loadFeaturedVendors error:", err);
    grid.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:#c00;padding:40px 0">Could not load vendors. Please refresh.</p>';
  }
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", loadFeaturedVendors);
