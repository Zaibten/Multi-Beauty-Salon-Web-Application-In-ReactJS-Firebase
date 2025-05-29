import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

// Firebase configuration
const config = {
  apiKey: "AIzaSyB3FObmEUWeLFUGnJ-tnieFPFBeVyOh3_0",
  authDomain: "anatomy-45c16.firebaseapp.com",
  projectId: "anatomy-45c16",
  storageBucket: "anatomy-45c16.firebasestorage.app",
  messagingSenderId: "231264600518",
  appId: "1:231264600518:web:9e6796111469507532f2c7",
  measurementId: "G-TG0B43KBEB",
};

// Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

const Profile = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentEmail = localStorage.getItem("email");
        if (!currentEmail) {
          console.error("No email found in localStorage.");
          return;
        }

        const userQuery = query(
          collection(db, "UserDB"),
          where("email", "==", currentEmail)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUserData({ ...doc.data(), id: doc.id });
          });
        } else {
          console.error("No user found with the given email.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userDocRef = doc(db, "UserDB", userData.id);
      await updateDoc(userDocRef, userData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.marqueeContainer}>
          <marquee style={styles.marquee}>
            Welcome to your profile! Update your details and stay connected 🚀
          </marquee>
        </div>
        <div style={styles.card}>
          <h2 style={styles.title}>MY PROFILE</h2>
          {Object.keys(userData).map(
            (key) =>
              key !== "id" && (
                <div key={key} style={styles.field}>
                  <label style={styles.label}>
                    {key === "email"
                      ? "✉️ Email"
                      : key === "number"
                      ? "📞 Phone"
                      : key === "password"
                      ? "🔒 Password"
                      : key === "address"
                      ? "🏠 Address"
                      : key === "name"
                      ? "👤 Name"
                      : key}
                  </label>
                  {key === "password" ? (
                    isEditing ? (
                      <input
                        type="text"
                        name={key}
                        value={userData[key]}
                        onChange={handleChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.value}>
                        {userData[key].replace(/./g, "*")}
                      </span>
                    )
                  ) : isEditing ? (
                    <input
                      type="text"
                      name={key}
                      value={userData[key]}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  ) : (
                    <span style={styles.value}>{userData[key]}</span>
                  )}
                </div>
              )
          )}

          <div style={styles.buttonContainer}>
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={styles.saveButton}
                className="button"
              >
                {isSaving ? "Saving..." : "Save Profile Information"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={styles.editButton}
                className="button"
              >
                Click To Edit Profile Information
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer /> {/* Footer is placed outside the container div */}
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f8f8",
    padding: "20px",
  },
  marqueeContainer: {
    width: "100%",
    overflow: "hidden",
    // backgroundColor: "#ff69b4",
    color: "#ff69b4",
    fontWeight: "bold",
    fontSize: "1.3rem",
    marginBottom: "20px",
    padding: "10px 0",
  },
  marquee: {
    animation: "scroll 15s linear infinite",
    fontStyle: "",
  },
  card: {
    width: "90%",
    maxWidth: "1200px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
    padding: "30px",
    textAlign: "center",
    animation: "fadeIn 1s ease-in-out",
  },
  title: {
    fontSize: "2rem",
    color: "#ff69b4",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    fontStyle: "",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    fontSize: "1.2rem",
    fontStyle: "",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    width: "60%",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    fontStyle: "",
  },
  value: {
    fontSize: "1rem",
    color: "#333",
    fontStyle: "",
  },
  buttonContainer: {
    marginTop: "30px",
  },
  editButton: {
    padding: "12px 30px",
    backgroundColor: "#ff69b4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "all 0.5s ease",
    fontStyle: "",
  },
  saveButton: {
    padding: "12px 30px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    transition: "all 0.5s ease",
    fontStyle: "",
  },
};

const globalCSS = `
  .button:hover {
    transform: scale(1.05);
    border-radius: 20px;
    background-color: #ffd700;
    color: #000;
    transition: all 0.5s ease;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalCSS;
document.head.appendChild(styleSheet);

export default Profile;
