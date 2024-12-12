import React from "react";
import { Link } from "react-router-dom";

const StyleCard = ({ price, book, name, image }) => {
  return (
    <div>
      <div className="card w-100">
        <img
          src="https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"
          className="card-img-top"
          alt="Fissure in Sandstone"
        />
        <div className="card-body w-100" style={{ backgroundColor: "white" }}>
          <h5 className="card-title fw-semibold">{name}</h5>
          <p className="card-text">
            <span className="fw-bold">
              Price: <span className="text-primary fw-bold">{price} /-</span>
            </span>
          </p>
          <Link
            to={book}
            className="w-100 px-2 py-2 d-block fw-bold text-white bg-black rounded"
          >
            Buy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StyleCard;
