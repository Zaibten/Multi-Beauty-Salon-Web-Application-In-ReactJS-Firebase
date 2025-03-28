import React from "react";
import "./style.css";
import { useState } from "react";
import Loader from "../../Loader/loader";
import { useEffect } from "react";
import ListItem from "./ScheduleList/listItem";
// import Breadcrumb from "../BreadCrumbs/Breadcrumb.js";

const ProfessionalSchedule = () => {
  const [schedules, setSchedules] = useState("");
  useEffect(() => {
    setSchedules("Hello");
  }, []);

  return schedules === "" ? (
    <Loader />
  ) : (
    <div id="main" className=" border py-2 px-3 position-relative vh-100 ">
      <h6 className="text-white position-absolute start-2">
        <span className="bg-white text-black px-2 py-2">
          Your
          <span className="text-decoration-underline ms-1">Schedules</span>
        </span>
      </h6>
      <div className="overflow-auto h-100 pb-5">
        <ListItem clientName="client" service="Service name" time="time" />
      </div>
    </div>
  );
};

export default ProfessionalSchedule;
