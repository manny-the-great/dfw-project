import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { imageBaseUrl } from '../utils/apiInstance';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const UserView = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const response = await apiInstance.get(`/view_user/${id}`);
            setData(response.data?.user_details || "");
        } catch (error) {
            setError("An error occurred while fetching user details...");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.user_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between">
                                    <h6 className="text-white text-capitalize ps-3">User Details</h6>
                                    {(userDetails?.admin?.role == 0 || userDetails?.admin?.order_view == 1) && (
                                        <div className="mx-4 text-end mt-1">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => navigate(`/userOrders/${id}`)}
                                            >
                                                Orders
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <form style={{ position: 'relative' }}>
                                {loading && (
                                    <div className="d-flex justify-content-center align-items-center"
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            zIndex: 1000,
                                        }}>
                                        <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                <div className="card-body">
                                    <div className="form-group mx-auto">
                                        {data?.profile_picture ? (
                                            <div className="image-container text-center">
                                                <img
                                                    src={`${imageBaseUrl}/${data?.profile_picture}`}
                                                    alt="profile"
                                                    style={{
                                                        width: "200px",
                                                        height: "200px",
                                                        objectFit: "cover",
                                                        borderRadius: "20%",
                                                    }}
                                                />
                                            </div>
                                        )
                                            :
                                            (
                                                <div className="image-container text-center">
                                                    <img
                                                        src="/user.png"
                                                        alt="profile"
                                                        style={{
                                                            width: "100px",
                                                            height: "100px",
                                                            objectFit: "cover",
                                                            borderRadius: "20%",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                    </div>
                                    <div className='row mt-5'>
                                        <div className='col-lg-6'>
                                            <div className="form-group mb-2">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control`}
                                                    value={data?.name || ""}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className="form-group mb-2">
                                                <label>Email</label>
                                                <input
                                                    type="text"
                                                    className={`form-control`}
                                                    value={data?.email || ""}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col-lg-6'>
                                            <div className="form-group mb-2">
                                                <label>Phone No.</label>
                                                <input
                                                    type="phone"
                                                    id="phone_no"
                                                    className="form-control "
                                                    value={`+${data?.country_code || ""} ${data.phone_no || ""}` || ""}
                                                    disabled
                                                    style={{ paddingLeft: '10px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {Array.isArray(data?.user_addresses) && data.user_addresses.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="text-info">Saved Addresses</h5>
                                            {data.user_addresses.map((info, index) => (
                                                <div key={info.id || index} className="border p-3 my-3 rounded shadow-sm bg-light">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <strong>Name:</strong> {info?.name}
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <strong>Mobile no.:</strong> +{info?.country_code || ''} {info?.phone_no || ""}
                                                        </div>
                                                    </div>
                                                    <div className="row mt-2">
                                                        <div className="col-lg-6">
                                                            <strong>City:</strong> {info?.city || ''}
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <strong>Apartment No.:</strong> {info?.apartment_no || 'N/A'}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-2">
                                                        <div className="col-lg-6">
                                                            <strong>Address:</strong> {info?.location || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>

                                <div className="mx-4 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-info"
                                        onClick={() => navigate(-1)}
                                    >
                                        Back
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserView;


