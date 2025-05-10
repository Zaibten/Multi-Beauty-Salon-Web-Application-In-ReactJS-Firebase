import React, { useEffect, useState } from "react";
import Time from "../../../bookingTime/bookingTime";
import { doc, getDoc, setDoc, collection, getDocs, query, where  } from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import { getAuthSlice } from "../../../Redux/Slices/AuthSlice";
import { useSelector } from "react-redux";
import Loader from "../../Loader/loader";
import { message } from "antd";
import { Switch } from "antd"; // Importing Ant Design Switch component

const url =
  "https://img.freepik.com/premium-vector/fist-with-lbtbi-wristband_24908-77160.jpg?size=626&ext=jpg";

const ProfessionalProfile = () => {
  const [profileIMG, setProfileIMG] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    number: "",
    email: "",
    shopName: "",
    shopAddress: "",
    shopOpen: "10:00AM",
    shopClose: "08:00PM",
    shopnlocation: "", // <-- NEW FIELD
    // bookingsPerDay: 0,  // <-- Field for number of bookings per day
    bookingStatus: true,  // <-- Field for booking status (active/inactive)
    bookingsPerDay: "", // <-- Add this state for bookings per day
    bookingDone: 0,  // Default value
    bookingLeft: 0,  // Default value
  });
  const [messageApi, contextHolder] = message.useMessage();
  const MessageBox = (messageText, variant) => {
    messageApi.open({
      type: variant,
      content: messageText,
    });
  };
  const authID = useSelector(getAuthSlice);
  const id = authID[0].id;
  const getData = async () => {
    const docRef = doc(db, "ProfessionalDB", `${id}`);
    await getDoc(docRef).then((res) => {
      if (res.data === "") {
        setProfile("");
        return;
      }
      setProfile(res.data());
      localStorage.setItem("data", JSON.stringify(res.data()));
    });
  };
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setProfile((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);
  
  useEffect(() => {
    if (id === "") {
      let messageText = "Failed! Please contact Admin";
      let variant = "error";
      MessageBox(messageText, variant);
      return;
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const ProfileImgHandle = (e) => {
    if (setProfileIMG.length === "") {
      let messageText = "Please Select Image if You want to !!";
      let variant = "warning";
      MessageBox(messageText, variant);
    }
    return setProfileIMG(URL.createObjectURL(e.target.files[0]));
  };
  const FormOnChangeHandler = (e) => {
    const { name, value } = e.target;
  
    if (name === "email" && !localStorage.getItem("userEmail")) {
      localStorage.setItem("userEmail", value); // Save only once
    }
  
    setProfile((data) => ({ ...data, [name]: value }));
  };
  

  const handleBookingStatusChange = (checked) => {
    setProfile((prevState) => ({
      ...prevState,
      bookingStatus: checked,
    }));
  };

  

  const updateFirestoreData = async () => {
    const docRef = doc(db, "ProfessionalDB", `${id}`);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const docData = docSnap.data();
  
      const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const lastUpdated = docData.lastUpdated || "";
  
      if (lastUpdated !== today) {
        // It's a new day — reset counters
        const updatedData = {
          bookingDone: 0,
          bookingLeft: Number(docData.bookingsPerDay) || 0,
          lastUpdated: today,
        };
  
        await setDoc(docRef, updatedData, { merge: true });
  
        setProfile((prev) => ({
          ...prev,
          ...updatedData,
        }));
      } else {
        // Same day, update bookingLeft just in case
        const bookingLeft = (Number(docData.bookingsPerDay) || 0) - (Number(docData.bookingDone) || 0);
  
        await setDoc(docRef, { bookingLeft }, { merge: true });
  
        setProfile((prev) => ({
          ...prev,
          bookingDone: docData.bookingDone,
          bookingLeft,
        }));
      }
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      updateFirestoreData(); // This function should already exist
    }, 10000); // Refresh every 30 seconds
  
    // Initial fetch on component mount
    updateFirestoreData();
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const ProfessionalFormSubmit = async (e) => {
    e.preventDefault();
  
    const DB = localStorage.getItem("data");
    const localDB = JSON.stringify(profile);
  
    if (localDB === DB) {
      MessageBox("Failed! Please Make Some Changes before Submit", "error");
      return;
    }
  
    const professionalRef = collection(db, "ProfessionalDB");
  
    // Check for duplicate email
    const emailQuery = query(professionalRef, where("email", "==", profile.email));
    const emailSnapshot = await getDocs(emailQuery);
    const emailExists = emailSnapshot.docs.some((doc) => doc.id !== id);
  
    // Check for duplicate name
    const nameQuery = query(professionalRef, where("name", "==", profile.name));
    const nameSnapshot = await getDocs(nameQuery);
    const nameExists = nameSnapshot.docs.some((doc) => doc.id !== id);
  
    // Check for duplicate shopName
    const shopQuery = query(professionalRef, where("shopName", "==", profile.shopName));
    const shopSnapshot = await getDocs(shopQuery);
    const shopExists = shopSnapshot.docs.some((doc) => doc.id !== id);
  
    if (emailExists || nameExists || shopExists) {
      MessageBox("Duplicate data found! Name, Email, or Shop Name already exists.", "error");
      return;
    }
  
    // Save if no duplicates
    const docRef = doc(db, "ProfessionalDB", `${id}`);
    await setDoc(docRef, profile);
    localStorage.clear("data");
    MessageBox("Data Saved Successfully !!", "success");
  };
  
  
  useEffect(() => {
    if (id) {
      updateFirestoreData();
    }
  }, [id]);
  
  const handleResetBookings = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset bookings to new?");
    if (!confirmReset) return;
  
    const docRef = doc(db, "ProfessionalDB", `${id}`);
    const updatedData = {
      bookingDone: 0,
      bookingLeft: 0,
    };
    await setDoc(docRef, updatedData, { merge: true });
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
    MessageBox("Booking counters reset successfully.", "success");
  };
  
  const [artist, setArtist] = useState({
    name: "",
    description: "",
    role: ""
  });
  const [artistsList, setArtistsList] = useState([]);
  
  const handleArtistChange = (e) => {
    const { name, value } = e.target;
    setArtist((prev) => ({ ...prev, [name]: value }));
  };
  
  const saveArtistPortfolio = async () => {
    if (!artist.name || !artist.description || !artist.role) return;
  
    // Check for duplicate artist name in the list
    const isDuplicate = artistsList.some((item) => item.name.toLowerCase() === artist.name.toLowerCase());
    
    if (isDuplicate) {
      MessageBox("An artist with this name already exists. Please choose a different name.", "error");
      return;
    }
  
    const docRef = doc(collection(db, "ArtistPortfolio"));
    await setDoc(docRef, {
      ...artist,
      salonName: profile.shopName,
      createdAt: new Date().toISOString(),
    });
  
    setArtist({ name: "", description: "", role: "" });
    MessageBox("Artist portfolio saved successfully", "success");

    fetchArtists();
  };
  
  const fetchArtists = async () => {
    const snapshot = await getDocs(collection(db, "ArtistPortfolio"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setArtistsList(data.filter(item => item.salonName === profile.shopName));
  };
  
  useEffect(() => {
    if (profile.shopName) {
      fetchArtists();
    }
  }, [profile.shopName]);
  
  return profile.name === "" ? (
    <Loader />
  ) : (
    <div className="w-100 bg-white p-3 h-100 overflow-auto pb-5">
    
    <br></br>
    <br></br>
    
    <br></br>
    <br></br>
    
    <br></br>
    <br></br>
    
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>

  
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
      {contextHolder}
      <div>
        {/* <img
          alt="#"
          src={profileIMG || url}
          className="rounded-circle ripple"
          width={150}
          height={150}
        /> */}
        {/* <label
          htmlFor="img"
          id="imgUpdate"
          className="material-icons-outlined position-absolute bg-white p-2 rounded-circle shadow bottom-0 start-50"
        >
          add_a_photo
        </label> */}
        <input
          type="file"
          className="d-none"
          onChange={ProfileImgHandle}
          id="img"
        />
      </div>
      <form onSubmit={ProfessionalFormSubmit}>
      <div className="col-12 col-sm-6 mt-2 d-flex align-items-end">
  {/* <button
    type="button"
    className="btn btn-outline-primary d-flex align-items-center"
    onClick={updateFirestoreData}
  >
    <span className="material-icons me-2">refresh</span> Refresh Booking
  </button> */}
</div>
<div className="col-12 col-sm-6 mt-2 d-flex align-items-end">
<button
  type="button"
  onClick={handleResetBookings}
  style={{
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
    border: "none",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <span
    className="material-icons"
    style={{
      marginRight: "10px",
      animation: "spin 1s linear infinite"
    }}
  >
    refresh
  </span>
  Refresh Bookings
</button>

<style>
{`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}
</style>

</div>

        <div className="row">
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Professional Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              value={profile.name}
              name="name"
              onChange={FormOnChangeHandler}
              className="form-control"
            />
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Mobile Number<span className="text-danger">*</span>
            </label>
            <input
              type="number"
              maxLength={10}
              value={profile.number}
              name="number"
              placeholder="+91"
              onChange={FormOnChangeHandler}
              className="form-control"
            />
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Email ID<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="email id"
              value={profile.email}
              name="email"
              onChange={FormOnChangeHandler}
              className="form-control"
            />
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Shop Name<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="shop name"
              value={profile.shopName}
              name="shopName"
              onChange={FormOnChangeHandler}
              className="form-control"
            />
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Shop Address<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={profile.shopAddress}
              name="shopAddress"
              onChange={FormOnChangeHandler}
              placeholder="shop address"
              className="form-control"
            />
          </div>
          <div className="col-12 col-sm-6 mt-2">
            <label>
              Shop Timing<span className="text-danger">*</span>
            </label>
            <div className="d-flex">
              <select
                className="form-select"
                aria-label="Default select example"
                value={profile.shopOpen}
                name="shopOpen"
                onChange={FormOnChangeHandler}
              >
                {Time.filter((data) => data.shift === "AM").map(
                  (sortTime, i) => (
                    <option key={i + 1} value={sortTime.time + sortTime.shift}>
                      {sortTime.time + sortTime.shift}
                    </option>
                  )
                )}
              </select>
              <select
                className="form-select ms-2"
                name="shopClose"
                onChange={FormOnChangeHandler}
                aria-label="Default select example"
                value={profile.shopClose}
              >
                {Time.filter((data) => data.shift === "PM").map((sortTime) => (
                  <option
                    key={sortTime.time}
                    value={sortTime.time + sortTime.shift}
                  >
                    {sortTime.time + sortTime.shift}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-sm-6 mt-2">
  <label>
    Bookings Per Day <span className="text-danger">*</span>
  </label>
  <input
    type="number"
    max="999" // Limit to 3 digits
    value={profile.bookingsPerDay}
    name="bookingsPerDay"
    onChange={FormOnChangeHandler}
    className="form-control"
    placeholder="Enter max bookings per day"
    maxLength={3} // Limit to 3 digits
  />
</div>

<div className="col-12 col-sm-6 mt-2">
  <label>Booking Done</label>
  <input
    type="number"
    value={profile.bookingDone}
    name="bookingDone"
    onChange={FormOnChangeHandler}
    className="form-control"
    disabled
  />
</div>

<div className="col-12 col-sm-6 mt-2">
  <label>Booking Left</label>
  <input
    type="number"
    value={profile.bookingLeft}
    name="bookingLeft"
    onChange={FormOnChangeHandler}
    className="form-control"
    disabled
  />
</div>


          <div className="col-12 col-sm-6 mt-2">
            <label>
              Google Map Embed Link <span className="text-danger">*</span>
            </label>
            <input
              type="url"
              value={profile.shopnlocation}
              name="shopnlocation"
              onChange={FormOnChangeHandler}
              placeholder="Paste Google Maps Embed location link"
              className="form-control"
            />
          </div>
          {/* <div className="col-12 col-sm-6 mt-2">
            <label>
              Bookings Per Day <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              max={150}
              value={profile.bookingsPerDay}
              name="bookingsPerDay"
              onChange={FormOnChangeHandler}
              className="form-control"
              placeholder="Enter max bookings per day (max 150)"
            />
          </div> */}
          <br></br>
          <hr></hr>
          <div className="col-4 col-sm-8 mt-2">
            <label>
              Booking Status <span className="text-danger">*</span>
            </label>
            <Switch
              checked={profile.bookingStatus}
              onChange={handleBookingStatusChange}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </div>
          <div className="col-12 mt-3">
  <label>Live Google Map Preview</label>
  <div className="border rounded shadow-sm" style={{ height: "300px", width: "100%" }}>
    <iframe
      title="Shop Location"
      src={
        profile.shopnlocation?.startsWith("https://www.google.com/maps/embed")
          ? profile.shopnlocation
          : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28934.458377838354!2d67.0576818!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f890d061c7f%3A0x1a147fa3c1d1707b!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1683566887073!5m2!1sen!2s"
      }
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>
          <div className="col-12 mt-4 d-flex justify-content-center align-items-end pb-5">
            <button className="bg-warning py-2 border-0 shadow ripple text-white rounded  w-50">
              Submit Details
            </button>
          </div>
        </div>
        
      </form>

    </div>
  );
};

export default ProfessionalProfile;
