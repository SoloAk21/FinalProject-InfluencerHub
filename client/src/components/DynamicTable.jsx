// SocialMediaTable.js

import React from "react";
import { Typography } from "@material-tailwind/react";

const DynamicTable = ({ headers, data }) => {
  return (
    <div className=" w-full overflow-x-hidden">
      {data.length > 0 && (
        <table className="max-w-full w-full table-auto text-left">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-2 px-4"
                >
                  <Typography className="text-xs font-normal opacity-70">
                    {header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="p-2 border-b border-blue-gray-50"
                  >
                    <Typography className="font-normal text-xs">
                      {cell}
                    </Typography>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicTable;
