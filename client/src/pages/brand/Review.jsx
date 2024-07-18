import youtube from "../../assets/images/youtube.png";
import instagram from "../../assets/images/instagram.png";
import facebook from "../../assets/images/facebook.png";
import tiktok from "../../assets/images/tiktok.png";
import star from "../../assets/images/star.png";
import star2 from "../../assets/images/star2.png";
import upload from "../../assets/images/upload.png";
import { IoMdArrowBack } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { platformsIcons } from "../../helper/platformIcons";
import { Tooltip } from "@material-tailwind/react";

const Review = () => {
  const location = useLocation();
  const { influencer } = location.state || {};
  console.log(influencer);
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(Array(5).fill(false));
  const [commentData, setCommentData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const receiverId = influencer._id;
  const senderId = currentUser._id;

  const fetchData = async () => {
    try {
      const comment = await axios.get("/api/comments/comment-data");
      setCommentData(comment.data);
      const response = await axios.get("/api/company/company-data");
      setCompanyData(response.data);
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(companyData);
  useEffect(() => {}, [companyData]);

  useEffect(() => {}, [commentData]);

  const handleStarClick = (index) => {
    setStars(stars.map((star, i) => (i === index ? !star : star)));
  };

  const starCount = stars.filter((star) => star).length;

  const handleChange = (value) => {
    setComment(value);
  };

  const uploadComment = async (e) => {
    e.preventDefault();
    const apiPath = "/api/comments/send";

    try {
      await axios.post(apiPath, { receiverId, senderId, comment, starCount });
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  return (
    <main className="bg-blue-gray-400 h-screen">
      <div className="flex max-lg:flex-col-reverse">
        <div className="flex-1">
          <div>
            <div className="flex gap-10 max-lg:absolute max-lg:top-0">
              <IoMdArrowBack width={30} className="mt-4 ml-1" />
              <h2>
                <p className="font-serif text-5xl absolute mt-5">
                  {influencer.username}
                </p>
              </h2>
            </div>
            <div
              className="flex ml-20 mt-8 gap-32 max-xl:gap-20 max-lg:ml-0 
                max-lg:justify-center max-lg:gap-32 max-sm:gap-4"
            >
              <div className="mt-10">
                {influencer.platforms.map((platform) => {
                  if (platform.name === "Telegram") {
                    return (
                      <div className="flex" key={platform.id}>
                        <Tooltip content={platform.name} key={platform._id}>
                          <span className="cursor-pointer rounded-full border border-blue-900/5 bg-blue-900/20 p-2 text-blue-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                            {React.createElement(platformsIcons[platform.name])}
                          </span>
                        </Tooltip>
                        <p className="mt-1 ml-3 font-serif text-xl">
                          {platform.followerCount} Followers
                        </p>
                      </div>
                    );
                  }
                  if (platform.name === "Instagram") {
                    return (
                      <div className="flex" key={platform.id}>
                        <img
                          src={instagram}
                          width={40}
                          className="mb-5"
                          alt="Instagram Icon"
                        />
                        <p className="mt-1 ml-3 font-serif text-xl">
                          {platform.followerCount} Followers
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div
              className="max-lg:flex 
                max-lg:justify-center max-md:flex max-md:justify-center max-lg:mb-3"
            >
              <button
                className="ml-36 mt-2 bg-blue-500 px-5 py-2 rounded-full font-serif 
                    text-white max-lg:mb-3 max-lg:ml-0 max-md:ml-0"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
        <hr className="border-2 hidden max-lg:block" />

        <div className="pr-11 flex max-lg:justify-center p-4">
          <FaUser className="w-72 h-72 text-white" />
        </div>
      </div>
      <hr className="border-2" />

      <div className="flex justify-center -mt-4">
        <p className="text-center w-44 font-serif rounded-full bg-white ">
          Ratings and reviews
        </p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-5 py-5 max-md:grid-cols-2 max-sm:grid-cols-1 bg-blue-gray-400">
        {commentData
          .filter((comment) => comment.receiverId === receiverId)
          .map((comment) => {
            const company = companyData.find(
              (company) => company._id === comment.senderId
            );
            console.log(companyData);
            return (
              <div className="bg-white w-full rounded-2xl shadow-xl flex">
                <div className="p-4" key={comment._id}>
                  <div className="flex">
                    <FaUser className="rounded-full w-8 h-8" />

                    {company && (
                      <p className="ml-2 mt-2">{company.contactName}</p>
                    )}
                  </div>
                  <div className="flex mt-2">
                    {[...Array(comment.starCount)].map((_, index) => (
                      <img src={star} width={20} key={index} alt="star" />
                    ))}
                    {[...Array(5 - comment.starCount)].map((_, index) => (
                      <img src={star2} width={20} key={index} alt="star" />
                    ))}
                  </div>
                  <p className="font-thin">{comment.comment}</p>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex">
        <div className="fixed bottom-1 right-16 max-sm:right-16 border-2 border-gray-300 h-16 rounded-md bg-white p-2">
          <input
            type="text"
            placeholder="Write your comment"
            className="w-96"
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className="flex gap-2 absolute right-2 mt-1 cursor-pointer">
            {stars.map((starStatus, index) => (
              <div key={index} onClick={() => handleStarClick(index)}>
                <img src={starStatus ? star : star2} width={18} alt="star" />
              </div>
            ))}
            <div>
              <img
                src={upload}
                width={20}
                onClick={uploadComment}
                alt="upload"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Review;
