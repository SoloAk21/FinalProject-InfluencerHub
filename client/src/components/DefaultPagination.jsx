import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const DefaultPagination = ({ active, setActive, totalPages }) => {
  const next = () => {
    if (active === totalPages) return;
    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
  };

  return (
    <div className="flex items-end justify-end gap-2 lg:gap-4">
      <Button
        size="sm"
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-1 ">
        {Array.from({ length: totalPages }, (_, index) => (
          <IconButton
            key={index + 1}
            variant={active === index + 1 ? "filled" : "text"}
            color="gray"
            onClick={() => setActive(index + 1)}
          >
            {index + 1}
          </IconButton>
        ))}
      </div>
      <Button
        size="sm"
        variant="text"
        className="flex items-center gap-1"
        onClick={next}
        disabled={active === totalPages}
      >
        Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DefaultPagination;
