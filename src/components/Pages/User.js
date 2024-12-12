import React, { useState, useEffect } from "react";
import "./User.css";
import Slider from "react-slick";
import { Rate } from "antd";

const User = () => {
  const [email, setEmail] = useState(localStorage.getItem("email"));

  useEffect(() => {
    // Retrieve email from local storage on component mount
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  const Slide = {
    infinite: false,
    arrows: false,
    speed: 500,
    useTransform: true,
    slidesToShow: 3.2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3.2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2.5,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.3,
          arrows: false,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="user-page">
      <div className="container mb-5">
        <h3 className="text-center mt-3 mb-3 text-white">
          <span className="border py-2 ps-3 text-white">
            Profile <span className="py-2 pe-3 bg-white text-black">Page</span>
          </span>
        </h3>
        <div className="profile-page">
          <div className="row">
            <div className="col-12 col-sm-6 d-flex justify-content-center">
              <img
                src="https://img.freepik.com/premium-vector/realistic-sunbed-illustration_23-2149443982.jpg?size=626&ext=jpg"
                alt=""
                className="w-50 w-sm-50 rounded-circle"
              />
            </div>
            <div className="col-12 col-sm-6 text-white">
              <div className="d-flex align-items-center position-relative">
                <span className="material-icons-outlined">person_outline</span>
                <div className="ms-3">
                  <label className="d-block text-secondary">Name</label>
                  <label className="fw-semibold">John Doe</label>
                </div>
              </div>
              <div className="d-flex align-items-center position-relative mt-2">
                <span className="material-icons-outlined">email</span>
                <div className="ms-3">
                  <label className="d-block text-secondary">Email</label>
                  <label className="fw-semibold">{email}</label>
                </div>
              </div>
              <div className="d-flex align-items-center position-relative mt-2">
                <span className="material-icons-outlined">call</span>
                <div className="ms-3">
                  <label className="d-block text-secondary">Number</label>
                  <label className="fw-semibold">123-456-7890</label>
                </div>
              </div>
              <div className="d-flex align-items-center position-relative mt-2">
                <span className="material-icons-outlined">home</span>
                <div className="ms-3">
                  <label className="d-block text-secondary">Address</label>
                  <label className="fw-semibold">123 Main St, City, Country</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black mb-4 mt-5">
        <div className="container">
          <h4 className="text-center mt-4 mb-5 text-white">
            <span className="border py-2 pe-2 text-white">
              <span className="py-2 px-2 bg-white text-black">Shops</span> You{" "}
              <span className="text-decoration-underline">Visited Before</span>
            </span>
          </h4>
          <div>
            <Slider {...Slide}>
              <div>
                <img
                  src="https://img.freepik.com/premium-vector/vintage-logo-barber-shop-vector-illustration_831416-112.jpg?size=626&ext=jpg"
                  alt=""
                  className="w-75"
                />
                <div>
                  <Rate tooltips={["terrible", "bad", "normal", "good", "wonderful"]} onChange={() => {}} value={5} />
                </div>
              </div>
              {/* Add more slider items if necessary */}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
