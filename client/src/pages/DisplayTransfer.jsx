import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayTransfers = () => {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await fetch("/api/transfers");

        const data = response.json();

        setTransfers(data);
      } catch (error) {
        console.error(error);
        // Handle error, e.g., show error message
      }
    };

    fetchTransfers();
  }, []);

  return (
    <div>
      <h2>All Transfers</h2>
      <ul>
        {transfers.map((transfer) => (
          <li key={transfer.id}>
            {transfer.account_name} - {transfer.amount} {transfer.currency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayTransfers;
