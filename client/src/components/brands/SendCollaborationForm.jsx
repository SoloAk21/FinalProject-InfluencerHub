// components/SendCollaborationForm.js
import React, { useState } from "react";
import { postToAuthAPI } from "../../helper/postToAuthAPI";
import { Button } from "@material-tailwind/react";

const SendCollaborationForm = ({ influencerId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await postToAuthAPI("/api/collaborations/send", {
        influencerId,
      });
      console.log(response.data);
      // Optionally, provide success feedback to the user
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative my-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Button
        size="small"
        className="bg-green-400 capitalize font-thin"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Collaboration Request"}
      </Button>
    </form>
  );
};

export default SendCollaborationForm;
