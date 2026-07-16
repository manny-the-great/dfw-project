import React, { useState } from 'react'
import { profile, edit, logout, user } from "../common/common-assets/assets-images";
import { FaCamera } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LogoutModal from '../components/LogoutModal';
import { axiosInstance } from '../utils/axios.config';
import { SetInLocalStorage, clearLocalStorage } from '../utils/local-storage';
import { CustomLoader } from '../utils/react-loader/loader';
import { useDispatch } from 'react-redux';
import {clearUser} from "../redux/slices/user-slice";

const ProfileMain = ({ userDetails, setImage }) => {
  const [searchParams] = useSearchParams();
  const AxiosInstance = axiosInstance();
  const tab = searchParams.get("tab");
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
const dispatch=useDispatch();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size should be within 20mb");
      return
    }
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImage(file);
  };

  const handleLogout = async () => {
    setLoader(true);
    try {
      await AxiosInstance.put('/user/logout');
      SetInLocalStorage("logout", true);
      clearLocalStorage("userData");
      dispatch(clearUser()); 
      navigate('/')
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!")
    } finally {
      setLoader(false)
      setShowModal(false);
    }
  }
  const activeClasses = "bg-[#185A96] text-white border-none";
  const inactiveClasses = "bg-white hover:bg-[#185A96] hover:text-white hover:border-none border border-[#D6D6D6] text-black cursor-pointer";
  const baseClasses = "group flex items-center gap-3 border border-[#D6D6D6] rounded-[10px] text-[14px] lg:text-[16px] font-medium py-[8px] lg:py-[10px] xl:py-[15px] pl-[20px] w-[100%] 2xl:w-[95%] text-left";

  return (
    <>
      {loader &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <div className='w-full  lg:w-[30%]'>
        <div className='w-full h-full flex flex-col sm:flex-col lg:flex-col  items-center justify-start relative py-10 px-[20px] xl:pt-10 sm:px-[10px] lg:px-[20px] shadow-sm border border-[#CECECE] rounded-[18px] mx-auto'>
          <div className='relative w-full '>
            <div className="w-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden relative">

              {tab === "edit" ? (
                <label htmlFor="profilePicUpload" className="cursor-pointer">
                  <img
                    src={
                      preview
                        ? preview
                        : userDetails?.profile_picture
                          ? `${import.meta.env.VITE_BASE_URL}/${userDetails?.profile_picture}`
                          : user
                    }
                    alt=""
                    className="w-[200px] h-[200px] object-cover rounded-lg"
                  />
                </label>
              ) : (
                <img
                  src={
                    preview
                      ? preview
                      : userDetails?.profile_picture
                        ? `${import.meta.env.VITE_BASE_URL}/${userDetails?.profile_picture}`
                        : user
                  }
                  alt=""
                  className="w-[200px] h-[200px] object-cover rounded-lg"
                />
              )}

              {tab === "edit" && (
                <>
                  <label
                    htmlFor="profilePicUpload"
                    className="absolute bottom-2 right-15 bg-[#185A96] text-white p-3 rounded-full cursor-pointer shadow-lg"
                  >
                    <FaCamera size={18} />
                  </label>

                  <input
                    type="file"
                    id="profilePicUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>

            <p className='text-[22px] font-semibold text-center my-1'>{userDetails?.name}</p>
            <p className='text-[12px] font-medium text-center text-[#B5B5B5]'>{userDetails?.email}</p>

          </div>


          <div className='w-full flex flex-col items-center justify-center gap-3 lg:gap-5 mx-10 mt-5 sm:mt-0 lg:mt-5'>
            <button
              onClick={() => { navigate("/profile"); setImage(null); setPreview(null) }}
              className={`${baseClasses} ${!tab ? activeClasses : inactiveClasses}`}
            >
              <img
                src={profile}
                className={`filter w-[18px] transition duration-300 
    ${!tab ? "invert brightness-0" : "group-hover:invert group-hover:brightness-0"}
  `}
                alt="Profile"
              />

              My Profile
            </button>

            <button
              onClick={() => navigate("/profile?tab=edit")}
              className={`${baseClasses} ${tab === "edit" ? activeClasses : inactiveClasses}`}
            >
              <img
                src={edit}
                className={`filter w-[18px] transition duration-300 
    ${tab === "edit" ? "invert brightness-0" : "group-hover:invert group-hover:brightness-0"}
  `}
                alt="Edit"
              />


              Edit Profile
            </button>


            <button onClick={handleShowModal} className='group flex items-center gap-3 border border-[#D6D6D6] bg-white hover:bg-[#185A96] hover:text-white hover:border-none rounded-[10px] text-[14px] lg:text-[16px] font-medium py-[8px] lg:py-[10px] xl:py-[15px] pl-[20px] w-[100%] 2xl:w-[95%] text-left cursor-pointer'>
              <img
                src={logout}
                className="filter  w-[15px] transition duration-300 group-hover:invert group-hover:brightness-0"
                alt="Profile"
              />

              Logout
            </button>


          </div>
        </div>
        <LogoutModal showModal={showModal} closeModal={closeModal} handleLogout={handleLogout} />
      </div>
    </>
  )
}

export default ProfileMain
