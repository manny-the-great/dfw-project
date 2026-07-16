import React, { useState } from "react";
import { main, errand1, errand2, errand3, errand4, errand5, errand6 } from "../common/common-assets/assets-images";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import truncate from "html-truncate";
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';
import LocationAutocomplete from '../utils/LocationAutocomplete';
const Banner = ({ aboutUs, serviceList }) => {
  const userDetails = useSelector((state) => state.users.user);
  const [activeTab, setActiveTab] = useState("pickup");
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const trimmedDescription = aboutUs?.description
    ? truncate(aboutUs.description, 300)
    : "";


  const today = new Date();

  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const maxDateObj = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  );

  const maxDate = `${maxDateObj.getFullYear()}-${String(
    maxDateObj.getMonth() + 1
  ).padStart(2, "0")}-${String(maxDateObj.getDate()).padStart(2, "0")}`;



  const handleContinue = () => {
    if (!selectedService) {
      const t = toast.error("Please select a service")
      setTimeout(() => {
        toast.dismiss(t);
      }, 2000);
      return
    }
    if (!userDetails || userDetails?.otp_verified != 1) {
      navigate(`/login`, { state: { serviceId: selectedService } })
    } else {
      navigate(`/location-errands?serviceId=${selectedService}`)
    }
  }

  const [pickup, setPickup] = useState({
    pickupLocation: "",
    pickupLat: null,
    pickupLng: null,

    deliveryLocation: "",
    deliveryLat: null,
    deliveryLng: null,

    date: "",
    time: "",
  });


  const [errors, setErrors] = useState({});


  const validateFields = (fieldName, value, updatedObj) => {
    let newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[fieldName] = "This field is required";
    } else {
      delete newErrors[fieldName];
    }

    if (updatedObj.date && updatedObj.time) {
      const [year, month, day] = updatedObj.date.split("-").map(Number);
      const [hour, minute] = updatedObj.time.split(":").map(Number);

      const selectedDateTime = new Date(year, month - 1, day, hour, minute, 0, 0);

      const now = new Date();
      now.setSeconds(0, 0);


      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const minAllowedDateTime = new Date(now.getTime() + 30 * 60 * 1000);
      const maxAllowedDate = new Date();
      maxAllowedDate.setFullYear(today.getFullYear() + 1);

      if (selectedDateTime < minAllowedDateTime) {
        newErrors.datetime = "Please select a time at least 30 minutes from now";
      } else if (selectedDateTime > maxAllowedDate) {
        newErrors.datetime = "Date & Time cannot be more than 1 year from today";
      } else {
        delete newErrors.datetime;
      }
    }

    setErrors(newErrors);
  };


  const handleChange = (field, value) => {
    const updatedObj = { ...pickup, [field]: value };

    setPickup(updatedObj);

    validateFields(field, value, updatedObj);

  };



  const handleSubmit = () => {
    let newErrors = {};

    if (!pickup.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!pickup.deliveryLocation.trim()) {
      newErrors.deliveryLocation = "Delivery location is required";
    }

    if (!pickup.pickupLat || !pickup.pickupLng) {
      newErrors.pickupLocation = "Please select a location";
    }

    if (!pickup.deliveryLat || !pickup.deliveryLng) {
      newErrors.deliveryLocation = "Please select a location";
    }

    if (!pickup.date || !pickup.time) newErrors.datetime = "Date and Time is required";
 

    if (pickup.date) {
      const [year, month, day] = pickup.date.split("-").map(Number);

      const selectedDate = new Date(year, month - 1, day);
      selectedDate.setHours(0, 0, 0, 0);

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      const maxAllowedDate = new Date(todayDate);
      maxAllowedDate.setFullYear(todayDate.getFullYear() + 1);
      console.log(selectedDate, "selectedDate", todayDate, "todayDate")
      if (selectedDate < todayDate) {
        newErrors.datetime = "Past dates are not allowed";
      } else if (selectedDate > maxAllowedDate) {
        newErrors.datetime = "Date cannot be more than 1 year from today";
      }
    }

    if (pickup.date && pickup.time) {
      const [year, month, day] = pickup.date.split("-").map(Number);
      const [hour, minute] = pickup.time.split(":").map(Number);

      const selectedDateTime = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
      );
      const now = new Date();
      now.setSeconds(0, 0);

      const minAllowedDateTime = new Date(now.getTime() + 30 * 60 * 1000);

      if (selectedDateTime < minAllowedDateTime) {
        newErrors.datetime = "Please select a time at least 30 minutes from now";
      }
    }



    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all fields correctly");
      return;
    }
    
    if (!userDetails || userDetails?.otp_verified != 1) {
      navigate(`/login`, { state: { pickupData: pickup } })
    } else {
      sessionStorage.setItem("pickupServiceData", JSON.stringify(pickup));
      navigate("/location");
    }
  };

  return (
    <div
      className="py-5 bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${main})`,
      }}
    >
      <div className="flex items-center flex-col lg:flex-row justify-between gap-10 xl:gap-30 container mx-auto px-6">
        {/* ---------- LEFT SIDE ---------- */}
        <div className="w-[100%] lg:w-[60%] text-white space-y-6">
          <p className="text-[20px] font-semibold">Welcome To DFWerrands</p>
          <h1 className="text-[38px] md:text-[50px] lg:text-[54px] xl:text-[64px] leading-tight font-bold">
            Choose the{" "}
            <span className="text-[#EEA52D]">service</span> that fits your{" "}
            <span className="text-[#185A96]">errand</span>
          </h1>

          <div className="text-[16px] font-medium max-w-[650px] [&_h1]:text-3xl [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1" dangerouslySetInnerHTML={{ __html: trimmedDescription }}>
          </div>
          {aboutUs &&
            <button onClick={() => navigate("/about")} className="rounded-[10px] px-8 py-3 bg-[#185A96] text-white font-semibold hover:bg-[#104777] transition cursor-pointer">
              Read More
            </button>
          }
        </div>

        {/* ---------- RIGHT SIDE ---------- */}
        <div className="w-[100%] lg:w-[40%] 2xl:w-[35%] bg-white rounded-[20px] shadow-lg p-10 min-h-[520px] flex flex-col justify-between">
          {/* Header Tabs */}
          <div>
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab("pickup")}
                className={` text-[14px] sm:text-[16px] pb-2 mr-6 ${activeTab === "pickup"
                  ? "text-black border-b-4 border-[#EEA52D] font-bold"
                  : "text-gray-500 cursor-pointer"
                  }`}
              >
                Pickup service
              </button>
              <button
                onClick={() => setActiveTab("errands")}
                className={`text-[14px] sm:text-[16px] pb-2 ${activeTab === "errands"
                  ? "font-bold text-black border-b-4 border-[#EEA52D]"
                  : "text-gray-500 cursor-pointer"
                  }`}
              >
                Other Errands
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "pickup" ? (
              <>
                {/* Pickup Location */}
                <div className="mb-4">
                  <label className="font-semibold text-black text-[15px]">
                    Pickup Location
                  </label>
                  <div className="flex items-center mt-1 rounded-lg custom-shadow px-3 py-3 shadow-sm">
                    <div className="flex-1 w-full">
                      <LocationAutocomplete
                        placeholder="Enter pickup location"
                        value={pickup.pickupLocation}
                        onChange={({ location, latitude, longitude }) => {
                          handleChange("pickupLocation", location);

                          setPickup(prev => ({
                            ...prev,
                            pickupLat: latitude,
                            pickupLng: longitude
                          }));
                        }}
                      />
                    </div>
                    <FaMapMarkerAlt className="text-[#EEA52D]" />
                  </div>
                  {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>}
                </div>

                {/* Delivery Location */}
                <div className="mb-4">
                  <label className="font-semibold text-black text-[15px]">
                    Delivery Location
                  </label>
                  <div className="flex items-center mt-1 rounded-lg custom-shadow px-3 py-3 shadow-sm">
                   
                    <div className="flex-1 w-full">
                      <LocationAutocomplete
                        placeholder="Enter delivery address"
                        value={pickup.deliveryLocation}
                        onChange={({ location, latitude, longitude }) => {
                          handleChange("deliveryLocation", location);

                          setPickup(prev => ({
                            ...prev,
                            deliveryLat: latitude,
                            deliveryLng: longitude
                          }));
                        }}
                      />
                    </div>
                    <FaMapMarkerAlt className="text-[#EEA52D]" />
                  </div>
                  {errors.deliveryLocation && <p className="text-red-500 text-sm mt-1">{errors.deliveryLocation}</p>}
                </div>

                {/* Date and Time */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/2">
                    <label className="font-semibold text-black text-[15px]">
                      Date
                    </label>
                    <div className="flex items-center mt-1 rounded-lg custom-shadow px-3 py-4 shadow-sm">
                      <input
                        type="date"
                        value={pickup.date}
                        min={minDate}
                        max={maxDate}
                        onChange={(e) => handleChange("date", e.target.value)}
                        className="w-full outline-none text-gray-600 appearance-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="font-semibold text-black text-[15px]">
                      Time
                    </label>
                    <div className="flex items-center mt-1 rounded-lg custom-shadow px-3 py-4 shadow-sm">
                      <input
                        type="time"
                        value={pickup.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        className="w-full outline-none text-gray-600 appearance-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
                {errors.datetime && <p className="text-red-500 text-sm -mt-4 mb-2">{errors.datetime}</p>}

              </>
            ) : (
              <div className="flex flex-col h-[412px] sm:h-[312px] overflow-auto mb-1">

                <div className="grid grid-cols-2  mt-5 xl:grid-cols-3 gap-4 flex-grow">
                  {serviceList && serviceList?.length > 0 ? serviceList.map((service, index) => (
                    <div
                      onClick={() => setSelectedService(service.id)}
                      key={service?.id}
                      className={`flex flex-col items-center px-4 rounded-[10px]
              hover:border-3 hover:border-[#EEA52D]
              shadow-md cursor-pointer transition
              min-h-[110px]
              ${selectedService === service.id
                          ? "border-3 border-[#EEA52D]"
                          : "bg-white border-3 border-white"
                        }`}>
                      <div className="w-[80px] h-[55px]  rounded-full mb-2 flex items-center justify-center">
                        <img src={`${import.meta.env.VITE_BASE_URL}/${service?.image}` || ""} alt="" className="w-[80px] h-[55px] mt-[20px] object-cover" />
                      </div>
                      <p className="text-[13px] sm:text-[14px] text-center font-medium text-gray-700 mt-1
                 break-words">
                        {service?.name}
                      </p>
                    </div>
                  ))
                    : !serviceList?.length &&
                    <p>No Services Available</p>
                  }

                </div>

              </div>
            )}
          </div>

          {activeTab === "pickup" && (
            <button
              onClick={handleSubmit}
              className="w-full bg-[#185A96] text-white py-4 rounded-lg font-semibold hover:bg-[#104777] transition mt-6 cursor-pointer"
            >
              Submit
            </button>
          )}

          {activeTab === "errands" && (
            <button
              onClick={handleContinue}
              className="w-full bg-[#EEA52D] text-white py-4 rounded-lg font-semibold hover:bg-[#d99123] transition mt-6 cursor-pointer"
            >
              Continue
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Banner;
