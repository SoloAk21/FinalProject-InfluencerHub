import React from "react";
import { useCountries } from "use-react-countries";
import {
  Input,
  Menu,
  MenuHandler,
  Button,
  Typography,
} from "@material-tailwind/react";

export function PhoneNumberInput({
  error,
  placeholder,
  value,
  onChange,
  required,
  label,
}) {
  const { countries } = useCountries();
  const ethiopiaIndex = countries.findIndex(
    (country) => country.name === "Ethiopia"
  );
  const [country] = React.useState(ethiopiaIndex);
  const { name, flags, countryCallingCode } = countries[country];

  return (
    <div>
      <div className="relative flex w-full max-w-lg">
        <Menu placement="bottom-start">
          <MenuHandler>
            <Button
              ripple={false}
              variant="text"
              color="blue-gray"
              className="disabled:* flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
            >
              <img
                src={flags.svg}
                alt={name}
                className="h-4 w-4 rounded-full object-cover"
              />
              {countryCallingCode}
            </Button>
          </MenuHandler>
        </Menu>
        <Input
          value={value}
          onChange={onChange}
          className="rounded-l-none"
          label={label}
          placeholder={placeholder}
          required={required}
        />
      </div>
      {error && (
        <Typography className=" text-[10px] ml-4 mt-1" color="red">
          {error}
        </Typography>
      )}
    </div>
  );
}
