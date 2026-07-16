import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import "react-loading-skeleton/dist/skeleton.css";
import PrivateRoute from "./utils/PrivateRoute";
import Index from './pages/Index.jsx'
import Navbar from './pages/Navbar.jsx'
import Footer from './components/Footer.jsx'
import History from './pages/History.jsx'
import Login from './pages/Login.jsx'
import Verification from './components/Verification.jsx'
import Signup from './pages/Signup.jsx'
import About from './pages/About.jsx'
import Contact from './components/contact.jsx'
import Privacy from './pages/privacy.jsx'
import Terms from './pages/Terms.jsx'
import Profile from './pages/Profile.jsx'
import Edit from './pages/Edit.jsx'
import CurrentOrder from './pages/CurrentOrder.jsx'
import MyOrder from './pages/MyOrder.jsx'
import Location from './pages/Location'
import Newaddress from './pages/Newaddress'
import Alladdress from './pages/Alladdress'
import Datetime from './pages/Datetime'
import Payment from './pages/Payment'
import Addcard from './pages/AddCard'
import Cardpayment from './pages/CardList'
import Summary from './pages/Summary'
import Notification from './pages/Notification.jsx'
import ScrollToTop from './components/ScrollToTop.js'
import LocationMain from './pages/LocationMain.jsx'
import NewaddressMain from './pages/NewAddressMain.jsx'
import AllAddressMain from './pages/AllAddressMain.jsx'
import DateTimeMain from './pages/DateTimeMain.jsx'
import SummeryMain from './pages/SummeryMain.jsx'
import PageNotFound from './pages/PageNotFound.jsx';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from 'react-hot-toast';

import { onMessageListener } from './firebase/NotificationController';

const App = () => {
  const navigate = useNavigate()
  onMessageListener()
    .then((payload) => {
      // console.log("Foreground message received:", payload);
      const type = payload?.data?.type;

      if (type === "order_notification") {
        navigate("/current-order");
      } else {
        navigate("/notification");
      }

    })
    .catch((err) => {
      // console.error("Error with onMessageListener", err)
    });

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              fontSize: '14px',
              background: "#185A96",
              color: "#fff",
            },
          },
          error: {
            style: {
              fontSize: '14px',
              background: "#ff4d4d",
              color: "#fff",
            },
          },
        }}
      />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/history' element={<PrivateRoute element={<History />} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verification' element={<Verification />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/profile' element={<PrivateRoute element={<Profile />} />} />
        <Route path='/edit' element={<PrivateRoute element={<Edit />} />} />
        <Route path='/current-order' element={<PrivateRoute element={<CurrentOrder />} />} />
        <Route path='/myorder/:id' element={<PrivateRoute element={<MyOrder />} />} />
        <Route path='/location' element={<PrivateRoute element={<Location />} />} />
        <Route path='/Newaddress' element={<PrivateRoute element={<Newaddress />} />} />
        <Route path='/address-list' element={<PrivateRoute element={<Alladdress />} />} />
        <Route path='/datetime' element={<PrivateRoute element={<Datetime />} />} />
        <Route path='/Payment' element={<PrivateRoute element={<Payment />} />} />
        <Route path='/AddCard' element={<Elements stripe={stripePromise}><PrivateRoute element={<Addcard />} /></Elements>} />
        <Route path='/CardPayment' element={<Elements stripe={stripePromise}><PrivateRoute element={<Cardpayment />} /></Elements>} />
        <Route path='/Summary' element={<Elements stripe={stripePromise}><PrivateRoute element={<Summary />} /></Elements>} />
        <Route path='/notification' element={<PrivateRoute element={<Notification />} />} />
        <Route path='/location-errands' element={<PrivateRoute element={<LocationMain />} />} />
        <Route path='/newaddress-errands' element={<PrivateRoute element={<NewaddressMain />} />} />
        <Route path='/alladdress-errands' element={<PrivateRoute element={<AllAddressMain />} />} />
        <Route path='/datetime-errands' element={<PrivateRoute element={<DateTimeMain />} />} />
        <Route path='/summary-errand' element={<PrivateRoute element={<SummeryMain />} />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
