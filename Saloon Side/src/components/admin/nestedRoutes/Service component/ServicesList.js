import React from "react";
import { useSelector } from "react-redux";
import { getAuthSlice } from "../../../../Redux/Slices/AuthSlice";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../../Firebase/firebase";

const ServicesList = ({ noImage, data }) => {
  const { ServiceImage, ServiceName, Price, Description, id } = data;
  const authID = useSelector(getAuthSlice);
  const ProID = authID[0].id;

  // const UpdateHandle = () => {
  //   alert(`Service ID : ${id}`);
  // };

  const DeletHandler = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return; // If user cancels, do nothing
  
    await deleteDoc(doc(db, "ProfessionalDB", `${ProID}`, "Services", `${id}`))
      .then(() => {
        alert(`Service with ID ${id} has been deleted successfully.`);
      })
      .catch((err) => console.log(err));
  };
  

  return (
    <div
      className="row border-bottom pb-2 mt-2"
      style={{ maxHeight: "300px", overflowY: "auto" }} // Scrollable list
    >
      <div className="col-3 col-sm-2 d-flex align-items-center">
        <img
          alt=""
          src={ServiceImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYv3B4_H9J6i2gaRikU_45_AaP727D3CGAw&s"}
          className="rounded shadow ripple serviceImg"
          style={{ objectFit: "contain", width: "100px", height: "120px" }} // Bigger image
        />
      </div>
      <div className="col-7 col-sm-8 d-flex align-items-center">
        <div>
          <li className="fw-semibold">{ServiceName}</li>
          <li>{Price}</li>
          <li>{Description}</li>
        </div>
      </div>
      <div className="col-2 col-sm-2 d-flex align-items-center">
        {/* <span
          className="material-icons-outlined py-1 px-1 bg-warning text-white ripple shadow rounded ms-2 servicebtn"
          onClick={UpdateHandle}
        >
          edit_note
        </span> */}
        <span
          className="material-icons-outlined py-1 px-1 bg-danger text-white ripple shadow rounded ms-2 servicebtn"
          onClick={DeletHandler}
        >
          delete
        </span>
      </div>
    </div>
  );
};

export default ServicesList;
