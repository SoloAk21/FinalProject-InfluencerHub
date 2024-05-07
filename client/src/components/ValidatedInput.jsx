// ValidatedInput.js
import React from "react";
import { Input, Typography } from "@material-tailwind/react";

const ValidatedInput = ({
  label,
  value,
  placeholder,
  onChange,
  error,
  required,
  type,
}) => {
  return (
    <div>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        className="placeholder:text-xs text-xs"
      />
      {error && (
        <Typography className=" text-[10px] ml-4 mt-1" color="red">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default ValidatedInput;
