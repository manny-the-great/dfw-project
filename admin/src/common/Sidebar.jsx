
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';



const Sidebar = ({ handleLinkClick }) => {
  const userDetails = useSelector((state) => state.users.user);
  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: "dashboard"
    },

    // Sub Admin List
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.sub_admin_view))
        ? [{
          to: "/subAdminList",
          label: "Sub Admins",
          icon: "admin_panel_settings",
          activePaths: ["/viewSubAdmin", "/editSubAdmin", "/addSubAdmin"]
        }]
        : []
    ),

    // Users
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.user_view))
        ? [{
          to: "/userList",
          label: "Users",
          icon: "group",
          activePaths: ["/viewUser", "/userOrders"]
        }]
        : []
    ),

    // Orders
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.order_view))
        ? [{
          to: "/orderList",
          label: "Orders",
          icon: "shopping_cart",
          activePaths: ["/orderDetails"]
        }]
        : []
    ),

    // Services
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.service_view))
        ? [{
          to: "/serviceList",
          label: "Services",
          icon: "miscellaneous_services",
          activePaths: [
            "/editService",
            "/addService",
            "/viewService",
            "/serviceTypes",
            "/serviceTypeAdd",
            "/serviceTypeDetails",
            "/updateServiceType"
          ]
        }]
        : []
    ),

    // Send Notification
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.notification_permit))
        ? [{
          to: "/sendNotification",
          label: "Send Notification",
          icon: "send"
        }]
        : []
    ),

    // Dummy Ratings
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.dummy_rating_view))
        ? [{
          to: "/dummyRatings",
          label: "Dummy Ratings",
          icon: "star_rate",
          activePaths: ["/viewDummyRating", "/addDummyRating", "/editDummyRating"]
        }]
        : []
    ),

    // Delivery Charges
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.delivery_charges_view))
        ? [{
          to: "/deliveryCharges",
          label: "Delivery Charges",
          icon: "local_shipping"
        }]
        : []
    ),
    // Wallet
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.wallet_view))
        ? [{
          to: "/wallet",
          label: "Wallet",
          icon: "account_balance_wallet"
        }]
        : []
    ),

    // Contact Us
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.contact_us_view))
        ? [{
          to: "/contactUs",
          label: "Contact Us",
          icon: "mail_outline",
          activePaths: ["/viewContactUs"]
        }]
        : []
    ),

    // About Us
    ...(
      ((userDetails && userDetails?.admin?.role == 0) || (userDetails && userDetails?.admin?.role == 1 && userDetails?.admin?.cms_view))
        ? [{
          to: "/aboutus",
          label: "About Us",
          icon: "info"
        },
        {
          to: "/privacypolicy",
          label: "Privacy Policy",
          icon: "security"
        },
        {
          to: "/terms&conditions",
          label: "Terms & Conditions",
          icon: "gavel"
        },
        {
          to: "/howItWork/3",
          label: "How It Works Step 1",
          icon: "support_agent"
        },
        {
          to: "/howItWork/4",
          label: "How It Works Step 2",
          icon: "support_agent"
        },
        {
          to: "/howItWork/5",
          label: "How It Works Step 3",
          icon: "support_agent"
        },
        {
          to: "/howItWork/6",
          label: "How It Works Step 4",
          icon: "support_agent"
        },
        {
          to: "/homePageAbout",
          label: "Home Page Content",
          icon: "description"
        },
        {
          to: "/footerContent",
          label: "Footer Content",
          icon: "web"
        }]
        : []
    ),
  ];
  const renderNavItem = ({ to, label, icon, activePaths = [] }) => {
    const isActivePath = () =>
      window.location.pathname.startsWith(to) ||
      activePaths.some((path) => window.location.pathname.startsWith(path));

    return (
      <li className="nav-item" key={to}>
        <NavLink
          style={{ color: "black" }}
          className={({ isActive }) =>
            `nav-link ${isActive || isActivePath() ? "active bg-info" : ""
            }`
          }

          to={to}
          onClick={handleLinkClick}
        >
          <div className="text-center me-2 d-flex align-items-center justify-content-center" style={{ color: "#185A96" }}>
            <i className="material-icons opacity-10">{icon}</i>
          </div>
          <span className="nav-link-text ms-1">{label}</span>
        </NavLink>

      </li>
    );
  };

  return (
    <aside
      className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 shadow-dark "
      style={{ backgroundColor: 'white' }}
      id="sidenav-main"
    >
      <div className="sidenav-header">
        <i
          className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
        ></i>

        <NavLink className="navbar-brand m-0" to="/dashboard" style={{ height: "300px" }}>
          <div style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '8px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            display: 'inline-block',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <img
              src="/logo.png"
              className=""
              alt="main_logo"
              style={{ height: '80px', width: "160px" }}
            />
          </div>
        </NavLink>

      </div>
      <hr className="horizontal light mt-5 mb-2" />
      <div className="collapse navbar-collapse w-auto sidebar-scroll" id="sidenav-collapse-main" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
        <ul className="navbar-nav">
          {menuItems.map(renderNavItem)}
        </ul>
      </div>

    </aside>
  );
};

export default Sidebar;