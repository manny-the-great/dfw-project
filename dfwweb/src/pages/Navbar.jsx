import React, { useState, useEffect } from "react";
import { logo } from "../common/common-assets/assets-images";
import { FiMenu, FiX, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_dashboard_content, get_user_by_id, get_unread_notification_count } from "../utils/thunkApis";
import { CustomLoader } from "../utils/react-loader/loader";
import { axiosInstance } from "../utils/axios.config";
import { getLocalStorageData } from "../utils/local-storage";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Driver Onboarding", path: "/driver-onboarding" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  useEffect(() => { fetchData(); }, [dispatch]);

  const fetchUserData = async () => {
    setUserLoader(true);
    try {
      await dispatch(get_user_by_id(userData.id));
    } catch (error) {
      // console.log("Error fetching user:", error);
    } finally {
      setUserLoader(false);
    }
  };
  useEffect(() => {
    if (userData?.id) fetchUserData();
  }, [userData?.id]);

  useEffect(() => {
    if (userData?.id) dispatch(get_unread_notification_count());
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

  // Clear session storage on route change
  useEffect(() => {
    const errandsAllowedPaths = ["/location-errands", "/alladdress-errands", "/newaddress-errands", "/datetime-errands", "/summary-errand"];
    const pickupAllowedPaths = ["/location", "/address-list", "/newaddress", "/datetime", "/Payment", "/Cardpayment", "/AddCard", "/Summary"];
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

  const isLoggedIn = userDetails && userDetails?.role == 2 && userDetails?.otp_verified == 1;

  return (
    <>
      {isLoader && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      )}

      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logo} alt="DFW Errands" className="h-[60px] w-auto" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative text-sm font-medium transition-colors duration-200 pb-1
                    ${isActive(path)
                      ? "text-[#185A96] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#185A96] after:rounded-full"
                      : "text-gray-600 hover:text-[#185A96]"
                    }`}
                >
                  {label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  to="/current-order"
                  className={`relative text-sm font-medium transition-colors duration-200 pb-1
                    ${isActive("/current-order")
                      ? "text-[#185A96] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#185A96] after:rounded-full"
                      : "text-gray-600 hover:text-[#185A96]"
                    }`}
                >
                  History
                </Link>
              )}
            </div>

            {/* Desktop Right — Auth Buttons or User Icons */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className={`p-2 rounded-full transition-colors ${isActive("/profile") ? "text-[#185A96]" : "text-gray-500 hover:text-[#185A96] hover:bg-blue-50"}`}
                  >
                    <FaUserCircle size={24} />
                  </button>
                  <button onClick={handleMarkAsRead} className="relative p-2 rounded-full text-gray-500 hover:text-[#185A96] hover:bg-blue-50 transition-colors">
                    <FiBell size={24} />
                    {notification_count > 0 && (
                      <span className="absolute top-1 right-1 bg-[#185A96] text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold leading-none px-[3px]">
                        {notification_count > 9 ? "9+" : notification_count}
                      </span>
                    )}
                  </button>
                </>
              ) : (!userLoader && (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-medium text-[#185A96] px-5 py-2 rounded-lg border border-[#185A96] hover:bg-[#185A96] hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-sm font-medium text-white bg-[#185A96] px-5 py-2 rounded-lg hover:bg-[#134978] transition-colors duration-200 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-[#185A96] hover:bg-blue-50 transition-colors"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(path) ? "bg-blue-50 text-[#185A96]" : "text-gray-700 hover:bg-gray-50 hover:text-[#185A96]"}`}
              >
                {label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                to="/current-order"
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive("/current-order") ? "bg-blue-50 text-[#185A96]" : "text-gray-700 hover:bg-gray-50 hover:text-[#185A96]"}`}
              >
                History
              </Link>
            )}

            <div className="mt-3 border-t border-gray-100 pt-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-4 px-3">
                  <button onClick={() => handleNavigate("/profile")} className="text-gray-500 hover:text-[#185A96] transition-colors">
                    <FaUserCircle size={24} />
                  </button>
                  <button onClick={handleMarkAsRead} className="relative text-gray-500 hover:text-[#185A96] transition-colors">
                    <FiBell size={24} />
                    {notification_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#185A96] text-white text-[9px] min-w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold px-[2px]">
                        {notification_count > 9 ? "9+" : notification_count}
                      </span>
                    )}
                  </button>
                </div>
              ) : (!userLoader && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="w-full text-sm font-medium text-[#185A96] py-2.5 rounded-lg border border-[#185A96] hover:bg-[#185A96] hover:text-white transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate("/signup")}
                    className="w-full text-sm font-medium text-white bg-[#185A96] py-2.5 rounded-lg hover:bg-[#134978] transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
