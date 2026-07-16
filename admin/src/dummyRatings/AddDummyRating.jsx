import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const AddDummyRating = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [nameError, setNameError] = useState("");
    const [ratingError, setRatingError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [imageError, setImageError] = useState("");

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.dummy_rating_add == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    // VALIDATION
    const validateName = (value) => {
        if (!value.trim()) return "Name is required.";
        if (value.trim().length > 50) return "Name cannot exceed 50 characters.";
        if (!isNaN(value)) return "Name cannot be only numbers.";
        return "";
    };

    const validateRating = (value) => {
        if (!value) return "Rating is required.";
        if (isNaN(value)) return "Invalid rating.";
        if (value < 1 || value > 5) return "Rating must be between 1 and 5.";
        return "";
    };

    const validateReview = (value) => {
        if (!value.trim()) return "Review is required.";
        if (value.trim().length < 5) return "Review must be at least 5 characters.";
        if (value.trim().length > 500) return "Review must be within 500 characters.";
        return "";
    };

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 20 * 1024 * 1024;
        if (!file) return "Image is required.";
        if (!validTypes.includes(file.type)) return "Only JPG, JPEG, or PNG allowed.";
        if (file.size > maxSize) return "Image must be less than 20MB.";
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
            }
        }

        if (name === "name") {
            setName(value);
            setNameError(validateName(value));
        }

        if (name === "rating") {
            setRating(value);
            setRatingError(validateRating(value));
        }

        if (name === "review") {
            setReview(value);
            setReviewError(validateReview(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameValidation = validateName(name);
        const ratingValidation = validateRating(rating);
        const reviewValidation = validateReview(review);
        const imageValidation = validateImage(image);

        setNameError(nameValidation);
        setRatingError(ratingValidation);
        setReviewError(reviewValidation);
        setImageError(imageValidation);

        if (nameValidation || ratingValidation || reviewValidation || imageValidation) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("ratings", rating);
        formData.append("review", review);
        formData.append("image", image);

        setLoading(true);
        try {
            await apiInstance.post(`/add_ratings`, formData);
            toast.success("Dummy rating added successfully");
            setTimeout(() => navigate(-1), 1000);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
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
                                        Add Dummy Rating
                                    </h6>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
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
                                                    <i className="material-icons" style={{ fontSize: "60px", color: "#333" }}>
                                                        add_a_photo
                                                    </i>
                                                )}
                                            </label>
                                            <input type="file" id="image" name="image" accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }} onChange={handleChange} />
                                            {imageError && <div className="invalid-feedback d-block text-danger mt-1">{imageError}</div>}
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
                                                    value={name}
                                                    onChange={handleChange}
                                                    maxLength={51}
                                                    placeholder="Enter name"
                                                />
                                                {nameError && <div className="invalid-feedback d-block">{nameError}</div>}
                                            </div>

                                            {/* RATING */}
                                            <div className="form-group mb-3">
                                                <label>Rating (1–5)</label>
                                                <input
                                                    type="text"
                                                    name="rating"
                                                    className="form-control"
                                                    value={rating}
                                                    onChange={(e) => {
                                                        if (!isNaN(e.target.value))
                                                            handleChange(e)
                                                    }}
                                                />
                                                {ratingError && <div className="invalid-feedback d-block">{ratingError}</div>}
                                            </div>

                                            {/* REVIEW */}
                                            <div className="form-group mb-3">
                                                <label>Review</label>
                                                <textarea
                                                    name="review"
                                                    className="form-control"
                                                    rows="4"
                                                    value={review}
                                                    onChange={handleChange}
                                                    placeholder="Write review"
                                                ></textarea>
                                                {reviewError && <div className="invalid-feedback d-block">{reviewError}</div>}
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

export default AddDummyRating;
