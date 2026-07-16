
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const ViewContactUs = () => {
  const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/view_contactUs/${id}`);
            setData(response.data?.details || "");
        } catch (error) {
            setError("An error occurred while fetching contact us details...");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.contact_us_view == 1;

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
                                <div className="bg-info shadow-dark border-radius-lg">
                                    <h6 className="text-white text-capitalize ps-3">
                                    Contact Us Details
                                    </h6>
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
                                    <div className='row mt-2'>
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
                                                <label>Phone Number</label>
                                                <input
                                                    type="text"
                                                    className={`form-control`}
                                                    value={`+${data?.country_code} ${data?.phone_no}`}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row mt-2'>
                                        <div className='col-lg-12'>
                                            <div className="form-group mb-2">
                                                <label>Message</label>
                                                <textarea
                                                    className={`form-control`}
                                                    value={data?.message || ""}
                                                    disabled
                                                    rows={4}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
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

export default ViewContactUs;


