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

export default function StepOne() {
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
          Personal Information
        </Typography>
        <Input label="Full Name *" placeholder="Alex Abera" />
        <Input type="date" label="Date of Birth  *" />
        <Select label="Select sectors  *">
          <Checkbox
            label="Material Tailwind HTML"
            value="Material Tailwind HTML"
            checked={selectedSectors.includes("Material Tailwind HTML")}
            onChange={handleSectorChange}
          />

          <Checkbox
            label="Material Tailwind React"
            value="Material Tailwind React"
            checked={selectedSectors.includes("Material Tailwind React")}
            onChange={handleSectorChange}
          />
        </Select>
        <Select label="City *">
          <Option>Addis Ababa</Option>
          <Option>Dire Dawa</Option>
          <Option>Mekelle</Option>
          <Option>Gondar</Option>
          <Option>Bahir Dar</Option>
          <Option>Awasa</Option>
          <Option>Adama (Nazret)</Option>
          <Option>Hawassa</Option>
          <Option>Jimma</Option>
          <Option>Dessie</Option>
          <Option>Axum</Option>
          <Option>Arba Minch</Option>
          <Option>Harar</Option>
          <Option>Debre Markos</Option>
          <Option>Nekemte</Option>
          <Option>Jijiga</Option>
          <Option>Shashamane</Option>
          <Option>Gambela</Option>
          <Option>Asosa</Option>
          <Option>Bishoftu (Debre Zeit)</Option>
          <Option>Dilla</Option>
          <Option>Debre Birhan</Option>
          <Option>Sodo</Option>
          <Option>Hagere Maryam</Option>
          <Option>Metu</Option>
          <Option>Woldia</Option>
          <Option>Ambo</Option>
          <Option>Adigrat</Option>
          <Option>Assela</Option>
          <Option>Kombolcha</Option>
        </Select>
      </form>
    </Card>
  );
}
