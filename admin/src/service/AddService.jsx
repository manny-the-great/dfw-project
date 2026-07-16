import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const AddService = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [nameError, setNameError] = useState("");
    const [imageError, setImageError] = useState("");

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.service_add == 1;

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
        const maxSize = 20 * 1024 * 1024; // 20MB
        if (!file) return "Image is required.";
        if (!validTypes.includes(file.type)) return "Only JPG, JPEG, or PNG allowed.";
        if (file.size > maxSize) return "Image size must be less than 20MB.";
        return "";
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            if (files.length > 0) {
                const file = files[0];
                const imgError = validateImage(file);
                setImageError(imgError);
                if (!imgError) {
                    setImage(file);
                    setImagePreview(URL.createObjectURL(file));
                } else {
                    setImage(null);
                    setImagePreview(null);
                }
            } else {
                setImage(null);
                setImagePreview(null);
            }
        } else if (name === "name") {
            setName(value);
            setNameError(validateName(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameValidation = validateName(name);
        const imageValidation = validateImage(image);

        setNameError(nameValidation);
        setImageError(imageValidation);

        if (nameValidation || imageValidation) {
            // toast.error("Please correct the errors before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        setLoading(true);
        try {
            await apiInstance.post(`/add_service`, formData);
            toast.success("Service added successfully");
            setTimeout(() => navigate(-1), 1000);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg">
                                    <h6 className="text-white text-capitalize ps-3">
                                        Add Service
                                    </h6>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                                <div className="card-body">

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
                                                    position: "relative",
                                                }}
                                            >
                                                {imagePreview ? (
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            borderRadius: "10px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <i
                                                        className="material-icons"
                                                        style={{
                                                            fontSize: "60px",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        add_a_photo
                                                    </i>
                                                )}
                                            </label>

                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                onChange={handleChange}
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                            />

                                            {imageError && (
                                                <div className="invalid-feedback d-block text-danger mt-1">{imageError}</div>
                                            )}
                                        </div>
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
                                                    onChange={handleChange}
                                                    maxLength={51}
                                                    onBlur={() => setNameError(validateName(name))}
                                                    placeholder="Enter service name"
                                                    autoComplete="off"
                                                />
                                                {nameError && (
                                                    <div className="invalid-feedback d-block">{nameError}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-4 text-end">
                                    <button type="submit" className="btn btn-info me-2">
                                        {loading ? "Adding..." : "Add"}
                                    </button>
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

export default AddService;
