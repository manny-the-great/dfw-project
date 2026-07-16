import React, { useState, useRef, useEffect } from 'react'
import { user, logo } from "../common/common-assets/assets-images";
import { FaCamera } from "react-icons/fa6";
import { getLocalStorageData } from '../utils/local-storage';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config'
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const AxiosInstance = axiosInstance();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_no: "",
    country_code: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [acceptPromoSms, setAcceptPromoSms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [serviceId, setServiceId] = useState(null)
  const [pickupData, setPickupData] = useState(null)
  const [loading, setLoading] = useState(0); //0:no loading ,1:loading-btn disabled,2:btn disabled

  useEffect(() => {
    const userData = getLocalStorageData("userData");
    if (userData) {
      navigate("/");
      return;
    }
  }, []);
  useEffect(() => {
    if (location.state?.serviceId) {
      setServiceId(location.state.serviceId);
    } else if (location.state?.pickupData) {
      setPickupData(location.state.pickupData);
    }
  }, [location.state, navigate]);
  const validate = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value.trim()) newErrors.name = "Name is required";
        else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value.trim()))
          newErrors.name = "Only alphabets allowed";
        else if (value?.trim()?.length > 30)
          newErrors.name = "Name should be within 30 characters";
        else delete newErrors.name;
        break;

      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value))
          newErrors.email = "Invalid email format";
        else if (value?.trim()?.length > 60)
          newErrors.email = "Email should be within 60 characters";
        else delete newErrors.email;
        break;

      case "phone_no":
        if (!value.trim()) newErrors.phone = "Phone number is required";
        else if (value.length < 6)
          newErrors.phone = "Invalid phone number";
        else delete newErrors.phone;
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    validate(name, value);
  };


  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size should be within 20mb");
      return
    }
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    Object.keys(form).forEach((key) => {
      const value = form[key];
      switch (key) {
        case "name":
          if (!value.trim()) {
            validationErrors[key] = "Name is required";
          } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value.trim())) {
            validationErrors[key] = "Only alphabets allowed";
          } else if (value.trim().length > 30) {
            validationErrors[key] = "Name should be within 30 characters";
          }
          break;
        case "email":
          if (!value.trim()) validationErrors.email = "Email is required";
          else if (!/^\S+@\S+\.\S+$/.test(value))
            validationErrors.email = "Invalid email format";
          else if (value?.trim()?.length > 60)
            validationErrors.email = "Email should be within 60 characters";
          break;
        case "phone_no":
          if (!value.trim()) validationErrors.phone = "Phone number is required";
          else if (value.length < 6)
            validationErrors.phone = "Invalid phone number";
          break;
      }
    });


    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    validate("name", form.name);
    validate("email", form.email);
    validate("phone_no", form.phone_no);
    validate("promoSms", acceptPromoSms);

    if (Object.keys(errors).length > 0) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone_no", form.phone_no);
    formData.append("country_code", form.country_code);
    if (form.image) formData.append("profile_picture", form.image);
    setLoading(1);
    try {
      const response = await AxiosInstance.post("/user/sign_up", formData);
      const t = toast.success("Details submitted successfully!");
      sessionStorage.removeItem("signupForm");
      setLoading(2)
      setTimeout(() => {
        toast.dismiss(t);
        navigate("/verification", {
          state: { userDetails: response?.data?.body?.userDetails, serviceId: serviceId ? serviceId : null, pickupData: pickupData ? pickupData : null },
        });
      }, 1000);
    } catch (error) {
      setLoading(0)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const savedForm = sessionStorage.getItem("signupForm");
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      const { acceptPrivacy: savedPrivacy, acceptPromoSms: savedPromo, ...rest } = parsed;
      setForm(rest);
      setAcceptPrivacy(savedPrivacy || false);
      setAcceptPrivacy(!!savedPrivacy);
      setAcceptPromoSms(!!savedPromo);
    }
  }, []);


  const handleNavigate = (path) => {
    const { image, ...formWithoutImage } = form;
    const formToSave = {
      ...formWithoutImage,
      acceptPrivacy,
    };
    sessionStorage.setItem("signupForm", JSON.stringify(formToSave));

    navigate(path);
  };


  return (
    <div>

      <div className=" flex  items-center justify-center">
        <div className=" flex flex-col custom-shadow text-black  md:mx-[50px] lg:mx-[60px] xl:mx-[100px] items-center justify-center backdrop-blur-md rounded-[35px] mt-[50px] mb-[50px] w-[85vw] py-7 sm:py-10 px-6 sm:w-[500px]  lg:w-[600px]  2xl:w-[700px]">
          <img className='w-[110px]'
            src={logo}
          />
          <h1 className="text-[22px]  sm:text-[25px] text-center lg:text-[25px] py-3 font-semibold">ENTER YOUR PERSONAL DETAILS</h1>
          <div className="relative w-[140px] h-[140px] mx-auto mb-6">
            <img
              src={preview || user}
              onClick={() => fileRef.current.click()}
              className="w-full h-full object-cover rounded-full cursor-pointer"
              alt="user"
            />
            <div
              onClick={() => fileRef.current.click()}
              className="w-[38px] h-[38px] bg-[#185A96] text-white rounded-full flex items-center justify-center cursor-pointer absolute bottom-1 right-1 shadow-md"
            >
              <FaCamera size={18} />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              hidden
              onChange={handleImageSelect}
            />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col  items-start justify-center w-full gap-4 px-5 sm:px-10 lg:px-20">
            <div className='flex w-full gap-3'>
              <div className="flex flex-col gap-1 w-full">
                <label className="text-[14px] sm:text-[16px] xl:text-[18px] font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className=" text-[13px] sm:text-[14px] custom-shadow xl:text-[16px] text-black rounded-lg bg-white py-2 lg:py-3 px-5 w-full focus:outline-none"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-[14px] sm:text-[16px] xl:text-[18px] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className=" text-[13px] custom-shadow sm:text-[14px] xl:text-[16px] text-black rounded-lg bg-white py-2 lg:py-3 px-5 w-full focus:outline-none"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[14px] sm:text-[16px] xl:text-[18px] font-semibold">
                Phone Number
              </label>

              <PhoneInput
                country={"us"}
                value={`${form.country_code}${form.phone_no}`}
                onChange={(value, data) => {
                  const dialCode = data.dialCode;
                  const number = value.replace(dialCode, "");
                  setForm({
                    ...form,
                    country_code: dialCode,
                    phone_no: number
                  });
                  validate("phone_no", number);
                }}
                containerClass="!w-full !bg-white !rounded-lg !border-none"
                containerStyle={{
                  boxShadow: "0px 0px 7px rgba(0,0,0,0.12)",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}

                inputClass="
    !w-full 
    !h-[48px] 
    !bg-white 
    !rounded-lg 
    !px-5 
    !ps-[50px]
    !text-black 
    !text-[14px]
    !border-none
  "

                buttonClass="
    !bg-white 
    !rounded-l-lg  
    !border-none
  "

                dropdownClass="
    !shadow-md
    !rounded-lg
    !border-none
    !bg-white
  "
              />

              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="flex items-start justify-center gap-2 max-w-[600px] mx-auto">
              <input
                type="checkbox"
                checked={acceptPromoSms}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAcceptPromoSms(checked);
                 
                }}
                className="mt-1 w-[16px] h-[16px] accent-[#185A96] cursor-pointer shrink-0"
              />

              <div className="text-[12px] sm:text-[14px] leading-relaxed text-gray-700">
                <p>
                  By checking, you are allowing to receive {""}
                  <span className="font-semibold">promotional/marketing SMS </span>
                  communications from{" "}
                  <span className="font-semibold">DFWerrands</span>.
                  Frequency may vary. Message and data rates may apply,
                  <span className="font-semibold">reply HELP for help or STOP to opt-out.</span>
                </p>
              </div>
            </div>

            <div className="flex items-start justify-center gap-2 max-w-[600px] mx-auto">
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="mt-1 w-[16px] h-[16px] accent-[#185A96] cursor-pointer shrink-0"
              />

              <div className="text-[12px] sm:text-[14px] leading-relaxed text-gray-700">

                <p className="mt-1">
                  By checking, I accept{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#185A96] underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#185A96] underline"
                  >
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>




            <div className='flex items-center justify-center w-full my-5'>
              <button
                type='submit'
                disabled={loading == 1 || loading == 2}
                className={`text-[20px] sm:text-[24px] font-medium bg-[#185A96] rounded-[10px] text-white ${loading == 1 ? "px-9 sm:px-21 xl:px-36" : "px-12 sm:px-25 xl:px-40"} py-3 cursor-pointer`}>
                {loading == 1 ? "Submitting.." : "Continue"}
              </button>
            </div>
          </form>

          <div>
          </div>

          <div className="text-[15px] lg:text-[17px] font-normal">Already have an account?<span onClick={() => navigate('/login')} className="underline text-[#FF8C01] cursor-pointer"> Log In</span></div>
        </div>
      </div>

    </div>
  );
}

export default Signup
