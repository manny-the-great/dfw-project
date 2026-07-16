import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Location = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({ date: "", time: "" });

  useEffect(() => {
    const serviceData = sessionStorage.getItem("serviceData");
    const selectedAddress = sessionStorage.getItem("selectedAddress");
    if (!serviceData || !selectedAddress) {
      navigate('/')
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("schedule");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDate(parsed.date || "");
      setTime(parsed.time || "");
    }
  }, []);


  const validate = (selectedDate, selectedTime) => {
    const newErrors = { date: "", time: "" };

    const today = new Date();
    today.setSeconds(0, 0);
    const maxAllowedDate = new Date(
      today.getFullYear() + 1,
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    if (!selectedDate) {
      newErrors.date = "Date is required";
    }

    if (!selectedTime) {
      newErrors.time = "Time is required";
    }

    if (selectedDate && selectedTime) {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const [hour, minute] = selectedTime.split(":").map(Number);

      const selected = new Date(
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

      const minAllowedDateTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 min
      if (selected < minAllowedDateTime) {
        newErrors.time = "Please select a time at least 30 minutes from now";
      } else if (selected > maxAllowedDate) {
        newErrors.time = "Date & Time cannot be more than 1 year from today";
      }
    }

    setErrors(newErrors);

    return newErrors.date === "" && newErrors.time === "";
  };


  const handleContinue = () => {
    if (!validate(date, time)) return;

    sessionStorage.setItem(
      "schedule",
      JSON.stringify({ date, time })
    );

    navigate("/summary-errand");
  };

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;


  const maxDateObj = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  );

  const maxDate = `${maxDateObj.getFullYear()}-${String(maxDateObj.getMonth() + 1).padStart(2, "0")}-${String(maxDateObj.getDate()).padStart(2, "0")}`;
  return (
    <div>

      {/* MAIN BODY */}
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full max-w-[620px] px-4 sm:px-6">

          {/* ✅ YOUR FULL STEPPER (UNCHANGED - now responsive) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-10 px-2 sm:px-4 gap-4">
            <div className="flex flex-col items-center flex-1 sm:flex-none min-w-[70px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Address</p>
            </div>

            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center flex-1 sm:flex-none min-w-[70px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Schedule</p>
            </div>

            

            <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center flex-1 sm:flex-none min-w-[70px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Summary</p>
            </div>
          </div>

          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-10 sm:px-[70px]">
            <h2 className="text-[24px] sm:text-[32px] font-semibold mb-4 text-center sm:text-left">
              ADD DATE AND TIME
            </h2>

            {/* Pickup */}
            <label className="text-sm font-medium">Date</label>
            <div className="relative mt-1 mb-4">
              <input
                type="date"
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => {
                  setDate(e.target.value);
                  validate(e.target.value, time);
                }}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md cursor-pointer text-sm sm:text-base"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Delivery */}
            <label className="text-sm font-medium">Time</label>
            <div className="relative mt-1 mb-4">
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  validate(date, e.target.value);
                }}
                className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md cursor-pointer text-sm sm:text-base"
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
              )}

            </div>

            <button
              onClick={handleContinue}
              className="mt-6 w-full max-w-[420px] bg-[#185A96] text-white py-3 rounded-lg hover:bg-[#eea62e] transition m-auto flex justify-center cursor-pointer text-[18px] sm:text-[24px]"
            >
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Location
