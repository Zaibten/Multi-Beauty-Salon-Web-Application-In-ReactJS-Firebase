import React, { useEffect, useState } from "react";
import Time from "../../../bookingTime/bookingTime";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import { getAuthSlice } from "../../../Redux/Slices/AuthSlice";
import { useSelector } from "react-redux";
import Loader from "../../Loader/loader";
import { message } from "antd";
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
  });
  const [messageApi, contextHolder] = message.useMessage();
  const MessageBox = (messageText, varient) => {
    messageApi.open({
      type: varient,
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
    if (id === "") {
      let messageText = "Failed! Please contact Admin";
      let varient = "error";
      MessageBox(messageText, varient);
      return;
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const ProfileImgHandle = (e) => {
    if (setProfileIMG.length === "") {
      let messageText = "Please Select Image if You want to !!";
      let varient = "warning";
      MessageBox(messageText, varient);
    }
    return setProfileIMG(URL.createObjectURL(e.target.files[0]));
  };
  const FormOnChangeHandler = (e) => {
    const { name, value } = e.target;
    setProfile((data) => {
      return { ...data, [name]: value };
    });
  };

  const ProfessionalFormSubmit = async (e) => {
    e.preventDefault();
    const DB = localStorage.getItem("data");
    const localDB = JSON.stringify(profile);
    if (localDB === DB) {
      let messageText = "Failed! Please Make Some Changes before Submit";
      let varient = "error";
      MessageBox(messageText, varient);
      return;
    }
    const docRef = doc(db, "ProfessionalDB", `${id}`);
    await setDoc(docRef, profile);
    localStorage.clear("data");
    let messageText = "Data Saved Successfully !!";
    let varient = "success";
    MessageBox(messageText, varient);
  };
  // console.log(data);
  return profile.name === "" ? (
    <Loader />
  ) : (
    <div className="w-100 bg-white p-3 h-100 overflow-auto pb-5">
      {contextHolder}
      <div className="d-flex justify-content-center mb-2 position-relative">
        <img
          alt="#"
          src={profileIMG || url}
          className="rounded-circle ripple"
          width={150}
          height={150}
        />
        <label
          htmlFor="img"
          id="imgUpdate"
          className="material-icons-outlined position-absolute bg-white p-2 rounded-circle shadow bottom-0 start-50"
        >
          add_a_photo
        </label>
        <input
          type="file"
          className="d-none"
          onChange={ProfileImgHandle}
          id="img"
        />
      </div>
      <form onSubmit={ProfessionalFormSubmit}>
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
