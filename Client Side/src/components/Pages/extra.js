import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import "./course.css"; // Import styles

const firebaseConfig = {
  apiKey: "AIzaSyB3FObmEUWeLFUGnJ-tnieFPFBeVyOh3_0",
  authDomain: "anatomy-45c16.firebaseapp.com",
  projectId: "anatomy-45c16",
  storageBucket: "anatomy-45c16.firebasestorage.app",
  messagingSenderId: "231264600518",
  appId: "1:231264600518:web:9e6796111469507532f2c7",
  measurementId: "G-TG0B43KBEB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(
          collection(db, "mastercourse"),
          where("Active", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const fetchedCourses = [];

        querySnapshot.forEach((doc) => {
          fetchedCourses.push({ id: doc.id, ...doc.data() });
        });

        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle course selection
  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  // Clear selection function
  const handleClearSelection = () => {
    setSelectedCourse(null);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.professionalname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="course-container">
      <h1 className="title">Salon Online Courses 💇‍♀️</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "15px",
          border: "2px solid #ddd",
          borderRadius: "5px",
        }}
      />

      {/* Course List */}
      <div className="course-list">
        {filteredCourses.length === 0 ? (
          <p>No matching courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleSelectCourse(course)}
            >
              <h3>{course.professionalname}</h3>
            </div>
          ))
        )}
      </div>

      {/* Clear Selection Button */}
      {selectedCourse && (
        <button
          onClick={handleClearSelection}
          style={{
            marginTop: "10px",
            padding: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Selection
        </button>
      )}
    </div>
  );
};

export default Course;
