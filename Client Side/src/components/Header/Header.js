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

  const getDisplayName = (email) => {
  if (!email) return "";
  const username = email.split("@")[0];
  const match = username.match(/^[^\d]+/);
  return match ? match[0] : username;
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
        const response = await fetch("http://localhost:5000/send-reminders", { method: "POST" });
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
        <div
  style={{
    background: "#ffe6f0",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
    boxShadow: "0 4px 12px rgba(255, 77, 166, 0.2)",
    height: "90px",
  }}
>
  {/* Left: Logo + Brand */}
  <Link
    to="/"
    style={{
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
    }}
  >
    <img
      src={logo}
      alt="Logo"
      style={{
        height: "55px",
        width: "170px",
        marginRight: "10px",
        objectFit: "cover",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    />
    <span
      style={{
        fontSize: "22px",
        fontWeight: "bold",
        color: "#ff4da6",
        letterSpacing: "1px",
      }}
    >
      {/* Glam The Girl */}
    </span>
  </Link>

  {/* Center: Nav Links */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      whiteSpace: "nowrap",
    }}
  >
    {[
      { to: "/search", text: "SALONS" },
      { to: "/artistportfolio", text: "ARTIST PORTFOLIO" },
      { to: "/suggestion", text: "AI RECOMMENDATION" },
      { to: "/courses", text: "MASTER CLASSES & TUTORIALS" },
      { to: "/contact", text: "CONTACT US" },
      
    ].map((link, i) => (
      <Link
        key={i}
        to={link.to}
        style={{
          padding: "6px 10px",
          color: "#333",
          textDecoration: "none",
          fontSize: "14px",
          borderRadius: "20px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "#ff4da6";
          e.target.style.border = "1px solid #ff4da6";
          e.target.style.background = "#ffd6eb";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "#333";
          e.target.style.border = "none";
          e.target.style.background = "transparent";
        }}
      >
        {link.text}
      </Link>
    ))}
  </div>

  {/* Right: Email + Avatar/Login */}
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {email && (
      <span style={{ color: "#333", fontSize: "13px", marginRight: "5px" }}>
  <strong>{getDisplayName(email)}</strong>
</span>

    )}
    {email ? (
      <div className="dropdown">
        <a
          href="#!"
          id="navbarDropdownMenuAvatar"
          role="button"
          data-mdb-toggle="dropdown"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfyjxCdAYqLFK4WDxeMU_bJL3mmQiJq42Uag&s"
            alt="User Avatar"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              border: "2px solid #ff4da6",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "rotate(5deg) scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </a>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="navbarDropdownMenuAvatar"
        >
          <li><Link to="/Profile" className="dropdown-item">My profile</Link></li>
          <li><Link to="/schedule" className="dropdown-item">Booking</Link></li>
          <li><button className="dropdown-item" onClick={logOutHandle}>Logout</button></li>
        </ul>
      </div>
    ) : (
      <NavLink
        to="/login"
        style={{
          padding: "8px 14px",
          background: "#ff4da6",
          borderRadius: "20px",
          color: "#fff",
          textDecoration: "none",
          fontWeight: "bold",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#ff80c1";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#ff4da6";
          e.target.style.transform = "scale(1)";
        }}
      >
        Login
      </NavLink>
    )}
  </div>
</div>


      </div>
      <BarberRegister />
    </div>
  );
};

export default Header;
