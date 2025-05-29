import React, { useState } from "react";

import Footer from "../Footer/Footer";

const Contact = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // success or error message

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("http://localhost:5000/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      setStatus("❌ Error sending message.");
    }
  };
// Define the functions inside the component
  const addFocusStyle = (e) => {
    e.target.style.borderColor = "#222";
    e.target.style.boxShadow = "0 0 8px rgba(34,34,34,0.3)";
    e.target.style.transform = "scale(1.02)";
  };

  const removeFocusStyle = (e) => {
    e.target.style.borderColor = "#ddd";
    e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
    e.target.style.transform = "scale(1)";
  };
   const styles = {
    container: {
      margin: "0 auto",
      padding: "50px 25px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#fff",
      animation: "fadeIn 1.2s ease forwards",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      borderRadius: "12px",
    },
    title: {
      textAlign: "center",
      marginBottom: "50px",
      fontSize: "2.8rem",
      fontWeight: "700",
      color: "#222",
      letterSpacing: "1.5px",
      animation: "slideDownFade 1s ease forwards",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "40px",
    },
    column: {
      flex: "1 1 45%",
      minWidth: "320px",
      animation: "slideUp 1s ease forwards",
      animationDelay: "0.4s",
      opacity: 0,
    },
    formGroup: {
      marginBottom: "22px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "700",
      color: "#555",
      letterSpacing: "0.05em",
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "10px",
      border: "2px solid #ddd",
      fontSize: "1.1rem",
      outline: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      fontWeight: "500",
    },
    textarea: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: "10px",
      border: "2px solid #ddd",
      fontSize: "1.1rem",
      resize: "vertical",
      outline: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      fontWeight: "500",
      minHeight: "130px",
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#222",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "1.15rem",
      fontWeight: "700",
      letterSpacing: "0.05em",
      transition: "all 0.35s ease",
      boxShadow: "0 4px 12px rgba(34,34,34,0.3)",
    },
    map: {
      width: "100%",
      height: "360px",
      border: "0",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      animation: "bounce 2.5s ease-in-out infinite",
    },
  };

  return (
    <div className="w-100">
    <div style={styles.container}>
      {/* your style tag remains unchanged */}

      <h2 style={styles.title}>CONTACT US <span style={{fontSize:"1.4rem"}}>📞✉️</span></h2>
      <div style={styles.row}>
        <div style={{ ...styles.column, animationDelay: "0.4s", opacity: 1 }}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your Name"
                style={styles.input}
                required
                onChange={handleChange}
                onFocus={addFocusStyle}
                onBlur={removeFocusStyle}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your Email"
                style={styles.input}
                required
                onChange={handleChange}
                onFocus={addFocusStyle}
                onBlur={removeFocusStyle}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                placeholder="Subject"
                style={styles.input}
                required
                onChange={handleChange}
                onFocus={addFocusStyle}
                onBlur={removeFocusStyle}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                placeholder="Your Message"
                rows="5"
                style={styles.textarea}
                required
                onChange={handleChange}
                onFocus={addFocusStyle}
                onBlur={removeFocusStyle}
              />
            </div>
            <button type="submit" style={styles.button}>
              Send Message
            </button>
            {status && (
              <p
                style={{
                  marginTop: "12px",
                  fontWeight: "600",
                  color: status.includes("success") ? "green" : "red",
                }}
              >
                {status}
              </p>
            )}
          </form>
        </div>
        {/* Map div unchanged */}
        <div style={{ ...styles.column, animationDelay: "0.6s", opacity: 1 }}>
          <iframe
            title="Google Map"
            style={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.547578617002!2d67.06306097596752!3d24.813829347150184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e7c3f3f2b1d%3A0x5a1a2b8f7adfc62!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1654125291225!5m2!1sen!2s"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
    
     <br></br>
      <Footer />
    </div>
  );
};


export default Contact;