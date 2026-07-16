import React, { useState, useEffect, useRef } from "react";
import CommonBanner from "../components/CommonBanner";
import { blue, notFound } from "../common/common-assets/assets-images";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { get_orders } from "../utils/thunkApis";
import CustomPagination from "../components/CustomPagination";
import { CustomLoader } from "../utils/react-loader/loader";
import { OrderCardSkeleton } from "../components/SkeletonLoader";
const CurrentOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.users.orders);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "current";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const listRef = useRef(null);
  const [isLoader, setIsLoader] = useState(false);
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loadingOrders, setLoadingOrders] = useState(4);

  const handleTabClick = (value) => {
    setSearchParams({ tab: value });
    setActiveTab(value)
  };

  const fetchOrders = async () => {
    const status = activeTab == 'past' ? 1 : 0;
    setIsLoader(true);
    try {
      await dispatch(get_orders({ currentPage, status }))
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoader(false)
    }
  }
  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  const handlePageChange = (event, page) => {
    if (currentPage != page) {
      setLoadingOrders(orderList?.order_list?.length || 4)
      setCurrentPage(page);
      setSearchParams({ page: page, tab: activeTab });
    }
  };
  const prevPageRef = useRef(initialPage);

  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      if (listRef.current) {
        listRef.current.scrollIntoView({ behavior: "smooth" });
      }
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  useEffect(() => {
    const paramPage = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(paramPage);
  }, [searchParams]);

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
        <p ref={listRef} className="text-[35px] font-semibold">My Orders</p>
        <div className="flex gap-3 mt-4">
          <button disabled={activeTab == "current"} onClick={() => handleTabClick('current')} className={`rounded-[21px] py-2 px-10 ${activeTab == "current" ? "bg-[#185A96] text-white" : "border-2 border-gray-500 text-gray-500 cursor-pointer"}`}>Current</button>
          <button disabled={activeTab == "past"} onClick={() => handleTabClick('past')} className={`rounded-[21px] py-2 px-12 ${activeTab == "past" ? "bg-[#185A96] text-white" : "border-2 border-gray-500 text-gray-500 cursor-pointer"}`}>Past</button>
        </div>
      </div>
      <div className="space-y-6 container mx-auto min-h-[400px]">
        {isLoader ? (
          [...Array(loadingOrders)].map((_, i) => <OrderCardSkeleton key={i} />)
        ) : orderList && orderList?.order_list && orderList?.order_list?.length > 0 ? orderList?.order_list.map((order, index) => (
          <div onClick={() => navigate(`/myorder/${order.id}`)}
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 cursor-pointer"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 sm:items-center bg-[#185A96] text-white px-1 sm:px-5 py-4 rounded-t-lg whitespace-nowrap">
              <p className="text-[14px] sm:text-[20px] md:text-[22px] xl:text-[25px] font-normal">Order No. {order?.order_id}</p>
              <p className="text-[14px] sm:text-[20px] md:text-[22px] xl:text-[25px] font-normal text-end">Status: {order?.status == 0 ? "Ongoing" : order?.status == 1 ? "Completed" : order?.status == 2 ? "Cancelled" : ""}</p>
            </div>

            {/* Scrollable Details Section */}
            {order?.type == 0 ?
              <div className="px-10 py-4">
                <div className="">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 ">
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">From</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{order?.pickup_location}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">To</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{order?.delivery_location}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">
                        Order Name
                      </p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{order?.order_name}</p>
                    </div>
                    <div>
                      <p className="text-[22px] sm:text-[24px] md:text-[26px] lg:text-[30px] font-bold mt-5 text-[#FF8C01]">
                        Price: ${order?.total_price}
                      </p>
                    </div>
                  </div>

                  {/* Receiver Details */}
                
                  <div className="mt-3">
                    <p className="text-[#FF8C01] text-[22px] md:text-[24px] lg:text-[28px] font-semibold mb-2">
                      Schedule
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 whitespace-nowrap">
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Date</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {(order && order?.date) ? formatDate(order?.date) : null}
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Time</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {order && order?.time && new Date(`1970-01-01T${order?.time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="px-10 py-4">
                <div className="">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 whitespace-nowrap">
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-semibold text-black">Service</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">{order?.service_name}</p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Date</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                        {(order && order?.date) ? formatDate(order?.date) : null}
                      </p>
                    </div>
                    <div>
                      <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Time</p>
                      <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                        {order && order?.time && new Date(`1970-01-01T${order?.time}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Receiver Details */}
                  <div className="mt-3">
                    <p className="text-[#FF8C01] text-[22px] md:text-[24px] lg:text-[28px] font-semibold mb-2">
                      Address Details
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ">
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Name</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {order?.user_address?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">
                          Contact Number
                        </p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">+{order?.user_address?.country_code} {order?.user_address?.phone_no}</p>
                      </div>
                      <div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]  font-semibold text-black">Address</p>
                        <p className="text-[16px] lg:text-[18px] xl:text-[20px] font-normal">
                          {order?.user_address?.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        ))
          :
          (
            !isLoader && orderList?.order_list?.length == 0 && <div className="flex justify-center items-center text-center">
              <img src={notFound} alt="Not Found" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" />
            </div>
          )}
      </div>
      {(orderList && orderList?.totalPages > 1) ?
        <CustomPagination
          count={orderList?.totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
        :
        null}
    </div>
  );
};

export default CurrentOrder;