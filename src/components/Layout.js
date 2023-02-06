import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main>
      <div className="vh-100 vw-100 d-flex align-items-center">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
