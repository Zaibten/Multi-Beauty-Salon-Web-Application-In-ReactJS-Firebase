import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const DashBoard = () => {
  return (
    <div className="d-flex gap-2 me-1 vh-100 pt-1 pb-1">
      <Sidebar />

      <div className="w-100 position-relative">
        <Outlet />
      </div>
      <div className="position-fixed w-100 bottom-0 responsiveMenu">
        <MobileMenu />
      </div>
    </div>
  );
};

export default DashBoard;
