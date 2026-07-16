import React from 'react'
import { total1, total2, total3 } from '../common/common-assets/assets-images'
const Total = ({ dashboardContent }) => {
  return (
    <div className='bg-black text-center py-10'>
      <div className="container mx-auto w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 justify-items-center gap-6 2xl:gap-15">
        <div className='bg-white border-t-2 border-l-2 border-[#FF8C01]  w-full rounded-[35px] space-y-3 flex items-center justify-center flex-col  px-15 py-10'><img className='w-[170px] ' src={total1} alt="" />


          <p className='text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold'>Total User</p>
          <p className='text-[40px] font-bold'>{dashboardContent?.userCount}</p>
        </div>
        <div className='bg-white w-full border-t-2 border-l-2 border-[#FF8C01] rounded-[35px] space-y-3 px-15 flex items-center justify-center flex-col py-10'><img className='w-[170px] ' src={total2} alt="" />
          <p className='text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold'>Current Orders</p>
          <p className='text-[40px] font-bold'>{dashboardContent?.currentOrderCount}</p>
        </div>
        <div className='bg-white w-full border-t-2 border-l-2 border-[#FF8C01] rounded-[35px] space-y-3 px-15 flex items-center justify-center flex-col py-10'><img className='w-[170px] ' src={total3} alt="" />
          <p className='text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] font-semibold'>Past Orders</p>
          <p className='text-[40px] font-bold'>{dashboardContent?.pastOrderCount}</p>
        </div>
      </div>
    </div>
  )
}

export default Total
