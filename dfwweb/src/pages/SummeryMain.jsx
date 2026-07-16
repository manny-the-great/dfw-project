import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
const Summary = () => {
  const AxiosInstance = axiosInstance();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleOk = () => {
    setShowModal(false);
    navigate('/current-order');
  };


  const [selectedAddress, setSelectedAddress] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [isLoader, setIsLoader] = useState(false);


  useEffect(() => {
    const address = sessionStorage.getItem("selectedAddress");
    const scheduleData = sessionStorage.getItem("schedule");
    const service = sessionStorage.getItem("serviceData");

    if (!address || !scheduleData || !service) {
      navigate("/");
      return;
    }

    setSelectedAddress(JSON.parse(address));
    setSchedule(JSON.parse(scheduleData));
    setServiceData(JSON.parse(service));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  const handleCheckout = async () => {
    if (
      !serviceData?.service_id ||
      !serviceData?.service_name ||
      !serviceData?.service_description ||
      !schedule?.date ||
      !schedule?.time ||
      !selectedAddress?.id) {
      toast.error("Something went wrong,Please try later!")
      return
    }

    const [year, month, day] = schedule.date.split("-").map(Number);
    const [hour, minute] = schedule.time.split(":").map(Number);

    const localDateTime = new Date(year, month - 1, day, hour, minute);

    const utcISOString = localDateTime.toISOString();
    const utc_date = utcISOString.split("T")[0];
    const utc_time = utcISOString.split("T")[1].substring(0, 5);

    setIsLoader(true);

    try {
      const body = {
        type: 1,
        service_id: serviceData?.service_id,
        service_name: serviceData?.service_name,
        service_description: serviceData?.service_description || "",
        date: schedule.date,
        time: schedule.time,
        user_address_id: selectedAddress?.id || null,
        utc_date,
        utc_time
      };

      await AxiosInstance.post("/user/create_order", body);

      sessionStorage.removeItem("selectedAddress");
      sessionStorage.removeItem("schedule");
      sessionStorage.removeItem("serviceData");

      setShowModal(true);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!")
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <div>


      {/* MAIN BODY */}
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full px-3 sm:px-6">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-10 px-2 sm:px-4 max-w-[620px] mx-auto gap-4">
            {["Address", "Schedule", "Summary"].map((label) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center w-1/4 sm:w-auto text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                    <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
                  </div>
                  <p className="text-xs sm:text-sm mt-1">{label}</p>
                </div>
                {label !== "Summary" && (
                  <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ✅ Summary Card */}
          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-10 max-w-[800px] mx-auto">
            <h2 className="text-[26px] sm:text-[35px] font-semibold mb-6 uppercase flex flex-col sm:flex-row sm:justify-between gap-2">
              Summary

            </h2>
            <div className="mb-6">
              <div className='flex items-center justify-between'>
                <p className="text-lg sm:text-xl font-medium mb-2"> Service Name</p>
                <p>{serviceData?.service_name}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Service Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {serviceData?.service_description}
                  </p>
                </div>

              </div>
            </div>
            {/* Pickup Location */}
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2"> Location</p>
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-3 relative">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedAddress?.apartment_no ? `${selectedAddress?.apartment_no},` : null}{selectedAddress?.city},{selectedAddress?.location}<br />
                    Phone Number: +{selectedAddress?.country_code} {selectedAddress?.phone_no}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/alladdress-errands')}
                  className="text-sm font-medium underline self-end sm:self-auto cursor-pointer absolute top-2 right-1">
                  Change Address
                </button>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-start space-x-4">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full">
                  <i className="fa-solid fa-calendar-days text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Date</p>
                  <p className="text-base sm:text-lg text-gray-600">
                   
                    {(schedule && schedule?.date) ? formatDate(schedule?.date) : null}

                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 justify-start ">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full">
                  <i className="fa-solid fa-clock text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Time</p>
                  <p className="text-base sm:text-lg text-gray-600">
                    {schedule && schedule?.time && new Date(`1970-01-01T${schedule?.time}:00`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>



            <button
              onClick={handleCheckout}
              disabled={isLoader}
              className="w-full max-w-[550px] bg-[#185A96] text-white py-4 text-[18px] sm:text-[20px] rounded-lg m-auto flex justify-center cursor-pointer"
            >
              {isLoader ? "Submitting.." : "Submit"}
            </button>
          </div>
        </div>
      </div>


      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[300px] sm:w-[370px] text-center relative">
            <div className="flex justify-center mb-4">
              <div className="w-17 h-17 bg-[#32BA7C] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-[40px] font-bold"></i>
              </div>
            </div>
            <p className="text-md text-gray-600 mb-6">Your request has been submitted successfully. We will contact you soon.</p>
            <button
              onClick={handleOk}
              className="bg-[#185A96] hover:bg-[#164d82] text-white px-15 py-2 rounded-md text-xl font-medium cursor-pointer"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
