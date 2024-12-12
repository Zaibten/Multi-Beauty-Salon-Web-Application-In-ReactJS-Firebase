import React from "react";
import StyleCard from "./StyleCard";
import Breadcrumb from "../BreadCrumbs/Breadcrumb";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useEffect } from "react";
import { useState } from "react";
import Loader from "../Loader/loader";

const ShopDetail = () => {
  const { id } = useParams();
  const [shopDetails, setShopdetails] = useState("");
  const [services, setServices] = useState([]);
  const getSaloon = async () => {
    await getDoc(doc(db, "ProfessionalDB", `${id}`)).then((res) =>
      setShopdetails(res.data())
    );
  };
  const getServiceBySaloon = async () => {
    const data = await getDocs(
      collection(db, "ProfessionalDB", `${id}`, "Services")
    ).catch((err) => console.log(err));
    const get = data.docs.map((res) => ({
      ...res.data(),
      id: res.id,
    }));
    setServices(get);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getSaloon();
    getServiceBySaloon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="container">
      <div className="mt-3">
        <Breadcrumb path="Shop Details" activePage={"Shop"} text="white" />
      </div>
      <h3 className="text-white text-center">
        <span className=" border  py-2 ps-4">
          Shop <span className="bg-white text-black py-2 pe-4">Details</span>
        </span>
      </h3>
      <div className="mt-5">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <img
              alt=""
              src="https://img.freepik.com/premium-photo/beauty-saloon-eyebrow-care_524291-978.jpg?size=626&ext=jpg&ga=GA1.2.1543915203.1685795707&semt=ais"
              className="w-100 mb-3"
            />
          </div>
          {!shopDetails ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div className="col-12 col-sm-8 ms-sm-3 d-flex">
              <div className="text-white">
                <span className="d-block">Shop Name</span>
                <span className="d-block">Owner Name</span>
                <span className="d-block">Timing</span>
                <span className="d-block">Contact Number</span>
                <span className="d-block">Shop Rating</span>
              </div>
              <div className="text-white ps-3">
                <span className="d-block">
                  : <span className="ms-2">{shopDetails.shopName}</span>
                </span>
                <span className="d-block">
                  : <span className="ms-2">{shopDetails.name}</span>
                </span>
                <span className="d-block">
                  :{" "}
                  <span className="ms-2">
                    {!shopDetails.shopOpen ? "10:00 AM" : shopDetails.shopOpen}{" "}
                    - {shopDetails.shopClose}
                  </span>
                </span>
                <span className="d-block">
                  : <span className="ms-2">{shopDetails.number}</span>
                </span>
                <span className="d-block">
                  : <span className="ms-2">Not Available</span>
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-5">
          <h3 className="text-white mb-3">
            Services by{" "}
            <span className="text-decoration-underline">Professional</span>
          </h3>
          <div className="row ">
            {services.length === 0 ? (
              <Loader bgcolor="black" />
            ) : (
              services.map((doc) => (
                <div className="col-6 col-sm-3 mt-2" key={doc.id}>
                  <div className=" ">
                    <StyleCard
                      shopDetails={shopDetails}
                      services={services}
                      price={doc.Price}
                      name={doc.ServiceName}
                      image={doc.ServiceImage}
                      book={`/shop/${id}/${doc.id}/booking`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h4 className="text-white text-center">
          Free Offers are you{" "}
          <span className="text-decoration-underline">eligible</span> ?
        </h4>
        <div className="mt-4 mb-3">
          <div className="">
            <h6 className="text-white text-center">
              No Offers{" "}
              <span className="text-decoration-underline">Currently</span> !!!
              <span className="text-warning fw-bold fs-2">☺</span>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
