import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import apiInstance from './utils/apiInstance';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const userDetails = useSelector((state) => state.users.user);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(0);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setUserChartData] = useState([]);
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get('/dashboard_data');
      setDashboardData(response.data?.data);
    } catch (error) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const loginmessage = localStorage.getItem('loginmessage');
  useEffect(() => {
    if (loginmessage) {
      toast.success('Login successful');
      localStorage.removeItem('loginmessage');
    }
  }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiInstance.get('/getMonthlyUserStats');
        const formattedUser = res.data.data.map((item, idx) => ({
          month: monthLabels[idx],
          users: item.user,
        }));
        const formattedBooking = res.data.data.map((item, idx) => ({
          month: monthLabels[idx],
          orders: item.order,
        }));

        setUserChartData(formattedUser);
        setBookingChartData(formattedBooking);
      } catch (error) {
        setError("Failed to fetch user stats");
      }
    };
    fetchStats();
  }, []);

  const userPermission = userDetails?.admin?.role == 0 || userDetails?.admin?.user_view == 1;
  const subAdminPermission = userDetails?.admin?.role == 0 || userDetails?.admin?.sub_admin_view == 1;
  const servicePermission = userDetails?.admin?.role == 0 || userDetails?.admin?.service_view == 1;
  const orderPermission = userDetails?.admin?.role == 0 || userDetails?.admin?.order_view == 1;

  if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;
  // If loading initial user auth or checking permission
  if (!userDetails) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (userDetails?.admin?.role != 0 && !userDetails?.admin?.dashboard_view_permission) {
    return (
      <div style={{ height: "80vh" }} className="d-flex justify-content-center align-items-center flex-column">
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#f1f1f1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <i className="material-icons" style={{ fontSize: 60, color: "#b3b3b3" }}>lock</i>
        </div>

        <h2 style={{ color: "#333", fontWeight: 600 }}>Access Restricted</h2>
        <p style={{ color: "#777", maxWidth: 350, textAlign: "center", marginTop: 10 }}>
          You don’t have permission to view this dashboard.
          Please contact the admin for access.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
            <Link to={userPermission?"/userList":"#"}>
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">group</i>
                  </div>
                  <div className="text-end">
                    <h4 style={{ color: 'black' }}>Users</h4>
                    <h4 style={{ color: 'black' }}>{dashboardData?.user_count || 0}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
            <Link to={subAdminPermission?"/subAdminList":"#"}>
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">admin_panel_settings</i>
                  </div>
                  <div className="text-end">
                    <h4 style={{ color: 'black' }}>Sub Admin</h4>
                    <h4 style={{ color: 'black' }}>{dashboardData?.sub_admin_count || 0}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>


          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
            <Link to={servicePermission?"/serviceList":"#"}>
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">category</i>
                  </div>
                  <div className="text-end">
                    <h4 style={{ color: 'black' }}>Services</h4>
                    <h4 style={{ color: 'black' }}>{dashboardData?.service_count || 0}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
            <Link to={orderPermission?"/orderList":"#"}>
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">shopping_cart</i>
                  </div>
                  <div className="text-end">
                    <h4 style={{ color: 'black' }}>Orders</h4>
                    <h4 style={{ color: 'black' }}>{dashboardData?.order_count || 0}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>

      <div className="my-4 bg-white p-4 rounded shadow-sm">
        <h4 className="text-center mb-4">User Data</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="my-5 bg-white p-4 rounded shadow-sm">
        <h4 className="text-center mb-4">Orders</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} stroke="#e0e0e0" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1000,
          }}
        >
          <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


