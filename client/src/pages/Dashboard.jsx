import React from "react";
import MainStructure from "./brand/MainStructure";
import ManageCollaborations from "./ManageCollaborations";
import ManageCampaign from "./brand/ManageCampaign";
import Content from "./Content";

export default function Dashboard() {
  return (
    <MainStructure
      content={
        <>
          <ManageCollaborations />
          <ManageCampaign />
          <Content />
        </>
      }
    />
  );
}
