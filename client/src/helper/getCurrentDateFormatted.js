// helper.js

export const getCurrentDateFormatted = () => {
  const currentDate = new Date();

  // Format options for date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Format the date according to options
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return formattedDate;
};
