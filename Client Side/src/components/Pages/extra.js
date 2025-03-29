import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import BreadCrumb from "../BreadCrumbs/Breadcrumb";
import "react-day-picker/dist/style.css";
import { useMediaQuery } from "@uidotdev/usehooks";
import List from "./List";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import Loader from "../Loader/loader";
import asset from "../../assets/hairfinder assest.png";

const BookShop = () => {
  const [selected, setSelected] = useState(Date);
  const isSmallDevice = useMediaQuery("(max-width : 748px)");
  const isMediumDevice = useMediaQuery("(min-width : 769px)");
  const [mark, setMark] = useState("");
  const [shopDetail, setShopDetail] = useState(undefined);
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const { id, parent } = useParams();
  const [service, setService] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    window.scrollTo(0, 0);
    getService();
    getShopDetail();
  }, []);

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
    const docSnap = await getDoc(doc(db, "ProfessionalDB", `${parent}`));
    if (docSnap.exists()) {
      setShopDetail(docSnap.data());
    }
  };

  const handleCheckBoxChange = (name, value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
      setCartTotal((prevCartTotal) => prevCartTotal - value);
    } else {
      setSelectedValues([...selectedValues, value]);
      setCartTotal((prevCartTotal) => prevCartTotal + value);
    }
  };

  let PurchasePrice = parseInt(service.Price) + cartTotal;
  let sample = !mark ? " Please Select Time" : mark.time + mark.shift;
  let footerDetail = selected.toString().substring(0, 15).concat("/", sample);

  const handleBookNow = async () => {
    try {
      const bookingDate = selected?.toString().substring(0, 15);
      const bookingTime = mark?.time && mark?.shift ? mark.time + mark.shift : null;

      if (!bookingDate || !bookingTime) {
        alert("Please select a valid booking date and time.");
        return;
      }

      const bookingData = {
        email: email,
        serviceName: service.ServiceName,
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        totalPrice: `${PurchasePrice} rs`,
      };

      const bookingsRef = collection(db, "Bookings");
      await addDoc(bookingsRef, bookingData);

      alert("Your booking has been saved successfully!");

      await fetch("https://glamthegirlemailservice.vercel.app/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      window.location.assign("/schedule");
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert("There was an error saving your booking. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="container">
        <BreadCrumb prevPage={"Shop"} link={`/shop/${parent}`} activePage={"Booking"} text="white" />
      </div>
      <h4 className="text-white text-center">
        <span className="border pe-4 py-2">
          <span className="py-2 ps-4 bg-white text-black">Book the</span> Shop
        </span>
      </h4>

      <div className="container">
        <div className="row mt-5 align-items-center">
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
                <div className="col-12 col-sm-6 d-flex">
                  <div className="text-white">
                    <span className="d-block fw-semibold">Shop Name</span>
                    <span className="d-block fw-semibold">Service Name</span>
                    <span className="d-block fw-semibold">Service Price</span>
                    <span className="d-block fw-semibold">Service Time</span>
                  </div>
                  <div className="text-white">
                    <span className="d-block">
                      <span className="mx-2">:</span>
                      {!shopDetail ? "Shop Name" : shopDetail.shopName}
                    </span>
                    <span className="d-block">
                      <span className="mx-2">:</span>
                      {service.ServiceName}
                    </span>
                    <span className="d-block">
                      <span className="mx-2">:</span>
                      {service.Price}
                    </span>
                    <span className="d-block">
                      <span className="mx-2">:</span>
                      10AM -{!shopDetail ? "9PM" : shopDetail.shopClose}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-6 mt-3">
            <div className="text-white ">
              <div className="d-flex border justify-content-center p-2 text-center" style={{ height: "410px" }}>
                <div>
                  <h6 className="fw-bold">Pick Your Date</h6>
                  <DayPicker
                    mode="single"
                    required
                    selected={selected}
                    onSelect={setSelected}
                    footer={footerDetail}
                    fromYear={new Date().getFullYear()}
                    fromMonth={new Date()}
                    toMonth={new Date()}
                    fixedWeeks
                    modifiersClassNames={{ today: "my-today" }}
                  />
                </div>
                {isMediumDevice && (
                  <div className="h-100 ">
                    <h6 className="fw-bold">Pick Your Time</h6>
                    <div className="text-white scheduleTime h-100 mt-5">
                      <div className="overflow-auto h-75">
                        <List mark={mark} setMark={setMark} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isSmallDevice && (
                <div className="container mt-4">
                  <h6 className="fw-bold text-center mb-3">Pick Your Time</h6>
                  <div className="w-100 overflow-auto">
                    <List name="d-flex" mark={mark} setMark={setMark} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mt-5 bg-white container-fluid text-center py-5">
        <h4 className="fw-bold">Total Price: {PurchasePrice} Rs</h4>
        <a
          href="https://book.stripe.com/test_00g7wuesWda5bVmdQR"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-3"
        >
          Proceed to Payment
        </a>
      </div>
    </div>
  );
};

export default BookShop;
