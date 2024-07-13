import React from "react";

const ContentDeliverables = ({ campaignInfo, setCampaignInfo }) => {
  const contentDeliverablesOptions = [
    {
      value: "socialMediaPost",
      label: "Social Media Post",
      description:
        "Short, engaging content for platforms like Instagram, Facebook, Twitter, etc.",
    },
    {
      value: "blogPost",
      label: "Blog Post",
      description:
        "Detailed articles with in-depth information, usually longer than social media posts.",
    },
    {
      value: "article",
      label: "Article",
      description: "Can be published on websites, blogs, or magazines.",
    },
    {
      value: "productReview",
      label: "Product Review",
      description: "Detailed reviews of products or services.",
    },
    {
      value: "howToGuide",
      label: "How-To Guide",
      description:
        "Step-by-step instructions on how to use a product or perform a task.",
    },
    {
      value: "interview",
      label: "Interview",
      description: "Conversations with experts or brand representatives.",
    },

    {
      value: "other",
      label: "Other",
      description:
        "Custom content deliverables not listed above. Please specify in the details field.",
    },
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
    <div className="mx-auto py-12 flex flex-col ">
      <div className="mb-2">
        <h2 className="text-lg font-medium text-gray-800">
          Content Deliverables
        </h2>
        <p className="text-sm text-gray-500">
          Select the types of content deliverables expected from influencers.
        </p>
      </div>
      {contentDeliverablesOptions.map((option) => (
        <div key={option.value} className="py-3 ml-20 w-full flex">
          <div className="bg-white dark:bg-gray-800 border rounded-sm border-gray-400 dark:border-gray-700 w-5 h-5 flex flex-shrink-0 relative">
            <input
              type="checkbox"
              id={option.value}
              checked={campaignInfo.contentDeliverables.includes(option.value)}
              onChange={(e) =>
                handleContentDeliverablesChange(option.value, e.target.checked)
              }
              className="checkbox opacity-0 absolute cursor-pointer w-full h-full"
            />
            <div
              className={`check-icon ${
                campaignInfo.contentDeliverables.includes(option.value)
                  ? "block"
                  : "hidden"
              } bg-indigo-700 text-white rounded-sm`}
            >
              <svg
                className="icon icon-tabler icon-tabler-check"
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M5 12l5 5l10 -10" />
              </svg>
            </div>
          </div>
          <p className=" text-base leading-4 font-normal text-gray-800 dark:text-gray-100">
            <div className="pl-2">
              <p className="text-sm font-medium leading-none text-gray-800">
                {option.label}
              </p>
              <p className="text-xs leading-3 text-gray-600 mt-1">
                {option.description}
              </p>
            </div>
          </p>
        </div>
      ))}
      <style jsx>{`
        .checkbox:checked {
          border: none;
        }
        .checkbox:checked + .check-icon {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default ContentDeliverables;
