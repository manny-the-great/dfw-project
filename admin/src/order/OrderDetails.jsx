import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const OrderDetails = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orderDetails, setOrderDetails] = useState(null);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [sendNotification, setSendNotification] = useState(true);
    const [sendEmail, setSendEmail] = useState(true);

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await apiInstance.get(`/view_order/${id}`);
            setOrderDetails(response.data?.orderDetails || "");
        } catch (error) {
            setError("An error occurred while fetching order details...");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            return toast.error("Both title and message are required");
        }
        if (!sendNotification && !sendEmail) {
            return toast.error("Please select at least one option: Notification or Email");
        }
        try {
            await apiInstance.post('/sendNotification', {
                user_ids: [orderDetails?.buyer?.id],
                title,
                message,
                sendToAll: 0,
                send_notification: sendNotification,
                send_email: sendEmail,
                order_id: id
            });
            toast.success("Notification/email sent successfully!");
            setTitle("");
            setMessage("");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send");
        }
    };

    const canUpdate = userDetails?.admin?.role == 0 || userDetails?.admin?.order_update == 1;
    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.order_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

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
        <>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg">
                                    <h6 className="text-white text-capitalize ps-3">
                                        Order Details
                                    </h6>
                                </div>
                            </div>

                            <div className="card-body">
                                {(!orderDetails || loading) ? (
                                    <p>Loading...</p>
                                ) : (
                                    <>
                                        <h5 className="mb-3">Order Details</h5>

                                        {/* ================== ORDER INFORMATION ================== */}
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <p><strong>Order ID:</strong> {orderDetails?.order_id}</p>
                                                {orderDetails?.type == 0 &&
                                                    <p><strong>Order Name: </strong> {orderDetails?.order_name}</p>
                                                }
                                                <p><strong>Status: </strong>
                                                    {orderDetails?.status === 0 ? "Ongoing" :
                                                        orderDetails?.status === 1 ? "Delivered" :
                                                            "Cancelled"}
                                                </p>
                                                <p><strong>Scheduled Date: </strong>
                                                    {/* {orderDetails && orderDetails?.date && formatDate(orderDetails?.date)} */}
                                                    {orderDetails && orderDetails?.utc_date}
                                                </p>
                                                <p><strong>Scheduled Time: </strong>
                                                    {orderDetails && orderDetails?.time && new Date(`1970-01-01T${orderDetails?.time}`).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}
                                                </p>
                                                {orderDetails?.type == 0 ?
                                                    <>
                                                        <p><strong>Scheduled UTC Date: </strong>
                                                            {orderDetails && orderDetails?.utc_date}
                                                        </p>
                                                        <p><strong>Scheduled UTC Time: </strong>
                                                            {orderDetails && orderDetails?.utc_time && new Date(`1970-01-01T${orderDetails?.utc_time}`).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })}
                                                        </p>
                                                    </>
                                                    : null}
                                            </div>
                                            {orderDetails?.type == 0 &&
                                                <div className="col-md-6">
                                                    <p><strong>Store Name:</strong> {orderDetails?.store_name || "N/A"}</p>
                                                    <p><strong>Total Price:</strong> ${orderDetails?.total_price.toFixed(2)}</p>
                                                    <p><strong>Delivery Fee:</strong> ${orderDetails?.delivery_fee.toFixed(2)}</p>
                                                    <p><strong>Product Price:</strong> ${orderDetails?.product_price.toFixed(2)}</p>
                                                    <p><strong>Prepaid:</strong> {orderDetails?.is_order_prepaid ? "Yes" : "No"}</p>
                                                    <p><strong>Service:</strong> {orderDetails?.type === 0 ? "Pickup Service" : "Other Errand"}</p>
                                                </div>
                                            }
                                            {orderDetails?.type == 1 &&
                                                <div className="col-md-6">
                                                    <p><strong>Service:</strong> {orderDetails?.service_name}</p>
                                                    <p><strong>Service Description:</strong> {orderDetails?.service_description}</p>
                                                    <p><strong>Scheduled UTC Date: </strong>
                                                        {orderDetails && orderDetails?.utc_date}
                                                    </p>
                                                    <p><strong>Scheduled UTC Time: </strong>
                                                        {orderDetails && orderDetails?.utc_time && new Date(`1970-01-01T${orderDetails?.utc_time}`).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })}
                                                    </p>
                                                </div>
                                            }
                                        </div>

                                        <hr />

                                        <h5 className="mb-3">Buyer Information</h5>
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <p><strong>Name:</strong> {orderDetails?.buyer?.name}</p>
                                                <p><strong>Email:</strong> {orderDetails?.buyer?.email}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Phone No.:</strong> +{orderDetails?.buyer?.country_code} {orderDetails?.buyer?.phone_no}</p>
                                            </div>
                                        </div>

                                        <hr />

                                        {orderDetails?.type == 0 &&
                                            <>
                                                <h5 className="mb-3">Pickup Location Details</h5>
                                                <div className="row mb-4">
                                                    <div className="col-md-6">
                                                        <p><strong>Pickup Location:</strong> {orderDetails?.pickup_location}</p>

                                                    </div>
                                                </div>

                                                <hr />

                                                <h5 className="mb-3">Delivery Location Details</h5>
                                                <div className="row mb-4">
                                                    <div className="col-md-6">
                                                        <p><strong>Delivery Location:</strong> {orderDetails?.delivery_location}</p>
                                                    </div>
                                                </div>

                                                <hr />
                                            </>
                                        }


                                        {orderDetails?.user_address ?
                                            <>
                                                <h5 className="mb-3">User Address</h5>
                                                <div className="row mb-4">
                                                    <div className="col-md-6">
                                                        <p><strong>Name:</strong> {orderDetails?.user_address?.name}</p>
                                                        <p><strong>Phone No.:</strong> +{orderDetails?.user_address?.country_code} {orderDetails?.user_address?.phone_no}</p>
                                                        <p><strong>City:</strong> {orderDetails?.user_address?.city || "N/A"}</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p><strong>Apartment No.:</strong> {orderDetails?.user_address?.apartment_no || "N/A"}</p>
                                                        <p><strong>Address:</strong> {orderDetails?.user_address?.location || "N/A"}</p>
                                                    </div>
                                                </div>

                                            </>
                                            : null}
                                        <hr />


                                        {orderDetails?.status == 0 &&
                                            <div>
                                                <h5 className="mb-3">Current Order Location</h5>

                                                <div className="row mb-4">
                                                    <div className="col-md-6">
                                                        <p><strong>Current Location:</strong> {orderDetails?.current_order_location || "No location"}</p>
                                                        {canUpdate && (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Update current location"
                                                                    value={orderDetails?.update_location_value || ""}
                                                                    onChange={(e) =>
                                                                        setOrderDetails((prev) => ({
                                                                            ...prev,
                                                                            update_location_value: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="form-control mt-2"
                                                                />
                                                                <button
                                                                    className="btn btn-info mt-3"
                                                                    onClick={async () => {
                                                                        try {
                                                                            await apiInstance.put(`/update_order_location`, {
                                                                                id: orderDetails?.id,
                                                                                location: orderDetails?.update_location_value,
                                                                            });
                                                                            toast.success("Location updated!");
                                                                            fetchData();
                                                                        } catch (error) {
                                                                            toast.error(error?.response?.data?.message || "Error updating location");
                                                                        }
                                                                    }}
                                                                >
                                                                    Update Location
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </>
                                )}
                            </div>

                            {orderDetails && orderDetails?.status == 0 && canUpdate && (
                                <>
                                    <hr />
                                    <h5 className="mb-3">Send Notification / Email to Buyer</h5>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                placeholder="Notification Title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="form-control mb-2"
                                            />
                                            <textarea
                                                placeholder="Notification / Email Message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="form-control"
                                                rows={3}
                                            />
                                            <div className="mt-2">
                                                <label className="mb-2 me-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sendNotification}
                                                        onChange={(e) => setSendNotification(e.target.checked)}
                                                    /> Send Notification
                                                </label>
                                                <label className="mb-2 me-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sendEmail}
                                                        onChange={(e) => setSendEmail(e.target.checked)}
                                                    /> Send Email
                                                </label>
                                            </div>
                                            <button
                                                className="btn btn-info mt-3 w-100 cursor-pointer "
                                                onClick={handleSend}
                                                disabled={!title.trim() || !message.trim()}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="mx-4 text-end">
                                <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;


