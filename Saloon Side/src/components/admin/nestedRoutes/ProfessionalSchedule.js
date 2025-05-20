import React, { useState, useEffect } from "react";
import "./style.css";
import Loader from "../../Loader/loader";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc, doc,updateDoc  } from "firebase/firestore";

// Firebase Configuration
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

const ProfessionalSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; 

  // Fetch all bookings from Firestore
  const fetchSchedules = async () => {
    try {
      setLoading(true);
  
      // Get the local data from localStorage
      const localUser = JSON.parse(localStorage.getItem("data")); // Ensure this is the correct key
      const localShopName = localUser?.shopName?.toLowerCase(); // Retrieve salon/shop name from localStorage
  
      const schedulesRef = collection(db, "Bookings");
      const q = query(schedulesRef, orderBy("bookingDate", "desc"));
      const querySnapshot = await getDocs(q);
  
      const schedulesData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((schedule) => 
          schedule.shopName?.toLowerCase() === localShopName // Filter by salon/shop name
        );
  
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Function to handle search
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchEmail(searchTerm);

    if (searchTerm === "") {
      setFilteredSchedules(schedules);
    } else {
      const filtered = schedules.filter((schedule) =>
        schedule.email?.toLowerCase().includes(searchTerm)
      );
      setFilteredSchedules(filtered);
    }
  };

  // Function to cancel a booking
  const handleCancelBooking = async (booking) => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this booking?");
  
    if (!isConfirmed) return; // If user cancels, do nothing
  
    try {
      await deleteDoc(doc(db, "Bookings", booking.id));
      alert("Booking canceled successfully.");
  
      // Send cancellation email after deleting the booking
      const response = await fetch("https://glamthegirlemailservice.vercel.app/send-cancellation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: booking.email,
          serviceName: booking.serviceName,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          totalPrice: booking.totalPrice,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Cancellation email sent successfully!");
      } else {
        alert("Failed to send cancellation email: " + data.error);
      }
  
      fetchSchedules(); // Refresh bookings list
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking.");
    }
  };
  
  
  

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSchedules.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSchedules.length / recordsPerPage);


  const handleToggleApproval = async (id, approved) => {
  try {
    const bookingRef = doc(db, "Bookings", id);
    await updateDoc(bookingRef, { approved: !approved });
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !approved } : item
      )
    );
    setFilteredSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !approved } : item
      )
    );
    alert(`Booking ${!approved ? "approved" : "unapproved"} successfully.`);
  } catch (error) {
    console.error("Error updating approval:", error);
    alert("Failed to update approval status.");
  }
};

  return loading ? (
    <Loader />
  ) : (
    <div id="main" className="border py-2 px-3 position-relative vh-100">
      <div className="d-flex align-items-center justify-content-between">
        <h6 className="text-white">
          <span className="bg-white text-black px-2 py-2">
            Your <span className="text-decoration-underline ms-1">Bookings</span>
          </span>
        </h6>

        {/* Refresh Button */}
        <button 
          onClick={fetchSchedules}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Search Input Field */}
      <div className="mb-3 d-flex justify-content-center">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Email..."
          value={searchEmail}
          onChange={handleSearch}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 15px",
            marginTop: "2%",
            borderRadius: "25px",
            border: "1px solid #ccc",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f8f9fa",
            color: "#333",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #007bff")}
          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
        />
      </div>

      <div className="overflow-auto h-100 pb-5">
        {filteredSchedules.length > 0 ? (
          <>
            <table className="table table-dark table-striped text-center">
         <thead>
  <tr>
    <th>Booking ID</th>
    <th>Email</th>
    <th>Service Name</th>
    <th>Additional Service</th>
    <th>Total Price</th>
    <th>Booking Date</th>
    <th>Booking Time</th>
    <th>Approved</th> {/* NEW COLUMN */}
    <th>Advance Payment</th>
    <th>Actions</th>
  </tr>
</thead>

             <tbody>
  {currentRecords.map((schedule, index) => (
    <tr key={schedule.id}>
      <td>{indexOfFirstRecord + index + 1}</td>
      <td>{schedule.email || "No Email"}</td>
      <td>{schedule.serviceName || "No Service"}</td>
      <td>{schedule.additionalService || "Not available"}</td>
      <td>{schedule.totalPrice || "No Price"}</td>
      <td>{schedule.bookingDate || "No Date"}</td>
      <td>{schedule.bookingTime || "No Time"}</td>

      {/* ✅ Approved Toggle */}
      <td>
        <input
          type="checkbox"
          checked={schedule.approved || false}
          onChange={() =>
            handleToggleApproval(schedule.id, schedule.approved || false)
          }
        />
      </td>
      <td>50%</td>

      <td>
        <button
          className="btn btn-danger"
          onClick={() => handleCancelBooking(schedule)}
        >
          Cancel Booking
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-light me-2"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-white align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-light ms-2"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-center mt-3">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfessionalSchedule;
