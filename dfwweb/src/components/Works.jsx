import React from 'react';

const Works = ({ dashboardContent }) => {

  const workItems = dashboardContent?.cmsData
    ?.filter(item => [3,4,5,6].includes(item.type))
    ?.sort((a, b) => a.type - b.type);

  return (
    <div className='bg-black text-center py-10'>
      <p className='text-center text-white text-[35px] sm:text-[40px] lg:text-[45px] xl:text-[50px] font-bold my-3'>
        How It <span className='text-[#FF8C01]'>Works</span>
      </p>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center gap-6 2xl:gap-10">

        {workItems?.map((item) => (
          <div
            key={item.id}
            className='bg-white rounded-[35px] space-y-3 py-15 px-10'
          >
            <img
              className='w-[200px] h-[150px]'
              src={`${import.meta.env.VITE_BASE_URL}/${item.image}`}
              alt=""
            />

            <p className='text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold'>
              {item.title}
            </p>

            <div
              className="text-[14px] font-light text-[#9F9F9F] 
              [&_h1]:text-3xl [&_h2]:text-2xl 
              [&_ul]:list-disc [&_ul]:pl-5 
              [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Works;