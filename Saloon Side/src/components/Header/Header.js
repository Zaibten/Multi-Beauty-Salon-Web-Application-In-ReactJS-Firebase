import React from "react";
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
// import { useState } from "react";

const Header = ({ isUser, isPro }) => {
  const [messageAPi, context] = message.useMessage();
  const sendMessage = (varient, textMessage) => {
    messageAPi.open({
      type: varient,
      content: textMessage,
    });
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOutHandle = () => {
    dispatch(userLogout());
    navigate("/");
    setTimeout(() => {
      let varient = "success";
      let textMessage = "User Logout !!!";
      sendMessage(varient, textMessage);
    }, 1200);
    store.dispatch(addAuth.deleteState(""));
  };
  const ProfessionalLogOUt = () => {
    dispatch(professionalLogOut());
    navigate("/");
    setTimeout(() => {
      let varient = "success";
      let textMessage = "Professional Logout !!!";
      sendMessage(varient, textMessage);
    }, 1200);
    store.dispatch(addAuth.deleteState(""));
  };
  const location = useLocation();
  const hideHeaderOnPath = [
    "/dashboard",
    "/dashboard/schedules-professional",
    "/dashboard/add-services",
    "/login",
  ];
  if (hideHeaderOnPath.includes(location.pathname)) {
    return <></>;
  }
  return (
   <div>
  <div>
    {context}
    <div className="text-white py-4" style={{ backgroundColor: "rgb(255, 230, 240)" }}>
      <div className="d-flex justify-content-between container-fluid px-sm-5 align-items-center">
        <Link to={"/"}>
          <img src={logo} width={130} alt="profile" /> {/* Enlarged logo */}
        </Link>

        {!isPro && (
          <div className="d-sm-none text-center">
            <h6
              className="text-decoration-underline border-0 bg-transparent fw-bold text-warning"
              data-mdb-toggle="modal"
              data-mdb-target="#exampleModal"
            >
              REGISTER AS PROFESSIONAL
            </h6>
          </div>
        )}

        <div className="d-flex">
          <div id="mainMenu">
            <div className="d-flex list-unstyled fw-bold">
              {!isPro && (
                <button
  className="me-5 text-decoration-underline border-0 fw-bold bg-transparent"
  style={{ color: "#ff69b4" }}
  data-mdb-toggle="modal"
  data-mdb-target="#exampleModal"
>
  REGISTER AS PROFESSIONAL
</button>

              )}

              {isUser ? (
                <Link to={"/schedule"} className="me-5 text-dark">
                  My Booking
                </Link>
              ) : isPro ? (
                <Link to={"/dashboard"} className="me-5 text-dark">
                  DASHBOARD
                </Link>
              ) : null}
            </div>
          </div>

          {(isUser || isPro) ? (
            <div className="dropdown">
              <a
                className="dropdown-toggle d-flex align-items-center hidden-arrow"
                href="#!"
                id="navbarDropdownMenuAvatar"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <img
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfyjxCdAYqLFK4WDxeMU_bJL3mmQiJq42Uag&s"
  className="rounded-circle"
  height="40"
  alt="Avatar"
  loading="lazy"
/>

              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuAvatar"
              >
                {isUser && (
                  <>
                    <li><Link to={"/user"} className="dropdown-item">My profile</Link></li>
                    <li><Link to={"/schedule"} className="dropdown-item">Booking</Link></li>
                    <li><button className="dropdown-item" onClick={logOutHandle}>Logout</button></li>
                  </>
                )}
                {isPro && (
                  <>
                    <li><Link to={"/dashboard"} className="dropdown-item">Dashboard</Link></li>
                    <li><button className="dropdown-item" onClick={ProfessionalLogOUt}>Logout</button></li>
                  </>
                )}
                {!isUser && !isPro && (
                  <li><NavLink to={"/login"} className="dropdown-item">Login</NavLink></li>
                )}
              </ul>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Professional Registration Modal */}
  <BarberRegister />
</div>

  );
};

export default Header;

