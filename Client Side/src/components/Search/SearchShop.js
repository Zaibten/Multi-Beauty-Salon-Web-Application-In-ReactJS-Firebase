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

  // Fetch shops and their services from Firebase
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ProfessionalDB"));
        const shopData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const servicesSnapshot = await getDocs(
              collection(db, "ProfessionalDB", doc.id, "Services")
            );
            const services = servicesSnapshot.docs.map((serviceDoc) => ({
              id: serviceDoc.id,
              ...serviceDoc.data(),
            }));

            const reviewsSnapshot = await getDocs(
              collection(db, "ProfessionalDB", doc.id, "Reviews")
            );
            const reviews = reviewsSnapshot.docs.map((reviewDoc) => ({
              id: reviewDoc.id,
              ...reviewDoc.data(),
            }));

            // Calculate average rating
            const avgRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  reviews.length
                : 0;

            return {
              id: doc.id,
              ...doc.data(),
              services,
              reviews,
              avgRating,
            };
          })
        );

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

  // Function to clear all filters
  const clearFilters = () => {
    setSearch("");
    setPriceFilter("");
    setRatingFilter("");
    setServiceFilter("");
  };

  // Filtering Logic
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      search === "" ||
      shop.shopName.toLowerCase().includes(search.toLowerCase());

    const matchesService =
      serviceFilter === "" ||
      shop.services.some((service) =>
        service.ServiceName.toLowerCase().includes(serviceFilter.toLowerCase())
      );

    const matchesPrice =
      priceFilter === "" ||
      shop.services.some((service) => {
        const price = parseInt(service.Price, 10);
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
          default:
            return true;
        }
      });

    const matchesRating =
      ratingFilter === "" || shop.avgRating >= parseInt(ratingFilter, 10);

    return matchesSearch && matchesService && matchesPrice && matchesRating;
  });

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

          {/* Filters Section */}
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

            {/* Clear Filters Button */}
            <div className="mt-3 text-end">
              <button className="btn btn-danger" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="mt-5 container">
        <div className="border p-3">
          {loading ? <Loader /> : filteredShops.map((res) => <NavLink key={res.id} to={`/shop/${res.id}`}><SearchContent data={res} /></NavLink>)}
        </div>
      </div>
    </div>
  );
};

export default SearchShop;
