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
        <div className="bg-black text-white py-2">
          <div className="d-flex justify-content-between container-fluid px-sm-5 align-items-center">
            <Link to={"/"}>
              <img src={logo} width={50} alt="profile" />
            </Link>
            {isPro ? ( //condition when Professional log in
              ""
            ) : (
              //condition when user log in
              <div className="d-sm-none text-center">
                <h6
                  to={"/professional-register"}
                  className="text-decoration-underline border-0 bg-black fw-bold text-warning"
                  data-mdb-toggle="modal"
                  data-mdb-target="#exampleModal"
                >
                  Register as Professional
                </h6>
              </div>
            )}

            <div className="d-flex">
              <div id="mainMenu">
                <div className="d-flex list-unstyled fw-bold ">
                  {isPro ? (
                    ""
                  ) : (
                    <button
                      to={"/professional-register"}
                      className="me-5 text-decoration-underline border-0 fw-bold bg-black text-warning"
                      data-mdb-toggle="modal"
                      data-mdb-target="#exampleModal"
                    >
                      Register as Professional
                    </button>
                  )}

                  {isUser ? (
                    <Link to={"/schedule"} className="me-5 text-white">
                      My Booking
                    </Link>
                  ) : isPro ? (
                    <Link to={"/dashboard"} className="me-5 text-white">
                      Dashboard
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {isUser || isPro ? (
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
                      src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.2.1543915203.1685795707&semt=ais"
                      className="rounded"
                      height="30"
                      alt="Black and White Portrait of a Man"
                      loading="lazy"
                    />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdownMenuAvatar"
                  >
                    {isUser ? (
                      <span>
                        <li>
                          <Link to={"/user"} className="dropdown-item">
                            My profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={"/schedule"}
                            className="dropdown-item"
                            href="#"
                          >
                            Booking
                          </Link>
                        </li>
                      </span>
                    ) : isPro ? (
                      <li>
                        <Link
                          to={"/dashboard"}
                          className="dropdown-item"
                          href="#"
                        >
                          Dashboard
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                    {isUser ? (
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={logOutHandle}
                        >
                          Logout
                        </button>
                      </li>
                    ) : isPro ? (
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={ProfessionalLogOUt}
                        >
                          Logout
                        </button>
                      </li>
                    ) : (
                      <li>
                        <NavLink to={"/login"} className="dropdown-item">
                          Login
                        </NavLink>
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                <div>
                 
                </div>
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

