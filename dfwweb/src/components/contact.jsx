import React, { useState, useEffect } from 'react'
import { map, blue } from "../common/common-assets/assets-images";
import CommonBanner from './CommonBanner';
import { axiosInstance } from '../utils/axios.config'
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'
import { toast, Toaster } from "react-hot-toast";
import ViewMap from '../utils/ViewMap.jsx';
import { useDispatch, useSelector } from "react-redux";
import { get_admin_details } from "../utils/thunkApis";
const Contact = () => {
  const adminDetails = useSelector((state) => state.users.adminDetails);
  const dispatch = useDispatch();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [defaultCountry, setDefaultCountry] = useState('us');
  const [isLoader, setIsLoader] = useState(false);

  const AxiosInstance = axiosInstance();

  const fetchAdmin = async () => {
    try {
      await dispatch(get_admin_details());
    } catch (error) {
      // console.log("Error fetching admin", error)
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      toast.error('Please fill in all the fields');
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Enter a valid name");
      return;
    }

    if (name.length > 30) {
      toast.error("Name should not be more than 30 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    if (email.length > 50) {
      toast.error("Email should not be more than 50 characters");
      return;
    }

    if (!countryCode || !phone.startsWith(countryCode)) {
      toast.error("Invalid phone number format");
      return;
    }

    const nationalNumber = phone.replace(countryCode, '');

    if (nationalNumber.length < 1) {
      toast.error("Enter a valid phone number");
      return;
    }

    if (message.length > 500) {
      toast.error("Message should not be more than 500 characters");
      return;
    }
    const payload = {
      name,
      email,
      country_code: countryCode,
      phone_no: phone.replace(countryCode, ''),
      message,
    };
    setIsLoader(true)
    try {
      const res = await AxiosInstance.post('/user/contact_us', payload);
      toast.success("Message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
      setPhone("");
      setCountryCode("");
      setDefaultCountry("us");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending message");
    } finally {
      setIsLoader(false);
    }
  };
  return (
    <>
      <div className='mb-15 overflow-hidden'>
        <p className='text-center text-black text-[35px] sm:text-[40px] lg:text-[45px] xl:text-[50px] font-bold my-3'>Contact <span className='text-[#185A96]'>Us</span></p>
        <div className='flex  w-full flex-col lg:flex-row items-center justify-center gap-20 container mx-auto'>
          <div className='w-full lg:w-[40%]'>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start justify-center gap-4 w-full"
            >
              <div className='flex items-center justify-center gap-5 w-full'>
                <div className="flex flex-col gap-1 w-full">
                  <label className="w-full text-[#185A96] space-y-2 text-[15px] xl:text-[20px]  font-semibold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="text-[13px] sm:text-[14px]  xl:text-[18px] rounded-[10px] extend text-black font-semibold  custom-shadow bg-white py-2 xl:py-3 px-5 w-full focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your Name"
                    id=""
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="w-full text-[#185A96] space-y-2 text-[15px] xl:text-[20px]  font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    className="text-[13px] sm:text-[14px]  xl:text-[18px] extend text-black bg-white  px-5 font-semibold rounded-[10px] custom-shadow py-2 xl:py-3 w-full focus:outline-none"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    id=""
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full ">
                <label className="w-full text-[#185A96] space-y-2 text-[13px] sm:text-[15px] xl:text-[20px]  font-semibold">
                  Phone Number
                </label>
                <PhoneInput
                  country={defaultCountry}
                  value={phone}
                  placeholder="Enter phone number"
                  onChange={(value, country) => {
                    setPhone(value);
                    setCountryCode(country?.dialCode || '');
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '51px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    backgroundColor: 'white',
                    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                    paddingLeft: '48px',
                    fontSize: '14px',
                    color: 'black',
                    border: 'white'
                  }}

                  buttonStyle={{
                    border: 'none',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div className="w-full space-y-2 text-[14px] xl:text-[18px]  font-semibold">
                <label htmlFor="description" className='w-full space-y-2 text-[#185A96] text-[15px] xl:text-[20px]  font-semibold'>Message</label>
                <textarea
                  id="description"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows="5"
                  className="w-full h-[80px] sm:h-[105px] md:h-[120px] lg:h-[130px] xl:h-[140px] text-[13px] sm:text-[14px]  xl:text-[18px] extend text-black px-5 font-semibold py-3 rounded-[10px] custom-shadow bg-white focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="flex items-center justify-start w-full xl:mt-5 ">
                <button type='submit' disabled={isLoader} className=" bg-[#185A96] text-[15px] md:text-[18px] xl:text-[20px] font-semibold rounded-xl text-white h-[40px] w-[150px]  sm:h-[45px] sm:w-[170px]  lg:h-[50px] lg:w-[200px] xl:h-[60px] xl:w-[200px] cursor-pointer">
                  {isLoader ? "Submitting.." : "Submit"}
                </button>
              </div>
            </form>
          </div>
          <div className="w-full relative lg:w-[60%]">
            {adminDetails?.latitude && adminDetails?.longitude ? (
              <div className="my-8">
                <ViewMap lat={adminDetails?.latitude} lng={adminDetails?.longitude} />
              </div>
            )
              :
              <div>fetching location</div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
