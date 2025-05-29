import React, { useEffect, useState } from "react";
import Carousel from "../Carousel/Carousel";
import ShopCard from "../ShopCard/ShopCard";
import About from "../About/About";
import Footer from "../Footer/Footer";
import "./Home.css";
import SearchHome from "../Search/SearchHome";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import store from "../../Redux/reduxStore";
import { addShop } from "../../Redux/Slices/AllShops";

const Home = () => {
  const [getShops, setGetShops] = useState([]);

  const getShopData = async () => {
    const data = await getDocs(collection(db, "ProfessionalDB"));
    const newData = data.docs.map((res) => ({
      ...res.data(),
      id: res.id,
    }));

    setGetShops(newData);
    store.dispatch(addShop(newData));

    // Update the timestamp in localStorage after fetching data
    localStorage.setItem("lastReload", Date.now());
  };

  useEffect(() => {
    // Check the last reload time from localStorage
    const lastReload = localStorage.getItem("lastReload");
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (!lastReload || Date.now() - lastReload > fifteenMinutes) {
      getShopData();
    }

    // If the user is logged in, log their info
    const user = localStorage.getItem("user");
    if (user) {
      console.log("User logged in:", user);
    }
  }, []);

  return (
    <div>
      <Carousel />
      <br></br>
      <br></br>
      <ShopCard data={getShops} />
      <SearchHome />
      <About />
      <Footer />
    </div>
  );
};

export default Home;
