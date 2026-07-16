import React from 'react'
import CommonBanner from '../components/CommonBanner'
import EditRight from './EditRight'
import ProfileMain from './ProfileMain'
import { blue } from '../common/common-assets/assets-images'

const Edit = () => {
  return (
    <div className='overflow-hidden'>
      <CommonBanner title="Edit Profile"/>
      <div className='relative'>
        <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
      </div>
      <div className="container mx-auto">  <p className='text-[30px] lg:text-[35px] font-semibold'>My Profiles</p></div>
       <div className='container mx-auto flex flex-col lg:flex-row  justify-center  pb-[20px]  mb-20  gap-5'>

        <ProfileMain/>
      <EditRight/>

    </div>
    </div>
  )
}

export default Edit
