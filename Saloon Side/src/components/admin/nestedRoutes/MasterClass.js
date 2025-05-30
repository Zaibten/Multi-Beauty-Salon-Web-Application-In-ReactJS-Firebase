import React, { useEffect, useState } from "react";
import { db } from "../../../Firebase/firebase";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { message, Switch, Modal, Input, Button, Select } from "antd";
import Loader from "../../Loader/loader";

const { Option } = Select;

const inputGroupStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};

const MasterClasses = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tutorialLink: "",
    bookingAvailable: false,
    maxBookings: "",
    category: "Master Class",
    artistName: "",
    selectedSaloon: ""
  });

  const [classes, setClasses] = useState({ tutorials: [], masterClasses: [] });
  const [loading, setLoading] = useState(false);
  const [saloons, setSaloons] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    fetchClasses();
    fetchSaloons();
  }, []);

  const fetchClasses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "MasterClasses"));
      const tutorials = [];
      const masterClasses = [];

      snapshot.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.category === "Tutorial") {
          tutorials.push(data);
        } else {
          masterClasses.push(data);
        }
      });

      setClasses({ tutorials, masterClasses });
    } catch (error) {
      console.error(error);
      message.error("Failed to load master classes");
    }
  };

  const fetchSaloons = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Salons"));
      const saloonList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSaloons(saloonList);
    } catch (err) {
      console.error(err);
      message.error("Failed to load saloons");
    }
  };
