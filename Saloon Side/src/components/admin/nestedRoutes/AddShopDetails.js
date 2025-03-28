import React, { useState } from "react";
import noImage from "../../../assets/noImage.jpg";
import ServicesList from "./Service component/ServicesList";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { getAuthSlice } from "../../../Redux/Slices/AuthSlice";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import { message } from "antd";
import { useEffect } from "react";
import Loader from "../../Loader/loader";
const AddShopDetails = () => {
  const [image, setImage] = useState("");
  const [saveImage, setSaveImage] = useState("");
  const [services, setServices] = useState([]);
  const [state, setState] = useState({
    serviceName: "",
    price: "",
    description: "",
    serviceImage: "",
  });
  const [messageAPI, context] = message.useMessage("");
  const notification = (message, varient) => {
    messageAPI.open({ type: varient, content: message });
  };
  const authID = useSelector(getAuthSlice);
  const id = authID[0].id;
  const storage = getStorage();
  const storageRef = ref(
    storage,
    `Professional/${id}/Services/` + saveImage.name
  );
  const dbRef = collection(db, `ProfessionalDB/${id}/Services/`);
  const onFormChange = (e) => {
    const { name, value } = e.target;

    setState((data) => {
      return { ...data, [name]: value };
    });
  };
  const getServices = async () => {
    const data = await getDocs(
      collection(db, "ProfessionalDB", `${id}`, "Services")
    );
    const get = data.docs.map((res) => ({
      ...res.data(),
      id: res.id,
    }));
    setServices(get);
  };

  // const services = "s";
  function ImageHandler(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setSaveImage(e.target.files[0]);
  }
  const SubmitHandler = async (e) => {
    e.preventDefault();
  
    if (image === "") {
      addDoc(dbRef, {
        ServiceName: state.serviceName,
        Price: state.price,
        Description: state.description,
        ServiceImage: "",
      })
        .then(() => {
          notification("Service Added !!", "success");
          getServices(); // Refresh services after adding
        })
        .catch((err) => {
          notification(err.message, "error");
        });
  
      setState({
        serviceName: "",
        price: "",
        description: "",
        serviceImage: "",
      });
      return;
    }
  
    const metadata = {
      contentType: "image",
    };
  
    await uploadBytes(storageRef, saveImage, metadata)
      .then(() =>
        getDownloadURL(storageRef).then((imageURL) =>
          addDoc(dbRef, {
            ServiceName: state.serviceName,
            Price: state.price,
            Description: state.description,
            ServiceImage: imageURL,
          })
        )
      )
      .then(() => {
        notification("Services Added Successfully !!!", "success");
        getServices(); // Refresh services after adding
      })
      .catch((err) => {
        notification(err.message, "error");
      });
  
    setState({
      serviceName: "",
      price: "",
      description: "",
      serviceImage: "",
    });
    setImage("");
  };
  
  useEffect(() => {
    getServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(image);
  return (
    
    <div className="bg-white p-2 h-sm-100">
      {context}
      <div className="pt-3 overflow-auto mb-3 pb-5">
        <h2 className="text-center pb-3">
        <span 
  className="border border-dark ps-2 py-2" 
  style={{ marginTop: "10px", display: "inline-block" }}
>
            Add{" "}
            <span className="text-white bg-black ps-1 pe-2 py-2">Services</span>
          </span>
        </h2>
        <form onSubmit={SubmitHandler}>
          <div className="row align-items-center">
            <div className="col-12 col-sm-6 col-md-5 mb-3">
            <div className="position-relative d-flex justify-content-center">
  <label
    htmlFor="addServiceImg"
    className="material-icons-outlined position-absolute bg-white text-black p-2 rounded-circle shadow"
    style={{ bottom: "10px", right: "10px", cursor: "pointer" }}
  >
    add_a_photo
  </label>
  <img
    src={image ? image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYv3B4_H9J6i2gaRikU_45_AaP727D3CGAw&s"}
    alt="Service Preview"
    className="shadow"
    style={{
      borderRadius: "20px", // Rounded corners
      maxWidth: "100%", // Prevent stretching
      height: "auto", // Maintain original aspect ratio
      objectFit: "cover", // Ensures proper scaling
    }}
  />
  <input
    id="addServiceImg"
    type="file"
    name="serviceImage"
    className="d-none"
    onChange={ImageHandler}
  />
</div>

            </div>
            <div className="col-12 col-sm-6 col-md-7">
              <div>
                <input
                  placeholder="Enter Service Name"
                  className="form-control"
                  name="serviceName"
                  value={state.serviceName}
                  required
                  onChange={onFormChange}
                />
                <input
                  placeholder="Enter Price"
                  type="number"
                  name="price"
                  value={state.price}
                  required
                  onChange={onFormChange}
                  className="form-control mt-2"
                />
                <textarea
                  placeholder="Enter description"
                  className="form-control mt-2"
                  name="description"
                  value={state.description}
                  onChange={onFormChange}
                />
                <button
                  type="submit"
                  className="py-2 bg-warning px-4 border-0 text-white rounded mt-2 shadow ripple"
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-4">
          <h5>
            Recently{" "}
            <span className="text-decoration-custom">added services</span>
          </h5>
          <button
  onClick={getServices}
  style={{
    backgroundColor: "#007bff", // Modern Blue
    color: "#fff",
    border: "none",
    padding: "6px", // Smaller padding
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",  // Small width
    height: "32px"  // Small height
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
>
  <span className="material-icons" style={{ fontSize: "20px" }}>
    refresh
  </span>
</button>


          <div className="mt-4 pb-3 overflow-auto" style={{ height: "200px" }}>
            {services.length === 0 ? (
              <div>
                <Loader />
              </div>
            ) : (
              <div>
                {services.map((doc) => (
                  <ServicesList
                    data={doc}
                    noImage={noImage}
                    setState={setState}
                    key={doc.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShopDetails;
