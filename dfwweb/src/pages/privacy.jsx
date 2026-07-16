import React, { useState, useEffect } from 'react'
import CommonBanner from '../components/CommonBanner'
import { blue } from '../common/common-assets/assets-images'
import { useSelector, useDispatch } from 'react-redux'
import { get_cms } from '../utils/thunkApis'
import { CustomLoader } from "../utils/react-loader/loader";

const Privacy = () => {
  const privacyPolicy = useSelector((state) => state.users.cms);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const type = 2;

  const fetchData = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_cms(type));
    } catch (error) {
      // console.log("Error fetching privacy policy:", error);
    } finally {
      setIsLoader(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <>
      {isLoader &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <div className='overflow-hidden'>
        <CommonBanner title="Privacy Policy" />
        <div className='relative'>
          <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
        </div>
        <div className="container mx-auto">
          <div className="text-[15px] lg:text-[17px] font-medium [&_h1]:text-3xl [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: privacyPolicy?.description }}></div><br/>
        </div>
      </div>
    </>
  )
}

export default Privacy
