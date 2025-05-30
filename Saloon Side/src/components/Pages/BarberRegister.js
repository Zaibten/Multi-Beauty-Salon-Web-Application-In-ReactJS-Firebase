import React, { useState } from "react";
import { ProfessionalSignIn, ProfessionalSignUp } from "../../Auth/auth";
import { message } from "antd";
import { useSelector } from "react-redux";
// import LoginPage from "../Loginpage/Loginpage";

const BarberRegister = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const isUser = useSelector((state) => state.isUser.isUser);
  // console.log(isUser);
  const sendMessage = (messageText, varient) => {
    messageApi.open({
      type: varient,
      content: messageText,
    });
  };
  const [value, setValue] = useState({
    //State for login

    email: "sudo@admin.in",
    password: "sudo@admin.in",
  });
  const [regValue, setRegValue] = useState({
    //State for Registration
    username: "",
    number: "",
    email: "",
    password: "",
  });

  const onChangeRegister = (e) => {
    const name = e.target.name; //Function for Register Section
    const value = e.target.value;
    setRegValue((data) => ({ ...data, [name]: value }));
    // console.log(regValue);
  };
  const onChangeSigin = (e) => {
    const name = e.target.name; //Function for Sigin Section
    const value = e.target.value;
    setValue((data) => {
      return { ...data, [name]: value };
    });
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();

    if (regValue === "") {
      alert("Enter SignUp Details");
      return;
    }
    let varient = "warning";
    let messageText = "Preparing Professional View!!";
    sendMessage(messageText, varient);
    await ProfessionalSignUp(regValue, sendMessage, isUser);
    setRegValue({
      username: "",
      email: "",
      number: "",
      password: "",
    });
  };
  const OnSubmitLogin = async (e) => {
    e.preventDefault();
    if (isUser === true) {
      let varient = "warning";
      let messageText =
        "Want to Switch your Account to Profesional Kindly visit User Profile !!!";
      sendMessage(messageText, varient);
      return;
    }
    if (value === "") {
      alert("Enter Login Details");
      return;
    }
    let varient = "warning";
    let messageText = "One moment please!!";
    sendMessage(messageText, varient);
    await ProfessionalSignIn(value, sendMessage);
    setValue({
      email: "",
      password: "",
    });
  };

  return (
 <div>
  {contextHolder}
  <div
    className="modal fade"
    id="exampleModal"
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div
        className="modal-content text-black"
        style={{
          backgroundColor: "rgb(255, 230, 240)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div className="modal-header border-0 position-relative">
          <h5 className="modal-title" id="exampleModalLabel">
            <span
              className="py-2 ps-3"
              style={{
                border: "2px solid #ff69b4",
                borderRadius: "10px",
                paddingRight: "10px",
                backgroundColor: "#ffe0ec",
              }}
            >
              Professional{" "}
              <span
                className="py-2 px-2 ms-2"
                style={{
                  backgroundColor: "#ff69b4",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                Login
              </span>
            </span>
          </h5>
          <button
            type="button"
            className="btn-close"
            data-mdb-dismiss="modal"
            aria-label="Close"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <ul className="nav nav-pills nav-justified mb-4" id="ex1" role="tablist">
            <li className="nav-item" role="presentation">
              <a
                className="nav-link nav-login rounded-pill"
                id="tab-login"
                data-mdb-toggle="pill"
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="false"
              >
                Login
              </a>
            </li>
            <li className="nav-item" role="presentation">
              <a
                className="nav-link nav-register rounded-pill"
                id="tab-register"
                data-mdb-toggle="pill"
                href="#pills-register"
                role="tab"
                aria-controls="pills-register"
                aria-selected="true"
              >
                Register
              </a>
            </li>
          </ul>

          {/* Tab Contents */}
          <div className="tab-content">
            {/* Login Form */}
            <div
              className="tab-pane fade"
              id="pills-login"
              role="tabpanel"
              aria-labelledby="tab-login"
            >
              <form onSubmit={OnSubmitLogin}>
                <input
                  type="email"
                  name="email"
                  value={value.email}
                  onChange={onChangeSigin}
                  placeholder="Enter Email"
                  className="form-control mt-3"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={value.password}
                  onChange={onChangeSigin}
                  placeholder="Enter Password"
                  className="form-control mt-3"
                  required
                />
                <br></br>
                <button
                  type="submit"
                  className="btn btn-block"
                  style={{
                    backgroundColor: "#ff69b4",
                    color: "white",
                    borderRadius: "10px",
                  }}
                  data-mdb-dismiss="modal"
                >
                  Login
                </button>
              </form>
            </div>

            {/* Register Form */}
            <div
              className="tab-pane fade show active"
              id="pills-register"
              role="tabpanel"
              aria-labelledby="tab-register"
            >
              <form onSubmit={onSubmitRegister}>
                <input
                  type="text"
                  name="username"
                  value={regValue.username}
                  onChange={onChangeRegister}
                  placeholder="Enter Name"
                  className="form-control mt-3"
                />
                <input
                  type="number"
                  name="number"
                  value={regValue.number}
                  onChange={onChangeRegister}
                  placeholder="Enter Number"
                  className="form-control mt-3"
                />
                <input
                  type="email"
                  name="email"
                  value={regValue.email}
                  onChange={onChangeRegister}
                  placeholder="Enter Email"
                  className="form-control mt-3"
                />
                <input
                  type="password"
                  name="password"
                  value={regValue.password}
                  onChange={onChangeRegister}
                  placeholder="Enter Password"
                  className="form-control mt-3"
                />

                <div className="form-check d-flex justify-content-center mt-4 mb-3">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    id="registerCheck"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="registerCheck">
                    I have read and agree to the terms
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-block"
                  style={{
                    backgroundColor: "#ff69b4",
                    color: "white",
                    borderRadius: "10px",
                  }}
                  data-mdb-dismiss="modal"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Additional content if needed */}
</div>

  );
};

export default BarberRegister;