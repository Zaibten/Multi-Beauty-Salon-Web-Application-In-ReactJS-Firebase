import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { message, Button, Modal, Radio, Spin } from "antd";

import Footer from "../Footer/Footer";

const CourseBookings = () => {
  const [tutorials, setTutorials] = useState([]);
  const [masterClasses, setMasterClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState("Tutorials");
  const [searchTerm, setSearchTerm] = useState(""); // <-- search term state

  const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "MasterClasses"));
      const fetchedTutorials = [];
      const fetchedMasterClasses = [];

      snapshot.docs.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (data.bookingAvailable) {
          if (data.category === "Tutorial") {
            fetchedTutorials.push(data);
          } else {
            fetchedMasterClasses.push(data);
          }
        }
      });

      setTutorials(fetchedTutorials);
      setMasterClasses(fetchedMasterClasses);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleBookClick = (cls) => {
    if (!cls.bookingAvailable || cls.maxBookings <= 0) {
      message.warning("This class is not available for booking.");
      return;
    }
    setSelectedClass(cls);
    setBookingModalVisible(true);
  };

const validateEmail = (email) => {
  // Basic email pattern, not exhaustive but good enough here
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateName = (name) => {
  // Only letters and spaces allowed, at least 2 characters
  return /^[a-zA-Z\s]{2,}$/.test(name.trim());
};

const validateContact = (contact) => {
  // Only digits allowed, length 7 to 15 (you can adjust)
  return /^\d{7,15}$/.test(contact.trim());
};

const confirmBooking = async () => {
  const { name, email, contact } = clientInfo;

  if (!name || !email || !contact) {
    message.warning("Please fill all fields before booking.");
    return;
  }

  if (!validateName(name)) {
    message.warning("Please enter a valid name (letters and spaces only).");
    return;
  }

  if (!validateEmail(email)) {
    message.warning("Please enter a valid email address.");
    return;
  }

  if (!validateContact(contact)) {
    message.warning(
      "Please enter a valid contact number (digits only, 7 to 15 characters)."
    );
    return;
  }

  if (!selectedClass || selectedClass.maxBookings <= 0) {
    message.warning("This class is not available for booking.");
    return;
  }

  setLoading(true);
  try {
    await updateDoc(doc(db, "MasterClasses", selectedClass.id), {
      maxBookings: selectedClass.maxBookings - 1,
    });

    await fetch("http://localhost:5000/mastersend-booking-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        contact,
        className: selectedClass.name,
        artistName: selectedClass.artistName,
        salonName: selectedClass.selectedSaloon,
      }),
    });

    message.success("Booking confirmed and email sent!");
    setBookingModalVisible(false);
    setSelectedClass(null);
    setClientInfo({ name: "", email: "", contact: "" });
    fetchData();

    // Redirect to Stripe payment page
    window.location.href = "https://buy.stripe.com/test_28EfZgcIb1nK6lY6kR1Nu02";
  } catch (err) {
    console.error(err);
    // message.error("Failed to book class or send email");
  } finally {
    setLoading(false);
  }
};



  // Filter tutorials or master classes based on search term (case insensitive)
// Filter tutorials or master classes based on search term (case insensitive)
const filteredTutorials = tutorials.filter((tut) =>
  tut.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredMasterClasses = masterClasses
  .filter((cls) => cls.maxBookings > 0) // <-- hide those with 0 bookings left
  .filter((cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase()));


  

  return (
    <div className="w-100">
    <div
      style={{
        padding: 30,
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#ff4da6", marginBottom: 20 }}>
        Course Bookings
      </h2>

      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <Radio.Group value={viewMode} onChange={(e) => {
          setViewMode(e.target.value);
          setSearchTerm(""); // reset search on view mode change
        }}>
          <Radio.Button value="Tutorials">Tutorials</Radio.Button>
          <Radio.Button value="MasterClasses">Master Classes</Radio.Button>
        </Radio.Group>
      </div>

      {/* Search bar */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder={`Search ${viewMode === "Tutorials" ? "Tutorials" : "Master Classes"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "300px",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 16,
          }}
        />
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
      ) : viewMode === "Tutorials" ? (
        <>
          {filteredTutorials.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No tutorials with booking available.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredTutorials.map((tut) => {
                const videoId = getYoutubeVideoId(tut.tutorialLink);
                const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

                return (
                  <div
                    key={tut.id}
                    style={{
                      border: "1px solid #ddd",
                      padding: 10,
                      borderRadius: 6,
                      textAlign: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <h4 style={{ marginBottom: 10 }}>{tut.name}</h4>
                    <img
                      src={thumbnail}
                      alt="Tutorial Thumbnail"
                      style={{
                        width: "100%",
                        maxWidth: 220,
                        height: "auto",
                        cursor: "pointer",
                        borderRadius: 6,
                      }}
                      onClick={() => {
                        setSelectedTutorial(tut);
                        setTutorialModalVisible(true);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {filteredMasterClasses.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No master classes with booking available.
            </p>
          ) : (
            filteredMasterClasses.map((cls) => (
              <div
                key={cls.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 15,
                  borderRadius: 6,
                  marginBottom: 15,
                }}
              >
                <h3>{cls.name}</h3>
                <p>
                  <b>Artist:</b> {cls.artistName}
                </p>
                <p>
                  <b>Salon:</b> {cls.selectedSaloon}
                </p>
                <p>
                  <b>Description:</b> {cls.description}
                </p>
                <p>
                  <b>Max Bookings Left:</b> {cls.maxBookings}
                </p>
                <Button
                  type="primary"
                  onClick={() => handleBookClick(cls)}
                  disabled={cls.maxBookings <= 0}
                  style={{
                    backgroundColor: "#ff4da6",
                    borderColor: "#ff4da6",
                  }}
                >
                  Book Class
                </Button>
              </div>
            ))
          )}
        </>
      )}

      {/* Booking Modal */}
      <Modal
        title="Book Class"
        open={bookingModalVisible}
        onCancel={() => {
          setBookingModalVisible(false);
          setSelectedClass(null);
          setClientInfo({ name: "", email: "", contact: "" });
        }}
        onOk={confirmBooking}
        okText="Submit Booking"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <p>
          You are booking <b>{selectedClass?.name}</b>
        </p>
        <input
          type="text"
          placeholder="Your Name"
          value={clientInfo.name}
          onChange={(e) =>
            setClientInfo({ ...clientInfo, name: e.target.value })
          }
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={clientInfo.email}
          onChange={(e) =>
            setClientInfo({ ...clientInfo, email: e.target.value })
          }
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={clientInfo.contact}
          onChange={(e) =>
            setClientInfo({ ...clientInfo, contact: e.target.value })
          }
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
      </Modal>

      {/* Tutorial Video Modal */}
      <Modal
        title={selectedTutorial?.name}
        open={tutorialModalVisible}
        onCancel={() => setTutorialModalVisible(false)}
        footer={null}
        width={480}
      >
        {selectedTutorial && (
          <div style={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                selectedTutorial.tutorialLink
              )}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Tutorial Video"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 6,
              }}
            ></iframe>
          </div>
        )}
      </Modal>
    </div>
    
     <br></br>
      <Footer />
    </div>
  );
};

export default CourseBookings;
