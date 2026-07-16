
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { imageBaseUrl } from "../utils/apiInstance";
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';
import { useSelector, useDispatch } from "react-redux";
import { get_user_by_id } from "../utils/thunkApis";

const Navbar = ({ toggleSidebar, closeSidebar }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    if (!token) return;
    try {
      const decode = jwtDecode(token);
      const id = decode.id;
      await dispatch(get_user_by_id(id));
      if (user && user?.admin) {
        const { profile_picture, name } = user.admin;
        setImage(`${imageBaseUrl}/${profile_picture}`);
        setName(name);
      }
    } catch (error) {
      // console.log("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, token]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const location = useLocation();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const logout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#185A96",
      cancelButtonColor: "#ed2121",
      confirmButtonText: "Yes, log out!",
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-button',
        cancelButton: 'custom-swal-button'
      }
    });

    if (result.isConfirmed) {
      try {
        localStorage.removeItem("token");
        localStorage.setItem("logoutmessage", "true");
        navigate("/");
        closeDropdown();
      } catch (error) {
        // console.error("Error logging out:", error);
      }
    }
  };

  const pathToTitleMap = {
    "/dashboard": "Dashboard",
    "/privacypolicy": "Privacy Policy",
    "/aboutus": "About Us",
    "/terms&conditions": "Terms & Conditions",
    "/changepassword": "Change Password",
    "/profile": "Profile",
    '/userList': 'Users',
    '/contactUs': 'Contact Us',
    '/productList': "Products",
    '/addProduct': "Add Product",
    '/categoryList': "Categories",
    '/addCategory': "Add Category",
    '/bannerList': "Banners",
    '/addBanner': "Add Banner",
    '/bgImageList': "Background Image",
    '/addBgImage': "Add Background Image",
    '/blogList': "Blogs",
    '/addBlog': "Add Blog",
    '/myEarnings': "My Earnings",
    '/faq': "FAQ",
    '/addFaq': "Add FAQ",
    "/orderList": "Orders",
    "/wallet": "Wallet",
    "/mostDemandedProducts": "Best Sellers",
    "/ratingList": "Ratings",
    "/subAdminList": "Sub Admins",
    "/addSubAdmin": "Add Sub Admin",
    "/serviceList": "Services",
    "/addService": "Add Service",
    "/dummyRatings": "Dummy Ratings",
    "/addDummyRating": "Add Dummy Rating",
    "/howItWork/3": "How It Works Step 1",
    "/howItWork/4": "How It Works Step 2",
    "/howItWork/5": "How It Works Step 3",
    "/howItWork/6": "How It Works Step 4",
    "/homePageAbout": "Home Page Content",
    "/footerContent": "Footer Content",
    "/deliveryCharges": "Delivery Charges",
    "/sendNotification": "Send Notification"
  };

  const currentPath = location.pathname;
  const currentTitle =
    pathToTitleMap[currentPath] ||
    (currentPath.startsWith("/viewUser")
      ? "User Details"
      : currentPath.startsWith("/viewContactUs")
        ? "Contact US Details"
        : currentPath.startsWith("/orderDetails")
          ? "Order Details"
          : currentPath.startsWith("/userOrders")
            ? "Orders"
          : currentPath.startsWith("/productRatings")
            ? "Ratings"
            : currentPath.startsWith("/viewRating")
              ? "Ratings Details"
              : currentPath.startsWith("/viewSubAdmin")
                ? "Sub Admin Details"
                : currentPath.startsWith("/editSubAdmin")
                  ? "Edit Sub Admin"
                  : currentPath.startsWith("/viewService")
                    ? "Service Details"
                    : currentPath.startsWith("/serviceTypes")
                      ? "Service Types"
                      : currentPath.startsWith("/editService")
                        ? "Edit Service"
                        : currentPath.startsWith("/serviceTypeAdd")
                          ? "Add Service Type"
                          : currentPath.startsWith("/serviceTypeDetails")
                            ? "Service Type Details"
                            : currentPath.startsWith("/updateServiceType")
                              ? "Edit Service Type"
                              : currentPath.startsWith("/editDummyRating")
                                ? "Edit Dummy Rating"
                                : currentPath.startsWith("/viewDummyRating")
                                  ? "Rating Details"
                                  : currentPath.startsWith("/productRatings")
                                    ? "Ratings"
                                    : "");


  const handleLinkClick = () => {
    closeSidebar();
  };


  return (
    <nav
      className="navbar navbar-main bg-light navbar-expand-lg px-0 mx-4 mt-3 shadow-dark border-radius-xl position-sticky top-0"
      id="navbarBlur"
      data-scroll="true"
      style={{ zIndex: '100' }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex ">
          {windowWidth < 1360 && (
            <button
              onClick={toggleSidebar}
              id="navbarToggler"
              className="navbar-toggler"
              type="button"
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
              }}
            >
              <i className="fas fa-bars"></i>
            </button>
          )}

          <h2 className="font-weight-bolder mb-0 " id="navbarHeader">{currentTitle}</h2>

        </div>
        <ul className="navbar-nav navbar-right d-flex align-items-center">
          <li className="d-flex align-items-center ms-auto position-relative">
            <h6 className="mb-0" style={{ color: 'black' }}>{user?.admin?.name}</h6>
            <div className="dropdown" ref={dropdownRef}>

              <button
                type="button"
                onClick={toggleDropdown}
                className="nav-link nav-link-lg nav-link-user d-flex align-items-center ms-1"
                style={{ background: "none", border: "none", padding: 0, position: "relative" }}
              >
                <img
                  alt="profile"
                  src={(user && user?.admin && user?.admin?.profile_picture) ? `${imageBaseUrl}/${user?.admin?.profile_picture}` : "user.png"}
                  style={{ height: "50px", width: "50px", cursor: "pointer" }}
                  className="rounded-circle mr-1"
                />
              </button>
              {dropdownOpen && (
                <div
                  className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? "show" : ""
                    }`}
                  style={{
                    backgroundColor: "#fff",
                    position: "absolute",
                    top: "15px",
                    padding: "10px",
                    borderRadius: "0.5rem",
                    minWidth: "130px",
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to="/profile"
                    className="dropdown-item has-icon"
                    style={{ color: '#185A96', fontWeight: '500' }}
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick();
                    }}
                  >
                    <i className="far fa-user me-1" /> Profile
                  </Link>
                  <Link
                    to="/changepassword"
                    className="dropdown-item has-icon"
                    style={{ color: '#185A96', fontWeight: '500' }}
                    onClick={() => {
                      closeDropdown();
                      handleLinkClick();
                    }}
                  >
                    <i className="fas fa-lock me-1" /> Change Password
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="dropdown-item has-icon"
                    style={{ background: "none", border: "none", padding: 0, color: '#FF4500', fontWeight: '500', marginLeft: "6px" }}
                  >
                    <i className="fas fa-sign-out-alt" style={{ marginRight: "2px" }} /> Log out
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

