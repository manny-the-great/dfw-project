import React, { useState, useEffect } from "react";
import visaLogo from "../assets/visa.png";
import { blue } from "../common/common-assets/assets-images";
import CommonBanner from "../components/CommonBanner";
import { useSelector, useDispatch } from "react-redux";
import { get_order_details } from "../utils/thunkApis";
import { useParams } from "react-router";
import { OrderDetailsSkeleton, OrderHeaderSkeleton } from "../components/SkeletonLoader";
const MyOrder = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const orderDetails = useSelector((state) => state.users.orderDetails);

  const fetchDetails = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_order_details(id));
    } catch (error) {
      // console.log("error", error)
    } finally {
      setIsLoader(false);
    }
  }
  useEffect(() => {
    fetchDetails();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden">
      <CommonBanner title="History To DFWerrands" />
      <div className='relative'>
        <img src={blue} className='absolute w-[355px] -top-[110px] -right-[70px] -z-10' alt="" />
      </div>
      <div className="container mx-auto">
        <p className="text-[35px] font-semibold">Order Details</p>

      </div>
      <div className="flex items-center justify-center container mx-auto p-6">
        <div className="bg-white w-full rounded-lg shadow-md border border-gray-200">

          {isLoader ? (
            <OrderHeaderSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#185A96] text-white px-6 py-3 rounded-t-lg">
              <p className="text-[16px] sm:text-[20px] md:text-[22px] xl:text-[25px] font-normal">Order No. {orderDetails?.order_id}</p>
              <p className="text-[16px] sm:text-[20px] md:text-[22px] xl:text-[25px]font-normal self-end">Status: {orderDetails?.status == 0 ? "Ongoing" : orderDetails?.status == 1 ? "Completed" : orderDetails?.status == 2 ? "Cancelled" : ""}</p>
            </div>
          )}

          {
            isLoader ? (
              <OrderDetailsSkeleton />
            ) : (orderDetails && orderDetails?.type == 0) ?

              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className=" w-full px-8 py-6 text-[#1a1a1a]">
                  {/* From-To + Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">From</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{orderDetails?.pickup_location}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">To</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{orderDetails?.delivery_location}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Order Name</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{orderDetails?.order_name}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Store Name</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{orderDetails?.store_name}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-[#FF8C01] text-[22px] md:text-[24px] lg:text-[28px] font-semibold mb-2">
                      Schedule
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Date</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {(orderDetails && orderDetails?.date) ? formatDate(orderDetails?.date) : null}
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Time</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {orderDetails && orderDetails?.time && new Date(`1970-01-01T${orderDetails?.time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Details */}
                  <div className="mt-6">
                    <p className="text-[#FF8C01] text-[22px] md:text-[24px] lg:text-[28px] font-semibold mb-2">
                      Payment Details
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Left Side */}
                      <div className="space-y-2">
                        {orderDetails?.product_price > 0.00 ?
                          <div className="flex w-[200px] md:w-[300px] justify-between">
                            <p className="font-medium text-gray-700">Product Price</p>
                            <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">${orderDetails?.product_price.toFixed(2)}</p>
                          </div>
                          :
                          null}
                        <div className="flex w-[200px] md:w-[300px] justify-between">
                          <p className="font-medium text-gray-700">Delivery Fee</p>
                          <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">${orderDetails?.delivery_fee.toFixed(2)}</p>
                        </div>
                        <div className="flex w-[200px] md:w-[300px] justify-between font-semibold">
                          <p>Total Price</p>
                          <p className="text-[#FF8C01] text-[16px] lg:text-[18px] xl:text-[20px] font-bold">${orderDetails?.total_price.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Right Side - Payment Method */}
                      <div className="border border-gray-200  sm:w-[300px]  lg:w-[400px] rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[18px] md:text-[20px] lg:text-[22px] xl:text-[25px] mb-2">Payment Method</p>
                          <div className="flex items-center gap-2">
                            <img src={visaLogo} alt="Visa" className="w-10" />
                            <div>
                              <p className="font-medium text-[16px] lg:text-[18px] xl:text-[20px]">{orderDetails?.order_transactions?.card_holder_name}</p>
                              <p className="text-gray-500 text-[15px] lg:text-[17px]">**** **** **** {orderDetails?.order_transactions?.card_last4_digits}</p>
                            </div>
                          </div>
                        </div>
                        <p className={`${orderDetails?.order_transactions?.payment_status == 1 ? "text-[#08BF3F]" : "text-[#ff0000]"} text-[18px] md:text-[20px] lg:text-[22px] xl:text-[25px] font-medium`}>{orderDetails?.order_transactions?.payment_status == 1 ? "Paid" : orderDetails?.order_transactions?.payment_status == 2 ? "Failed" : ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              (orderDetails && orderDetails?.type == 1) ?
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className=" w-full px-8 py-6 text-[#1a1a1a]">
                    {/* From-To + Order Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Service</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{orderDetails?.service_name}</p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Date</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {(orderDetails && orderDetails?.date) ? formatDate(orderDetails?.date) : null}
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Time</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {orderDetails && orderDetails?.time && new Date(`1970-01-01T${orderDetails?.time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-black text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Service Description</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal mb-2">
                        {orderDetails?.service_description}
                      </p>
                    </div>
                    {(orderDetails?.current_order_location && orderDetails?.status == 0) ?
                      <div>
                        <p className="text-[#0127ff] text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Order's Current Location</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal mb-2">
                          {orderDetails?.current_order_location}
                        </p>
                      </div>
                      :
                      null
                    }
                    {/* Receiver Details */}
                    <div className="mt-5">
                      <p className="text-[#FF8C01] text-[22px] md:text-[24px] lg:text-[28px] font-semibold mb-2">
                        Address Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Name</p>
                          <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal"> {orderDetails?.user_address?.name}</p>
                        </div>
                        <div>
                          <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Contact Number</p>
                          <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">+{orderDetails?.user_address?.country_code} {orderDetails?.user_address?.phone_no}</p>
                        </div>
                        <div>
                          <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">City</p>
                          <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal"> {orderDetails?.user_address?.city}</p>
                        </div>
                        {orderDetails?.user_address?.apartment_no ?
                          <div>
                            <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Apartment No.</p>
                            <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal"> {orderDetails?.user_address?.apartment_no}</p>
                          </div>
                          :
                          null
                        }
                        <div>
                          <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold">Address</p>
                          <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal"> {orderDetails?.user_address?.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                null
          }

        </div>

      </div>
    </div>
  );
};

export default MyOrder;