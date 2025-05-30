import React, { useEffect, useState } from "react";
import Time from "../../../bookingTime/bookingTime";
import { doc, getDoc,deleteDoc, setDoc, collection, getDocs, query, where  } from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import { getAuthSlice } from "../../../Redux/Slices/AuthSlice";
import { useSelector } from "react-redux";
import Loader from "../../Loader/loader";
import { message } from "antd";
import { Switch } from "antd"; // Importing Ant Design Switch component

const url =
  "https://img.freepik.com/premium-vector/fist-with-lbtbi-wristband_24908-77160.jpg?size=626&ext=jpg";

const ArtistPortfolioAdmin = () => {
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

  
  const handleDeleteArtist = async (artistId) => {
    await deleteDoc(doc(db, "ArtistPortfolio", artistId));
    MessageBox("Artist deleted successfully", "success");
    fetchArtists();
  };
  
  const handleEditArtist = (artistData) => {
    setArtist({
      name: artistData.name,
      description: artistData.description,
      role: artistData.role,
      imageLink: artistData.imageLink || ""
    });
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
    role: "",
    imageLink: "",
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
    
   
      {contextHolder}
      <div  style={{ marginBottom: '15%', visibility: 'visible', display: 'block' }}>
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
  

      <div className="mt-6 px- py-2 max-w-7xl mx-auto bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl transition-all duration-700 ease-in-out transform hover:shadow-purple-300 hover:scale-[1.01]">
 <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-center text-gray-800 mb-5 animate-fade-in">
  ARTIST PORTFOLIO
</h2>


  {/* Form Inputs */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
    <input
      type="text"
      name="name"
      value={artist.name}
      onChange={handleArtistChange}
      placeholder="Artist Name"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300 shadow-sm"
    />
    <input
      type="text"
      name="description"
      value={artist.description}
      onChange={handleArtistChange}
      placeholder="Artist Description"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all duration-300 shadow-sm"
    />
    <input
      type="text"
      name="role"
      value={artist.role}
      onChange={handleArtistChange}
      placeholder="Artist Role"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition-all duration-300 shadow-sm"
    />
    <input
      type="text"
      name="imageLink"
      value={artist.imageLink}
      onChange={handleArtistChange}
      placeholder="Image URL"
      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all duration-300 shadow-sm"
    />
  </div>

  {/* Save Button */}
  <div className="flex justify-center">
<button
  type="button"
  onClick={saveArtistPortfolio}
  className="py-2 px-4 border-0 shadow text-white rounded w-full max-w-md"
  style={{ backgroundColor: '#ff69b4' }}
>
  Submit Artist Portfolio
</button>


  </div>
  <br></br>
  <br></br>
  <br></br>

  {/* Artist Table */}
  <div className="mt-12">
  <h3 className="text-2xl font-bold text-gray-700 mb-2">SAVED ARTISTS</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
      <thead className="bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800 text-left">
        <tr>
          <th className="p-4 font-semibold w-1/5">Name</th>
          <th className="p-4 font-semibold w-3/5">Description</th>
          <th className="p-4 font-semibold w-1/5">Role</th>
          <th className="p-4 font-semibold w-1/5">Action</th>
        </tr>
      </thead>
      <tbody>
        {artistsList.map((art, index) => (
          <tr
            key={index}
            className="border-t hover:bg-purple-50 transition-colors duration-200 align-top"
          >
            <td className="p-4 break-words">{art.name}</td>
            <td className="p-4 break-words whitespace-pre-wrap">{art.description}</td>
            <td className="p-4 break-words">{art.role}</td>
            <td className="p-4 break-words">
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this artist?")) {
                    handleDeleteArtist(art.id);
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

</div>


    </div>
  );
};

export default ArtistPortfolioAdmin;
