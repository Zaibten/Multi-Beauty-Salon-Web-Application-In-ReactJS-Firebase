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
    let messageText = "Hold On Dude!!";
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
        <div className="modal-dialog modal-dialog-centered modal-lg ">
          <div className="modal-content rounded-0 border bg-black text-white">
            <div className="modal-header border-0 position-relative">
              <h5 className="modal-title" id="exampleModalLabel">
                <span className="border text-white py-2 ps-3">
                  Professional{" "}
                  <span className="py-2 pe-3 bg-white text-black">Login</span>
                </span>
              </h5>
              <button
                type="button"
                className="text-white btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            <div className="modal-body">
              <ul
                className="nav nav-pills nav-justified mb-3"
                id="ex1"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link rounded-0 text-black"
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
                    className="nav-link active rounded-0 text-black"
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

              <div className="tab-content">
                <div
                  className="tab-pane fade "
                  id="pills-login"
                  role="tabpanel"
                  aria-labelledby="tab-login"
                >
                  <form onSubmit={OnSubmitLogin}>
                    <input
                      type="email"
                      id="loginName"
                      required
                      value={value.email}
                      onChange={onChangeSigin}
                      name="email"
                      placeholder="Enter Email"
                      className="form-control bg-black text-white"
                    />

                    <input
                      type="password"
                      value={value.password}
                      placeholder="Enter Password"
                      id="loginPassword"
                      onChange={onChangeSigin}
                      name="password"
                      required
                      className="form-control text-white bg-black mt-4"
                    />
                    <div className="row mb-4">
                      <div className="col-md-12 mt-2 d-flex justify-content-center">
                        <a href="#!">Forgot password?</a>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-warning btn-block mb-4"
                      data-mdb-dismiss="modal"
                    >
                      Sign in
                    </button> 
                  </form>
                </div>
                <div
                  className="tab-pane fade show active"
                  id="pills-register"
                  role="tabpanel"
                  aria-labelledby="tab-register"
                >
                  <form onSubmit={onSubmitRegister}>
                    <input
                      type="text"
                      id="registerName"
                      name="username"
                      value={regValue.username}
                      onChange={onChangeRegister}
                      placeholder="Enter Name"
                      className="form-control border bg-black mt-3 text-white"
                    />

                    <input
                      placeholder="Enter Number"
                      value={regValue.number}
                      type="number"
                      name="number"
                      onChange={onChangeRegister}
                      id="registerUsername"
                      className="form-control border bg-black mt-3 text-white"
                    />

                    <input
                      type="email"
                      placeholder="Enter Email"
                      value={regValue.email}
                      name="email"
                      onChange={onChangeRegister}
                      id="registerEmail"
                      className="form-control border bg-black mt-3 text-white"
                    />

                    <input
                      type="password"
                      name="password"
                      value={regValue.password}
                      onChange={onChangeRegister}
                      placeholder="Enter Password"
                      id="registerPassword"
                      className="form-control border bg-black mt-3 text-white"
                    />

                    <div className="form-check d-flex justify-content-center mb-4 mt-2">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        value=""
                        id="registerCheck"
                        defaultChecked
                        aria-describedby="registerCheckHelpText"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="registerCheck"
                      >
                        I have read and agree to the terms
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-warning btn-block mb-3"
                      data-mdb-dismiss="modal"
                    >
                      Sign in
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberRegister;
