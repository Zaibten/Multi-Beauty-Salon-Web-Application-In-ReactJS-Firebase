import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import Breadcrumb from "../BreadCrumbs/Breadcrumb";
import Loader from "../Loader/loader";
import StyleCard from "./StyleCard";
import "./ShopDetail.css"; // Importing styles

const ShopDetail = () => {
  const [services, setServices] = useState([]);
  const { id } = useParams();
  const [shopDetails, setShopDetails] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  
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
  );
};

export default ShopDetail;