import React, { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import { PhoneNumberInput } from "../../PhoneNumberInput";

export default function StepTwo() {
  const [selectedSectors, setSelectedSectors] = useState([]);

  const handleSectorChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedSectors((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedSectors((prevSelected) =>
        prevSelected.filter((sector) => sector !== value)
      );
    }
  };

  return (
    <Card className="mx-auto max-w-xl " color="transparent" shadow={false}>
      <form className="flex flex-col gap-2 md:gap-4 mt-8 mb-2 w-72 max-w-screen-lg sm:w-96">
        <Typography
          className="text-center mb-4 text-blue-gray-600"
          variant="h6"
          color="blue-gray"
        >
          Contact Information
        </Typography>
        <Input label="Username *" />
        <Input
          className="disabled:*"
          label="Email address "
          value={"Xxjz3@example.com"}
        />
        <PhoneNumberInput />

        <Input type="password" label="Password  *" />
        <Input type="password" label="Confirm Password  *" />
      </form>
    </Card>
  );
}
