import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { get_address_list } from '../utils/thunkApis';
import { CustomLoader } from '../utils/react-loader/loader';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../utils/axios.config';
import DeleteAddressModal from '../components/DeleteAddressModal';

const Location = () => {
  const dispatch = useDispatch();
  const AxiosInstance = axiosInstance();
  const addressList = useSelector((state) => state.users.addressList);

  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pickupServiceData = sessionStorage.getItem("pickupServiceData");
    if (!pickupServiceData) {
      navigate('/')
    }
  }, []);
  const handleOpenModal = (id) => {
    setDeleteId(id)
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setDeleteId(null);
    setOpenModal(false);
  }
  const fetchAddressList = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_address_list());
    } catch (error) {
      // console.log(error)
    } finally {
      setIsLoader(false)
    }
  }

  useEffect(() => {
    fetchAddressList();
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("selectedUserAddress");

    if (saved && addressList?.length > 0) {
      const savedAddress = JSON.parse(saved);

      const exists = addressList.some(a => a.id === savedAddress.id);

      if (exists) {
        setSelectedAddress(savedAddress.id);
      } else {
        sessionStorage.removeItem("selectedUserAddress");
      }
    }
  }, [addressList]);


  const handleContinue = () => {
    const address = addressList.find(a => a.id === selectedAddress);
    if (!address) {
      toast.error("Please select an address")
      return;
    }

    sessionStorage.setItem("selectedUserAddress", JSON.stringify(address));

    navigate("/datetime");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsLoader(true);
    try {
      await AxiosInstance.delete(`/user/delete_address/${deleteId}`);
      setOpenModal(false);
      toast.success("Address deleted successfully");
      const saved = sessionStorage.getItem("selectedUserAddress");
      if (saved) {
        const savedAddress = JSON.parse(saved);
        if (savedAddress?.id == deleteId) {
          sessionStorage.removeItem("selectedUserAddress");
          setSelectedAddress(null); // update state too
        }
      }
      if (selectedAddress == deleteId) {
        setSelectedAddress(null)
      }
      setDeleteId(null);
      dispatch(get_address_list());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!")
    } finally {
      setIsLoader(false)
    }
  }
  return (
    <div>
      {isLoader &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full max-w-[920px] px-4 sm:px-6 md:px-8">

          <div className="flex flex-wrap items-center justify-center sm:justify-between mb-10 max-w-[625px] mx-auto gap-4 sm:gap-0">

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Address</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Schedule</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Payment</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Summary</p>
            </div>

          </div>

          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-8 md:p-10 md:px-[70px] lg:px-[100px]">

            <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-semibold mb-6 text-center sm:text-left">
              ADDRESS
            </h2>

            {(addressList && addressList?.length > 0) ? addressList?.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row justify-between gap-4 cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedAddress(item?.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-[16px] sm:text-[17px]">{item?.name}</p>
                  <p className="text-sm text-gray-600 leading-5 mt-1">
                    {item?.apartment_no ? `${item?.apartment_no},` : null} {item?.city},{item?.location} <br />Phone no.: +{item?.country_code} {item?.phone_no}
                  </p>

                  <div className="flex items-center gap-2 text-sm mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/newaddress?addressId=${item.id}`);
                      }}
                      className="hover:underline cursor-pointer">Edit</button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(item.id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer">Delete</button>
                  </div>
                </div>

                <div className="flex items-start justify-end sm:justify-center">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border flex items-center justify-center transition"
                    style={{
                      backgroundColor: selectedAddress === item.id ? "#185A96" : "#fff",
                      borderColor: selectedAddress === item.id ? "#185A96" : "#AFAFAF",
                    }}
                  >
                    {selectedAddress === item.id && (
                      <i className="fa-solid fa-check text-white text-[10px] sm:text-xs"></i>
                    )}
                  </div>
                </div>
              </div>
            ))
              :
              !isLoader &&
              <p>No saved address</p>}


            {addressList && addressList?.length > 0 &&
              <button onClick={handleContinue} className="w-full max-w-[420px] bg-[#185A96] text-white py-3 rounded-lg text-[16px] sm:text-[18px] md:text-[20px] m-auto flex justify-center cursor-pointer hover:bg-[#0f446f] transition">
                Continue
              </button>
            }

            <p className="text-center mt-5 sm:mt-6">
              <button onClick={() => navigate('/newaddress')} className="text-[#FF8C01] font-medium underline text-[16px] sm:text-[18px] cursor-pointer">
                Add New Address
              </button>
            </p>

          </div>
        </div>
      </div>
      {openModal && (
        <DeleteAddressModal handleDelete={handleDelete} handleClose={handleCloseModal} isLoader={isLoader} />
      )}
    </div>
  )
}

export default Location
