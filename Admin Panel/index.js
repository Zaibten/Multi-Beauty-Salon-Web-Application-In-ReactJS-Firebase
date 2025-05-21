const express = require("express");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, deleteDoc, doc } = require("firebase/firestore");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const SECRET_KEY = "ohdejfdsiea092qei021e-w dbsajcduafiywq9e8132uewjADXSANCSAFDUEWQOQ"; // Change this to something secure


// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB3FObmEUWeLFUGnJ-tnieFPFBeVyOh3_0",
  authDomain: "anatomy-45c16.firebaseapp.com",
  projectId: "anatomy-45c16",
  storageBucket: "anatomy-45c16.firebasestorage.app",
  messagingSenderId: "231264600518",
  appId: "1:231264600518:web:9e6796111469507532f2c7",
  measurementId: "G-TG0B43KBEB",
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
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; }
    body, html {
      margin: 0; padding: 0;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: #f4f6f8;
      color: #1e293b;
      overflow: hidden;
    }
    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 10px; height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #e2e8f0;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: #2563eb;
      border-radius: 10px;
      transition: background-color 0.3s ease;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #1d4ed8;
    }

    /* Layout */
    #app {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: #f9fafb;
    }

    /* Sidebar */
    .sidebar {
      background: #1e40af;
      width: 280px;
      min-width: 280px;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 2rem 1.5rem;
      box-shadow: 2px 0 12px rgba(0,0,0,0.12);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 200;
      overflow-y: auto;
    }
    .sidebar h2 {
      font-weight: 900;
      font-size: 1.75rem;
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      user-select: none;
      text-align: center;
      text-shadow: 0 1px 4px rgba(0,0,0,0.15);
    }
    .sidebar a {
      display: block;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 1rem;
      padding: 12px 18px;
      margin-bottom: 0.75rem;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: inset 0 0 0 0 transparent;
      transition: background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar a:hover,
    .sidebar a.active {
      background-color: #2563eb;
      color: white;
      box-shadow: inset 0 0 8px 2px rgba(37, 99, 235, 0.6);
    }

    /* Hamburger */
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
      background: transparent;
    }
    .hamburger span {
      display: block;
      height: 4px;
      border-radius: 2px;
      background: #2563eb;
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

    /* Main content */
    .main {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 0 16px 16px 0;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      display: none; /* Hide main content by default */
    }
    .main-header {
      padding: 2rem;
      border-bottom: 1px solid #e2e8f0;
      font-weight: 900;
      font-size: 2rem;
      color: #1e293b;
      user-select: none;
      background: #f9fafb;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    /* Datatables container */
    .datatable {
      padding: 2rem;
      overflow-x: auto;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
      display: none;
      will-change: transform, opacity;
    }
    .datatable.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 12px;
      font-size: 1rem;
      color: #334155;
      min-width: 600px;
      table-layout: fixed;
    }
    thead tr {
      background-color: #2563eb;
      color: white;
      user-select: none;
    }
    thead th {
      padding: 14px 20px;
      text-align: left;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    tbody tr {
      background: #f1f5f9;
      border-radius: 12px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    tbody tr:hover {
      background: white;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);
      transform: translateY(-3px);
    }
    tbody td {
      padding: 14px 20px;
      vertical-align: middle;
      word-break: break-word;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
      cursor: default;
    }
    tbody td:hover {
      overflow: visible;
      white-space: normal;
      background: #fefefe;
      position: relative;
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      border-radius: 8px;
      padding: 12px 20px;
    }

    /* Buttons */
    .btn {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 1px 5px rgb(0 0 0 / 0.1);
      margin: 0 4px;
    }
    .btn-edit {
      background: #facc15;
      color: #202020;
    }
    .btn-edit:hover {
      background: #eab308;
      box-shadow: 0 4px 10px rgb(234 179 8 / 0.6);
    }
    .btn-delete {
      background: #ef4444;
      color: white;
    }
    .btn-delete:hover {
      background: #dc2626;
      box-shadow: 0 4px 10px rgb(220 38 38 / 0.6);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        transform: translateX(-320px);
        box-shadow: 4px 0 20px rgba(0,0,0,0.15);
        transition: transform 0.3s ease;
        z-index: 100;
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
