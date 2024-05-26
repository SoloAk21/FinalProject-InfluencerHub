import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import MainStructure from "./MainStructure";
// import { InfluencerProfile } from "../../components/brands/InfluencerProfile";
import SearchByUsername from "../../components/brands/search/SearchByUsername";
import SearchByFilter from "../../components/brands/search/SearchByFilter";

export default function Search() {
  const data = [
    {
      label: "Search by username",
      value: "searchByUsername",
    },
    {
      label: "Search by filters",
      value: "searchByFilters",
    },
  ];
  const searchPage = (
    <Tabs id="custom-animation" value="searchByUsername" className="text-xs ">
      <TabsHeader
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-blue-gray-900 shadow-none rounded-none ",
        }}
        className="rounded-none   border-b  border-blue-gray-50 bg-transparent px-4"
      >
        {data.map(({ label, value }) => (
          <Tab className="" key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        animate={{
          initial: { y: 250 },
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
        className="block"
      >
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {value === "searchByUsername" ? (
              <SearchByUsername />
            ) : (
              <SearchByFilter />
            )}

            {/* <InfluencerProfile /> */}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
  return <MainStructure content={searchPage} />;
}
