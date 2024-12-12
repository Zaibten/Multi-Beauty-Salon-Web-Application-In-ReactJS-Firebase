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
          <div className="d-flex justify-content-center align-items-center pt-3">
            <input
              placeholder="Search Your Favorite Salon..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="HomeSearch"
              className="text- bg-white w-75 border border-end-0 border-dark ps-3 pe-3 py-3"
            />
            <span className="material-icons py-3 px-3 bg-black text-white border-dark border border-start-0">
              search
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="container">
          <div className="d-flex justify-content-between text-white mb-3 align-items-center">
            <h6>Search Results ...</h6>
            <div className="d-flex align-items-center">
              <span className="material-icons-outlined">tune</span>
              <span className="ms-2"></span>
            </div>
          </div>
          <div className="border p-3">
            <div className="overflow-auto" style={{ height: "500px" }}>
              {loading ? (
                <Loader />
              ) : (
                shops
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.shopName.toLowerCase().includes(search);
                  })
                  .map((res) => (
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
