import React, { useState, useEffect } from 'react'
import { paid } from "../common/common-assets/assets-images";
import { tag } from "../common/common-assets/assets-images";
import { useNavigate } from 'react-router-dom';
const Location = () => {

  const [openModal, setOpenModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({ date: "", time: "" });
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const pickupServiceData = sessionStorage.getItem("pickupServiceData");
    const selectedUserAddress = sessionStorage.getItem("selectedUserAddress");
    if (!pickupServiceData) {
      navigate('/')
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("pickupServiceData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDate(parsed.date || "");
      setTime(parsed.time || "");
    }
  }, []);

  const updatePickupServiceData = (updatedFields) => {
    const saved = sessionStorage.getItem("pickupServiceData");
    const parsed = saved ? JSON.parse(saved) : {};

    const updated = { ...parsed, ...updatedFields };

    sessionStorage.setItem("pickupServiceData", JSON.stringify(updated));
  };

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

      const now = new Date()
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
    updatePickupServiceData({ date, time });
    setOpenModal(true)
  };

  const validatePrice = (value) => {
    let error = "";

    if (!value) {
      error = "Price is required";
    } else {
      const num = Number(value);

      if (num < 1) {
        error = "Price must be minimum $1";
      } else if (num > 999999.99) {
        error = "Maximum allowed price is 999,999.99";
      }
      else if (!/^\d{1,6}(\.\d{0,2})?$/.test(value)) {
        error = "Only 2 digits after decimals allowed";
      }
    }

    setPriceError(error);
    return error === "";
  };

  const handlePriceChange = (e) => {
    let val = e.target.value;

    if (!/^\d*\.?\d*$/.test(val)) return;

    const [beforeDecimal, afterDecimal] = val.split(".");

    if (beforeDecimal && beforeDecimal.length > 6) return;

    if (afterDecimal && afterDecimal.length > 2) return;

    setPrice(val);
    setPriceError("");

  };

  const handlePriceBlur = () => {
    if (!price) return;

    let formatted = price;

    if (/^\d+\.$/.test(price)) {
      formatted = price.slice(0, -1) + ".00";
    }
    else if (/^\d+\.\d$/.test(price)) {
      formatted = price + "0";
    }
    else if (/^\d+$/.test(price)) {
      formatted = price + ".00";
    }
    setPrice(formatted);
    validatePrice(formatted);
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
              <p className="text-xs sm:text-sm mt-1">Payment</p>
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


      {openModal && !showPriceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg text-center px-5 sm:px-10 py-8 w-[300px] sm:w-[400px]">
            <div className="flex justify-center mb-4">
              <div className="p-3">
                <img src={paid} alt="Paid" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Is your order prepaid?
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              You have already paid the shop directly. Only
              the delivery fee will be charged.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => { sessionStorage.setItem("productPrice", 0.00); navigate('/Payment') }}
                className="bg-[#185A96] text-white px-10 py-2 rounded-lg hover:bg-[#134a7c] transition cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPriceModal(true)}
                className="bg-gray-200 text-gray-700 px-10 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showPriceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-lg text-center px-5 sm:px-10 py-8 w-[300px] sm:w-[400px] relative">
            <button
              onClick={() => setShowPriceModal(false)}
              className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center 
             rounded-full bg-gray-100 text-gray-600 
             hover:bg-[#185A96] hover:text-white 
             transition-all duration-300 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-sm"></i>
            </button>

            <div className="flex justify-center mb-4">
              <div className="p-3">
                <img src={tag} alt="Tag Icon" className="w-14 mx-auto" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Enter Product Price($)</h2>
            <p className="text-xs text-gray-500 mb-6">
              Enter the actual amount of the product. We will pay the shop on your behalf.
            </p>

            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              placeholder="00.00"
              className="w-[60%] border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md mb-4 text-center"
            />

            {priceError && (
              <p className="text-red-500 text-xs mt-1">{priceError}</p>
            )}
            <button
              onClick={() => {
                if (!validatePrice(price)) return;

                sessionStorage.setItem("productPrice", price);

                setShowPriceModal(false);
                setOpenModal(false);
                navigate("/Payment");
              }}
              className="w-full max-w-[240px] bg-[#185A96] text-white text-[22px] py-2 rounded-lg hover:bg-[#134a7c] transition cursor-pointer flex justify-center m-auto"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Location
