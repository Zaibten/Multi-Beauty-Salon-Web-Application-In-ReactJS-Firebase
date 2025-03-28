import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import BreadCrumbs from "../BreadCrumbs/Breadcrumb";
import SearchContent from "./SearchContent";
import Loader from "../Loader/loader";
import { NavLink } from "react-router-dom";

// Firebase Configuration
const config = {
  apiKey: "AIzaSyB3FObmEUWeLFUGnJ-tnieFPFBeVyOh3_0",
  authDomain: "anatomy-45c16.firebaseapp.com",
  projectId: "anatomy-45c16",
  storageBucket: "anatomy-45c16.firebasestorage.app",
  messagingSenderId: "231264600518",
  appId: "1:231264600518:web:9e6796111469507532f2c7",
  measurementId: "G-TG0B43KBEB",
};

const SearchShop = () => {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState(""); // Price filter state
  const [ratingFilter, setRatingFilter] = useState(""); // Rating filter state
  const [serviceFilter, setServiceFilter] = useState(""); // Service filter state

  // Initialize Firebase
  const app = initializeApp(config);
  const db = getFirestore(app);

  // Fetch shops from Firebase
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ProfessionalDB"));
        const shopData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShops(shopData);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [db]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mb-3">
      <div className="bg-white">
        <div className="container pt-3 pb-5">
          <BreadCrumbs text="black" activePage={"Search"} />
          
          {/* Search Bar */}
          <div className="d-flex justify-content-center align-items-center pt-3">
            <input
              placeholder="Search Your Favorite Salon..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="HomeSearch"
              className="text-bg-white w-75 border border-end-0 border-dark ps-3 pe-3 py-3"
            />
            <span className="material-icons py-3 px-3 bg-black text-white border-dark border border-start-0">
              search
            </span>
          </div>

          {/* Filters Section (No Filtering Logic) */}
          <div className="mt-4 border p-3 rounded bg-light">
            <h6 className="fw-bold">Filters:</h6>
            <div className="row">
              
              {/* Price Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">Price Range:</label>
                <select
                  className="form-control"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="0-1000">Below 1000</option>
                  <option value="1000-3000">1000 - 3000</option>
                  <option value="3000-5000">3000 - 5000</option>
                  <option value="5000-10000">5000 - 10000</option>
                  <option value="10000-20000">10000 - 20000</option>
                </select>
              </div>

              {/* Ratings Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">Minimum Rating:</label>
                <select
                  className="form-control"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="1">1 Star & Above</option>
                  <option value="2">2 Stars & Above</option>
                  <option value="3">3 Stars & Above</option>
                  <option value="4">4 Stars & Above</option>
                  <option value="5">5 Stars Only</option>
                </select>
              </div>

              {/* Service Type Filter */}
              <div className="col-md-4">
                <label className="fw-semibold">Service Type:</label>
                <select
                  className="form-control"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Haircut">Haircut</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Spa">Spa</option>
                  <option value="Facial">Facial</option>
                  <option value="Massage">Massage</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results (No Filtering Applied) */}
      <div className="mt-5">
        <div className="container">
          <div className="d-flex justify-content-between text-black mb-3 align-items-center">
            <h6>Search Results ({shops.length})</h6>
          </div>
          <div className="border p-3">
            <div className="overflow-auto" style={{ height: "500px" }}>
              {loading ? (
                <Loader />
              ) : shops.length === 0 ? (
                <p className="text-center text-muted">No results found.</p>
              ) : (
                shops.map((res) => (
                  <NavLink key={res.id} to={`/shop/${res.id}`}>
                    <SearchContent data={res} />
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchShop;
