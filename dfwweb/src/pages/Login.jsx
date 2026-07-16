import React, { useState, useEffect } from 'react'
import { getLocalStorageData } from '../utils/local-storage';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config'
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const AxiosInstance = axiosInstance();

  const [form, setForm] = useState({
    country_code: "",
    phone_no: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = getLocalStorageData("userData");
  const [serviceId, setServiceId] = useState(null)
  const [pickupData, setPickupData] = useState(null)

  useEffect(() => {
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

  const validatePhone = (value) => {
    if (!value) {
      setError("Phone number is required");
      return false;
    }
    if (value.length < 5) {
      setError("Enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validatePhone(form.phone_no)) return;

    setLoading(true);

    try {
      const res = await AxiosInstance.post("/user/login", {
        country_code: form.country_code,
        phone_no: form.phone_no,
      });

      const { userDetails } = res?.data?.body;
      navigate("/verification", {
        state: { userDetails, serviceId: serviceId ? serviceId : null, pickupData: pickupData ? pickupData : null },
      });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container mx-auto flex items-center justify-center'>
      <div className='rounded-[35px] min-w-[300px] lg:max-w-[700px] custom-shadow flex items-center justify-center space-y-8 flex-col my-10 p-6 sm:p-10 md:p-20'>
        <div>
          <p className='text-[28px] md:text-[30px] lg:text-[35px] font-semibold'>ENTER YOUR MOBILE NUMBER</p>
          <p className='text-[15px] md:text-[17px] font-medium text-[#00000080] text-start'>We'll send you an OTP via SMS to confirm your mobile number</p>
        </div>
        <div className="flex flex-col gap-1 w-full ">
          <label className="w-full text-[#185A96] space-y-2 text-[13px] sm:text-[15px] xl:text-[20px]  font-semibold">
            Phone Number
          </label>
          <PhoneInput
            country={"us"}
            value={`${form.country_code}${form.phone_no}`}
            onChange={(value, data) => {
              const dialCode = data.dialCode;
              const number = value.replace(dialCode, "");

              setForm({
                country_code: dialCode,
                phone_no: number
              });

              validatePhone(number);
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

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>


        <div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`text-[20px] lg:text-[24px] font-medium bg-[#185A96] rounded-[10px] text-white ${loading ? "px-13 sm:px-32" : "px-20 sm:px-40"} py-3 cursor-pointer`}>
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </div>
        <p className='text-[15px] lg:text-[17px] font-normal'>Don’t have an account? <span onClick={() => navigate("/signup", { state: { serviceId: serviceId ? serviceId : null, pickupData: pickupData ? pickupData : null } })} className='text-[#FF8C01] cursor-pointer underline'>Sign Up</span></p>
      </div>
    </div>
  )
}

export default Login
