import { Rate } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const SearchContent = ({ btn, data, serviceFilter }) => {
  const {
    email,
    name,
    number,
    shopAddress,
    shopName,
    shopClose,
    id,
    avgRating,
    services = [],
  } = data;

  const ShopImg =
    "https://img.freepik.com/premium-vector/vintage-art-illustration-man-getting-his-hair-cut_697324-8454.jpg";

  const showServices = serviceFilter !== "" && serviceFilter !== "All";

  return (
    <div
      className="row pb-4 mt-4 border-bottom border-secondary"
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      
    >
      <div className="col-12 col-sm-3">
        <img alt="" src={ShopImg} className="w-100 rounded shadow" />
      </div>

      <div className="col-12 col-sm-5 text-white">
        <h5 className="fw-bold">{shopName}</h5>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><strong>Owner:</strong> {name}</li>
          <li><strong>Time:</strong> 10:00 AM - {shopClose}</li>
          <li><strong>Address:</strong> {shopAddress}</li>
          <li><strong>Phone:</strong> {number}</li>
          <li><strong>Email:</strong> {email}</li>
        </ul>

        {/* Matching Services - Only show when appropriate */}
        {showServices && services.length > 0 && (
          <div className="mt-3">
            <strong>Matching Services:</strong>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap", // Allows services to wrap to the next line
                gap: "15px",
                marginTop: "10px",
              }}
            >
              {services.map((service, i) => (
                <Link
                  to={`/shop/${id}/${service.id}/booking`}
                  key={i}
                  style={{
                    textDecoration: "none",
                    background: "#333",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    color: "#fff",
                    transition: "all 0.3s ease, transform 0.3s ease",
                    border: "1px solid transparent",
                    fontSize: "14px",
                    fontWeight: "600",
                    minWidth: "180px",
                    transform: "scale(1)", // Default scale for animation
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Initial shadow
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#444";
                    e.currentTarget.style.transform = "scale(1.05)"; // Scaling effect
                    e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.borderColor = "#888";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#333";
                    e.currentTarget.style.transform = "scale(1)"; // Reset scaling
                    e.currentTarget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <span>{service.ServiceName}</span>
                  <span> Rs: {service.Price}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="col-12 col-sm-4 d-flex align-items-end justify-content-between text-white mt-3 mt-sm-0">
        <div>
          {avgRating && avgRating > 0 ? (
            <>
              <Rate allowHalf value={avgRating} disabled />
              <span className="ms-2">{avgRating.toFixed(1)} / 5</span>
            </>
          ) : (
            <span className="text-warning">No Rating</span>
          )}
        </div>
        <div>
          {btn ? (
            <button
              className="py-2 px-4 border-0 rounded bg-danger text-white transition-all"
              style={{
                backgroundColor: "#ff4d4d",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
              Cancel
            </button>
          ) : (
            <Link
              to={`/shop/${id}`}
              className="py-2 px-4 border bg-black text-white rounded shadow-sm transition-all"
              style={{
                fontSize: "14px",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Check Shop
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
