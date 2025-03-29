const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
// Import required Firebase modules
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Initialize Firebase App
const firebaseApp = initializeApp({
  apiKey: "AIzaSyD6OzSxTCO4YGygFWuj3MZfe2BcXPSnJ1s",
  authDomain: "saloon-a805a.firebaseapp.com",
  projectId: "saloon-a805a",
  storageBucket: "saloon-a805a.firebasestorage.app",
  messagingSenderId: "769957782953",
  appId: "1:769957782953:web:fc119110c2f9403f5050b8",
  measurementId: "G-T2VLH1LDVV",
});

// Initialize Firestore
const db = getFirestore(firebaseApp);


const app = express();
app.use(cors());
app.use(bodyParser.json());


// SMTP Credentials
// const senderEmail = "muzamilkhanofficial786@gmail.com";
// const senderPassword = "iaqu xvna tpix ugkt";

const senderEmail = "laibaimran910@gmail.com";
const senderPassword = "qlqy ozpj napw topa";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

// API to send cancellation email
app.post("/send-cancellation-email", async (req, res) => {
  const { email, serviceName, bookingDate, bookingTime, totalPrice } = req.body;

  console.log("Received email request for:", email);

  if (!email) {
    console.error("No email provided!");
    return res.status(400).json({ error: "Email is required" });
  }

  const mailOptions = {
    from: senderEmail,
    to: email,
    subject: "Booking Cancellation Confirmation",
    html: `
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="Company Logo" style="width: 80px; height: 80px; border-radius: 50%; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);"/>
        </div>

        <!-- Title -->
        <h2 style="color: #ff4d4d; text-align: center; font-size: 22px;">Booking Cancellation Confirmation</h2>
        <p style="color: #555; font-size: 16px; text-align: center;">We regret to inform you that your booking has been canceled.</p>

        <!-- Animated Details Box -->
        <div style="border-radius: 8px; background: #f9f9f9; padding: 15px; margin-top: 10px; animation: fadeIn 1.5s ease-in-out;">
          <p style="font-size: 16px;"><strong>Service:</strong> ${serviceName || "Not Available"}</p>
          <p style="font-size: 16px;"><strong>Date:</strong> ${bookingDate || "Not Available"}</p>
          <p style="font-size: 16px;"><strong>Time:</strong> ${bookingTime || "Not Available"}</p>
          <p style="font-size: 16px; color: #ff4d4d;"><strong>Total Price:</strong> ${totalPrice || "Not Available"}</p>
        </div>

        <!-- Footer -->
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">If you have any concerns, please contact our support team.</p>
      </div>

      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "assets/logo.png"), // Ensure your logo is in the 'assets' folder
        cid: "logo",
      },
    ],
  };

  try {
    console.log("Sending email to:", email);
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.json({ success: true, message: "Cancellation email sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});


// API to send booking confirmation email
app.post("/send-booking-email", async (req, res) => {
    const { email, serviceName, bookingDate, bookingTime, totalPrice } = req.body;
  
    console.log("Received booking email request for:", email);
  
    if (!email) {
      console.error("No email provided!");
      return res.status(400).json({ error: "Email is required" });
    }
  
    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: "Booking Confirmation",
      html: `
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="Company Logo" style="width: 80px; height: 80px; border-radius: 50%; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);"/>
          </div>
  
          <!-- Title -->
          <h2 style="color: #4CAF50; text-align: center; font-size: 22px;">Booking Confirmed</h2>
          <p style="color: #555; font-size: 16px; text-align: center;">Thank you for your booking! Below are your booking details:</p>
  
          <!-- Animated Details Box -->
          <div style="border-radius: 8px; background: #f9f9f9; padding: 15px; margin-top: 10px; animation: fadeIn 1.5s ease-in-out;">
            <p style="font-size: 16px;"><strong>Service:</strong> ${serviceName || "Not Available"}</p>
            <p style="font-size: 16px;"><strong>Date:</strong> ${bookingDate || "Not Available"}</p>
            <p style="font-size: 16px;"><strong>Time:</strong> ${bookingTime || "Not Available"}</p>
            <p style="font-size: 16px; color: #4CAF50;"><strong>Total Price:</strong> ${totalPrice || "Not Available"}</p>
          </div>
  
          <!-- Footer -->
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">
            If you have any questions, feel free to contact us. We look forward to serving you!
          </p>
        </div>
  
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "assets/logo.png"), // Ensure your logo is in the 'assets' folder
          cid: "logo",
        },
      ],
    };
  
    try {
      console.log("Sending booking confirmation email to:", email);
      await transporter.sendMail(mailOptions);
      console.log("Booking confirmation email sent successfully!");
      res.json({ success: true, message: "Booking confirmation email sent!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send booking email" });
    }
  });
  


// Function to send reminder emails
const sendReminderEmails = async () => {
  try {
    console.log("Checking for upcoming bookings...");
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const tomorrowDate = today.toISOString().split("T")[0];

    const bookingsSnapshot = await db.collection("Bookings").get();

    if (bookingsSnapshot.empty) {
      console.log("No bookings found.");
      return;
    }

    const promises = bookingsSnapshot.docs.map(async (doc) => {
      const booking = doc.data();

      // Ensure bookingDate is properly formatted
      const bookingDate = typeof booking.bookingDate === "string" ? booking.bookingDate 
                         : booking.bookingDate.toDate().toISOString().split("T")[0];

      if (bookingDate === tomorrowDate) {
        const { email, serviceName, bookingTime, totalPrice } = booking;

        const mailOptions = {
          from: senderEmail,
          to: email,
          subject: "Reminder: Upcoming Booking Tomorrow",
          html: `
            <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif;">
              <h2 style="color: #FFA500; text-align: center;">Upcoming Booking Reminder</h2>
              <p style="text-align: center;">This is a reminder about your upcoming booking scheduled for tomorrow.</p>
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
                <p><strong>Service:</strong> ${serviceName || "Not Available"}</p>
                <p><strong>Date:</strong> ${bookingDate}</p>
                <p><strong>Time:</strong> ${bookingTime || "Not Available"}</p>
                <p style="color: #FFA500;"><strong>Total Price:</strong> ${totalPrice || "Not Available"}</p>
              </div>
              <p style="text-align: center; margin-top: 15px;">If you need to reschedule, please contact us.</p>
            </div>
          `,
        };

        console.log(`Preparing to send email to ${email} for booking on ${bookingDate}`);

        return transporter.sendMail(mailOptions)
          .then(() => console.log(`Reminder email sent successfully to ${email}`))
          .catch((error) => console.error("Error sending email:", error));
      }
    });

    await Promise.all(promises);
    console.log("All reminder emails sent.");
  } catch (error) {
    console.error("Error sending reminder emails:", error);
  }
};

// Schedule the reminder email to run daily at a fixed time
const scheduleDailyReminder = () => {
  console.log("Starting daily reminder scheduler...");
  const now = new Date();
  const nextRun = new Date(now);
  nextRun.setHours(0, 0, 0, 0);
  nextRun.setDate(nextRun.getDate() + 1);

  const timeUntilNextRun = nextRun.getTime() - now.getTime();
  console.log(`Scheduled reminder emails in ${Math.round(timeUntilNextRun / 1000 / 60)} minutes`);

  setTimeout(() => {
    sendReminderEmails();
    scheduleDailyReminder();
  }, timeUntilNextRun);
};

// Start scheduling reminders
scheduleDailyReminder();


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
