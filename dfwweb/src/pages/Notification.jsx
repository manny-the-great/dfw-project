import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { get_notifications } from "../utils/thunkApis";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
import { CustomLoader } from '../utils/react-loader/loader';
import DeleteNotificationModal from '../components/DeleteNotificationModal';
import { notFound, favicon } from "../common/common-assets/assets-images";
import { NotificationSkeleton } from '../components/SkeletonLoader';
import CommonBanner from "../components/CommonBanner";
const Notification = () => {


  const navigate = useNavigate();
  const AxiosInstance = axiosInstance();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.users.notificationList);
  const [showNoData, setShowNoData] = useState(false);

  const limit = 20;

  const [page, setPage] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const observer = React.useRef();

  const lastNotificationRef = React.useCallback((node) => {
    if (isLoader) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoader, hasMore]);

  const fetchData = async (pageNumber) => {
    setIsLoader(true);
    try {
      const res = await dispatch(get_notifications({ currentPage: pageNumber, limit }));
      const list = res?.payload?.list || [];
      const total = res?.payload?.total || 0;

      if ((pageNumber * limit) >= total) {
        setHasMore(false);
      }

      if (pageNumber === 1) {
        await AxiosInstance.put('/user/markAllAsRead');
      }
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleDelete = async () => {
    setIsLoader(true);
    try {
      await AxiosInstance.delete(`/user/clear_all_notifications`);
      toast.success("Notifications cleared successfully");
      setPage(1);
      setHasMore(true);
      fetchData(1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setOpenModal(false);
      setIsLoader(false);
    }
  };


  useEffect(() => {
    if (!isLoader && notifications.length === 0) {
      const timer = setTimeout(() => {
        setShowNoData(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowNoData(false);
    }
  }, [isLoader, notifications]);

  const handleNavigation = (type) => {
    if (type == 1) {
      navigate("/current-order");
    } else if (type == 2) {
      navigate("#");
    }
  }

  const handleClose = () => {
    setOpenModal(false)
  }
  return (
    <div className='relative'>
      <CommonBanner title="Notifications" />
      {(isLoader && notifications?.length > 0) &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <div className='w-full px-[30px] py-10 pb-20 sm:px-[70px] 2xl:px-[150px] min-h-[350px] lg:min-h-[600px]'>
        {(notifications && notifications?.length > 0) ?
          <p
            onClick={() => setOpenModal(true)}
            className='text-[14px] lg:text-[18px] text-[#F11515]  font-bold flex justify-end underline cursor-pointer'>
            Clear All
          </p>
          :
          null
        }
        {isLoader && notifications?.length === 0 ? (
          <>
            {[...Array(5)].map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </>
        ) : notifications && notifications?.length > 0 ? notifications.map((notification, index) => (
          <div
            key={index}
            ref={lastNotificationRef}
            onClick={() => handleNavigation(notification?.navigation_type)}
            className={`px-5 xl:px-10 py-5 flex flex-col sm:flex-row border-1 border-[#DCDCDC] rounded-[10px] gap-5 w-full h-full  justify-center items-start my-10 ${notification?.navigation_type == 1 && "cursor-pointer"}`}>
            <div className=''>
              <img src={favicon} className=" w-[60px] h-[60px] rounded-full object-cover" alt="" />
            </div>
            <div className='w-full space-y-2'>
              <div className=' flex justify-between w-full'>
                <p className='text-[16px] lg:text-[18px] font-bold'>{notification?.title}</p><p className='text-[#929090] text-[12px] lg:text-[14px] xxl:text-[16px] font-normal'>
                  {new Date(notification?.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <p className='text-[#707070] text-[12px] lg:text-[14px] xxl:text-[16px] font-normal'>{notification?.description}</p>
            </div>
          </div>
        ))
          :
          (
            !isLoader && showNoData && <div className="flex justify-center items-center text-center">
              <img src={notFound} alt="Not Found" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" />
            </div>
          )
        }
      </div>
      {openModal && (
        <DeleteNotificationModal handleDelete={handleDelete} handleClose={handleClose} isLoader={isLoader} />
      )}
    </div>
  )
}

export default Notification
