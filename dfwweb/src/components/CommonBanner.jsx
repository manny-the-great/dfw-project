import React from 'react'
import { main } from "../common/common-assets/assets-images";

const CommonBanner = ({ title }) => {
  return (
    <div>
      <div
        className='Banner-common relative z-10 pt-[70px] pb-[70px] mb-[60px]'
        style={{
          backgroundImage: `url(${main})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 "></div>

        {/* Content */}
        <div className='container m-auto relative z-10'>
          <h2 className='text-center text-white text-[35px] sm:text-[45px] md:text-[55px] lg:text-[64px] font-bold uppercase'>
            {title}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default CommonBanner;
