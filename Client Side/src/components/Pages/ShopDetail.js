import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import Breadcrumb from "../BreadCrumbs/Breadcrumb";
import Loader from "../Loader/loader";
import StyleCard from "./StyleCard";
import "./ShopDetail.css"; // Importing styles
import Footer from "../Footer/Footer";

const ShopDetail = () => {
  const [services, setServices] = useState([]);
  const { id } = useParams();
  const [shopDetails, setShopDetails] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  


  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    window.scrollTo(0, 0);
    getSaloon();
    getServices();
    getReviews();
    
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
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
    const fetchedReviews = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setReviews(fetchedReviews);
    setLoading(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please log in to add a review.");
      return;
    }
    if (reviewText.trim() === "") return;

    const newReview = { name: email, text: reviewText, rating: rating, timestamp: new Date() };

    await addDoc(collection(db, "ProfessionalDB", `${id}`, "Reviews"), newReview);
    setReviews([...reviews, newReview]);
    setReviewText("");
    setRating(5);
    alert("Your review has been submitted successfully!");
  };

  // Pagination Logic
  const lastReviewIndex = currentPage * reviewsPerPage;
  const firstReviewIndex = lastReviewIndex - reviewsPerPage;
  const currentReviews = reviews.slice(firstReviewIndex, lastReviewIndex);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <div  className="w-100">
    <div className="container">
      <Breadcrumb path="Shop Details" activePage={"Shop"} text="white" />
      <h3 className="text-white text-center">
        <span className="border py-2 ps-4">
          Shop <span className="bg-white text-black py-2 pe-4">Details</span>
        </span>
      </h3>
      {/* Shop Details */}
      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <img
              alt="Saloon Image"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDlpM9l6Ni4vskN3sHcDJIaUTogmQ2rqC6dg&s"
              className="shop-image"
            />
          </div>
          {!shopDetails ? (
            <Loader />
          ) : (
            <div className="col-12 col-sm-8 ms-sm-3 d-flex text-white">
              <div>
                <span>Shop Name: {shopDetails.shopName}</span><br />
                <span>Owner: {shopDetails.name}</span><br />
                <span>Timing: {shopDetails.shopOpen || "10:00 AM"} - {shopDetails.shopClose}</span><br />
                <span>Contact: {shopDetails.number}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {shopDetails && (
  <div className="mt-4">
    <h5 className="text-white">Shop Location</h5>
    <div className="rounded overflow-hidden shadow" style={{ height: "300px", width: "100%" }}>
      <iframe
        title="Google Map"
        src={
          shopDetails.shopnlocation?.startsWith("https://www.google.com/maps/embed")
            ? shopDetails.shopnlocation
            : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28934.458377838354!2d67.0576818!3d24.8607343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f890d061c7f%3A0x1a147fa3c1d1707b!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1683566887073!5m2!1sen!2s"
        }
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
)}


              {/* 🔹 Services Section */}
              <div className="mt-5">
  <h3 className="text-white mb-3">
    Services by <span className="text-decoration-underline">Professional</span>
  </h3>


  <div className="row">
  <div className="row mb-4 text-white">
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
    backgroundColor: "#1a1a1a",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
    transition: "all 0.3s ease-in-out",
  }}
