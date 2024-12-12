import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.png";
import BarberRegister from "../Pages/BarberRegister";
import store from "../../Redux/reduxStore";
import { addAuth } from "../../Redux/Slices/AuthSlice";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { professionalLogOut } from "../../Redux/Slices/professionalRedux";
import { userLogout } from "../../Redux/Slices/UserRedux";

const Header = () => {
  const [email, setEmail] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendMessage = (textMessage) => {
    alert(textMessage); // Use native `alert` for feedback
  };

  const logOutHandle = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out? This will log you out of your account."
    );
    if (confirmLogout) {
      dispatch(userLogout());
      dispatch(professionalLogOut()); // Logout for both user and professional
      localStorage.setItem("email", ""); // Clear email in localStorage
      localStorage.removeItem("userState"); // Optional: Remove user-related data
      setEmail(null); // Reset email in state
      navigate("/");
      sendMessage("Logout Successful!");
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      localStorage.setItem("email", email);
    }
  }, [email]);

  const location = useLocation();
  const hideHeaderOnPath = [
    "/dashboard",
    "/dashboard/schedules-professional",
    "/dashboard/add-services",
    "/login",
  ];

  if (hideHeaderOnPath.includes(location.pathname)) {
    return null;
  }

  return (
    <div>
      <div className="navbar-container">
        <div className="marquee-header">
          <span>
            Welcome to our platform! Get the best services at amazing prices.
          </span>
        </div>
        <div className="navbar">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <Link to="/">
              <img src={logo} className="navbar-logo" alt="profile" />
            </Link>
            <Link to="/" className="company-name-link">
              <span className="company-name animated-text">BEAUTY SALON</span>
            </Link>
            <div className="d-flex">
              <div id="mainMenu">
                <div className="d-flex list-unstyled">
                  <Link to="" className="navbar-linkemail me-5">
                    {email && (
                      <div className="user-email-display">
                        <p>Welcome: {email}</p>
                      </div>
                    )}
                  </Link>
                  <Link to="/search" className="navbar-link me-5">
                    Salons
                  </Link>
                  <Link to="/contact-us" className="navbar-link me-5">
                    Contact Us
                  </Link>
                  <Link to="/help" className="navbar-link me-5">
                    Help
                  </Link>
                </div>
              </div>
              {email ? (
                <div className="dropdown">
                  <a
                    className="dropdown-toggle d-flex align-items-center hidden-arrow"
                    href="#!"
                    id="navbarDropdownMenuAvatar"
                    role="button"
                    data-mdb-toggle="dropdown"
                  >
                    <img
                      src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
                      className="navbar-avatar"
                      alt="User Avatar"
                      loading="lazy"
                    />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdownMenuAvatar"
                  >
                    <li>
                      <Link to="/Profile" className="dropdown-item">
                        My profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/schedule" className="dropdown-item">
                        Booking
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={logOutHandle}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink to="/login" className="login-btn">
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
      <BarberRegister />
    </div>
  );
};

export default Header;
