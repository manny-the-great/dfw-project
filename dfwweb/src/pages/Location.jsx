import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-hot-toast';
import LocationAutocomplete from '../utils/LocationAutocomplete';

const Location = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const changeAddress = searchParams.get('changeAddress');
  const summary = searchParams.get('summary');

  const storedPickup = JSON.parse(sessionStorage.getItem("pickupServiceData")) || {
    pickupLocation: "",
    deliveryLocation: "",
    pickupLat: null,
    pickupLng: null,
    deliveryLat: null,
    deliveryLng: null,

    date: "",
    time: "",
    order_name: "",
    store_name: "",
    isHomeAddress: false,
  };

  const [formData, setFormData] = useState({
    ...storedPickup,
  });

  const [errors, setErrors] = useState({});
  const [isHomeAddress, setIsHomeAddress] = useState(
    storedPickup.isHomeAddress || false
  );

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (!value.trim()) {
      newErrors[name] = "This field is required";
    } else {
      delete newErrors[name];
    }

   
    if (name === "store_name") {
      if (!value.trim()) {
        newErrors.store_name = "This field is required";
      } else if (value.length > 30) {
        newErrors.store_name = "Store name must be within 30 characters";
      } else {
        delete newErrors.store_name;
      }
    }

    if (name === "order_name") {
      if (!value.trim()) {
        newErrors.order_name = "This field is required";
      } else if (value.length > 30) {
        newErrors.order_name = "Order name must be within 30 characters";
      } else {
        delete newErrors.order_name;
      }
    }

    setErrors(newErrors);
  };

  const handleCheckboxChange = (checked) => {
    setIsHomeAddress(checked);
    const updated = { ...formData, isHomeAddress: checked };
    setFormData(updated);
    sessionStorage.setItem("pickupServiceData", JSON.stringify(updated));
  };

  const handleChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    validateField(name, value);

    sessionStorage.setItem("pickupServiceData", JSON.stringify(updated));
  };
  

  const handleLocationSelect = (type, location, lat, lng) => {
    const updated = {
      ...formData,
      [`${type}Location`]: location,
      [`${type}Lat`]: lat,
      [`${type}Lng`]: lng
    };

    setFormData(updated);

    sessionStorage.setItem("pickupServiceData", JSON.stringify(updated));

    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[`${type}Location`];
      return newErr;
    });
  };

  const handleSubmit = () => {
    let required = [
      "pickupLocation",
      "deliveryLocation",
      "order_name",
      "store_name",
    ];

    let newErrors = {};

    required.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.store_name?.length > 30) {
      newErrors.store_name = "Store name must be within 30 characters";
    }
    if (formData.order_name?.length > 30) {
      newErrors.order_name = "Order name must be within 30 characters";
    }
    if (!formData.pickupLat || !formData.pickupLng) {
      newErrors.pickupLocation = "Please select a pickup location";
    }

    if (!formData.deliveryLat || !formData.deliveryLng) {
      newErrors.deliveryLocation = "Please select a delivery location";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    if (changeAddress) {
      navigate("/Payment");
    } else if (summary) {
      navigate("/Summary");
    } else if (isHomeAddress) {
      sessionStorage.removeItem('selectedUserAddress')
      navigate("/datetime");
    } else {
      navigate("/address-list");
    }
  };

  return (
    <div>

      {/* MAIN BODY */}
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full">

          <div className="flex items-center justify-between mb-10 px-4 max-w-[860px] mx-auto">

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[25px]"></i>
              </div>
              <p className="text-sm mt-1">Address</p>
            </div>

            <div className="flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-sm mt-1">Schedule</p>
            </div>

            <div className="flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-sm mt-1">Payment</p>
            </div>

            <div className="flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-sm mt-1">Summary</p>
            </div>

          </div>

          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl px-30 lg:px-[80px] container  lg:max-w-[860px] mx-auto">

            <h2 className="text-[35px] font-semibold mb-1 text-uppercase">ADD LOCATION</h2>
            <div className="flex items-center justify-center gap-2 bg-red-50  text-red-700 px-4 py-2 rounded-lg mb-4 max-w-md mx-auto">
              <i className="fa-solid fa-circle-info"></i>
              <span className="text-sm font-medium">
                Car Delivery Items Only
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-5">Add pickup and delivery location</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Pickup Location */}
              <div className="md:col-span-2">
               
                <label className="text-sm font-medium">Pickup Location</label>
                <div className="relative mt-1 pe-5 full border border-gray-200 px-4 py-2 rounded-lg outline-none shadow-md">
             
                  <LocationAutocomplete
                    placeholder="Enter pickup location"
                    value={formData.pickupLocation}
                    onChange={({ location, latitude, longitude }) => {
                      handleLocationSelect("pickup", location, latitude, longitude);
                    }}
                  />


                  <i className="fa-solid fa-location-dot absolute right-3 top-4 text-orange-500 text-lg"></i>
                </div>

                {errors.pickupLocation && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
                )}

              </div>

              {/* Delivery Location */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Delivery Location</label>
                <div className="relative mt-1 pe-5 full border border-gray-200 px-4 py-2 rounded-lg outline-none shadow-md">
                  <LocationAutocomplete
                    placeholder="Enter delivery location"
                    value={formData.deliveryLocation}
                    onChange={({ location, latitude, longitude }) => {
                      handleLocationSelect("delivery", location, latitude, longitude);
                    }}
                  />

                  <i className="fa-solid fa-location-dot absolute right-3 top-4 text-orange-500 text-lg"></i>
                </div>

                {errors.deliveryLocation && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryLocation}</p>
                )}
              </div>

              {/* Order Name */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Order Name</label>
                <input
                  type="text"
                  value={formData.order_name}
                  onChange={(e) => handleChange("order_name", e.target.value)}
                  placeholder="Enter order name"
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md"
                />
                {errors.order_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.order_name}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Store Name</label>
                <input
                  type="text"
                  value={formData.store_name}
                  onChange={(e) => handleChange("store_name", e.target.value)}
                  placeholder="Enter store name"
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md"
                />
                {errors.store_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.store_name}
                  </p>
                )}
              </div>
              <div className="md:col-span-2 flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={isHomeAddress}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                  className="mr-2 cursor-pointer"
                />
                <span className="text-[#185A96]">The previous address is your home address</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-10 w-full max-w-[420px] bg-[#185A96] text-white py-3 rounded-lg hover:bg-[#eea62e] transition m-auto flex justify-center cursor-pointer text-[24px]">
              Submit
            </button>

          </div>

        </div>
      </div>

    </div>
  )
}

export default Location
