import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { get_address_details } from '../utils/thunkApis';
import { useDispatch } from 'react-redux';
import LocationAutocomplete from '../utils/LocationAutocomplete';

const NewaddressMain = () => {
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get('addressId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AxiosInstance = axiosInstance();

  const [form, setForm] = useState({
    name: "",
    phone_no: "",
    country_code: "",
    city: "",
    apartment_no: "",
    location: "",
    latitude: "",
    longitude: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(0); //0:no loading ,1:loading-btn disabled,2:btn disabled

  useEffect(() => {
    if (addressId) {
      dispatch(get_address_details(addressId))
        .then(res => {
          const data = res.payload;
          if (data) {
            setForm({
              name: data.name || "",
              phone_no: data.phone_no || "",
              country_code: data.country_code || "",
              city: data.city || "",
              apartment_no: data.apartment_no || "",
              location: data.location || "",
              latitude: data.latitude || "",
              longitude: data.longitude || ""
            });
          }
        });
    }
  }, [addressId, dispatch]);

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

      case "city":
        if (!value.trim()) newErrors.city = "City is required";
        else if (value?.trim()?.length > 50)
          newErrors.city = "City should be within 50 characters";
        else delete newErrors.city;
        break;

      case "apartment_no":
        if (value && value?.trim()?.length > 20)
          newErrors.apartment_no = "Apartment number should be within 20 characters";
        else delete newErrors.apartment_no;
        break;

      case "location":
        if (!value.trim()) newErrors.location = "Address is required";
        else if (value?.trim()?.length > 200)
          newErrors.location = "Address should be within 200 characters";
        else delete newErrors.location;
        break;

      case "phone_no":
        if (!value.trim()) newErrors.phone_no = "Phone number is required";
        else if (value.length < 6)
          newErrors.phone_no = "Invalid phone number";
        else delete newErrors.phone_no;
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
        case "city":
          if (!value.trim()) validationErrors[key] = "City is required";
          else if (value?.trim()?.length > 50)
            validationErrors[key] = "City should be within 50 characters";
          break;

        case "apartment_no":
          if (value && value?.trim()?.length > 20)
            validationErrors[key] = "Apartment number should be within 20 characters";
          break;

        case "location":
          if (!value.trim()) validationErrors[key] = "Address is required";
          else if (value?.trim()?.length > 200)
            validationErrors[key] = "Address should be within 200 characters";
          break;
        case "phone_no":
          if (!value.trim()) validationErrors[key] = "Phone number is required";
          else if (value.length < 6)
            validationErrors[key] = "Invalid phone number";
          break;
      }
    });
    if (!form.latitude || !form.longitude) {
      validationErrors.location = "Please select address";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    validate("name", form.name);
    validate("phone_no", form.phone_no);
    validate("floor", form.floor)
    validate("location", form.location);
    validate("apartment_no", form.apartment_no);
    if (Object.keys(errors).length > 0) return;
    setLoading(1);
    try {
      if (addressId) {
        await AxiosInstance.put('/user/update_address', {
          id: addressId,
          ...form,
          latitude: form.latitude,
          longitude: form.longitude
        });
        const t = toast.success("Address updated successfully!");
        setLoading(2)
        setTimeout(() => {
          toast.dismiss(t);
          navigate("/alladdress-errands");
        }, 1000);
      } else {
        await AxiosInstance.post("/user/add_address", form);
        const t = toast.success("Address added successfully!");
        setLoading(2)
        setTimeout(() => {
          toast.dismiss(t);
          navigate("/alladdress-errands");
        }, 1000);
      }
    } catch (error) {
      setLoading(0)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>

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
              <p className="text-sm mt-1">Summary</p>
            </div>

          </div>

          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-10 max-w-[860px] mx-auto">

            <h2 className="text-[35px] font-semibold mb-2 text-uppercase">{addressId ? "UPDATE" : "ADD NEW"} ADDRESS</h2>
            <p className="text-sm text-gray-500 mb-6">Please enter your full address details</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-sm font-medium">Phone Number</label>
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

                {errors.phone_no && <p className="text-red-500 text-sm">{errors.phone_no}</p>}
              </div>

              {/* City */}
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              {/* Apartment Number */}
              <div>
                <label className="text-sm font-medium">Apartment Number(optional)</label>
                <input
                  type="text"
                  placeholder="Enter apartment number"
                  name="apartment_no"
                  value={form.apartment_no}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 rounded-lg outline-none shadow-md"
                />
                {errors.apartment_no && <p className="text-red-500 text-sm">{errors.apartment_no}</p>}
              </div>

              {/* Address */}

              <div>
                <label className="text-sm font-medium">Address</label>
                <div className="w-full border border-gray-200 px-1 py-[6px] rounded-lg outline-none shadow-md">
                  <LocationAutocomplete
                    placeholder="Enter address"
                    value={form.location}
                    onChange={({ location, latitude, longitude }) => {
                      const updatedForm = {
                        ...form,
                        location,
                        latitude,
                        longitude
                      };
                      setForm(updatedForm);
                      validate("location", location);
                    }}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>

            </div>

            <button
              onClick={handleSubmit}
              disabled={loading != 0}
              className="mt-10 w-full max-w-[420px] bg-[#185A96] text-white py-3 rounded-lg hover:bg-[#eea62e] transition m-auto flex justify-center cursor-pointer text-[24px]">
              {loading == 1 ? (addressId ? "Updating.." : "Adding..") : (addressId ? "Update" : "Add")}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default NewaddressMain
