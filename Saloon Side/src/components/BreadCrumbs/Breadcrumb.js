import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ prevPage, link, text, activePage }) => {
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb text-white">
          <li className="breadcrumb-item">
            <Link to={"/"} className={`text-${text}`}>
              Home
            </Link>
          </li>
          {link ? (
            <Link
              to={`${link}`}
              className={`text-${text} breadcrumb-item active text-secondary`}
              aria-current="page"
            >
              {prevPage}
            </Link>
          ) : (
            <></>
          )}

          <li
            className="breadcrumb-item active text-secondary text-decoration-underline"
            aria-current="page"
          >
            {activePage}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
