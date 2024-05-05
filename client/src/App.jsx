import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUpCompany from "./pages/brand/SignUpCompany";
import OAuth from "./components/AOuth";
import RegistrationSuccess from "./pages/RegistrationSuccess";

export default function App() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/brand/signup" element={<SignUpCompany />} />
          <Route path="/brand/google" element={<OAuth />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}
