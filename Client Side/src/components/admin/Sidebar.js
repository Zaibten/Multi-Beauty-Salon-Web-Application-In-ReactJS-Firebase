import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import store from "../../Redux/reduxStore";
import { addAuth } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
import { professionalLogOut } from "../../Redux/Slices/professionalRedux";
import { message } from "antd";

const Sidebar = () => {
  const imgPath =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsFSmPkMDqTMA1fbmpNRrXlC1Ijnex-jYMhT9VCscOPGYqjVV9RgvyfuIC0IxTynz0q9w&usqp=CAU";
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, context] = message.useMessage();
  const sendMessage = (varient, messageText) => {
    messageApi.open({
      type: varient,
      content: messageText,
    });
  };
  const HandleSignOut = () => {
    signOut(auth)
      .then(() => {
        let varient = "success";
        let messageText = "Professional SignOut !!!";
        sendMessage(varient, messageText);
        setTimeout(() => {
          navigate("/");
          dispatch(professionalLogOut());
        }, 1200);
      })
      .catch((err) => {
        let varient = "success";
        let messageText = err.message;
        sendMessage(varient, messageText);
      });
    setTimeout(() => {
      store.dispatch(addAuth.deleteState(null));
    }, 2000);
  };

  return (
    <div
      id="sideDiv"
      className="text-white w-25 d-flex justify-content-between flex-column h-100 border px-2 pb-2 "
      style={{ background: "#001C30" }}
    >
      {context}
      <div id="main" className="">
        <div className="d-flex justify-content-center mt-2">
          <img alt="" src={imgPath} className="rounded-circle w-50" />
        </div>
        <Link
          to={"/"}
          id="SideBtn"
          className="py-2 my-4 ps-2 bg-warning d-flex align-items-center text-white"
        >
          <span className="material-icons-outlined me-2">home</span>
          <span id="sidebarMenuName">Home</span>
        </Link>
        <Link
          to={"/dashboard"}
          id="SideBtn"
          className="py-2 my-4 ps-2 bg-warning d-flex align-items-center text-white active"
        >
          <span className="material-icons-outlined me-2">person</span>
          <span id="sidebarMenuName">Profile Page</span>
        </Link>
        <Link
          to={"add-services"}
          id="SideBtn"
          className="py-2 my-4 ps-2 bg-warning d-flex align-items-center text-white"
        >
          <span className="material-icons-outlined me-2">design_services</span>
          <span id="sidebarMenuName">Add Services</span>
        </Link>
        <Link
          to={"schedules-professional"}
          id="SideBtn"
          className="py-2 my-4 ps-2 bg-warning d-flex align-items-center text-white"
        >
          <span className="material-icons-outlined me-2">calendar_month</span>
          <span id="sidebarMenuName">Schedules</span>
        </Link>
      </div>
      <div id="footer">
        <div
          id="SideBtn"
          className="bg-warning ps-2 py-2 d-flex align-items-center"
          onClick={HandleSignOut}
        >
          <span className="material-icons-outlined me-2">logout</span>
          <span id="sidebarMenuName">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
