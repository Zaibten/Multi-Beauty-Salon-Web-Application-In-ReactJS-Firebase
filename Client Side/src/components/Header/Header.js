// import React from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import "./Header.css";
// import logo from "../../assets/logo.png";
// import BarberRegister from "../Pages/BarberRegister";
// import store from "../../Redux/reduxStore";
// import { addAuth } from "../../Redux/Slices/AuthSlice";
// import { message } from "antd";
// import { useDispatch } from "react-redux";
// import { professionalLogOut } from "../../Redux/Slices/professionalRedux";
// import { userLogout } from "../../Redux/Slices/UserRedux";
// // import { useState } from "react";

// const Header = ({ isUser, isPro }) => {
//   const [messageAPi, context] = message.useMessage();
//   const sendMessage = (varient, textMessage) => {
//     messageAPi.open({
//       type: varient,
//       content: textMessage,
//     });
//   };
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const logOutHandle = () => {
//     dispatch(userLogout());
//     navigate("/");
//     setTimeout(() => {
//       let varient = "success";
//       let textMessage = "User Logout !!!";
//       sendMessage(varient, textMessage);
//     }, 1200);
//     store.dispatch(addAuth.deleteState(""));
//   };
//   const ProfessionalLogOUt = () => {
//     dispatch(professionalLogOut());
//     navigate("/");
//     setTimeout(() => {
//       let varient = "success";
//       let textMessage = "Professional Logout !!!";
//       sendMessage(varient, textMessage);
//     }, 1200);
//     store.dispatch(addAuth.deleteState(""));
//   };
//   const location = useLocation();
//   const hideHeaderOnPath = [
//     "/dashboard",
//     "/dashboard/schedules-professional",
//     "/dashboard/add-services",
//     "/login",
//   ];
//   if (hideHeaderOnPath.includes(location.pathname)) {
//     return <></>;
//   }
//   return (
//     <div>
//       <div>
//         {context}
//         <div className="bg-black text-white py-2">
//           <div className="d-flex justify-content-between container-fluid px-sm-5 align-items-center">
//             <Link to={"/"}>
//               <img src={logo} width={50} alt="profile" />
//             </Link>
//             {isPro ? ( //condition when Professional log in
//               ""
//             ) : (
//               //condition when user log in
//               <div className="d-sm-none text-center">
//                 <h6
//                   to={"/professional-register"}
//                   className="text-decoration-underline border-0 bg-black fw-bold text-warning"
//                   data-mdb-toggle="modal"
//                   data-mdb-target="#exampleModal"
//                 >
//                   Register as Professional
//                 </h6>
//               </div>
//             )}

//             <div className="d-flex">
//               <div id="mainMenu">
//                 <div className="d-flex list-unstyled fw-bold ">
//                   {isPro ? (
//                     ""
//                   ) : (
//                     <button
//                       to={"/professional-register"}
//                       className="me-5 text-decoration-underline border-0 fw-bold bg-black text-warning"
//                       data-mdb-toggle="modal"
//                       data-mdb-target="#exampleModal"
//                     >
//                       Register as Professional
//                     </button>
//                   )}

//                   {isUser ? (
//                     <Link to={"/schedule"} className="me-5 text-white">
//                       My Booking
//                     </Link>
//                   ) : isPro ? (
//                     <Link to={"/dashboard"} className="me-5 text-white">
//                       Dashboard
//                     </Link>
//                   ) : (
//                     ""
//                   )}

//                   <Link to={"/help"} className="me-5 text-white">
//                     Help
//                   </Link>
//                 </div>
//               </div>
//               {isUser || isPro ? (
//                 <div className="dropdown">
//                   <a
//                     className="dropdown-toggle d-flex align-items-center hidden-arrow"
//                     href="#!"
//                     id="navbarDropdownMenuAvatar"
//                     role="button"
//                     data-mdb-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     <img
//                       src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=626&ext=jpg&ga=GA1.2.1543915203.1685795707&semt=ais"
//                       className="rounded"
//                       height="30"
//                       alt="Black and White Portrait of a Man"
//                       loading="lazy"
//                     />
//                   </a>
//                   <ul
//                     className="dropdown-menu dropdown-menu-end"
//                     aria-labelledby="navbarDropdownMenuAvatar"
//                   >
//                     {isUser ? (
//                       <span>
//                         <li>
//                           <Link to={"/user"} className="dropdown-item">
//                             My profile
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             to={"/schedule"}
//                             className="dropdown-item"
//                             href="#"
//                           >
//                             Booking
//                           </Link>
//                         </li>
//                       </span>
//                     ) : isPro ? (
//                       <li>
//                         <Link
//                           to={"/dashboard"}
//                           className="dropdown-item"
//                           href="#"
//                         >
//                           Dashboard
//                         </Link>
//                       </li>
//                     ) : (
//                       ""
//                     )}
//                     {isUser ? (
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={logOutHandle}
//                         >
//                           Logout
//                         </button>
//                       </li>
//                     ) : isPro ? (
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={ProfessionalLogOUt}
//                         >
//                           Logout
//                         </button>
//                       </li>
//                     ) : (
//                       <li>
//                         <NavLink to={"/login"} className="dropdown-item">
//                           Login
//                         </NavLink>
//                       </li>
//                     )}
//                   </ul>
//                 </div>
//               ) : (
//                 <div>
//                   <NavLink
//                     to={"/login"}
//                     className="fw-bold border-0 bg-black text-white"
//                   >
//                     Login
//                   </NavLink>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Professional Registration Modal */}
//       <BarberRegister />
//     </div>
//   );
// };

// export default Header;


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
  useEffect(() => {
        const script = document.createElement("script");
        script.src = "//code.tidio.co/gcakni5fpv5txertwqchvwgabaw1yzi9.js";
        script.async = true;
        document.body.appendChild(script);
      }, []);
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
    const sendReminderEmails = async () => {
      try {
        const response = await fetch("https://glamthegirlemailservice.vercel.app/send-reminders", { method: "POST" });
        if (!response.ok) {
          throw new Error("Failed to send reminders");
        }
        console.log("Reminder emails sent successfully.");
      } catch (error) {
        console.error("Error sending reminder emails:", error);
      }
    };
  
    const interval = setInterval(sendReminderEmails, 24 * 60 * 60 * 1000); // Runs every 24 hours
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

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
