import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAZRPoc-FkbdQ8ZNSkGIYFukU1TG-FJF6s",
  authDomain: "ojahub-c10d9.firebaseapp.com",
  projectId: "ojahub-c10d9",
  storageBucket: "ojahub-c10d9.firebasestorage.app",
  messagingSenderId: "896902243220",
  appId: "1:896902243220:web:7259724fe7865c281aa581"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 FULL 20 VENDORS
const vendorsBatch3 = [

{
vendorId: "OJ040",
businessName: "Hair by jummy",
ownerName: "Ayorinde fathia ayobami",
phone: "08168178684",
whatsapp: "https://wa.me/2348168178684",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Pending Review",
area: "Within Pending Review",
description: "Hairstylist/wig vendor",
verified: true
},

{
vendorId: "OJ042",
businessName: "Celebrity chef",
ownerName: "Olushola favour Ayomide",
phone: "08028453984",
whatsapp: "https://wa.me/2348028453984",
category: "Food",
subCategory: "Food(Cooked meal)",
city: "Lagos",
area: "Within Lagos",
description: "We bake cake decoration event planner wedding cake",
verified: true
},

{
vendorId: "OJ043",
businessName: "Shaped body secret",
ownerName: "Suziannah gift",
phone: "9132674734",
whatsapp: "https://wa.me/2349132674734",
category: "Others",
subCategory: "Others",
city: "Ogbomosho",
area: "Within Ogbomosho",
description: "Natural body enhancement products",
verified: true
},

{
vendorId: "OJ044",
businessName: "SK electrical and electronics solar installations",
ownerName: "Afolabi Shakiru Akanmu",
phone: "07069329711",
whatsapp: "https://wa.me/2347069329711",
category: "Services",
subCategory: "Repair/Service",
city: "Ogbomosho",
area: "Within Ogbomosho",
description: "Electrical wiring repairs and solar installation",
verified: true
},

{
vendorId: "OJ046",
businessName: "Immanuel stitches",
ownerName: "Oluwatobi Emmanuel",
phone: "09058797613",
whatsapp: "https://wa.me/2349058797613",
category: "Fashion",
subCategory: "Fashion &Clothing",
city: "Lagos",
area: "Under G",
description: "Elegant luxury fashion brand",
verified: true
},

{
vendorId: "OJ047",
businessName: "Fiyin luxe wigs",
ownerName: "Bodunde fiyinfoluwa Rebecca",
phone: "08132133364",
whatsapp: "https://wa.me/2348132133364",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Pending Review",
area: "Within Pending Review",
description: "Luxury wigs",
verified: true
},

{
vendorId: "OJ048",
businessName: "Cisca’s closet",
ownerName: "Azeez kehinde Francisca",
phone: "07030106832",
whatsapp: "https://wa.me/2347030106832",
category: "Fashion",
subCategory: "Fashion &Clothing",
city: "Ibadan",
area: "Soka",
description: "Men underwear store",
verified: true
},

{
vendorId: "OJ049",
businessName: "Esthy stitches",
ownerName: "Esther Amos",
phone: "09057458964",
whatsapp: "https://wa.me/2349057458964",
category: "Fashion",
subCategory: "Fashion &Clothing",
city: "Ogbomosho",
area: "Within Ogbomosho",
description: "Trendy custom fashion outfits",
verified: true
},

{
vendorId: "OJ050",
businessName: "Kabbs&Co",
ownerName: "Afolabi Kabirat Abolanle",
phone: "08160494801",
whatsapp: "https://wa.me/2348160494801",
category: "Fashion",
subCategory: "Fashion &Clothing",
city: "Pending Review",
area: "Under G",
description: "RTW female brand",
verified: true
},

{
vendorId: "OJ051",
businessName: "JAYSHOTIT 📸",
ownerName: "Atanda Joshua",
phone: "08115864916",
whatsapp: "https://wa.me/2348115864916",
category: "Others",
subCategory: "Others",
city: "Ogbomosho",
area: "Adenike",
description: "Lifestyle photography brand",
verified: true
},

{
vendorId: "OJ052",
businessName: "Matade.shotit",
ownerName: "Adeleke matade matthew",
phone: "7048106631",
whatsapp: "https://wa.me/2347048106631",
category: "Others",
subCategory: "Others",
city: "Ogbomosho",
area: "Adenike",
description: "Mobile videography brand",
verified: true
},

{
vendorId: "OJ053",
businessName: "Dammy Stitches",
ownerName: "Precious Oluwadamilola Dairo",
phone: "09058466752",
whatsapp: "https://wa.me/2349058466752",
category: "Fashion",
subCategory: "Fashion &Clothing",
city: "Ogbomosho",
area: "Under G",
description: "Handmade crochet fashion brand",
verified: true
},

{
vendorId: "OJ054",
businessName: "Slayed by Anjie",
ownerName: "Anjola Ayandele",
phone: "08136329941",
whatsapp: "https://wa.me/2348136329941",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Ogbomosho",
area: "Within Ogbomosho",
description: "Professional makeup artist",
verified: true
},

{
vendorId: "OJ055",
businessName: "Tife scent",
ownerName: "Adebowale Boluwatife Dorcas",
phone: "09120978097",
whatsapp: "https://wa.me/2349120978097",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Ogbomosho",
area: "Under G",
description: "Luxury perfumes",
verified: true
},

{
vendorId: "OJ057",
businessName: "Crafty vibes",
ownerName: "Adebayo Anjolaoluwa",
phone: "08162908940",
whatsapp: "https://wa.me/2348162908940",
category: "Others",
subCategory: "Others",
city: "Ibadan",
area: "Within Ibadan",
description: "Beaded accessories resin art candles",
verified: true
},

{
vendorId: "OJ058",
businessName: "Mikun’s Scent",
ownerName: "Afolabi Ayomikun Blessing",
phone: "09152734966",
whatsapp: "https://wa.me/2349152734966",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Ogbomosho",
area: "Under G",
description: "Long lasting perfumes",
verified: true
},

{
vendorId: "OJ059",
businessName: "ARglam",
ownerName: "Ilias Awau",
phone: "09131952051",
whatsapp: "https://wa.me/2349131952051",
category: "Beauty",
subCategory: "Beauty& Cosmetics",
city: "Ogbomosho",
area: "Adenike",
description: "Makeup artist and lash technician",
verified: true
}

];


// 🔥 UPLOAD
async function uploadVendors() {

for (const vendor of vendorsBatch3) {

await setDoc(doc(db, "vendors", vendor.vendorId), vendor);

console.log(vendor.businessName + " uploaded ✅");
}

alert("20 Vendors Uploaded Successfully 🚀");
}

uploadVendors();