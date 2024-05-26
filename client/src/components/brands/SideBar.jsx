import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MegaphoneIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { FaSearch } from "react-icons/fa";

const sidebarItems = [
  {
    icon: MagnifyingGlassIcon,
    label: "Search",
    href: "/search",
  },
  {
    icon: PresentationChartBarIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: ShoppingBagIcon,
    label: "Create Campaign",
    href: "/create-campaign",
  },
  {
    icon: MegaphoneIcon,
    label: "Manage Campaign",
    href: "/manage-campaign",
  },
  {
    icon: ChatBubbleOvalLeftEllipsisIcon, // Updated icon for "Message"
    label: "Message",
    href: "/message",
  },
  {
    icon: InboxIcon,
    label: "Inbox",
    suffix: (
      <ListItemSuffix>
        <Chip
          value="14"
          size="sm"
          variant="ghost"
          color="blue-gray"
          className="rounded-full"
        />
      </ListItemSuffix>
    ),
  },
  {
    icon: UserCircleIcon,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: Cog6ToothIcon,
    label: "Settings",
    href: "/settings",
  },
  {
    icon: PowerIcon,
    label: "Log Out",
  },
];

export default function SideBar() {
  return (
    <Card className=" w-full p-4 shadow-xl shadow-blue-gray-900/5 ">
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.label}>
            <ListItemPrefix>
              <item.icon className="h-5 w-5" />
            </ListItemPrefix>
            {item.href ? (
              <a href={item.href} className="hover:text-blue-gray-700">
                {item.label}
              </a>
            ) : (
              item.label
            )}
            {item.suffix && item.suffix}
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
