import React, { useState } from "react";
import { Drawer, Avatar, Typography } from "@material-tailwind/react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import SideBar from "../../components/brands/SideBar";

export default function MainStructure({ content }) {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <div className="">
      <div className="sticky top-0 bg-white shadow-lg md:py-2 md:px-4 z-10">
        <div className="flex flex-row items-center justify-between px-2 pt-4 pb-2">
          <HiOutlineMenuAlt2
            className="md:hidden"
            size={24}
            onClick={openDrawer}
          />
          <Typography variant="h5" color="blue-gray">
            InfluencerHub
          </Typography>
          <Avatar
            src="https://docs.material-tailwind.com/img/face-2.jpg"
            alt="avatar"
            size="sm"
          />
        </div>
      </div>

      <Drawer className="md:hidden p-4" open={open} onClose={closeDrawer}>
        <SideBar />
      </Drawer>
      <div className="flex flex-row">
        <div className="flex-none md:flex hidden h-[calc(100vh-4rem)] custom-scrollbar overflow-y-auto border-x-4">
          <SideBar />
        </div>
        <div className="flex-auto h-[calc(100vh-4rem)] custom-scrollbar overflow-y-auto">
          {content}
        </div>
      </div>

      {/* Custom CSS for hiding the scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        .custom-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
