import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import Breadcrumb from "../BreadCrumbs/Breadcrumb";
import Loader from "../Loader/loader";
import StyleCard from "./StyleCard";

const ShopDetail = () => {
  const { id } = useParams();
  const [shopDetails, setShopDetails] = useState("");
  const [services, setServices] = useState([]);  // <-- Added services state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [email, setEmail] = useState(""); 
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getSaloon();
    getServices();  // <-- Fetching services
    getReviews();

    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [id]);

  const getSaloon = async () => {
    const res = await getDoc(doc(db, "ProfessionalDB", `${id}`));
    setShopDetails(res.data());
  };

  const getServices = async () => {
    const serviceData = await getDocs(collection(db, "ProfessionalDB", `${id}`, "Services"));
    setServices(serviceData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getReviews = async () => {
    const data = await getDocs(collection(db, "ProfessionalDB", `${id}`, "Reviews"));
    setReviews(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="mt-3">
        <Breadcrumb path="Shop Details" activePage={"Shop"} text="white" />
      </div>

      <h3 className="text-white text-center">
        <span className="border py-2 ps-4">
          Shop <span className="bg-white text-black py-2 pe-4">Details</span>
        </span>
      </h3>

      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <img
              alt=""
              src="https://img.freepik.com/premium-photo/beauty-saloon-eyebrow-care_524291-978.jpg"
              className="w-100 mb-3"
            />
          </div>

          {!shopDetails ? (
            <Loader />
          ) : (
            <div className="col-12 col-sm-8 ms-sm-3 d-flex">
              <div className="text-white">
                <span className="d-block">Shop Name</span>
                <span className="d-block">Owner Name</span>
                <span className="d-block">Timing</span>
                <span className="d-block">Contact Number</span>
              </div>
              <div className="text-white ps-3">
                <span className="d-block">: {shopDetails.shopName}</span>
                <span className="d-block">: {shopDetails.name}</span>
                <span className="d-block">: {shopDetails.shopOpen || "10:00 AM"} - {shopDetails.shopClose}</span>
                <span className="d-block">: {shopDetails.number}</span>
              </div>
            </div>
          )}
        </div>

        {/* 🔹 Services Section */}
        <div className="mt-5">
          <h3 className="text-white mb-3">
            Services by <span className="text-decoration-underline">Professional</span>
          </h3>
          <div className="row">
            {services.length === 0 ? (
              <Loader bgcolor="black" />
            ) : (
              services.map((doc) => (
                <div className="col-6 col-sm-3 mt-2" key={doc.id}>
                  <StyleCard
                    shopDetails={shopDetails}
                    services={services}
                    price={doc.Price}
                    name={doc.ServiceName}
                    image={doc.ServiceImage}
                    book={`/shop/${id}/${doc.id}/booking`}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🔹 Reviews Section */}
        <div className="review-section mt-5">
          <h3 className="text-white text-center">Customer Reviews</h3>
          <div className="review-container">
            {loading ? (
              <Loader bgcolor="black" />
            ) : reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div className="review-card" key={index}>
                  <h5>{review.name}</h5>
                  <div className="rating-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  <p>{review.text}</p>
                </div>
              ))
            ) : (
              <p className="text-white text-center">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 CSS */}
      <style>
        {`
          .review-section {
            margin-top: 40px;
            padding: 20px;
            background: #222;
            border-radius: 10px;
          }

          .review-container {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 10px;
          }

          .review-card {
            background: linear-gradient(135deg, #444, #111);
            color: white;
            padding: 15px;
            border-radius: 10px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .review-card:hover {
            transform: scale(1.1);
            box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
          }

          .rating-stars {
            font-size: 18px;
            color: gold;
            transition: transform 0.3s ease;
          }

          .rating-stars:hover {
            transform: scale(1.2);
          }

          .form-control {
            width: 60%;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            border: none;
          }

          select.form-control {
            cursor: pointer;
            font-size: 16px;
          }

          .submit-btn {
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .submit-btn:hover {
            background: linear-gradient(135deg, #ff4b4b, #ff6a33);
          }
        `}
      </style>
    </div>
  );
};

export default ShopDetail;





