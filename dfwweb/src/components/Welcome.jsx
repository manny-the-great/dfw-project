import React from 'react'
const Welcome = ({ dashboardContent }) => {
  const type7Data = dashboardContent?.cmsData?.find(item => item.type === 7);
  return (
    <div>
      <div className="container mx-auto">
        <p className="text-center text-[35px] sm:text-[40px] lg:text-[45px] xl:text-[50px] font-bold">
          Welcome To <span className="text-[#FF8C01]">DFWerrands</span>
        </p>

        <div className="my-6">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/${type7Data?.image}` || ""}
            alt=""
            className="w-full lg:w-1/3 float-left mr-5 mb-3 rounded"
          />

          <div
            className="text-[14px] xl:text-[16px] font-medium 
        [&_h1]:text-3xl [&_h2]:text-2xl 
        [&_ul]:list-disc [&_ul]:pl-5 
        [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{
              __html: type7Data?.description,
            }}
          ></div>

          {/* Clearfix so next sections don't float */}
          <div className="clear-both"></div>
        </div>
      </div>
    </div>

  )
}

export default Welcome