import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import {  dummyUser } from "../common/common-assets/assets-images";

const Review = ({ dashboardContent }) => {
  const [activeButton, setActiveButton] = useState("right");


  const Reviews = dashboardContent?.ratingsList || [];
  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60 / 60);

    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff} hours ago`;

    const days = Math.floor(diff / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className=" bg-white container mx-auto overflow-hidden ">
      <p className='text-center text-black text-[35px] sm:text-[40px] lg:text-[45px] xl:text-[50px] font-bold my-3'>What People Say  <br /><span className='text-[#185A96]'>About Us</span></p>


      <div className=" ">
        <Swiper
          spaceBetween={25}
          loop={true}
          speed={800}
          allowTouchMove={true}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1536: {
              slidesPerView: 4,
              centeredSlides: false,
            },
          }}
          modules={[Navigation]}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
        >
          {Reviews.map((item, index) => (
            <SwiperSlide className="py-5" key={index}>
              <div className="p-4 rounded-2xl bg-white custom-shadow pl-3  transition mx-auto sm:w-[90%] md:w-[100%]">
                <div className="flex items-center gap-x-3">
                  <img
                    src={item?.image ? `${import.meta.env.VITE_BASE_URL}/${item.image}` : dummyUser}
                    className="w-[54px] h-[54px] rounded-full"
                    alt="user"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-[18px]">
                      {item?.name}
                    </p>
                    <p className="text-[12px] text-gray-400">{timeAgo(item?.updatedAt)}</p>
                  </div>
                </div>
                <p className="text-[#A2A2A2] text-[14px] mt-2 font-light">{item?.review}</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 mr-[2px] ${i < item.ratings ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-[12px] ml-2 text-gray-600">
                    {item.ratings?.toFixed(1)}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex items-center justify-center mb-5 gap-4 ">
          <button
            onClick={() => setActiveButton("left")}
            className={`w-[49px] h-[49px] rounded-full flex items-center justify-center shadow-[0px_4px_20px_rgba(0,0,0,0.15)] prev-btn transition-all duration-300 cursor-pointer ${activeButton === "left" ? "bg-[#FF8C01]" : "bg-white"
              }`}
          >
            <div></div>
            <FaCaretLeft
              size={30}
              className={`${activeButton === "left" ? "text-white" : "text-gray-700"
                }`}
            />
          </button>

          <button
            onClick={() => setActiveButton("right")}
            className={`w-[49px] h-[49px] rounded-full flex items-center justify-center shadow-[0px_4px_20px_rgba(0,0,0,0.15)] next-btn transition-all duration-300 cursor-pointer ${activeButton === "right" ? "bg-[#FF8C01]" : "bg-white"
              }`}
          >
            <FaCaretRight
              size={30}
              className={`${activeButton === "right" ? "text-white" : "text-gray-700"
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
