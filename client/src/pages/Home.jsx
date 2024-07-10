import { Button } from "@material-tailwind/react";
import React from "react";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Header />

      <div class="bg-gray-100 dark:bg-transparent mt-16">
        <div class="container mx-auto flex flex-col items-center py-12 sm:py-24">
          <div class="w-11/12 sm:w-2/3 lg:flex justify-center items-center flex-col  mb-5 sm:mb-10">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center text-gray-800 dark:text-white font-black leading-7 md:leading-10">
              The Freedom to Create Your
              <span class="text-indigo-700 mx-2">Campaign</span>
              for Advertisements
            </h1>
            <p class="mt-5 sm:mt-10 lg:w-10/12 text-gray-400 font-normal text-center text-sm sm:text-lg">
              Collaborate with top influencers to drive sales. Create engaging
              advertisement campaigns and establish your brand's online
              presence.
            </p>
          </div>
          <div class="flex justify-center items-center">
            <Link to="/influencer/google">
              <button class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 lg:text-xl lg:font-bold  rounded text-white px-4 sm:px-10 border border-indigo-700 py-2 sm:py-4 text-sm">
                As Influnecer
              </button>
            </Link>
            <Link to="/company/google">
              <button class="ml-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-transparent transition duration-150 ease-in-out hover:border-indigo-600 lg:text-xl lg:font-bold  hover:text-indigo-600 rounded border border-indigo-700 text-indigo-700 px-4 sm:px-10 py-2 sm:py-4 text-sm">
                As Company
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      <script src="https://unpkg.com/flowbite@1.4.7/dist/flowbite.js"></script>
    </>
  );
}
