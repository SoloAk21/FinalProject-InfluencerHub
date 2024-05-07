import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTelegramPlane,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export const INDUSTRY = [
  "Education",
  "Healthcare",
  "Entertainment",
  "Finance",
  "Manufacturing",
  "Retail",
  "Technology",
  "Travel",
  "Government",
  "Media",
  "Other",
];

export const USER_ROLE = ["Influencer", "Company"];
export const CONTENTS = INDUSTRY;
export const PLATFORM = [
  { name: "Telegram", icon: FaTelegramPlane, minFollowers: 10000 },
  { name: "YouTube", icon: FaYoutube, minFollowers: 5000 },
  { name: "Facebook", icon: FaFacebookF, minFollowers: 5000 },
  { name: "Tiktok", icon: FaTiktok, minFollowers: 5000 },
  { name: "Instagram", icon: FaInstagram, minFollowers: 5000 },
];

export const AGE_GROUP = [
  "Under 18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

export const GENDER = ["Male", "Female"];

export const CITIES = [
  "Addis Ababa",
  "Dire Dawa",
  "Mekelle",
  "Gondar",
  "Bahir Dar",
  "Hawassa",
  "Adama",
  "Jimma",
  "Dessie",
  "Jijiga",
  "Shashamane",
  "Bishoftu",
  "Sodo",
  "Arba Minch",
  "Harar",
  "Dilla",
  "Debre Birhan",
  "Debre Markos",
  "Kombolcha",
  "Woldia",
  "Axum",
  "Hagere Maryam",
  "Asosa",
  "Gambela",
  "Metu",
  "Ambo",
  "Adigrat",
  "Assela",
  "Nekemte",
];
