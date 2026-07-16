import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile2 } from '../common/common-assets/assets-images';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../utils/axios.config';
import { get_user_by_id } from '../utils/thunkApis';
import { toast } from "react-hot-toast";
const EditRight = ({ userDetails, profile_picture }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const AxiosInstance = axiosInstance();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [submitLoader, setSubmitLoader] = useState(false)


  useEffect(() => {
    if (userDetails) {
      setName(userDetails?.name || "");
      setEmail(userDetails?.email || "");

    }

  }, [userDetails]);




  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {

      case "name":
        const trimmedValue = value.trim();
        if (!value.trim()) {
          error = "Name is required";
        } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(trimmedValue)) {
          error = "Name should contain only letters and single space between words";
        } else if (value.length > 30) {
          error = "Name must be within 30 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email format";
        } else if (value?.trim()?.length > 60) {
          error = "Email should be within 60 characters";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };



  const validateAllFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name.trim())) newErrors.name = "Name should contain only letters and single space between words";
    if (name.length > 30) newErrors.name = "Name must be within 30 characters";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) newErrors.email = "Invalid email format";
    if (email?.length > 60) newErrors.email = "Email must be within 60 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllFields()) {
      toast.error("Please fix validation errors");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
formData.append("id",userDetails?.id)
    if (profile_picture) formData.append("profile_picture", profile_picture);

    setSubmitLoader(true)
    try {
      await AxiosInstance.put("/user/edit_profile", formData);
      toast.success("Profile updated!");
      dispatch(get_user_by_id(userDetails.id));
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitLoader(false)
    }
  };
  return (
    <div className=' w-full shadow-sm border-[1px] border-[#CECECE] rounded-[18px] py-5 lg:w-[70%]'>

      <div className='w-full xl:mt-0  flex flex-col md:flex-row items-start justify-around px-0 py-2'>

        <div className='w-full md:w-[50%] px-10'>
          <p className='text-[20px] font-semibold'>Profile</p>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3 py-5 w-full'>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[14px] xl:text-[16px] mb-1  font-bold">
                Name
              </label>
              <input
                type="text"
                className=" text-[12px] custom-shadow rounded-[10px] px-5 py-4 font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-white w-full"
                name="name"
                id="editName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField("name", e.target.value);
                }}
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[14px] xl:text-[16px] mb-1 font-bold">
                Email
              </label>
              <input
                type="email"
                className=" text-[12px] custom-shadow rounded-[10px] px-5 py-4 font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-white w-full"
                name="email"
                id="editEmail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>


            <div className="flex flex-col gap-1 w-full">
              <label className="text-[14px] xl:text-[16px] mb-1  font-bold">
                Phone Number
              </label>
              <input
                type="text"
                className=" text-[12px] custom-shadow rounded-[10px] px-5 py-4 font-normal focus:outline-none sm:text-[12px] xl:text-[14px] text-black  bg-[#F5F5F5] w-full cursor-not-allowed"
                name="phone_no"
                id="editNo"
                disabled
                value={`+${userDetails?.country_code} ${userDetails?.phone_no}`}
                placeholder="Enter phone number"
              />
            </div>
            <div className='w-full flex items-center justify-center my-5'>
              <button disabled={submitLoader} className='bg-[#185A96] w-full py-3 rounded-[10px] text-white text-[20px] font-medium cursor-pointer'>{submitLoader ? "Updating.." : "Update"}</button>
            </div>

          </form>
        </div>
        <div className=' h-full flex items-center justify-center mx-5'><img src={profile2} className=' w-[370px] md:w-[410px] mt-0  sm:mt-3 ' alt="" />
        </div>
      </div>
    </div>

  )
}

export default EditRight