>
  {[
    ["Price Range", priceFilter, setPriceFilter, [
      "All",
      "0-1000",
      "1000-3000",
      "3000-5000",
      "5000-10000",
      "10000-20000",
      "20000-50000",
      "50000-100000",
      "100000-200000",
      "200000-500000",
    ]],
    ["Service Type", serviceFilter, setServiceFilter, [
      "All",
      "Hair services",
      "Skin Care services",
      "Hair Removal services",
      "Hand & Foot care",
      "Makeup Services",
      "Body Treatments",
      "Packages",
    ]],
  ].map(([label, value, setter, options], i) => (
    <div key={i} style={{ flex: "1 1 300px", minWidth: "250px" }}>
      <label
        style={{
          fontWeight: "600",
          fontSize: "16px",
          color: "#f5f5f5",
          marginBottom: "8px",
          display: "block",
        }}
      >
        {label}:
      </label>
      <select
        value={value}
        onChange={(e) => setter(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #444",
          backgroundColor: "#2b2b2b",
          color: "#fff",
          fontSize: "15px",
          cursor: "pointer",
          boxShadow: "inset 0 0 5px rgba(255, 255, 255, 0.05)",
          transition: "all 0.35s ease",
          outline: "none",
          transform: "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = "0 0 10px #ff6b6b, 0 0 3px rgba(255,255,255,0.1)";
          e.target.style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = "inset 0 0 5px rgba(255, 255, 255, 0.05)";
          e.target.style.transform = "scale(1)";
        }}
        onFocus={(e) => (e.target.style.borderColor = "#ff6b6b")}
        onBlur={(e) => (e.target.style.borderColor = "#444")}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt === "All" ? "" : opt}>
            {opt === "All" ? "All" : opt}
          </option>
        ))}
      </select>
    </div>
  ))}
</div>

</div>

    {services.length === 0 ? (
      <Loader bgcolor="black" />
    ) : (
services
  .filter((doc) => {
    const matchesCategory =
      !categoryFilter || (doc.Category && doc.Category.toLowerCase().includes(categoryFilter.toLowerCase()));

    const matchesServiceType =
      !serviceFilter || (doc.Category && doc.Category.toLowerCase().includes(serviceFilter.toLowerCase()));

    const matchesPrice =
  !priceFilter ||
  (() => {
    const price = parseInt(doc.Price || 0);
    switch (priceFilter) {
      case "0-1000":
        return price <= 1000;
      case "1000-3000":
        return price >= 1000 && price <= 3000;
      case "3000-5000":
        return price >= 3000 && price <= 5000;
      case "5000-10000":
        return price >= 5000 && price <= 10000;
      case "10000-20000":
        return price >= 10000 && price <= 20000;
      case "20000-50000":
        return price >= 20000 && price <= 50000;
      case "50000-100000":
        return price >= 50000 && price <= 100000;
      case "100000-200000":
        return price >= 100000 && price <= 200000;
      case "200000-500000":
        return price >= 200000 && price <= 500000;
      default:
        return true;
    }
  })();


    const matchesRating =
      !ratingFilter ||
      (doc.rating && doc.rating >= parseInt(ratingFilter, 10)); // if you store per-service ratings

    return matchesCategory && matchesServiceType && matchesPrice && matchesRating;
  })

        .map((doc) => (
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


      {/* Reviews Section */}
      <div className="review-section">
        <h3 className="text-white text-center">Customer Reviews</h3>
        <p className="text-white text-center">
          {reviews.length} Reviews | Average Rating: {averageRating.toFixed(1)} ⭐
        </p>
        
        <div className="review-container">
          {loading ? (
            <Loader bgcolor="black" />
          ) : reviews.length > 0 ? (
            currentReviews.map((review, index) => (
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

        {/* Pagination */}
        {reviews.length > reviewsPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Review Form */}
                 {/* Review Form */}
                 <div className="review-form mt-4">
            <h4 className="text-white text-center">Leave a Review</h4>
            <form onSubmit={submitReview} className="review-form-container">
              {/* Auto-fetched email */}
              <input
                type="text"
                value={email || ""}
                className="form-control"
                disabled
                placeholder="Login To Continue"
              />

              {/* Rating Dropdown with Emojis */}
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="form-control"
                required
              >
                <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                <option value="4">⭐⭐⭐⭐ - Good</option>
                <option value="3">⭐⭐⭐ - Average</option>
                <option value="2">😐😐 - Below Average</option>
                <option value="1">😞 - Poor</option>
              </select>

              <textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="form-control"
                required
              />
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>
      </div>



    
      {/* CSS BELOW */}
      <style>
        {`
          .review-section {
            margin-top: 40px;
            padding: 20px;
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

          .review-form-container {
            display: flex;
            flex-direction: column;
            align-items: center;
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
 
     <br></br>
      <Footer />
    </div>
  );
};

export default ShopDetail;