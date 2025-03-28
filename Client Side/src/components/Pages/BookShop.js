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
 
 


  const handleBookNow = async () => {
    try {
      // Validate booking date and time
      const bookingDate = selected?.toString().substring(0, 15); // Ensure selected date is valid
      const bookingTime = mark?.time && mark?.shift ? mark.time + mark.shift : null;
  
      if (!bookingDate) {
        alert("Please select a valid booking date.");
        return;
      }
  
      if (!bookingTime) {
        alert("Please select a valid booking time.");
        return;
      }
  
      // Convert selected date and time to a Date object
      const currentDateTime = new Date(); // Current date and time
      const selectedDateTime = new Date(`${bookingDate} ${mark.time} ${mark.shift}`);
  
      if (selectedDateTime < currentDateTime) {
        alert("You cannot book a service for a past date or time. Please select a future date and time.");
        return;
      }
  
      // Prepare the booking data
      const bookingData = {
        email: email,
        serviceName: service.ServiceName,
        servicePrice: service.Price ? `${service.Price} rs` : "Not available",
        serviceTime: footerDetail || "Not specified",
        serviceDescription: service.Description || "Not available",
        additionalService: selectedValues.length > 0 ? selectedValues.join(", ") : "Not available",
        bookingDate: bookingDate,
        bookingTime: bookingTime,
        totalPrice: PurchasePrice ? `${PurchasePrice} rs` : "Not available",
        shopId: parent,
        userId: email,
        createdAt: new Date(),
      };
  
      // Check for duplicates
      const bookingsRef = collection(db, "Bookings");
      const duplicateQuery = query(
        bookingsRef,
        where("email", "==", bookingData.email),
        where("serviceName", "==", bookingData.serviceName),
        where("bookingDate", "==", bookingData.bookingDate),
        where("bookingTime", "==", bookingData.bookingTime)
      );
      const querySnapshot = await getDocs(duplicateQuery);
  
      if (!querySnapshot.empty) {
        alert("Duplicate booking found! Please modify your booking.");
        return;
      }
  
      // Insert new booking data
      await addDoc(bookingsRef, bookingData);
      alert("Your booking has been saved successfully!");
  
      // Redirect to /schedule page and refresh it
      window.location.assign('/schedule');
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
          <span className="py-2 ps-4 bg-white text-black">Book the</span> Shop
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
                className="px-5 py-2 bg-black fw-semibold rounded text-white w-100 border-0 mt-3"
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
