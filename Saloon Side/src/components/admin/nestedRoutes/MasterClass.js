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
import { message, Switch, Modal, Input, Button } from "antd";
import Loader from "../../Loader/loader";

const MasterClasses = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tutorialLink: "",
    bookingAvailable: false,
    maxBookings: "",
    category: "Master Class" // Default category
  });

  const [classes, setClasses] = useState({ tutorials: [], masterClasses: [] });
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    fetchClasses();
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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
    if (!formData.name || !formData.description || !formData.tutorialLink || !formData.maxBookings) {
      return message.warning("Please fill all fields");
    }

    if (isNaN(formData.maxBookings) || parseInt(formData.maxBookings) <= 0) {
      return message.warning("Max bookings must be a valid positive number");
    }

    setLoading(true);
    try {
      const newDocRef = doc(collection(db, "MasterClasses"));
      await setDoc(newDocRef, {
        ...formData,
        maxBookings: parseInt(formData.maxBookings),
      });
      message.success("Master Class added");
      setFormData({
        name: "",
        description: "",
        tutorialLink: "",
        bookingAvailable: false,
        maxBookings: "",
        category: "Master Class"
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
    if (!editingClass.tutorialLink || !editingClass.maxBookings) {
      return message.warning("Please fill all fields");
    }

    try {
      await updateDoc(doc(db, "MasterClasses", editingClass.id), {
        tutorialLink: editingClass.tutorialLink,
        bookingAvailable: editingClass.bookingAvailable,
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
      marginTop: "50%",
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    }}>
    <br></br>
    <br></br>
    <br></br>
    <br></br>
      <h2 style={{ textAlign: "center", color: "#ff4da6", marginBottom: "30px" }}>Add Master Class</h2>
      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label>Name:</label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div style={inputGroupStyle}>
          <label>Description:</label>
          <Input.TextArea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div style={inputGroupStyle}>
          <label>Tutorial Link:</label>
          <Input name="tutorialLink" value={formData.tutorialLink} onChange={handleChange} />
        </div>
        <div style={inputGroupStyle}>
          <label>Max Bookings:</label>
          <Input type="number" name="maxBookings" value={formData.maxBookings} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>Booking Available:</label><br />
          <Switch checked={formData.bookingAvailable} onChange={handleSwitchChange} />
        </div>
        <div style={inputGroupStyle}>
          <label>Category:</label>
          <Switch
            checked={formData.category === "Tutorial"}
            onChange={(checked) => setFormData(prev => ({
              ...prev,
              category: checked ? "Tutorial" : "Master Class"
            }))}
            checkedChildren="Tutorial"
            unCheckedChildren="Master Class"
          />
        </div>
        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#ff4da6", borderColor: "#ff4da6" }}>Submit</Button>
      </form>

      <div style={{ marginTop: "50px" }}>
        <h3 style={{ color: "#333", marginBottom: "20px" }}>Tutorials</h3>
        {classes.tutorials.length === 0 ? (
          <p>No tutorials found.</p>
        ) : (
          classes.tutorials.map((cls) => (
            <div
              key={cls.id}
              style={{
                padding: "15px",
                marginBottom: "15px",
                background: "#fff0f5",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <h4 style={{ margin: 0, color: "#d63384" }}>{cls.name}</h4>
              <p>{cls.description}</p>
              <p><b>Tutorial:</b> <a href={cls.tutorialLink} target="_blank" rel="noreferrer">Watch</a></p>
              <p><b>Booking:</b> {cls.bookingAvailable ? "Available" : "Closed"} | <b>Max:</b> {cls.maxBookings}</p>
              <Button
                onClick={() => openEditModal(cls)}
                style={{ marginRight: 10 }}
              >Edit</Button>
              <Button
                danger
                onClick={() => handleDelete(cls.id)}
              >Delete</Button>
            </div>
          ))
        )}

        <h3 style={{ color: "#333", marginTop: "50px", marginBottom: "20px" }}>Master Classes</h3>
        {classes.masterClasses.length === 0 ? (
          <p>No master classes found.</p>
        ) : (
          classes.masterClasses.map((cls) => (
            <div
              key={cls.id}
              style={{
                padding: "15px",
                marginBottom: "15px",
                background: "#fff0f5",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <h4 style={{ margin: 0, color: "#d63384" }}>{cls.name}</h4>
              <p>{cls.description}</p>
              <p><b>Tutorial:</b> <a href={cls.tutorialLink} target="_blank" rel="noreferrer">Watch</a></p>
              <p><b>Booking:</b> {cls.bookingAvailable ? "Available" : "Closed"} | <b>Max:</b> {cls.maxBookings}</p>
              <Button
                onClick={() => openEditModal(cls)}
                style={{ marginRight: 10 }}
              >Edit</Button>
              <Button
                danger
                onClick={() => handleDelete(cls.id)}
              >Delete</Button>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        title="Update Booking Details"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleUpdate}
        okText="Update"
      >
        {editingClass && (
          <div>
            <div style={inputGroupStyle}>
              <label>Tutorial Link:</label>
              <Input name="tutorialLink" value={editingClass.tutorialLink} onChange={handleEditChange} />
            </div>
            <div style={inputGroupStyle}>
              <label>Max Bookings:</label>
              <Input type="number" name="maxBookings" value={editingClass.maxBookings} onChange={handleEditChange} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Booking Available:</label><br />
              <Switch checked={editingClass.bookingAvailable} onChange={handleEditSwitch} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const inputGroupStyle = {
  marginBottom: "20px"
};

export default MasterClasses;
