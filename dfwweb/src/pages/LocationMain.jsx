import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
const AddLocation = () => {


  const [searchParams] = useSearchParams();
  const serviceIdFromQuery = searchParams.get("serviceId");
  const navigate = useNavigate();
  const serviceList = useSelector((state) => state.users.serviceList);

  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const [touched, setTouched] = useState({
    service: false,
    description: false,
  });

  useEffect(() => {
    if (!serviceIdFromQuery) {
      navigate("/")
    }
  }, [serviceIdFromQuery])

  useEffect(() => {
    const saved = sessionStorage.getItem("serviceData");

    if (saved) {
      const parsed = JSON.parse(saved);
      setService(parsed.service_id || "");
      setDescription(parsed.service_description || "");
      return;
    }

    if (serviceIdFromQuery) {
      setService(serviceIdFromQuery);
    }
  }, [serviceIdFromQuery]);



  useEffect(() => {
    const newErrors = {};

    if (!service) newErrors.service = "Service is required";
    if (!description) newErrors.description = "Description is required";
    else if (description.length > 500)
      newErrors.description = "Maximum 500 characters allowed";

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [service, description]);

  const handleSubmit = () => {
    if (!isValid) return;
    const selectedService = serviceList?.find(s => String(s.id) === String(service));

    const payload = {
      service_id: selectedService?.id,
      service_name: selectedService?.name,
      service_description: description,
    };
    sessionStorage.setItem("serviceData", JSON.stringify(payload));

    navigate("/alladdress-errands");
  };
  return (

    <div className="min-h-screen mt-15 ">
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
          <p className="text-sm mt-1">Summary</p>
        </div>

      </div>
      <div className=" px-4">

        <div className="bg-white w-full flex-items-center justify-center container mx-auto  max-w-[480px] rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.12)] p-8">
          <h2 className="text-[24px] font-semibold mb-1">ADD LOCATION</h2>

          <div className="mb-6">
            <label className="block font-semibold text-[14px] mb-2">
              Selected Service
            </label>
            <div className="relative">

              <select
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setTouched((prev) => ({ ...prev, service: true }));
                }}
                className={`appearance-none w-full border py-3 px-4 rounded-lg shadow-sm outline-none cursor-pointer ${errors.service ? "border-gray-200" : "border-gray-200"
                  }`}
              >
                <option value="">Select Service</option>

                {serviceList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <IoIosArrowDown className="absolute right-4 top-4 text-gray-500 text-xl" />
            </div>
            {touched.service && errors.service && (
              <p className="text-red-500 text-xs mt-1">{errors.service}</p>
            )}

          </div>

          <div className="mb-6">
            <label className="block font-semibold text-[14px] mb-2">
              Service Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setTouched((prev) => ({ ...prev, description: true }));
              }}
              placeholder="Write here..."
              rows="4"
              className={`w-full border rounded-lg p-4 text-sm outline-none shadow-sm resize-none ${errors.description ? "border-gray-200" : "border-gray-200"
                }`}
            />
            <div className="flex justify-between mt-1 text-xs">
              {touched.description && errors.description ? (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              ) : (
                <p className="text-gray-400">{description.length}/500 characters</p>
              )}

            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full text-white text-[16px] font-medium py-3 rounded-lg transition ${isValid ? "bg-[#185A96] cursor-pointer" : "bg-gray-400 cursor-not-allowed"
              }`}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;