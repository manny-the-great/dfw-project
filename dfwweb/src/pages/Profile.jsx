import React, { useState } from 'react'
import ProfileMain from './ProfileMain'
import ProfileRight from './ProfileRight'
import CommonBanner from '../components/CommonBanner'
import { blue } from '../common/common-assets/assets-images'
import EditRight from './EditRight'
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Profile = () => {
  const userDetails = useSelector((state) => state.users.user);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const [image, setImage] = useState();
  return (
    <div className='overflow-hidden'>
      <CommonBanner title={tab === "edit" ? "Edit Profile" : "Profile"} />
      <div className='relative'>
        <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
      </div>
      <div className="container mx-auto">  <p className='text-[30px] lg:text-[35px] font-semibold'>{tab === "edit" ? "Edit Profile" : "My Profile"}</p></div>
      <div className='container mx-auto flex flex-col lg:flex-row  justify-center  pb-[20px]  mb-20  gap-5'>

        <ProfileMain userDetails={userDetails} setImage={setImage} />
        {tab === "edit" ? <EditRight userDetails={userDetails} profile_picture={image} /> : <ProfileRight userDetails={userDetails} />}
      </div>
    </div>
  )
}

export default Profile
