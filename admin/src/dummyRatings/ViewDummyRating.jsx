import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { imageBaseUrl } from "../utils/apiInstance";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const ViewDummyRating = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await apiInstance.get(`/view_rating/${id}`);
                const details = response.data?.details;
                setData(details || "");
            } catch (error) {
                setError("An error occurred while fetching rating details...");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.dummy_rating_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }
    const renderStars = (count) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star ${i <= count ? 'text-warning' : 'text-muted'}`}
                ></i>
            );
        }
        return stars;
    };

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
                                    <h6 className="text-white text-capitalize ps-3">
                                        Rating Details
                                    </h6>
                                </div>
                            </div>

                            <form className="relative">
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

                                    {/* IMAGE */}
                                    <div className="form-group col-3 mx-auto d-flex justify-content-center">
                                        <div className="waiter_profile mt-2 text-center">
                                            <label
                                                htmlFor="image"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "2px dashed #ccc",
                                                    borderRadius: "10px",
                                                    width: "200px",
                                                    height: "200px",
                                                    cursor: "pointer",
                                                    backgroundColor: "#f9f9f9",
                                                }}
                                            >
                                                {data?.image ? (
                                                    <img
                                                        src={`${imageBaseUrl}/${data?.image}`}
                                                        alt="Preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            borderRadius: "10px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
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
                                            </label>

                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-lg-6 mx-auto">

                                            {/* NAME */}
                                            <div className="form-group mb-3">
                                                <label>Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={data?.name}
                                                    disabled
                                                />
                                            </div>

                                            {/* RATING */}
                                            <div className="form-group mb-3">
                                                <label>Rating</label>
                                                <div className="form-control d-flex align-items-center" style={{ height: '45px', backgroundColor:"#F0F2F5" }}>
                                                    {renderStars(data?.ratings || 0)}
                                                </div>
                                            </div>

                                            {/* REVIEW */}
                                            <div className="form-group mb-3">
                                                <label>Review</label>
                                                <textarea
                                                    name="review"
                                                    className="form-control"
                                                    rows="4"
                                                    value={data?.review}
                                                    disabled
                                                ></textarea>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="mx-4 text-end">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
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

export default ViewDummyRating;
