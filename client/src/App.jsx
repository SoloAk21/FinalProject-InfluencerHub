// App.jsx

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUpCompany from "./pages/brand/SignUpCompany";
import SignUpInfluencer from "./pages/influencer/SignUpInfluencer";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import SignIn from "./pages/SignIn";
import UserProfile from "./pages/influencer/UserProfile";
import CompanyProfile from "./pages/brand/CompanyProfile";
import MainStructure from "./pages/brand/MainStructure";
import Search from "./pages/brand/Search";
import InfluencerDetail from "./pages/brand/InfluencerDetail";
import Message from "./pages/Message";
import CreateCampaign from "./pages/brand/CreateCampaign";
import Payment from "./pages/brand/Payment";
import ManageCampaign from "./pages/brand/ManageCampaign";
import CampaignDetails from "./pages/brand/CampaignDetails";
import PrivateRoute from "./components/PrivateRoute";
import OAuth from "./components/AOuth";

import ManageCollaborations from "./pages/ManageCollaborations";

import UploadContent from "./pages/influencer/UploadContent";
import Content from "./pages/Content";
import InitiateTransfer from "./pages/InitiateTransfer";
import DisplayTransfers from "./pages/DisplayTransfer";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="flex-col flex bg-white min-h-screen ">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/company/signup" element={<SignUpCompany />} />
          <Route path="/influencer/signup" element={<SignUpInfluencer />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />
          <Route path="/signin" element={<SignIn />} />

          {/* OAuth Redirects */}
          <Route
            path="/company/google"
            element={<OAuth userType="company" />}
          />
          <Route
            path="/influencer/google"
            element={<OAuth userType="influencer" />}
          />

          {/* Routes accessible to both company and influencer */}
          <Route element={<PrivateRoute userTypeAllowed={null} />}>
            <Route
              path="/profile"
              element={<MainStructure content={<CompanyProfile />} />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/influencer/:id" element={<InfluencerDetail />} />
            <Route path="/message" element={<Message />} />
            <Route path="/collaborations" element={<ManageCollaborations />} />
            <Route path="/manage-campaign" element={<ManageCampaign />} />
            <Route path="/content" element={<Content />} />
          </Route>

          {/* Routes accessible only to company */}
          <Route element={<PrivateRoute userTypeAllowed="company" />}>
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/payment" element={<Payment />} />

            <Route path="/detail-campaign" element={<CampaignDetails />} />
            <Route path="/companyprofile" element={<CompanyProfile />} />
            <Route
              path="/detail-influencer/:id"
              element={<InfluencerDetail />}
            />
          </Route>

          {/* Routes accessible only to influencer */}
          <Route element={<PrivateRoute userTypeAllowed="influencer" />}>
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/upload-content" element={<UploadContent />} />
            <Route path="/transfer" element={<InitiateTransfer />} />
            <Route path="/display-transfer" element={<DisplayTransfers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
