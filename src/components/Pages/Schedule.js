import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useMediaQuery } from "@uidotdev/usehooks";
import Loader from "../Loader/loader";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const isSmallDevice = useMediaQuery("(max-width: 748px)");

  // Set current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString(); // Formats as MM/DD/YYYY
  
      // Formats time as 12:30PM
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(" ", "");
  
      setCurrentDate(date);
      setCurrentTime(time);
    };
  
    // Update the date and time every second
    const interval = setInterval(updateDateTime, 1000);
  
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
const fetchBookings = async () => {
  try {
    const bookingsRef = collection(db, "Bookings");
    const q = query(bookingsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const bookingsData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Format the booking date to MM/DD/YYYY
      const formattedDate = new Date(data.bookingDate).toLocaleDateString();

      bookingsData.push({
        id: doc.id,
        ...data,
        bookingDate: formattedDate, // Replace with formatted date
      });
    });
    setBookings(bookingsData);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    alert("Failed to load bookings. Please try again.");
    setLoading(false);
  }
};


    if (email) {
      fetchBookings();
    } else {
      alert("Please log in to view your bookings.");
      navigate("/login");
    }
  }, [email, navigate]);

  const handleEdit = (booking) => {
    setEditing(booking.id);
    setEditForm(booking);
  };

  const handleSave = async () => {
    if (
      !editForm.serviceName ||
      !editForm.servicePrice ||
      !editForm.bookingDate ||
      !editForm.bookingTime ||
      !editForm.totalPrice
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const bookingRef = doc(db, "Bookings", editing);
      await updateDoc(bookingRef, editForm);
      setBookings((prev) =>
        prev.map((b) => (b.id === editing ? { ...b, ...editForm } : b))
      );
      setEditing(null);
      alert("Booking updated successfully.");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const bookingRef = doc(db, "Bookings", id);
        await deleteDoc(bookingRef);
        setBookings((prev) => prev.filter((booking) => booking.id !== id));
        alert("Booking deleted successfully.");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <h5 style={styles.header}>
        <span style={styles.headerText}>
          Your <span style={styles.innerHeaderText}>Bookings</span>
        </span>
      </h5>

      {/* Date and Time Label */}
      <div style={styles.dateTimeLabel}>
        <p><strong>Date:</strong> {currentDate}</p>
        <p><strong>Time:</strong> {currentTime}</p>
      </div>

      <div style={styles.innerContainer}>
        {loading ? (
          <Loader />
        ) : bookings.length > 0 ? (
          <div style={styles.bookingsWrapper}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                {editing === booking.id ? (
                  <>
                    <input
                      style={styles.input}
                      name="serviceName"
                      value={editForm.serviceName}
                      placeholder="Service Name"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="servicePrice"
                      value={editForm.servicePrice}
                      placeholder="Service Price"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="bookingDate"
                      value={editForm.bookingDate}
                      placeholder="Booking Date"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="bookingTime"
                      value={editForm.bookingTime}
                      placeholder="Booking Time"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="totalPrice"
                      value={editForm.totalPrice}
                      placeholder="Total Price"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="additionalService"
                      value={editForm.additionalService || ""}
                      placeholder="Additional Services"
                      onChange={handleChange}
                    />
                    <input
                      style={styles.input}
                      name="serviceDescription"
                      value={editForm.serviceDescription || ""}
                      placeholder="Service Description"
                      onChange={handleChange}
                    />
                    <button style={styles.saveButton} onClick={handleSave}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h5 style={styles.cardTitle}>
                      <strong>Service Name:</strong> {booking.serviceName}
                    </h5>
                    <p>
                      <strong>Service Price:</strong> {booking.servicePrice}
                    </p>
                    <p>
                      <strong>Booking Date:</strong> {booking.bookingDate}
                    </p>
                    <p>
                      <strong>Booking Time:</strong> {booking.bookingTime}
                    </p>
                    <p>
                      <strong>Total Price:</strong> {booking.totalPrice}
                    </p>
                    <p>
                      <strong>Additional Services:</strong>{" "}
                      {booking.additionalService || "N/A"}
                    </p>
                    <p>
                      <strong>Service Description:</strong>{" "}
                      {booking.serviceDescription || "N/A"}
                    </p>
                    <hr style={styles.divider} />
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEdit(booking)}
                      >
                        Edit Booking ✎
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDelete(booking.id)}
                      >
                       Delete Booking ✖
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
      
    <Footer /> {/* Footer is placed outside the container div */} 
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f2f2f2",
  },
  header: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "20px",
    padding: "10px",
    borderRadius: "5px",
  },
  headerText: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    border: "2px solid #ff69b4",
    borderRadius: "70px",
    backgroundColor: "#fff",
    color: "#ff69b4",
  },
  innerHeaderText: {
    color: "#ffffff",
    backgroundColor: "#ff69b4",
    padding: "5px 10px",
    borderRadius: "70px",
  },
  dateTimeLabel: {
    textAlign: "center",
    margin: "10px 0",
  },
  innerContainer: {
    padding: "15px",
  },
  bookingsWrapper: {
    padding: "15px",
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #ff69b4",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardTitle: {
    color: "#000000",
  },
  divider: {
    borderTop: "1px solid #ff69b4",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#f0ad4e",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#5cb85c",
    border: "none",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default Schedule;
