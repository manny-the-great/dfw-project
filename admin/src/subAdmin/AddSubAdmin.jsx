import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../utils/apiInstance";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";
import { LoadScript } from '@react-google-maps/api';
import GooglePlaceInput from "../utils/GooglePlaceInput";
const GOOGLE_API_KEY = "AIzaSyC2EZpjGL6WaieNcThm4gasP34Qlr04s3U";
const AddSubAdmin = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        role: 1,
        name: "",
        email: "",
        country_code: "",
        phone_no: "",
        password: "",
        profile_picture: null,
        location: "",
        latitude: "",
        longitude: "",

        // CMS
        cms_view: false,
        cms_update: false,

        // USERS
        user_view: false,
        user_update: false,

        // SUB ADMIN
        sub_admin_view: false,
        sub_admin_add: false,
        sub_admin_update: false,
        delete_sub_admin: false,

        // DUMMY RATING
        dummy_rating_view: false,
        dummy_rating_add: false,
        dummy_rating_update: false,
        dummy_rating_delete: false,

        // SERVICES
        service_view: false,
        service_add: false,
        service_update: false,
        delete_service_permission: false,

        // SERVICE TYPE
        service_type_view: false,
        service_type_add: false,
        service_type_update: false,
        service_type_delete_permission: false,

        // CONTACT US
        contact_us_view: false,
        contact_us_delete_permission: false,

        // DASHBOARD
        dashboard_view_permission: false,

        // OTHERS
        wallet_view: false,
        notification_permit: false,
        // ORDERS
        order_view: false,
        order_update: false,

        // DELIVERY CHARGES
        delivery_charges_view: false,
        delivery_charges_update: false,
    });


    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        location: "",
    });

    const convertBooleanToInt = (obj) => {
        const newObj = {};
        for (let key in obj) {
            if (typeof obj[key] === "boolean") {
                newObj[key] = obj[key] ? 1 : 0;
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };

    const hasAccess =
        userDetails?.admin?.role === 0 ||
        userDetails?.admin?.sub_admin_add === 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const validateField = (name, value) => {
        let msg = "";

        switch (name) {
            case "name":
                if (!value.trim()) msg = "Name is required";
                else if (value.length > 30) msg = "Name must be within 30 characters";
                break;

            case "email":
                if (!value.trim()) msg = "Email is required";
                else if (!/^\S+@\S+\.\S+$/.test(value)) msg = "Invalid email";
                break;

            case "password":
                if (!value.trim()) msg = "Password is required";
                else if (value.length < 6 || value.length > 12) msg = "Password must be of 6-12 characters";
                break;

            case "phone":
                if (value.length < 5) msg = "Invalid phone number";
                break;

            case "location":
                if (!value.trim()) msg = "Address is required";
                else if (value.length > 100) msg = "Address must be within 100 characters";
                break;
            default:
                break;
        }

        return msg;
    };


    const enforcePermissionRules = (name, value, updatedForm) => {
        const groups = [
            { module: "cms", view: "cms_view", update: "cms_update" },
            { module: "user", view: "user_view", update: "user_update" },
            { module: "sub_admin", view: "sub_admin_view", update: "sub_admin_update", add: "sub_admin_add", delete: "delete_sub_admin" },
            { module: "dummy_rating", view: "dummy_rating_view", update: "dummy_rating_update", add: "dummy_rating_add", delete: "dummy_rating_delete" },
            { module: "service", view: "service_view", update: "service_update", add: "service_add", delete: "delete_service_permission" },
            { module: "service_type", view: "service_type_view", update: "service_type_update", add: "service_type_add", delete: "service_type_delete_permission" },
            { module: "order", view: "order_view", update: "order_update" },
            { module: "contact_us", view: "contact_us_view", delete: "contact_us_delete_permission" },
            { module: "wallet", view: "wallet_view" },
            { module: "notification", view: "notification_permit" },
            { module: "dashboard", view: "dashboard_view_permission" },
            { module: "delivery charges", view: "delivery_charges_view", update: "delivery_charges_update" },
        ];
        groups.forEach(group => {
            const { view, update, add, delete: del } = group;
            const children = [update, add, del].filter(Boolean);
            const allKeys = [view, ...children].filter(Boolean);

            if (![view, ...children].includes(name)) return;

            if (value === true) {
                updatedForm[view] = true; // no list → check view
            }

            if (name === view && value === false) {
                children.forEach(k => updatedForm[k] = false);
            }

            if (
                name.startsWith("service_type") &&
                value === true
            ) {
                updatedForm.service_view = true;
            }

            if (name === "service_view" && value === false) {
                updatedForm.service_type_view = false;
                updatedForm.service_type_add = false;
                updatedForm.service_type_update = false;
                updatedForm.service_type_delete_permission = false;
            }
        });

        return updatedForm;
    };









    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === "profile_picture") {
            const file = files[0];
            setForm({ ...form, profile_picture: file });
            setPreview(URL.createObjectURL(file));
            return;
        }

        let updatedForm = {
            ...form,
            [name]: type === "checkbox" ? checked : value,
        };

        if (name.includes("view") || name.includes("update") || name.includes("add") || name.includes("delete")) {
            updatedForm = enforcePermissionRules(name, checked, updatedForm);
        }

        setForm(updatedForm);

        if (["name", "email", "password", "location"].includes(name)) {
            setErrors({ ...errors, [name]: validateField(name, value) });
        }
    };

    const handlePhone = (value, data) => {
        const dialCode = data.dialCode;
        const phone = value.replace(dialCode, "");

        setForm({
            ...form,
            country_code: dialCode,
            phone_no: phone,
        });

        setErrors({
            ...errors,
            phone: validateField("phone", phone),
        });
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const tempErrors = {};

        Object.keys(errors).forEach((key) => {
            let value = form[key];

            if (key === "phone") value = form.phone_no;

            const v = validateField(key, value);
            tempErrors[key] = v;
            if (v) hasError = true;
        });
        if (!form.latitude || !form.longitude) {
            tempErrors.location =
                tempErrors.location || "Please select a valid address from Google suggestions";
            hasError = true;
        }

        setErrors(tempErrors);

        if (hasError) return
        setLoading(true);

        try {
            const finalForm = convertBooleanToInt(form);
            const fd = new FormData();
            Object.entries(finalForm).forEach(([key, value]) => {
                fd.append(key, value);
            });

            await apiInstance.post(`/add_sub_admin`, fd);
            toast.success("Sub admin added successfully");
            setTimeout(() => navigate(-1), 1000);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    const PermissionBox = ({ title, keys }) => (
        <div className="border rounded p-3 my-2">
            <h6 className="fw-bold">{title}</h6>
            <div className="d-flex gap-4 mt-2 flex-wrap">
                {keys.map((k) => (
                    <label key={k} className="me-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name={k}
                            checked={form[k]}
                            onChange={handleChange}
                            onMouseDown={(e) => e.preventDefault()}
                        />{" "}
                        {k.replace(/_/g, " ")}
                    </label>
                ))}
            </div>
        </div>
    );


    return (
        <>
            <ToastContainer />
            <div className="container-fluid">
                <div className="card my-4">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between">
                            <h6 className="text-white text-capitalize ps-3">Add Sub Admin</h6>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="card-body">
                            {/* PROFILE PICTURE */}
                            <div className="row">
                                <div className="col-12 mb-3  d-flex flex-column justify-content-center align-items-center ">
                                    <label className="mb-2">Profile Picture</label>

                                    <div className="d-flex justify-content-start">
                                        <label
                                            htmlFor="profile_picture"
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
                                            {preview ? (
                                                <img
                                                    src={preview}
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
                                                    style={{ fontSize: "60px", color: "#333" }}
                                                >
                                                    add_a_photo
                                                </i>
                                            )}
                                        </label>

                                        <input
                                            type="file"
                                            id="profile_picture"
                                            name="profile_picture"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">

                                {/* NAME */}
                                <div className="col-md-6 mb-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter name"
                                    />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                </div>

                                {/* EMAIL */}
                                <div className="col-md-6 mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                    />
                                    {errors.email && <small className="text-danger">{errors.email}</small>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Phone Number</label>
                                    <PhoneInput
                                        country={"us"}
                                        value={form.country_code + form.phone_no}
                                        onChange={handlePhone}
                                        inputStyle={{
                                            width: "100%",
                                            height: "44.22px", 
                                            borderRadius: "6px"
                                        }}
                                        buttonStyle={{
                                            height: "44.25px" 
                                        }}
                                    />
                                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                </div>

                                <div className="col-md-6 mb-3" style={{ position: "relative" }}>
                                    <label>Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control"
                                        autoComplete="new-password"
                                        maxLength={15}
                                        value={form.password}
                                        onChange={handleChange}
                                        style={{ paddingRight: "40px" }} 
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: "absolute",
                                            top: "53px",
                                            right: "20px",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            color: "#555",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.password && <small className="text-danger">{errors.password}</small>}
                                </div>


                                <div className="col-md-6 mb-3">
                                    <label>Address</label>

                                    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
                                        <GooglePlaceInput
                                            value={form.location}
                                            onChange={({ location, latitude, longitude }) => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    location,
                                                    latitude,
                                                    longitude
                                                }));

                                                setErrors(prev => ({
                                                    ...prev,
                                                    location: validateField("location", location)
                                                }));
                                            }}
                                        />
                                    </LoadScript>

                                    {errors.location && (
                                        <small className="text-danger">{errors.location}</small>
                                    )}
                                </div>

                            </div>

                            <h5 className="mt-4">Permissions</h5>

                            <PermissionBox
                                title="CMS"
                                keys={["cms_view", "cms_update"]}
                            />

                            <PermissionBox
                                title="Users"
                                keys={["user_view", "user_update"]}
                            />

                            <PermissionBox
                                title="Sub Admin"
                                keys={[
                                    "sub_admin_view",
                                    "sub_admin_add",
                                    "sub_admin_update",
                                    "delete_sub_admin"
                                ]}
                            />

                            <PermissionBox
                                title="Dummy Rating"
                                keys={[
                                    "dummy_rating_view",
                                    "dummy_rating_add",
                                    "dummy_rating_update",
                                    "dummy_rating_delete"
                                ]}
                            />

                            <PermissionBox
                                title="Services"
                                keys={[
                                    "service_view",
                                    "service_add",
                                    "service_update",
                                    "delete_service_permission"
                                ]}
                            />

                            <PermissionBox
                                title="Orders"
                                keys={["order_view", "order_update"]}
                            />

                            <PermissionBox
                                title="Delivery Charges"
                                keys={["delivery_charges_view", "delivery_charges_update"]}
                            />

                            <PermissionBox title="Wallet" keys={["wallet_view"]} />

                            <PermissionBox title="Notifications" keys={["notification_permit"]} />

                            <PermissionBox
                                title="Contact Us"
                                keys={[
                                    "contact_us_view",
                                    "contact_us_delete_permission"
                                ]}
                            />

                            <PermissionBox title="Dashboard" keys={["dashboard_view_permission"]} />



                        </div>

                        <div className="text-end p-3">
                            <button className="btn btn-info me-2" type="submit">
                                {loading ? "Adding…" : "Add"}
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
                                Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddSubAdmin;