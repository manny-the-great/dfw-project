import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance, { imageBaseUrl } from '../utils/apiInstance';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const ViewSubAdmin = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [error, setError] = useState("");

    const permissionGroups = [
        {
            title: "CMS",
            permissions: [
                { key: "cms_view", label: "View" },
                { key: "cms_update", label: "Update" },
            ],
        },
        {
            title: "Users",
            permissions: [
                { key: "user_view", label: "View" },
                { key: "user_update", label: "Update" },
            ],
        },
        {
            title: "Sub Admin",
            permissions: [
                { key: "sub_admin_view", label: "View" },
                { key: "sub_admin_add", label: "Add" },
                { key: "sub_admin_update", label: "Update" },
                { key: "delete_sub_admin", label: "Delete" },
            ],
        },
        {
            title: "Dummy Ratings",
            permissions: [
                { key: "dummy_rating_view", label: "View" },
                { key: "dummy_rating_add", label: "Add" },
                { key: "dummy_rating_update", label: "Update" },
                { key: "dummy_rating_delete", label: "Delete" },
            ],
        },
        {
            title: "Services",
            permissions: [
                { key: "service_view", label: "View" },
                { key: "service_add", label: "Add" },
                { key: "service_update", label: "Update" },
                { key: "delete_service_permission", label: "Delete" },
            ],
        },
        {
            title: "Orders",
            permissions: [
                { key: "order_view", label: "View" },
                { key: "order_update", label: "Update" },
            ],
        },
        {
            title: "Delivery Charges",
            permissions: [
                { key: "delivery_charges_view", label: "View" },
                { key: "delivery_charges_update", label: "Update" },
            ],
        },
        {
            title: "Contact Us",
            permissions: [
                { key: "contact_us_view", label: "View" },
                { key: "contact_us_delete_permission", label: "Delete" },
            ],
        },
        {
            title: "Wallet & Notification",
            permissions: [
                { key: "wallet_view", label: "Wallet View" },
                { key: "notification_permit", label: "Notification" },
            ],
        },
        {
            title: "Dashboard",
            permissions: [{ key: "dashboard_view_permission", label: "View" }],
        },
    ];

    const fetchData = async () => {
        try {
            const response = await apiInstance.get(`/view_user/${id}`);
            setData(response.data?.user_details || {});
        } catch (err) {
            setError("An error occurred while fetching user details...");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.sub_admin_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    if (error) return <div>{error}</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="card my-4">
                        <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                            <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between">
                                <h6 className="text-white text-capitalize ps-3">Sub Admin Details</h6>
                            </div>
                        </div>

                        <div className="card-body">
                            {loading && (
                                <div className="d-flex justify-content-center align-items-center"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: "rgba(255,255,255,0.7)",
                                        zIndex: 1000,
                                    }}>
                                    <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-4">
                                <img
                                    src={data?.profile_picture ? `${imageBaseUrl}/${data.profile_picture}` : "/user.png"}
                                    alt="Profile"
                                    style={{
                                        width: data?.profile_picture ? "200px" : "100px",
                                        height: data?.profile_picture ? "200px" : "100px",
                                        objectFit: "cover",
                                        borderRadius: "20%",
                                    }}
                                />
                            </div>

                            <div className="row mb-4">
                                <div className="col-lg-6">
                                    <label>Name</label>
                                    <input className="form-control" value={data?.name || ""} disabled />
                                </div>
                                <div className="col-lg-6">
                                    <label>Email</label>
                                    <input className="form-control" value={data?.email || ""} disabled />
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-lg-6">
                                    <label>Phone No.</label>
                                    <input className="form-control" value={`+${data?.country_code || ""} ${data?.phone_no || ""}`} disabled />
                                </div>
                                <div className="col-lg-6">
                                    <label>Address</label>
                                    <input className="form-control" value={data?.location || ""} disabled />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="text-info">Permissions</h5>
                                {permissionGroups.map(group => (
                                    <div key={group.title} className="mb-3 p-3 border rounded">
                                        <h6 className="fw-bold">{group.title}</h6>
                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                            {group.permissions.map(p => (
                                                <span key={p.key} className={`badge ${data?.[p.key] === 1 ? "bg-success" : "bg-danger"}`}>
                                                    {p.label}: {data?.[p.key] === 1 ? "Enabled" : "Disabled"}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-end mt-3">
                                <button className="btn btn-info" onClick={() => navigate(-1)}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSubAdmin;