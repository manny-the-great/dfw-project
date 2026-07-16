import React,{useState,useEffect} from 'react'
import { blue } from '../common/common-assets/assets-images'
import CommonBanner from '../components/CommonBanner'
import { useSelector,useDispatch } from "react-redux";
import { get_cms } from '../utils/thunkApis';
import { CustomLoader } from "../utils/react-loader/loader";

const About = () => {
  const aboutUs = useSelector((state) => state.users.cms);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const type = 0;

  const fetchData = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_cms(type));
    } catch (error) {
      // console.log("Error fetching terms&conditions:", error);
    } finally {
      setIsLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);
  return (
    <>
     {isLoader &&
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
              <CustomLoader />
            </div>
          }
    <div className='overflow-hidden'>
      <CommonBanner title="About Us" />
      <div className='relative'>
        <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
      </div>
      <div className='container mx-auto'>

        <img src={`${import.meta.env.VITE_BASE_URL}/${aboutUs?.image}` || ""} className='float-left w-full mb-5 md:mb-0 md:w-[350px] lg:w-[400px] xl:w-[550px] xl:h-[485px] mr-10 rounded-2xl ' alt="" />
        <div className="text-[15px] lg:text-[17px] font-medium [&_h1]:text-3xl [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: aboutUs?.description }}></div><br/>

      </div>
    </div>
    </>
  )
}

export default About
