import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
import { SetInLocalStorage, getLocalStorageData } from '../utils/local-storage';
import { useDispatch } from "react-redux";
import { get_user_by_id } from "../utils/thunkApis";
import { requestNotificationPermission, requestForToken } from '../firebase/NotificationController'; //for push notification

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const AxiosInstance = axiosInstance();
  const [userDetails, setUserDetails] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [deviceToken, setDeviceToken] = useState(null);

  const [serviceId, setServiceId] = useState(null);
  const [pickupData, setPickupData] = useState(null)
  const [loading, setLoading] = useState(0); //0-no loading,1:submit-loading,2:resend-otp loading, 3:disabled

  useEffect(() => {
    const userData = getLocalStorageData("userData");
    if (userData) {
      navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      toast.success("OTP is 111111")
    }, 1000)
  }, [])
  useEffect(() => {
    if (location.state?.userDetails) {
      setUserDetails(location.state.userDetails);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
      if (location?.state?.serviceId) {
        setServiceId(location?.state?.serviceId)
      } else if (location.state?.pickupData) {
        setPickupData(location.state.pickupData);
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);



  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getTokenAndSave = async () => {
      requestNotificationPermission();
      const fcmToken = await requestForToken();
      if (fcmToken) {
        setDeviceToken(fcmToken);
      }
    };

    getTokenAndSave();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };




  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Please enter the full OTP');
      return;
    }
    setLoading(1)
    try {
      const res = await AxiosInstance.post('/user/verify_otp', {
        otp: otpValue,
        id: userDetails.id,
        device_token: deviceToken ? deviceToken : null
      });
      const { userData } = res?.data?.body;
      setLoading(3)
      const t = toast.success("OTP verified successfully!");

      setTimeout(() => {
        toast.dismiss(t);
        if (userDetails.type == "signup" && !serviceId && !pickupData) {
          SetInLocalStorage("signup", true)
        } else if (userDetails.type == "login" && !serviceId && !pickupData) {
          SetInLocalStorage("login", true)
        }
        dispatch(get_user_by_id(userData.id));
        SetInLocalStorage("userData", JSON.stringify(userData));
        if (serviceId) {
          navigate(`/location-errands?serviceId=${serviceId}`)
        } else if (pickupData) {
          sessionStorage.setItem("pickupServiceData", JSON.stringify(pickupData));
          navigate(`/location`)
        } else {
          navigate('/');
        }
      }, 1000)
    } catch (error) {
      setLoading(0)
      toast.error(error?.response?.data?.message || 'Invalid OTP');
    }
  };

  const resendOtp = async () => {
    setLoading(2);
    try {
      await AxiosInstance.post('/user/resend_otp', {
        id: userDetails?.id
      });

      setCanResend(false);
      setResendTimer(30);
      toast.success("OTP is 111111")
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev === 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error sending OTP. Please try again.');
    } finally {
      setLoading(0);
    }
  };
  return (
    <div className='container mx-auto flex items-center justify-center'>
      <div className='rounded-[35px] max-w-[650px] custom-shadow flex  space-y-8 flex-col my-10 p-10 sm:p-20'>
        <div>
          <p className='text-[30px] sm:text-[35px] font-semibold'>VERIFICATION</p>
          <p className='text-[15px] sm:text-[17px] font-medium text-[#00000080] '>Enter the 6-digit OTP sent to you at +{userDetails?.country_code} {userDetails?.phone_no}</p>
        </div>

        <p className='text-[18px] font-bold'>OTP</p>
        <div className='w-full flex items-center justify-center gap-2 sm:gap-5'>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full custom-shadow h-[45px] sm:h-[50px] text-center rounded-[10px] px-3 outline-none"
              placeholder="-"
            />
          ))}
        </div>


        <p className='text-[15px] sm:text-[17px] font-normal'>Haven't received the OTP?
          {canResend ? (
            <span
              onClick={() => {
                if (loading == 0) resendOtp();
              }}
              className='text-[#FF8C01] cursor-pointer'>{loading == 2 ? " Resending.." : " Resend"}</span>
          ) : (
            <span className='text-[#FF8C01]'> Resend OTP in {resendTimer}s</span>
          )}
        </p>
        <div className='flex items-center justify-center'>
          <button
            onClick={handleSubmit}
            disabled={loading != 0}
            className={`text-[20px] sm:text-[24px] font-medium bg-[#185A96] rounded-[10px] text-white py-3 cursor-pointer ${loading == 1 ? "px-6 sm:px-33" : "px-12 sm:px-40"}`}>
            {loading == 1 ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Otp
