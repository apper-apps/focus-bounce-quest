import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./components/organisms/Layout";
import GamePage from "./components/pages/GamePage";
import MenuPage from "./components/pages/MenuPage";
import LevelSelectPage from "./components/pages/LevelSelectPage";

function App() {
  return (
    <div className="h-full w-full overflow-hidden">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MenuPage />} />
          <Route path="levels" element={<LevelSelectPage />} />
          <Route path="game/:levelId" element={<GamePage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
      />
    </div>
  );
}

export default App;