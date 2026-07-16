import React from 'react'
import CommonBanner from '../components/CommonBanner'
import { blue, history } from '../common/common-assets/assets-images'


const History = () => {
  return (
    <div className='relative overflow-hidden'>
      <CommonBanner title="History To DFWerrands"/>
      <div className='relative flex items-center justify-center flex-col'>
        <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
        <p className='text-[30px] sm:text-[35px] font-semibold'>My Orders</p>
        <img src={history} className='w-[250px] sm:w-[350px]' alt="" />
        <p className='text-[24px] sm:text-[30px] font-medium text-center my-3'>No history yet <br /> start your first order!</p>
        <div>
            <button className='text-[24px] font-medium bg-[#185A96] rounded-[10px] text-white px-20 sm:px-40 mb-20 mt-3 py-3'>
                Refresh
            </button>
        </div>
      </div>
    </div>
  )
}

export default History
