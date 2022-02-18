import React from "react";
import "./tailwind.css";
import ReactDOM from "react-dom";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import NavBar from "./components/navBar";
import TokenPage from "./pages/TokenPage";
import TokenICO from "./pages/TokenICO";

const tokenAddress = "0xC59C54DdB15B16dC54F41aCDE2f049F8fb401247";

ReactDOM.render(
  <div>
    <NavBar></NavBar>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<TokenPage tokenAddress={tokenAddress} />}></Route>
        <Route exact path="/ico" element={<TokenICO tokenAddress={tokenAddress} />}></Route>
        {/* ProtectedRoute */}
      </Routes>
    </BrowserRouter>
  </div>,
  document.getElementById("root")
);
