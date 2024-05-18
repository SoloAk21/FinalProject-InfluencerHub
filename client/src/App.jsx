import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUpCompany from "./pages/brand/SignUpCompany";

import RegistrationSuccess from "./pages/RegistrationSuccess";
import SignUpInfluencer from "./pages/influencer/SignUpInfluencer";
import OAuth from "./components/AOuth";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import UserProfile from "./pages/influencer/UserProfile";
import CompanyProfile from "./pages/brand/CompanyProfile";

export default function App() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/company/signup" element={<SignUpCompany />} />
          <Route
            path="/company/google"
            element={<OAuth userType="company" />}
          />
          <Route
            path="/influencer/google"
            element={<OAuth userType="influencer" />}
          />
          <Route path="/influencer/signup" element={<SignUpInfluencer />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/companyprofile" element={<CompanyProfile />} />

          <Route element={<PrivateRoute />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
