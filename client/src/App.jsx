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
import MainStructure from "./pages/brand/MainStructure";
import Search from "./pages/brand/Search";
import InfluencerDetail from "./pages/brand/InfluencerDetail";
import Message from "./pages/Message";
import CreateCampaign from "./pages/brand/CreateCampaign";
import Payment from "./pages/brand/Payment";

export default function App() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/company/signup" element={<SignUpCompany />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/payment" element={<Payment />} />

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

          <Route element={<PrivateRoute />}>
            <Route
              path="/profile"
              element={<MainStructure content={<CompanyProfile />} />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/influencer/:id" element={<InfluencerDetail />} />
            <Route path="/message" element={<Message />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
