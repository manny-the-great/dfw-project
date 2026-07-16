import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance, { imageBaseUrl } from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const EditService = () => {
    const userDetails = useSelector((state) => state.users.user);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [nameError, setNameError] = useState("");
    const [imageError, setImageError] = useState("");
    const [error, setError] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState("");

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
        userDetails?.admin?.service_update == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }


    const validateName = (value) => {
        if (!value.trim()) return "Service name is required.";
        if (value.trim().length > 20) return "Service name must be within 20 characters.";
        if (!isNaN(value)) return "Name can't be only numbers.";
        return "";
    };

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 20 * 1024 * 1024;
        if (!file) return "";
        if (!validTypes.includes(file.type)) return "Only JPG, JPEG, or PNG allowed.";
        if (file.size > maxSize) return "Image size must be less than 20MB.";
        return "";
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return
        const error = validateImage(file);
        setImageError(error);
        if (!error) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setSelectedFileName(file.name);
        }
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
        if (nameError || imageError) {
            toast.error("Please correct the errors before submitting.");
            return;
        }
        const nameValidation = validateName(name);
        const imageValidation = validateImage(image);
        setNameError(nameValidation);
        setImageError(imageValidation);

        if (nameValidation || imageValidation) {
            toast.error("Please correct the errors before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", name);
        if (image) formData.append("image", image);

        setUpdateLoading(true);
        try {
            await apiInstance.put(`/edit_service`, formData);
            toast.success("Service updated successfully");
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
                                    <h6 className="text-white text-capitalize ps-3">Edit Service</h6>
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

                                    <div className="form-group col-3 mx-auto d-flex justify-content-center flex-column align-items-center">
                                        <div className="banner_profile mt-2" data-aspect="1/1">
                                            {imagePreview && (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    style={{
                                                        borderRadius: "10px",
                                                        width: "200px",
                                                        height: "200px",
                                                        marginBottom: "5px",
                                                    }}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                name="image"
                                                id="imageUpload"
                                                className="form-control"
                                                onChange={handleImageChange}
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="btn btn-outline-secondary"
                                                style={{ width: "200px", marginBottom: "5px" }}
                                            >
                                                Choose Image
                                            </label>
                                            {selectedFileName && (
                                                <div style={{ fontSize: "14px", textAlign: "center", width: "200px" }}>
                                                    {selectedFileName}
                                                </div>
                                            )}
                                        </div>
                                        {imageError && (
                                            <div className="invalid-feedback d-block text-danger mt-1">{imageError}</div>
                                        )}
                                    </div>


                                    <div className='row mt-4'>
                                        <div className='col-lg-6 mx-auto'>
                                            <div className="form-group mb-2">
                                                <label htmlFor="name">Service Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control `}
                                                    name="name"
                                                    value={name}
                                                    maxLength={51}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Enter service name"
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

export default EditService;
