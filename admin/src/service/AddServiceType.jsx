import React, { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import apiInstance from '../utils/apiInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const AddServiceType = () => {
  const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const { serviceId }=useParams();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.service_type_add == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const validateName = (value) => {
        if (!value.trim()) return "Service name is required.";
        if (value.trim().length > 50) return "Service name must be within 50 characters.";
        if (!isNaN(value)) return "Name can't be only numbers.";
        return "";
    };

    const handleChange = (e) => {
        const { value } = e.target;
            setName(value);
            setNameError(validateName(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameValidation = validateName(name);

        setNameError(nameValidation);

        if (nameValidation) {
            // toast.error("Please correct the errors before submitting.");
            return;
        }

        setLoading(true);
        try {
            await apiInstance.post(`/add_service_type`, { name, service_id:serviceId });
            toast.success("Service Type added successfully");
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
                                    Add Service Type
                                    </h6>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                                <div className="card-body">
                                    <div className='row mt-4'>
                                        <div className='col-lg-6 mx-auto'>
                                            <div className="form-group mb-2">
                                                <label htmlFor="name">Service Type Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control`}
                                                    name="name"
                                                    value={name}
                                                    onChange={handleChange}
                                                    maxLength={51}
                                                    onBlur={() => setNameError(validateName(name))}
                                                    placeholder="Enter service type"
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

export default AddServiceType;
