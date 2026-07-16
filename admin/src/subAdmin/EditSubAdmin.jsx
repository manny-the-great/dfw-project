import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiInstance from "../utils/apiInstance";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { imageBaseUrl } from '../utils/apiInstance';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";
import { LoadScript } from '@react-google-maps/api';
import GooglePlaceInput from "../utils/GooglePlaceInput";
const GOOGLE_API_KEY = "AIzaSyC2EZpjGL6WaieNcThm4gasP34Qlr04s3U";

const EditSubAdmin = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [preview, setPreview] = useState('/user.png');

    const [form, setForm] = useState({
        name: "",
        email: "",
        country_code: "",
        phone_no: "",
        location: "",
        latitude: "",
        longitude: "",
        profile_picture: null,

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

        // DUMMY RATINGS
        dummy_rating_view: false,
        dummy_rating_add: false,
        dummy_rating_update: false,
        dummy_rating_delete: false,

        // SERVICES
        service_view: false,
        service_add: false,
        service_update: false,
        delete_service_permission: false,

        // SERVICE TYPES
        service_type_view: false,
        service_type_add: false,
        service_type_update: false,
        service_type_delete_permission: false,

        // ORDERS
        order_view: false,
        order_update: false,

        // CONTACT US
        contact_us_view: false,
        contact_us_delete_permission: false,

        // WALLET
        wallet_view: false,

        // NOTIFICATIONS
        notification_permit: false,

        // DASHBOARD
        dashboard_view_permission: false,

        // DELIVERY CHARGES
        delivery_charges_view: false,
        delivery_charges_update: false,
    });


    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        location: ""
    });


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

            if (![view, ...children].includes(name)) return;

            if (value === true) {
                updatedForm[view] = true;
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

        if (["name", "email", "location"].includes(name)) {
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


    const fetchData = async () => {
        try {
            const response = await apiInstance.get(`/view_user/${id}`);
            const user = response.data?.user_details;
            if (!user) return;

            setForm({
                ...form,
                ...user,
                profile_picture: null,
            });

            if (user.profile_picture && user.profile_picture != null) {
                setPreview(`${imageBaseUrl}/${user.profile_picture}`);
            } else {
                setPreview('/user.png')
            }

        } catch (err) {
            toast.error("Error fetching data");
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.sub_admin_update == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }



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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let hasError = false;
        const tempErrors = {};

        const fieldsToValidate = ["name", "email", "phone", "location"];
        fieldsToValidate.forEach((key) => {
            const v = validateField(key, key === "phone" ? form.phone_no : form[key]);
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
                if (value !== null) fd.append(key, value);
            });

            await apiInstance.put(`/edit_sub_admin/${id}`, fd);

            toast.success("Sub admin updated");
            setTimeout(() => navigate(-1), 800);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed");
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

    if (initialLoading) return <p className="text-center mt-4">Loading...</p>;

    return (
        <>
            <ToastContainer />

            <div className="container-fluid">
                <div className="card my-4">
                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between">
                            <h6 className="text-white text-capitalize ps-3">Edit Sub Admin</h6>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="card-body">

                            <div className="row">
                                <div className="col-12 mb-3 d-flex flex-column align-items-center">
                                    <label className="mb-2">Profile Picture</label>

                                    <label
                                        htmlFor="profile_picture"
                                        style={{
                                            position: "relative",
                                            border: "2px dashed #ccc",
                                            borderRadius: "10px",
                                            width: "200px",
                                            height: "200px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            background: "#f9f9f9",
                                        }}
                                    >
                                        {preview && (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        )}

                                        <i
                                            className="material-icons"
                                            style={{
                                                fontSize: "50px",
                                                color: "white",
                                                position: "absolute",
                                                bottom: "8px",
                                                right: "8px",
                                                background: "rgba(0,0,0,0.5)",
                                                padding: "6px",
                                                borderRadius: "50%",
                                            }}
                                        >
                                            photo_camera
                                        </i>

                                        {!preview && (
                                            <i
                                                className="material-icons"
                                                style={{ fontSize: "60px", color: "#333", position: "absolute" }}
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


                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <small className="text-danger">{errors.name}</small>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
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

                                <div className="col-md-6 mb-3">
                                    <label>Address</label>

                                    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
                                        <GooglePlaceInput
                                            value={form.location}
                                            onChange={({ location, latitude, longitude }) => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    location: location,
                                                    latitude: latitude,
                                                    longitude: longitude
                                                }));

                                                setErrors(prev => ({
                                                    ...prev,
                                                    location: validateField("location", location)
                                                }));
                                            }}
                                        />
                                    </LoadScript>

                                    {errors.location && <small className="text-danger">{errors.location}</small>}

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
                                {loading ? "Updating…" : "Update"}
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

export default EditSubAdmin;