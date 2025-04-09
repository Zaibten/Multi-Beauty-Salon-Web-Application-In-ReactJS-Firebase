import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAuthSlice } from "../../../../Redux/Slices/AuthSlice";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../Firebase/firebase";

const ServicesList = ({ noImage, data, onUpdate }) => {
  const {
    ServiceImage,
    ServiceName,
    Price,
    Description,
    category,
    Category,
    id,
  } = data;

  const authID = useSelector(getAuthSlice);
  const ProID = authID[0].id;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: ServiceName || "",
    price: Price || "",
    description: Description || "",
    category: category || Category || "",
  });

  const DeleteHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "ProfessionalDB", `${ProID}`, "Services", `${id}`))
      .then(() => {
        alert(`Service with ID ${id} has been deleted successfully.`);
      })
      .catch((err) => console.log(err));
  };

  const UpdateHandler = () => {
    setShowModal(true); // Open the modal when the update button is clicked
  };

  const onFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    const docRef = doc(
      db,
      "ProfessionalDB",
      ProID, // the professional's ID
      "Services",
      id
    );

    await updateDoc(docRef, {
      ServiceName: formData.serviceName,
      Price: formData.price,
      Description: formData.description,
      category: formData.category,
    });

    alert("Service updated successfully!");
    setShowModal(false); // Close modal after updating
  };

  return (
    <>
      <div
        className="row border-bottom pb-2 mt-2"
        style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}
      >
        <div className="col-3 col-sm-2 d-flex align-items-center">
          <img
            alt="Service"
            src={
              ServiceImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYv3B4_H9J6i2gaRikU_45_AaP727D3CGAw&s"
            }
            className="rounded shadow ripple serviceImg"
            style={{ objectFit: "contain", width: "100px", height: "120px" }}
          />
        </div>
        <div className="col-7 col-sm-8 d-flex align-items-center">
          <div>
            <li className="fw-semibold">{ServiceName}</li>
            <li>Rs. {Price}</li>
            <li>{Description}</li>
            <li className="text-muted small">
              Category: {category || Category || "Not specified"}
            </li>
          </div>
        </div>
        <div className="col-2 col-sm-2 d-flex align-items-center">
          <span
            className="material-icons-outlined py-1 px-1 bg-warning text-white ripple shadow rounded servicebtn me-2"
            onClick={UpdateHandler}
            title="Update Service"
          >
            edit_note
          </span>
          <span
            className="material-icons-outlined py-1 px-1 bg-danger text-white ripple shadow rounded servicebtn"
            onClick={DeleteHandler}
            title="Delete Service"
          >
            delete
          </span>
        </div>
      </div>

      {/* Modal for Updating Service */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5 className="modal-title">Update Service</h5>

              <select
                className="form-control mt-2 mb-2"
                name="category"
                value={formData.category}
                onChange={onFormChange}
              >
                <option value="">Select Service Category</option>
                <option value="Hair services">Hair services</option>
                <option value="Skin Care services">Skin Care services</option>
                <option value="Hair Removal services">Hair Removal services</option>
                <option value="Hand & Foot care">Hand & Foot care</option>
                <option value="Makeup Services">Makeup Services</option>
                <option value="Body Treatments">Body Treatments</option>
                <option value="Packages">Packages</option>
              </select>

              <input
                className="form-control"
                placeholder="Enter Service Name"
                name="serviceName"
                value={formData.serviceName}
                onChange={onFormChange}
              />
              <input
                className="form-control mt-2"
                placeholder="Enter Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={onFormChange}
              />
              <textarea
                className="form-control mt-2"
                placeholder="Enter Description"
                name="description"
                value={formData.description}
                onChange={onFormChange}
              ></textarea>

              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={handleUpdateSubmit}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesList;
