import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import DynamicTable from "../../components/DynamicTable";
import { Typography } from "@material-tailwind/react";
import MainStructure from "./MainStructure";
import { platformsIcons } from "../../helper/platformIcons";

function InfluencerDetail() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useMemo hook moved to the top level
  const formatArrayValue = useMemo(
    () => (value) => value.join(", ").replace(/,(?=[^,]*$)/, " and"),
    []
  );

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const response = await fetch(`/api/influencers/details/${id}`);

        if (response.ok) {
          const data = await response.json();
          setInfluencer(data);
        } else {
          throw new Error("Failed to fetch influencer data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const tableHeaders = ["Platform", "URL", "Followers"];

  const tableData = influencer.platforms.map(({ name, url, followerCount }) => [
    <span className="flex items-center gap-1">
      <span className="cursor-pointer rounded-full border border-blue-900/5 bg-blue-900/20 p-2 text-blue-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
        {React.createElement(platformsIcons[name])}
      </span>
      <span>{name}</span>
    </span>,
    url,
    followerCount,
  ]);

  const renderField = (key) => {
    if (["platforms"].includes(key)) return;

    const label = key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    const value = Array.isArray(influencer[key])
      ? formatArrayValue(influencer[key])
      : influencer[key];

    return (
      <div key={key} className="flex items-center flex-row gap-3">
        <Typography className="text-sm text-blue-gray-900 font-medium">
          {label}
        </Typography>
        <div className="text-xs flex-1 flex items-center text--gray-600">
          <span className="bg-gray-900/5 rounded-sm p-2">{value}</span>
        </div>
      </div>
    );
  };

  const influencerDetailPage = (
    <div className="px-4 min-h-[1000px]">
      {influencer ? (
        <div>
          <div className="flex flex-col gap-4 my-2">
            <Typography variant="h6" color="blue-gray" className="text-center ">
              Influencer Detail
            </Typography>
            <div className="flex flex-col gap-3">
              {Object.keys(influencer).map(renderField)}
            </div>
          </div>
          <DynamicTable headers={tableHeaders} data={tableData} />
        </div>
      ) : (
        <p>No influencer details available.</p>
      )}
    </div>
  );
  return <MainStructure content={influencerDetailPage} />;
}

export default InfluencerDetail;
