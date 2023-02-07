import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <main>
      <Navigation />
      <div className="vh-100 vw-100 d-flex align-items-center">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
