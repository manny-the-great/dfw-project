import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import apiInstance, { imageBaseUrl } from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const EditServiceType = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [error, setError] = useState(null);
    useEffect(() => {
        if (location.state) {
            setName(location.state.name || "");
        }
    }, [location.state]);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.service_type_update == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const validateName = (value) => {
        if (!value.trim()) return "Name is required.";
        if (value.trim().length > 50) return "Name must be within 50 characters.";
        if (!isNaN(value)) return "Name can't be only numbers.";
        return "";
    };



    const handleChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    };

    const handleBlur = () => {
        setNameError(validateName(name));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameValidation = validateName(name);
        setNameError(nameValidation);

        if (nameValidation) {
            toast.error("Please correct the errors before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);

        setUpdateLoading(true);
        try {
            await apiInstance.put(`/edit_service_type`, formData);
            toast.success("Service type updated successfully");
            setTimeout(() => navigate(-1), 1000);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (error) {
        return <div>{error}<br />Please try again later.</div>;
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg">
                                    <h6 className="text-white text-capitalize ps-3">Edit Service Type</h6>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
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


                                    <div className='row mt-4'>
                                        <div className='col-lg-6 mx-auto'>
                                            <div className="form-group mb-2">
                                                <label htmlFor="name">Service Type</label>
                                                <input
                                                    type="text"
                                                    className={`form-control `}
                                                    name="name"
                                                    value={name}
                                                    maxLength={51}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Enter service type name"
                                                    autoComplete='off'
                                                />
                                                {nameError && (
                                                    <div className="invalid-feedback d-block">{nameError}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-4 text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-info me-2"
                                    >
                                        {updateLoading ? "Updating..." : "Update"}
                                    </button>
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

export default EditServiceType;
