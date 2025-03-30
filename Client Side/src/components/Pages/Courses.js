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

// Firebase configuration
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
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [courseReviews, setCourseReviews] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const coursesPerPage = 10;
  const reviewsPerPage = 10;
  const [loading, setLoading] = useState(true); // Loader state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input


  // Fetch active courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true); // Start loader
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
      setLoading(false); // Stop loader
    };

    fetchCourses();
  }, []);

  // Fetch reviews from Firebase
  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "courseReviews"));
      const fetchedReviews = [];
      const reviewsByCourse = {};

      querySnapshot.forEach((doc) => {
        const reviewData = doc.data();
        fetchedReviews.push(reviewData);
        if (!reviewsByCourse[reviewData.courseId]) {
          reviewsByCourse[reviewData.courseId] = [];
        }
        reviewsByCourse[reviewData.courseId].push(reviewData);
      });

      setReviews(fetchedReviews);
      setCourseReviews(reviewsByCourse);
    };

    fetchReviews();
  }, []);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setReviewPage(1);
  };

  const handleSubmitReview = async () => {
    if (!selectedCourse || !rating || !review) {
      alert("Please select a course, provide a rating and a review.");
      return;
    }

    const reviewData = {
      courseId: selectedCourse.id,
      courseName: selectedCourse.professionalname,
      rating,
      review,
    };

    try {
      await addDoc(collection(db, "courseReviews"), reviewData);
      const updatedReviews = [...reviews, reviewData];
      setReviews(updatedReviews);
      setRating(0);
      setReview("");
      alert("Review submitted successfully!");

      if (!courseReviews[selectedCourse.id]) {
        courseReviews[selectedCourse.id] = [];
      }
      setCourseReviews({
        ...courseReviews,
        [selectedCourse.id]: [...courseReviews[selectedCourse.id], reviewData],
      });
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  // Clear selection function
  const handleClearSelection = () => {
    setSelectedCourse(null);
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.professionalname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getAverageRating = (courseId) => {
    if (!courseReviews[courseId]) return 0;
    const total = courseReviews[courseId].reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (total / courseReviews[courseId].length).toFixed(1);
  };

  const getTotalReviews = (courseId) => {
    return courseReviews[courseId] ? courseReviews[courseId].length : 0;
  };

  const paginatedCourses = courses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );
  const paginatedReviews = selectedCourse
    ? (courseReviews[selectedCourse.id] || []).slice(
        (reviewPage - 1) * reviewsPerPage,
        reviewPage * reviewsPerPage
      )
    : [];

    

    const handleBooking = async () => {
        const userEmail = localStorage.getItem("email");
        console.log("User Email:", userEmail); // Debugging
      
        if (!userEmail) {
          alert("User not logged in! Please log in to book this course.");
          return;
        }
      
        if (!selectedCourse) {
          alert("No course selected.");
          return;
        }
      
        try {
          // Fetch existing bookings from Firestore
          const bookingsSnapshot = await getDocs(collection(db, "masterclassbookings"));
          const existingBookings = bookingsSnapshot.docs.map(doc => doc.data());
      
          // Check if the user has already booked this course
          const alreadyBooked = existingBookings.some(
            booking => booking.email === userEmail && booking.courseId === selectedCourse.id
          );
      
          if (alreadyBooked) {
            alert("You have already booked this course!");
            return;
          }
      
          // Booking Data with Current Date
          const bookingData = {
            email: userEmail,
            courseId: selectedCourse.id,
            courseName: selectedCourse.professionalname,
            salonName: selectedCourse.saloonnname,
            address: selectedCourse.address,
            contact: selectedCourse.contactno,
            supportEmail: selectedCourse.emailsupport,
            timestamp: new Date().toISOString(),
          };
      
          console.log("Sending booking data:", bookingData); // Debugging
      
          // Add booking to Firestore
          await addDoc(collection(db, "masterclassbookings"), bookingData);
          alert("Booking Confirmed!");
      
          // Call API to send booking confirmation email
          const response = await fetch("http://localhost:5000/send-master-booking-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userEmail,
              serviceName: selectedCourse.professionalname,
              bookingDate: new Date().toISOString().split("T")[0], // Current date
              bookingTime: "10:00 AM", // You can modify this dynamically
              totalPrice: "1000", // Change this to the actual price
            }),
          });
      
          const result = await response.json();
          console.log("Email response:", result);
      
          if (result.success) {
            alert("Booking confirmation email sent!");
          } else {
            alert("Failed to send booking confirmation email.");
          }
        } catch (error) {
          console.error("Error processing booking:", error);
          alert("Error occurred while booking. Please try again.");
        }
      };
      
    
      

  return (
    <div
      className="course-container"
      style={{
        background: "#f5b7b9",
      }}
    >
      <h1 className="title">Salon Online Courses 💇‍♀️</h1>
            {/* Search Bar */}
            <input
        type="text"
        placeholder="Search by class name..."
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
      {/* Loader */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading courses...</p>
        </div>
      )}

      {/* No Courses Message */}
      {!loading && courses.length === 0 && (
        <div className="no-courses">
          <p>There are no classes right now. Stay tuned! 😊</p>
        </div>
      )}

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
              <p>
                ⭐ {getAverageRating(course.id)}/5 ({getTotalReviews(course.id)}{" "}
                reviews)
              </p>
            </div>
          ))
        )}
      </div>
{/* Clear Selection Button */}
{selectedCourse && (
        <button
          onClick={handleClearSelection}
          style={{
            // marginTop: "10px",
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
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(courses.length / coursesPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {selectedCourse && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            transform: "scale(1)",
            transition: "all 0.3s ease-in-out",
            animation: "fadeIn 0.5s ease-in-out",
            maxWidth: "600px",
            margin: "20px auto",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              color: "#333",
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              borderBottom: "2px solid #ff4a57",
              paddingBottom: "5px",
              marginBottom: "15px",
            }}
          >
            {selectedCourse.name}
          </h2>

          <p style={{ fontSize: "16px", color: "#555", textAlign: "center" }}>
            {selectedCourse.description}
          </p>

          <h3
            style={{
              color: "#ff4a57",
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            Course Details:
          </h3>

          <h2>{selectedCourse.professionalname}</h2>
          <p>
            <strong>🏢 Salon Name:</strong> {selectedCourse.saloonnname}
          </p>
          <p>
            <strong>📍 Address:</strong> {selectedCourse.address}
          </p>
          <p>
            <strong>📞 Contact:</strong> {selectedCourse.contactno}
          </p>
          <p>
            <strong>📧 Email:</strong> {selectedCourse.emailsupport}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleBooking}
              style={{
                width: "70%",
                padding: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                background: "linear-gradient(45deg, #00c853, #64dd17)",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                boxShadow: "0 4px 10px rgba(0, 200, 83, 0.3)",
                textAlign: "center",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 15px rgba(0, 200, 83, 0.5)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 10px rgba(0, 200, 83, 0.3)";
              }}
            >
              Book Now
            </button>
          </div>

          <br></br>
          <hr></hr>
          <br></br>
          <button
  onClick={() => setShowReviewForm(!showReviewForm)}
  style={{
    width: "25%",
    padding: "8px",
    fontSize: "13px",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ff4081, #ff80ab)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 10px rgba(255, 64, 129, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }}
  onMouseOver={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 6px 15px rgba(255, 64, 129, 0.5)";
  }}
  onMouseOut={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "0 4px 10px rgba(255, 64, 129, 0.3)";
  }}
>
  {showReviewForm ? "❌ Close" : "📝 Submit Review"}
</button>


{showReviewForm && (
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      maxWidth: "600px",
      margin: "20px auto",
      textAlign: "left",
    }}
  >
    <h3 style={{ color: "#ff4a57", fontSize: "18px", fontWeight: "bold" }}>
      Leave a Review
    </h3>

    {/* Rating Dropdown */}
    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      style={{
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "2px solid #ddd",
        outline: "none",
        transition: "all 0.3s ease-in-out",
        background: "#fff",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <option value={0} disabled>
        Select Rating
      </option>
      <option value={1}>⭐ 1</option>
      <option value={2}>⭐⭐ 2</option>
      <option value={3}>⭐⭐⭐ 3</option>
      <option value={4}>⭐⭐⭐⭐ 4</option>
      <option value={5}>⭐⭐⭐⭐⭐ 5</option>
    </select>

    <textarea
      value={review}
      onChange={(e) => setReview(e.target.value)}
      placeholder="Write your review..."
      style={{
        width: "100%",
        minHeight: "100px",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "2px solid #ddd",
        outline: "none",
        resize: "none",
        transition: "all 0.3s ease-in-out",
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    ></textarea>

    <button
      onClick={handleSubmitReview}
      style={{
        width: "50%",
        padding: "12px",
        fontSize: "18px",
        fontWeight: "bold",
        background: "linear-gradient(45deg, #ff4081, #ff80ab)",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        boxShadow: "0 4px 10px rgba(255, 64, 129, 0.3)",
      }}
    >
      Submit Review
    </button>
  </div>
)}

        </div>
      )}

      {selectedCourse && (
        <>
          <h2 className="review-title">📢 Course Reviews</h2>
          <div className="review-list">
            {paginatedReviews.map((r, index) => (
              <div key={index} className="review-card">
                <strong>{r.courseName}</strong> - ⭐ {r.rating}/5
                <p>{r.review}</p>
              </div>
            ))}
          </div>

          <div className="review-pagination">
            <button
              disabled={reviewPage === 1}
              onClick={() => setReviewPage(reviewPage - 1)}
              className="pagination-button"
            >
              ⬅️ Previous
            </button>

            <span className="page-info">
              Page {reviewPage} of{" "}
              {Math.ceil(
                (courseReviews[selectedCourse?.id] || []).length /
                  reviewsPerPage
              )}
            </span>

            <button
              disabled={
                reviewPage >=
                Math.ceil(
                  (courseReviews[selectedCourse?.id] || []).length /
                    reviewsPerPage
                )
              }
              onClick={() => setReviewPage(reviewPage + 1)}
              className="pagination-button"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Course;
