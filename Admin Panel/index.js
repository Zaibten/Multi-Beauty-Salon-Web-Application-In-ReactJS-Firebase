require('dotenv').config();
const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, deleteDoc, doc } = require("firebase/firestore");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const collections = [
  "ArtistPortfolio", "Bookings", "MasterClasses", "ProfessionalDB", "UserDB",
  "courseReviews", "masterclassbookings", "mastercourse", "proLogin", "userLogin"
];

// Fetch all data
async function fetchAllData() {
  let allData = {};
  for (const col of collections) {
    const colRef = collection(db, col);
    const snapshot = await getDocs(colRef);
    allData[col] = [];
    snapshot.forEach(doc => {
      allData[col].push({ id: doc.id, ...doc.data() });
    });
  }
  return allData;
}

app.get("/dashboard", async (req, res) => {
  const allData = await fetchAllData();

  let collections = [
    "ArtistPortfolio", "Bookings", "MasterClasses", "ProfessionalDB", "UserDB",
    "courseReviews", "masterclassbookings", "mastercourse", "proLogin", "userLogin"
  ];

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Glam The Girl Admin Panel</title>
  <link rel="icon" type="image/png" href="assets/logo.png" />

  
  <style>
  *, *::before, *::after { box-sizing: border-box; }
  body, html {
    margin: 0; padding: 0;
    height: 100%;
    font-family: 'Inter', sans-serif;
    background: #fff0f5; /* Light pink background */
    color: #3d0a30; /* Deep pink text */
    overflow: hidden;
  }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track {
    background: #ffd5ec;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ff69b4;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover { background: #ff3e9e; }

  #app {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #ffe6f0;
  }

  .sidebar {
    background: rgba(255, 105, 180, 0.56);
    width: 280px;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.5rem;
    box-shadow: 2px 0 12px rgba(0,0,0,0.12);
    z-index: 200;
    overflow-y: auto;
  }

  .sidebar h2 {
    font-weight: 900;
    font-size: 1.75rem;
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .sidebar a {
    color: #ffdce9;
    font-weight: 600;
    padding: 12px 18px;
    margin-bottom: 0.75rem;
    border-radius: 12px;
    text-decoration: none;
    background-color: transparent;
    transition: all 0.3s ease;
  }

  .sidebar a:hover,
  .sidebar a.active {
    background-color: #ff69b4;
    color: white;
    box-shadow: inset 0 0 8px 2px rgba(255, 105, 180, 0.6);
  }

  .hamburger {
    display: none;
    position: fixed;
    top: 20px;
    left: 20px;
    width: 32px;
    height: 26px;
    cursor: pointer;
    flex-direction: column;
    justify-content: space-between;
    z-index: 300;
  }

  .hamburger span {
    height: 4px;
    background: #ff69b4;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
  }
  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
  }

  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background: #fff5fa;
    border-radius: 0 16px 16px 0;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    display: none;
  }

  .main-header {
    padding: 2rem;
    border-bottom: 1px solid #ffcce6;
    font-weight: 900;
    font-size: 2rem;
    background: #fff0f7;
    box-shadow: 0 2px 6px rgba(255, 105, 180, 0.1);
    color: #3d0a30;
  }

  .datatable {
    padding: 2rem;
    overflow-x: auto;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    display: none;
  }

  .datatable.active {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 12px;
    color: #6b123c;
    background: #fff0f5;
  }

  thead tr {
    background-color: #ff69b4;
    color: white;
  }

  thead th {
    padding: 14px 20px;
    text-align: left;
  }

  tbody tr {
    background: #ffeaf3;
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  tbody tr:hover {
    background: white;
    box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
    transform: translateY(-3px);
  }

  tbody td {
    padding: 14px 20px;
    max-width: 200px;
  }

  tbody td:hover {
    background: #fff8fc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  }

  .btn {
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 1px 5px rgb(0 0 0 / 0.1);
    margin: 0 4px;
  }

  .btn-edit {
    background: #ffb6c1;
    color: #3d0a30;
  }

  .btn-edit:hover {
    background: #ff85c1;
    box-shadow: 0 4px 10px rgba(255, 105, 180, 0.4);
  }

  .btn-delete {
    background: #ff4d6d;
    color: white;
  }

  .btn-delete:hover {
    background: #ff0033;
    box-shadow: 0 4px 10px rgba(255, 0, 51, 0.5);
  }

  @media (max-width: 1024px) {
    .sidebar {
      position: fixed;
      transform: translateX(-320px);
    }
    .sidebar.open {
      transform: translateX(0);
    }
    .hamburger {
      display: flex;
    }
    .main {
      border-radius: 0;
    }
  }
</style>

</head>
<body>
  <div id="app">
    <nav class="sidebar" id="sidebar" aria-label="Sidebar Navigation">
      <h2>Glam The Girl</h2>
      ${collections.map((col, i) =>
        `<a href="#table${i + 1}" role="tab" aria-controls="table${i + 1}" tabindex="${i === 0 ? 0 : -1}">${col}</a>`
      ).join("")}
    </nav>

    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="sidebar">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <main class="main" id="mainContent" role="main" aria-live="polite" aria-atomic="true">
      <header class="main-header">Glam The Girl Admin Panel</header>
      ${collections.map((col, i) => `
        <section id="table${i + 1}" class="datatable" role="tabpanel" aria-hidden="${i === 0 ? "false" : "true"}" tabindex="0" aria-labelledby="tab${i + 1}">
          <table>
            <thead>
              <tr>
                ${Object.keys(allData[col][0] || {}).map(h => `<th>${h}</th>`).join("")}
                
              </tr>
            </thead>
            <tbody>
              ${allData[col].map(row => `
                <tr>
                  ${Object.values(row).map(v => `<td>${v}</td>`).join("")}
              
                </tr>`).join("")}
            </tbody>
          </table>
        </section>
      `).join("")}
    </main>
  </div>

  <script>
    // Authentication on page load
    function promptCredentials() {
      let username = prompt("Please enter username:");
      let password = prompt("Please enter password:");

      if (username === "admin" && password === "123") {
        document.getElementById("mainContent").style.display = "flex";
      } else {
        // Show blank page (hide main and sidebar)
        document.getElementById("mainContent").style.display = "none";
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("hamburger").style.display = "none";
      }
    }

    // Run promptCredentials on load
    window.onload = promptCredentials;

    // Sidebar navigation with tabs behavior
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const tabs = sidebar.querySelectorAll("a");
    const panels = mainContent.querySelectorAll(".datatable");

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", e => {
        e.preventDefault();
        // Remove active from all tabs
        tabs.forEach(t => {
          t.classList.remove("active");
          t.setAttribute("tabindex", "-1");
          let panelId = t.getAttribute("href").substring(1);
          document.getElementById(panelId).setAttribute("aria-hidden", "true");
          document.getElementById(panelId).classList.remove("active");
        });
        // Activate clicked tab and panel
        tab.classList.add("active");
        tab.setAttribute("tabindex", "0");
        let panelId = tab.getAttribute("href").substring(1);
        document.getElementById(panelId).setAttribute("aria-hidden", "false");
        document.getElementById(panelId).classList.add("active");
        // Focus the panel for accessibility
        document.getElementById(panelId).focus();

        // Close sidebar on mobile if open
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Set first tab active by default
    tabs[0].classList.add("active");
    tabs[0].setAttribute("tabindex", "0");
    panels[0].classList.add("active");
    panels[0].setAttribute("aria-hidden", "false");

    // Hamburger toggle
    const hamburger = document.getElementById("hamburger");
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !expanded);
      hamburger.classList.toggle("open");
      sidebar.classList.toggle("open");
    });

    // Accessibility: keyboard navigation for sidebar tabs
    sidebar.addEventListener("keydown", e => {
      const currentIndex = Array.from(tabs).findIndex(t => t === document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        let prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
      }
    });
  </script>
</body>
</html>
`;

  res.send(html);
});

// Delete record
app.delete("/delete/:collection/:id", async (req, res) => {
  const { collection, id } = req.params;
  try {
    await deleteDoc(doc(db, collection, id));
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send("Failed to delete: " + err.message);
  }
});

// Start server
app.listen(port, () => console.log(`🚀 Running at http://localhost:${port}`));
