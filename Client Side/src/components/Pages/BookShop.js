import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import BreadCrumb from "../BreadCrumbs/Breadcrumb";
import "react-day-picker/dist/style.css";
import { useMediaQuery } from "@uidotdev/usehooks";
import List from "./List";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useEffect } from "react";
import Loader from "../Loader/loader";
import asset from "../../assets/hairfinder assest.png";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const BookShop = () => {
  const [showModal, setShowModal] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [selected, setSelected] = useState(Date);
  const isSmallDevice = useMediaQuery("(max-width : 748px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const [mark, setMark] = useState("");
  const [shopDetail, setShopDetail] = useState(undefined);
  const [email, setEmail] = useState(localStorage.getItem("email"));

  useEffect(() => {
    // Retrieve email from local storage on component mount
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);
  const handlePayment = () => {
    if (cardNumber && expiryDate && cvv) {
      alert("Payment of 500 Rs successful! Booking confirmed.");
      setShowModal(false);
      handleBookNow();
    } else {
      alert("Please enter valid card details.");
    }
  };

  let today = new Date();
  let year = today.getFullYear();
  const { id, parent } = useParams();
  const [service, setService] = useState("");
  const getService = async () => {
    const docRef = doc(db, "ProfessionalDB", `${parent}`, "Services", `${id}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setService(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };
  const getShopDetail = async () => {
    await getDoc(doc(db, "ProfessionalDB", `${parent}`)).then((res) =>
      setShopDetail(res.data())
    );
  };

  const [selectedValues, setSelectedValues] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const handleCheckBoxChange = (name, value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
      setCartTotal((prevCartTotal) => prevCartTotal - value);
    } else {
      setSelectedValues([...selectedValues, value]);
      setCartTotal((prevCartTotal) => prevCartTotal + value);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getService();
    getShopDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let PurchasePrice = parseInt(service.Price) + cartTotal;
  let sample = !mark ? " Please Select Time" : mark.time + mark.shift;
  let footerDetail = selected.toString().substring(0, 15).concat("/", sample);

  /* ✅ Define isValid function */
  const isValid = () => {
    return (
      cardNumber.length === 16 &&
      /^\d{2}\/\d{2}$/.test(expiryDate) &&
      cvv.length === 3
    );
  };

  const handleCheckout = () => {
    window.location.href = "https://book.stripe.com/test_00g7wuesWda5bVmdQR";
  };

  const handleBookNow = async () => {
    try {
      // Validate booking date and time
      const bookingDate = selected?.toString().substring(0, 15);
      const bookingTime =
        mark?.time && mark?.shift ? mark.time + mark.shift : null;

      if (!bookingDate || !bookingTime) {
        alert("Please select a valid booking date and time.");
        return;
      }

      // Reference to the "Bookings" collection
      const bookingsRef = collection(db, "Bookings");

      // Query to check if an entry with the same email, date, and time exists
      const q = query(
        bookingsRef,
        where("email", "==", email),
        where("bookingDate", "==", bookingDate),
        where("bookingTime", "==", bookingTime)
      );

      const querySnapshot = await getDocs(q);

      // If a booking exists, prevent duplicate entry
      if (!querySnapshot.empty) {
        alert("You have already booked a service at this time.");
        return;
      }

      const bookingData = {
        email: email,
        serviceName: service.ServiceName,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        totalPrice: `${PurchasePrice} rs`,
      };

      // Save booking to Firebase
      await addDoc(bookingsRef, bookingData);

      handleCheckout();

      // Send confirmation email
      await fetch("http://localhost:5000/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      // Redirect to schedule page
      window.location.assign("/schedule");
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert("There was an error saving your booking. Please try again.");
    }
  };

  // console.log(shopDetail);
  return (
    <div className="">
      <div className="container">
        <BreadCrumb //BreadCrumbs component
          prevPage={"Shop"}
          link={`/shop/${parent}`}
          activePage={"Booking"}
          text="white"
        />
      </div>
      <h4 className="text-white text-center ">
        <span className="border pe-4 py-2">
          <span className="py-2 ps-4 bg-white text-black">Book the</span> Service
        </span>
      </h4>

      <div className="container">
        <div className="row mt-5  align-items-center">
          <div className="col-12 col-sm-6">
            <div className="row align-items-center">
              <div className="col-6 col-sm-5">
                <img alt="" src={asset} className="w-100" />
              </div>

              {service === "" ? (
                <div className="col-8 col-sm-6">
                  <Loader />
                </div>
              ) : (
                <div className="col-12 col-sm-6">
                <div className="text-white">
  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'transparent',
  }}>
    <thead>
      <tr style={{
        height: '50px',
        borderBottom: '1px solid #ddd',
      }}>
      </tr>
    </thead>
    <tbody>
      <tr style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Shop Name</td>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>{!shopDetail ? "Shop Name" : shopDetail.shopName}</td>
      </tr>
      <tr style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Service Name</td>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>{service.ServiceName}</td>
      </tr>
      <tr style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Service Price</td>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Rs: {service.Price}</td>
      </tr>
      <tr style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Service Time</td>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>10AM - {!shopDetail ? "9PM" : shopDetail.shopClose}</td>
      </tr>
      <tr style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
        cursor: 'pointer',
      }} onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
      }} onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>Service Description</td>
        <td style={{
          padding: '12px 20px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>{service.Description || "No description available"}</td>
      </tr>
    </tbody>
  </table>
</div>

</div>

              )}
            </div>
          </div>
          <div className="col-12 col-sm-6 mt-3">
            <div className="text-white ">
              <div
                className="d-flex border justify-content-center p-2 text-center"
                style={{ height: "410px" }}
              >
                <div>
                  <h6 className="fw-bold">Pick Your Date</h6>
                  <div className="">
                    <DayPicker
                      mode="single"
                      required
                      selected={selected}
                      onSelect={setSelected}
                      footer={footerDetail}
                      fromYear={year}
                      fromMonth={today}
                      //showOutsideDays
                      //toDate={toDay}
                      toMonth={today}
                      fixedWeeks
                      modifiersClassNames={{
                        today: "my-today",
                      }}
                    />
                  </div>
                </div>
                {/* Menu for Desktop mode */}
                {isMediumDevice ? (
                  <div className="h-100 ">
                    <h6 className="fw-bold">Pick Your Time</h6>
                    <div className="text-white scheduleTime h-100 mt-5">
                      <div className="overflow-auto h-75">
                        <List mark={mark} setMark={setMark} />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {/* Menu for mobile mode */}
              {isSmallDevice ? (
                <div className="container mt-4">
                  <h6 className="fw-bold text-center mb-3">Pick Your Time</h6>
                  <div className="w-100 overflow-auto">
                    <List name="d-flex" mark={mark} setMark={setMark} />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Payment Section */}
      <div className="mt-5 bg-white container-fluid">
        <h4 className=" text-center pt-4">
          <span className="border ps-3 py-3 fw-bold">
            Payment
            <span className="text-white fw-normal bg-black ms-1 ps-1 py-3 pe-3">
              Section
            </span>
          </span>
        </h4>
        <div className="row mt-5 align-items-center pb-3">
          <div className="col-5 col-sm-4 text-center">
            <div className="w-100">
              <img
                src="https://img.freepik.com/premium-vector/hand-drawn-barbershop-illustration_9829-82.jpg?size=626&ext=jpg&ga=GA1.2.1543915203.1685795707&semt=ais"
                alt=""
                className="w-100"
              />
            </div>
          </div>
          <div className="col-7 col-sm-4  ">
            <div className="w-100">
              <h6 className="fw-bold">Additional Services</h6>
              <div className="d-block pt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="shampoo"
                  value=""
                  id="flexCheckDefault"
                  onChange={() => handleCheckBoxChange("shampoo", 30)}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Shampoo (30rs)
                </label>
              </div>
              <div className="d-block">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="HeadMassage"
                  value=""
                  onChange={() => handleCheckBoxChange("HeadMassage", 50)}
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Head Massage (50rs)
                </label>
              </div>
              <div className="d-block">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  name="FaceMask"
                  id="flexCheckDefault"
                  onChange={() => handleCheckBoxChange("FaceMask", 80)}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Face Mask (80rs)
                </label>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-4 mt-5 me-0 overflow-hidden">
            <div className="w-100">
              <h6 className="fw-bold text-center">Services Details</h6>
              <div className="pt-2">
                <div className="d-flex justify-content-between">
                  <span>Total Services :</span>
                  <span>{service.ServiceName}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Book Time :</span>
                  <span>
                    {selected
                      .toString()
                      .substring(0, 10)
                      .concat(
                        "-",
                        !mark ? "Select Time" : mark.time + mark.shift
                      )}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total Bill :</span>
                  <span className="fw-bold">{PurchasePrice}rs</span>
                </div>
              </div>

              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "5px",
                  width: "100%",
                  border: "none",
                  marginTop: "10px",
                  cursor: "pointer",
                }}
                onClick={handleBookNow}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookShop;
