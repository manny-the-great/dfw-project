import React, { useState, useEffect } from "react";
import { header, logo } from "../common/common-assets/assets-images";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_dashboard_content, get_user_by_id, get_unread_notification_count } from "../utils/thunkApis";
import { CustomLoader } from "../utils/react-loader/loader";
import { axiosInstance } from "../utils/axios.config";
import { getLocalStorageData } from "../utils/local-storage";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const AxiosInstance = axiosInstance();
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [userData] = useState(() => getLocalStorageData("userData"));
  const [userLoader, setUserLoader] = useState(false);
  const userDetails = useSelector((state) => state.users.user);
  const notification_count = useSelector((state) => state.users.unread_notification_count);

  const fetchData = async () => {
    setIsLoader(true);
    try {
      await dispatch(get_dashboard_content());
    } catch (error) {
      // console.log("Error fetching terms&conditions:", error);
    } finally {
      setIsLoader(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const fetchUserData = async () => {
    setUserLoader(true);
    try {
      await dispatch(get_user_by_id(userData.id));
    } catch (error) {
      // console.log("Error fetching terms&conditions:", error);
    } finally {
      setUserLoader(false);
    }
  };
  useEffect(() => {
    if (userData?.id) {
      fetchUserData();
    }
  }, [userData?.id]);

  useEffect(() => {
    if (userData?.id) {
      dispatch(get_unread_notification_count());
    }
  }, [dispatch, userData?.id]);

  const handleMarkAsRead = async () => {
    try {
      await AxiosInstance.put('/user/markAllAsRead');
      dispatch(get_unread_notification_count());
      navigate('/notification');
    } catch (error) {
      // console.log(error);
    }
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const errandsAllowedPaths = [
      "/location-errands",
      "/alladdress-errands",
      "/newaddress-errands",
      "/datetime-errands",
      "/summary-errand"
    ];
    const pickupAllowedPaths = [
      "/location",
      "/address-list",
      "/newaddress",
      "/datetime",
      "/Payment",
      "/Cardpayment",
      "/AddCard",
      "/Summary",
    ];
    if (!errandsAllowedPaths.includes(location.pathname)) {
      sessionStorage.removeItem("serviceData");
      sessionStorage.removeItem("selectedAddress");
      sessionStorage.removeItem("schedule");
    }
    if (!pickupAllowedPaths.includes(location.pathname)) {
      sessionStorage.removeItem("pickupServiceData");
      sessionStorage.removeItem("productPrice");
      sessionStorage.removeItem("selectedCard");
      sessionStorage.removeItem("selectedUserAddress");
    }
  }, [location.pathname]);

  return (
    <>
      {isLoader &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <nav className="shadow-sm">
        <div className="flex items-center justify-between container mx-auto py-4 px-4 md:px-0">

          {/* Left: Logo */}
          <div className="flex items-center">
            <img src={logo} alt="DFW Errands" className="h-[100px] w-[132px]" />
          </div>

          {/* Desktop Menu */}
          <div className="relative hidden md:flex items-center space-x-20">
            <Link
              to="/"
              className={`${isActive("/") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black hover:text-[#185A96]"} font-medium`}
            >
              Home
            </Link>
            {userDetails && userDetails?.role == 2 && userDetails?.otp_verified == 1 &&
              <Link
                to="/current-order"
                className={`${isActive("/current-order") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black hover:text-[#185A96]"} font-medium`}
              >
                History
              </Link>
            }
            <Link
              to="/about"
              className={`${isActive("/about") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black hover:text-[#185A96]"} font-medium`}
            >
              About Us
            </Link>

            {/* Conditional Rendering */}
            {(userDetails && userDetails?.role == 2 && userDetails?.otp_verified == 1) ? (
              <div className="flex items-center space-x-8">
                <FaUserCircle
                  size={26}
                  className={
                    `${isActive("/profile")
                      ? "text-[#184670]"
                      : "text-black cursor-pointer hover:text-[#184670]"}`
                  }
                  onClick={() => handleNavigate("/profile")}
                />
                <div onClick={handleMarkAsRead} className="relative cursor-pointer">
                  <FiBell
                    size={26}
                    className={
                      `${isActive("/notification")
                        ? "text-[#184670]"
                        : "text-black cursor-pointer hover:text-[#184670]"}`
                    }
                  />
                  <span className="absolute top-0 right-0 bg-[#185A96] text-white text-[10px] px-[4px] rounded-full font-bold">
                    {notification_count <= 9 ? notification_count : notification_count > 9 ? "9+" : "0"}
                  </span>
                </div>
              </div>

            ) : (!userLoader && (
              <div className="flex items-center space-x-4">
                {/* Login Button */}
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#185A96] text-white font-medium px-7 py-2 rounded-lg hover:bg-[#184670] transition cursor-pointer"
                >
                  Login
                </button>

                {/* Vertical Line */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Signup Button */}
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-[#185A96] font-medium px-7 py-2 rounded-lg border border-[#185A96] hover:bg-[#185A96] hover:text-white transition cursor-pointer"
                >
                  Signup
                </button>
              </div>
            ))
            }
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <FiX size={28} className="text-[#185A96]" />
              ) : (
                <FiMenu size={28} className="text-[#185A96]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#EFF8FF] shadow-md flex flex-col items-center space-y-5 py-5">

            <Link
              to="/"
              className={`${isActive("/") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black"} font-medium`}
            >
              Home
            </Link>
            {userDetails && userDetails?.role == 2 && userDetails?.otp_verified == 1 &&
              <Link
                to="/current-order"
                className={`${isActive("/current-order") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black"} font-medium`}
              >
                History
              </Link>
            }

            <Link
              to="/about"
              className={`${isActive("/about") ? "text-[#185A96] font-semibold border-b-2 border-[#185A96]" : "text-black"} font-medium`}
            >
              About Us
            </Link>

            {(userDetails && userDetails?.role == 2 && userDetails?.otp_verified == 1) ? (
              <div className="flex items-center space-x-6">
                <FaUserCircle
                  size={22}
                  className="text-black cursor-pointer hover:text-[#184670]"
                  onClick={() => handleNavigate("/profile")}
                />
                <div onClick={handleMarkAsRead} className="relative cursor-pointer">
                  <FiBell
                    size={22}
                    className="text-black cursor-pointer hover:text-[#184670]"
                  />
                  <span className="absolute top-0 right-0 bg-[#185A96] text-white text-[8px] px-[4px] rounded-full font-bold">
                    {notification_count <= 9 ? notification_count : notification_count > 9 ? "9+" : "0"}
                  </span>
                </div>
              </div>

            ) : (!userLoader && (
              <div className="flex items-center space-x-4">

                {/* Login Button */}
                <button
                  onClick={() => handleNavigate("/login")}
                  className="bg-[#185A96] text-white font-medium px-7 py-2 rounded-lg hover:bg-[#184670] transition cursor-pointer"
                >
                  Login
                </button>

                {/* Vertical Line */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Signup Button */}
                <button
                  onClick={() => handleNavigate("/signup")}
                  className="bg-white text-[#185A96] font-medium px-7 py-2 rounded-lg border border-[#185A96] hover:bg-[#185A96] hover:text-white transition cursor-pointer"
                >
                  Signup
                </button>

              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
