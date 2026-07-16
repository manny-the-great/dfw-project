import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance, { imageBaseUrl } from '../utils/apiInstance';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const ViewService = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiInstance.get(`/view_service/${id}`);
                const details = response.data?.service_details;
                setName(details?.name || "");
                if (details?.image) {
                    setImagePreview(`${imageBaseUrl}/${details.image}`);
                }
            } catch (error) {
                setError("An error occurred while fetching service details...");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.service_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    if (error) {
        return <div>{error}<br />Please try again later.</div>;
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg">
                                    <h6 className="text-white text-capitalize ps-3">Service Details</h6>
                                </div>
                            </div>
                            <form style={{ position: 'relative' }}>
                                {loading && (
                                    <div className="d-flex justify-content-center align-items-center"
                                        style={{
                                            position: "absolute",
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                            zIndex: 1000,
                                        }}>
                                        <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                <div className="card-body">
                                    <div className="form-group col-3 mx-auto d-flex justify-content-center flex-column align-items-center">
                                        <img
                                            src={imagePreview || "/noimage.png"}
                                            alt="Preview"
                                            style={{
                                                borderRadius: "10px",
                                                width: "200px",
                                                height: "200px",
                                                objectFit: "cover",
                                                marginBottom: "10px"
                                            }}
                                        />
                                    </div>

                                    <div className='row mt-4'>
                                        <div className='col-lg-6 mx-auto'>
                                            <div className="form-group mb-2">
                                                <label htmlFor="name">Service Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control`}
                                                    name="name"
                                                    value={name}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-4 text-end">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
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

export default ViewService;
