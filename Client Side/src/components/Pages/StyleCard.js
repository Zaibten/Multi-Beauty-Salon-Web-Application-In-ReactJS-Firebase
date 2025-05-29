import React from "react";
import { Link } from "react-router-dom";

const StyleCard = ({ price, book, name, image }) => {
  return (
    <div>
      <div
        className="card w-100"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
        }}
      >
        <img
          src={image || "https://i.pinimg.com/736x/a8/21/56/a82156d72e6951200224b84649c22f0c.jpg"}
          className="card-img-top"
          alt="Service Image"
          style={{
            height: "180px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        />
        <div
          className="card-body"
          style={{
            backgroundColor: "#ffffff",
            textAlign: "center",
            padding: "15px",
          }}
        >
          <h5
            className="card-title fw-semibold"
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "#333",
              marginBottom: "10px",
            }}
          >
            {name}
          </h5>
          <p
            className="card-text"
            style={{
              fontSize: "1rem",
              color: "#555",
              fontWeight: "500",
              marginBottom: "15px",
            }}
          >
            <span className="fw-bold">Price: </span>
            <span style={{ color: "#007bff", fontWeight: "bold" }}>
              {price} /-
            </span>
          </p>
          <Link
  to={book}
  className="w-100 px-2 py-2 d-block fw-bold text-center"
  style={{
    backgroundColor: "#f9c5d1", // blush pink
    color: "#72065b", // deep purple contrast
    borderRadius: "8px",
    textDecoration: "none",
    transition: "background 0.3s ease, transform 0.3s ease, color 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#f497b6"; // deeper blush on hover
    e.target.style.color = "#fff"; // white text on hover
    e.target.style.transform = "scale(1.05)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "#f9c5d1"; // original blush
    e.target.style.color = "#72065b"; // original text color
    e.target.style.transform = "scale(1)";
  }}
>
  Book
</Link>

        </div>
      </div>
    </div>
  );
};

export default StyleCard;
