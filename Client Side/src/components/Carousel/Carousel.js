import React, { useEffect, useState } from "react";
import "./Carousel.css";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("next");
      setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval when the component unmounts
  }, []);

  const goToPrev = () => {
    setDirection("prev");
    setActiveIndex((prevIndex) => (prevIndex - 1 + 3) % 3);
  };

  const goToNext = () => {
    setDirection("next");
    setActiveIndex((prevIndex) => (prevIndex + 1) % 3);
  };

  return (
    <div id="carouselControls" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div
          className={`carousel-item ${
            activeIndex === 0 ? "active" : ""
          } ${direction === "prev" ? "fadeOut" : ""} ${
            direction === "next" ? "fadeIn" : ""
          }`}
        >
          <img
            src={require("../../assets/s1.png")} // Ensure correct path for local images
            className="d-block w-100 carouselImg"
            alt="Luxurious Hair Spa"
          />
          {/* <div className="carousel-caption">
            <h3>Luxurious Hair Spa</h3>
            <p>Pamper yourself with our exclusive hair treatments.</p>
          </div> */}
        </div>
        <div
          className={`carousel-item ${
            activeIndex === 1 ? "active" : ""
          } ${direction === "prev" ? "fadeOut" : ""} ${
            direction === "next" ? "fadeIn" : ""
          }`}
        >
          <img
            src={require("../../assets/s2.png")}
            className="d-block w-100 carouselImg"
            alt="Bridal Makeup Excellence"
          />
          {/* <div className="carousel-caption">
            <h3>Bridal Makeup Excellence</h3>
            <p>Look your best on your special day with our expert artists.</p>
          </div> */}
        </div>
        <div
          className={`carousel-item ${
            activeIndex === 2 ? "active" : ""
          } ${direction === "prev" ? "fadeOut" : ""} ${
            direction === "next" ? "fadeIn" : ""
          }`}
        >
          <img
            src={require("../../assets/s3.png")}
            className="d-block w-100 carouselImg"
            alt="Exquisite Nail Art"
          />
          {/* <div className="carousel-caption">
            <h3>Exquisite Nail Art</h3>
            <p>Get stunning nails with our creative designs.</p>
          </div> */}
        </div>
      </div>

      <button
        className="carousel-control-prev center-btn"
        type="button"
        onClick={goToPrev}
      >
        <span className="material-icons">arrow_back_ios</span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next center-btn"
        type="button"
        onClick={goToNext}
      >
        <span className="material-icons">arrow_forward_ios</span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
