import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Checkbox,
} from "@material-tailwind/react";

const ContentDeliverables = ({ campaignInfo, setCampaignInfo }) => {
  const contentDeliverablesOptions = [
    { value: "socialMediaPost", label: "Social Media Post" },
    { value: "blogPost", label: "Blog Post" },
    { value: "videoContent", label: "Video Content" },
    { value: "podcastEpisode", label: "Podcast Episode" },
  ];

  const handleContentDeliverablesChange = (value, checked) => {
    if (checked) {
      setCampaignInfo((prev) => ({
        ...prev,
        contentDeliverables: [...prev.contentDeliverables, value],
      }));
    } else {
      setCampaignInfo((prev) => ({
        ...prev,
        contentDeliverables: prev.contentDeliverables.filter(
          (item) => item !== value
        ),
      }));
    }
  };

  return (
    <div className="my-1">
      <Typography variant="body">Content Deliverables</Typography>
      {contentDeliverablesOptions.map((option) => (
        <label key={option.value} className="flex items-center m-0">
          <List className="w-full">
            <ListItem className="p-0">
              <label
                htmlFor={option.value}
                className="flex w-full cursor-pointer items-center px-3"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id={option.value}
                    value={option.value}
                    checked={campaignInfo.contentDeliverables.includes(
                      option.value
                    )}
                    onChange={(e) =>
                      handleContentDeliverablesChange(
                        option.value,
                        e.target.checked
                      )
                    }
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{ className: "p-0" }}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  {option.label}
                </Typography>
              </label>
            </ListItem>
          </List>
        </label>
      ))}

      <Typography
        variant="small"
        color="gray"
        className="text-xs font-normal m-1 mx-2"
      >
        Select the types of content deliverables expected from influencers. For
        example, "Social Media Post".
      </Typography>
    </div>
  );
};

export default ContentDeliverables;
