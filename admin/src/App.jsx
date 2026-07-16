
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ScrollToTop from './utils/ScrollToTop';
import Login from "./admin/Login";
import Layout from "./common/Layout";
import Dashboard from "./Dashboard";
import Profile from "./admin/Profile";
import Privacy from "./cms/Privacy";
import AboutUs from "./cms/AboutUs";
import Terms from "./cms/Terms";
import ChangePassword from "./admin/ChangePassword";
import AddService from './service/AddService';
import ViewService from './service/ViewService'
import EditService from './service/EditService';
import ServiceList from './service/ServiceList';
import AddServiceType from './service/AddServiceType';
import ViewServiceType from './service/ViewServiceType'
import EditServiceType from './service/EditServiceType';
import ServiceTypes from './service/ServiceTypes';
import UserList from './user/UserList';
import UserView from './user/UserView';
import ContactUs from './contactUs/ContactUs';
import ViewContactUs from './contactUs/ViewContactUs';
import OrderList from './order/OrderList';
import OrderDetails from './order/OrderDetails';
import UserOrders from './order/UserOrders';
import Wallet from './Wallet/Wallet';
import HowItWork from './cms/HowItWork';

import HomePageAbout from './cms/HomePageAbout';
import FooterContent from './cms/FooterContent';

import DummyRatings from './dummyRatings/dummyRatings';
import AddDummyRating from './dummyRatings/AddDummyRating';
import ViewDummyRating from './dummyRatings/ViewDummyRating';
import EditDummyRating from './dummyRatings/EditDummyRating';
import SubAdminList from './subAdmin/SubAdminList';
import ViewSubAdmin from './subAdmin/ViewSubAdmin';
import EditSubAdmin from './subAdmin/EditSubAdmin';
import AddSubAdmin from './subAdmin/AddSubAdmin';
import SendNotification from './sendNotification/SendNotification';
import DeliveryCharges from './deliveryCharges/DeliveryCharges';
const App = () => {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

            <Route path="/privacypolicy" element={<PrivateRoute element={<Privacy />} />} />
            <Route path="/aboutus" element={<PrivateRoute element={<AboutUs />} />} />
            <Route path="/terms&conditions" element={<PrivateRoute element={<Terms />} />} />
            <Route path="/howItWork/:type" element={<PrivateRoute element={<HowItWork />} />} />
            <Route path="/homePageAbout" element={<PrivateRoute element={<HomePageAbout />} />} />
            <Route path="/footerContent" element={<PrivateRoute element={<FooterContent />} />} />

            <Route path="/changepassword" element={<PrivateRoute element={<ChangePassword />} />} />

            <Route path="/sendNotification" element={<PrivateRoute element={<SendNotification />} />} />


            <Route path="/serviceList" element={<PrivateRoute element={<ServiceList />} />} />
            <Route path="/viewService/:id" element={<PrivateRoute element={<ViewService />} />} />
            <Route path="/editService/:id" element={<PrivateRoute element={<EditService />} />} />
            <Route path="/addService" element={<PrivateRoute element={<AddService />} />} />
            <Route path="/serviceTypes/:serviceId" element={<PrivateRoute element={<ServiceTypes />} />} />
            <Route path="/serviceTypeDetails" element={<PrivateRoute element={<ViewServiceType />} />} />
            <Route path="/updateServiceType/:id" element={<PrivateRoute element={<EditServiceType />} />} />
            <Route path="/serviceTypeAdd/:serviceId" element={<PrivateRoute element={<AddServiceType />} />} />
            <Route path="/dummyRatings" element={<PrivateRoute element={<DummyRatings />} />} />
            <Route path="/addDummyRating" element={<PrivateRoute element={<AddDummyRating />} />} />
            <Route path="/viewDummyRating/:id" element={<PrivateRoute element={<ViewDummyRating />} />} />
            <Route path="/editDummyRating/:id" element={<PrivateRoute element={<EditDummyRating />} />} />

            <Route path="/addSubAdmin" element={<PrivateRoute element={<AddSubAdmin />} />} />
            <Route path="/subAdminList" element={<PrivateRoute element={<SubAdminList />} />} />
            <Route path="/viewSubAdmin/:id" element={<PrivateRoute element={<ViewSubAdmin />} />} />
            <Route path="/editSubAdmin/:id" element={<PrivateRoute element={<EditSubAdmin />} />} />

            <Route path="/userList" element={<PrivateRoute element={<UserList />} />} />
            <Route path="/viewUser/:id" element={<PrivateRoute element={<UserView />} />} />
            <Route path="/contactUs" element={<PrivateRoute element={<ContactUs />} />} />
            <Route path="/viewContactUs/:id" element={<PrivateRoute element={<ViewContactUs />} />} />
            <Route path="/orderList" element={<PrivateRoute element={<OrderList />} />} />
            <Route path="/orderDetails/:id" element={<PrivateRoute element={<OrderDetails />} />} />
            <Route path="/userOrders/:id" element={<PrivateRoute element={<UserOrders />} />} />
            <Route path="/wallet" element={<PrivateRoute element={<Wallet />} />} />
            <Route path="/deliveryCharges" element={<PrivateRoute element={<DeliveryCharges />} />} />


          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
