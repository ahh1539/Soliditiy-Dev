import React from "react";
import "./tailwind.css";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import NavBar from "./components/navBar";
import TokenPage from "./pages/TokenPage";
import TokenICO from "./pages/TokenICO";

ReactDOM.render(
  <div>
    <NavBar></NavBar>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<TokenPage />}></Route>
        <Route exact path="/ico" element={<TokenICO />}></Route>
        {/* ProtectedRoute */}
      </Routes>
    </BrowserRouter>
  </div>,
  document.getElementById("root")
);
