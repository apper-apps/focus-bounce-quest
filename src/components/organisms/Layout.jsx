import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <Outlet />
    </div>
  );
};

export default Layout;