useEffect(() => {
  const localUser = JSON.parse(localStorage.getItem("data"));
  const localShopName = localUser?.shopName?.toLowerCase();

  setFormData(prev => ({
    ...prev,
    selectedSaloon: localShopName || ""
  }));
}, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      selectedSaloon: value
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      bookingAvailable: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  const { name, description, tutorialLink, maxBookings, category, artistName, selectedSaloon } = formData;


  if (category === "Master Class") {
  if (!name || !artistName || !selectedSaloon || maxBookings === "") {
    return message.warning("Please fill all fields for master class.");
  }
  
  const maxBookingsNum = parseInt(maxBookings, 10);
  if (isNaN(maxBookingsNum) || maxBookingsNum < 0) {
    return message.warning("Max Bookings cannot be negative or invalid.");
  }
}


  if (category === "Tutorial") {
    if (!name || !tutorialLink) return message.warning("Please fill title and link for tutorial.");
  } else {
    if (!name || !artistName || !selectedSaloon || !maxBookings) {
      return message.warning("Please fill all fields for master class.");
    }
  }

    setLoading(true);
    try {
      const newDocRef = doc(collection(db, "MasterClasses"));
      await setDoc(newDocRef, {
        ...formData,
        maxBookings: parseInt(formData.maxBookings),
      });

      message.success(`${category} added`);
      setFormData({
        name: "",
        description: "",
        tutorialLink: "",
        bookingAvailable: false,
        maxBookings: "",
        category: formData.category,
        artistName: "",
        selectedSaloon: ""
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
      message.error("Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this class?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDoc(doc(db, "MasterClasses", id));
          message.success("Deleted successfully");
          fetchClasses();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete");
        }
      }
    });
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setEditModalVisible(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingClass(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSwitch = (checked) => {
    setEditingClass(prev => ({
      ...prev,
      bookingAvailable: checked
    }));
  };

  const handleUpdate = async () => {
    try {
      const maxBookingsNum = parseInt(editingClass.maxBookings, 10);
if (isNaN(maxBookingsNum) || maxBookingsNum < 0) {
  return message.warning("Max Bookings cannot be negative or invalid.");
}
await updateDoc(doc(db, "MasterClasses", editingClass.id), {
  ...editingClass,
  maxBookings: maxBookingsNum,
});

      await updateDoc(doc(db, "MasterClasses", editingClass.id), {
        ...editingClass,
        maxBookings: parseInt(editingClass.maxBookings)
      });
      message.success("Updated successfully");
      setEditModalVisible(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err) {
      console.error(err);
      message.error("Failed to update");
    }
  };

  if (loading) return <Loader />;

  return (
<div style={{
    padding: "30px",
    maxWidth: "100%",
    // Remove or set marginTop to a small value or 0
    marginTop: "0",
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    height: "100vh", // full viewport height
    display: "flex",
    flexDirection: "column",
  }}>
    <h2 style={{ textAlign: "center", color: "#ff4da6", marginBottom: "30px" }}>
        {formData.category === "Tutorial" ? "ADD TUTORIAL" : "ADD MASTER CLASS"}
      </h2>

  <form onSubmit={handleSubmit}>
  <div style={inputGroupStyle}>
    <label>Title:</label>
    <Input name="name" value={formData.name} onChange={handleChange} />
  </div>

  {formData.category === "Master Class" && (
    <>
      <div style={inputGroupStyle}>
        <label>Artist Name:</label>
        <Input name="artistName" value={formData.artistName} onChange={handleChange} />
      </div>

      <div style={inputGroupStyle}>
        <label>Salon Name:</label>
        <Input value={formData.selectedSaloon} readOnly />
      </div>
    </>
  )}

  {/* Show tutorialLink ONLY for Tutorials */}
  {formData.category === "Tutorial" && (
    <div style={inputGroupStyle}>
      <label>Tutorial Link:</label>
      <Input name="tutorialLink" value={formData.tutorialLink} onChange={handleChange} />
    </div>
  )}

  {formData.category === "Master Class" && (
    <>
      <Input
  type="number"
  name="maxBookings"
  min={0}  // This prevents negative numbers in UI for many browsers
  value={formData.maxBookings}
  onChange={handleChange}
/>

      <div style={{ marginBottom: "20px" }}>
        <label>Booking Available:</label><br />
        <Switch checked={formData.bookingAvailable} onChange={handleSwitchChange} />
      </div>
    </>
  )}

  <div style={inputGroupStyle}>
    <label>Category:</label>
    <Switch
      checked={formData.category === "Tutorial"}
      onChange={(checked) => setFormData(prev => ({
        ...prev,
        category: checked ? "Tutorial" : "Master Class",
        tutorialLink: checked ? prev.tutorialLink : "" // reset link if switching to Master Class
      }))}
      checkedChildren="Tutorial"
      unCheckedChildren="Master Class"
    />
  </div>

  <Button type="primary" htmlType="submit" style={{ backgroundColor: "#ff4da6", borderColor: "#ff4da6" }}>
    Submit
  </Button>
</form>


      {/* LISTING DISPLAY CAN REMAIN SAME */}

      <div style={{ marginTop: "50px" }}>
        {/* Tutorial List */}
        <h3 style={{ color: "#333", marginBottom: "20px" }}>Tutorials</h3>
        {classes.tutorials.length === 0 ? (
          <p>No tutorials found.</p>
        ) : (
          classes.tutorials.map(cls => (
            <div key={cls.id} style={cardStyle}>
              <h4>{cls.name}</h4>
              <p><b>Link:</b> <a href={cls.tutorialLink} target="_blank" rel="noreferrer">Watch</a></p>
              <Button onClick={() => openEditModal(cls)} style={{ marginRight: 10 }}>Edit</Button>
              <Button danger onClick={() => handleDelete(cls.id)}>Delete</Button>
            </div>
          ))
        )}

        {/* Master Class List */}
        <h3 style={{ color: "#333", marginTop: "50px", marginBottom: "20px" }}>Master Classes</h3>
        {classes.masterClasses.length === 0 ? (
          <p>No master classes found.</p>
        ) : (
          classes.masterClasses.map(cls => (
            <div key={cls.id} style={cardStyle}>
              <h4>{cls.name}</h4>
              <p><b>Artist:</b> {cls.artistName}</p>
              <p><b>Saloon:</b> {cls.selectedSaloon}</p>
              <p><b>Link:</b> <a href={cls.tutorialLink} target="_blank" rel="noreferrer">Watch</a></p>
              <p><b>Booking:</b> {cls.bookingAvailable ? "Available" : "Closed"} | <b>Max:</b> {cls.maxBookings}</p>
              <Button onClick={() => openEditModal(cls)} style={{ marginRight: 10 }}>Edit</Button>
              <Button danger onClick={() => handleDelete(cls.id)}>Delete</Button>
            </div>
          ))
        )}
      </div>

{/* Edit Modal */}
<Modal
  title="Update Class"
  open={editModalVisible}
  onCancel={() => setEditModalVisible(false)}
  onOk={handleUpdate}
  okText="Update"
>
  {editingClass && (
    <>
      {/* Title */}
      <div style={inputGroupStyle}>
        <label>Title:</label>
        <Input
          name="name"
          value={editingClass.name}
          onChange={handleEditChange}
        />
      </div>

      {/* Description */}
      <div style={inputGroupStyle}>
        <label>Description:</label>
        <Input
          name="description"
          value={editingClass.description}
          onChange={handleEditChange}
        />
      </div>

      {/* Category Switch */}
      <div style={inputGroupStyle}>
        <label>Category:</label>
        <Switch
          checked={editingClass.category === "Tutorial"}
          onChange={(checked) =>
            setEditingClass((prev) => ({
              ...prev,
              category: checked ? "Tutorial" : "Master Class",
              tutorialLink: checked ? prev.tutorialLink : "", // reset tutorialLink if switching
            }))
          }
          checkedChildren="Tutorial"
          unCheckedChildren="Master Class"
        />
      </div>

      {/* Tutorial Link - only show if category is Tutorial */}
      {editingClass.category === "Tutorial" && (
        <div style={inputGroupStyle}>
          <label>Tutorial Link:</label>
          <Input
            name="tutorialLink"
            value={editingClass.tutorialLink}
            onChange={handleEditChange}
          />
        </div>
      )}

      {/* Master Class Fields */}
      {editingClass.category === "Master Class" && (
        <>
          <div style={inputGroupStyle}>
            <label>Artist Name:</label>
            <Input
              name="artistName"
              value={editingClass.artistName}
              onChange={handleEditChange}
            />
          </div>

          <div style={inputGroupStyle}>
            <label>Salon Name:</label>
            <Input
              name="selectedSaloon"
              value={editingClass.selectedSaloon}
              onChange={handleEditChange}
              readOnly
            />
          </div>

          <Input
  type="number"
  name="maxBookings"
  min={0}
  value={editingClass.maxBookings}
  onChange={handleEditChange}
/>


          <div style={{ marginBottom: "20px" }}>
            <label>Booking Available:</label>
            <br />
            <Switch
              checked={editingClass.bookingAvailable}
              onChange={handleEditSwitch}
            />
          </div>
        </>
      )}
    </>
  )}
</Modal>

    </div>
  );
};

const cardStyle = {
  padding: "15px",
  marginBottom: "15px",
  background: "#fff0f5",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

export default MasterClasses;
