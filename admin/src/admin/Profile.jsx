
import React, { useState, useEffect } from "react";
import apiInstance, { imageBaseUrl } from "../utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { LoadScript } from '@react-google-maps/api';
import GooglePlaceInput from "../utils/GooglePlaceInput";
import { useSelector, useDispatch } from "react-redux";
import { get_user_by_id } from "../utils/thunkApis";
const GOOGLE_API_KEY = "AIzaSyC2EZpjGL6WaieNcThm4gasP34Qlr04s3U";


const Profile = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone_no: "",
    location: "",
    latitude: "",
    longitude: "",
    profile_picture: "",
    country_code: ""
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fetchingError, setFetchingError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const user = useSelector((state) => state.users.user);

  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return;
    }
    const decode = jwtDecode(token);
    setId(decode.id);
  }, [token]);

  useEffect(() => {
    if (user && user?.admin) {
      setData(user.admin);
      const imageUrl = user?.admin?.profile_picture.startsWith("http")
        ? user?.admin?.profile_picture
        : `${imageBaseUrl}/${user?.admin?.profile_picture}`;
      setImagePreview(imageUrl);
    }
  }, [user]);

  const fetchProfileData = async () => {
    setLoading(true);
    if (!id) return;
    try {
      await dispatch(get_user_by_id(id));
    } catch (error) {
      setFetchingError("An error occurred while fetching profile details...")
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };


  let formErrors = {};
  const validateForm = () => {
    if (!data.name) {
      formErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(data.name)) {
      formErrors.name = "Enter a valid name";
    } else if (data.name.length > 15) {
      formErrors.name = "Name must be within 15 characters";
    }

    if (!data.phone_no) {
      formErrors.phone_no = "Phone number is required";
    } else if (isNaN(data.phone_no)) {
      formErrors.phone_no = "Enter a valid phone number";
    }

    if (!data.location) {
      formErrors.location = "Address is required";
    } else if (!isNaN(data.location)) {
      formErrors.location = "Enter a valid address";
    }else if(!data.latitude || !data.longitude){
      formErrors.location = "Please select an address";
    }

    if (selectedImage && selectedImage.size > (1024 * 1024 * 20)) formErrors.image = "Image size must be less than 20mb.";
    return formErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors('');
    setLoading(true);

    if (!id) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone_no", data.phone_no);
    formData.append("location", data.location);
    formData.append("latitude", data.latitude);
    formData.append("longitude", data.longitude);
    formData.append("country_code", data.country_code);
    if (selectedImage) {
      formData.append("profile_picture", selectedImage);
    }

    try {
      await apiInstance.put(`/updateProfile/${id}`, formData);
      toast.success("Profile updated successfully");
      fetchProfileData();
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingError) return <div>{fetchingError}<br />Please try again after some time or check your internet connection.</div>
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container-fluid ">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-info shadow-dark border-radius-lg">
                  <h6 className="text-white text-capitalize ps-3">
                    Profile
                  </h6>
                </div>
              </div>
              <div className="position-relative">
                {loading && (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      zIndex: 1000,
                    }}
                  >
                    <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <form
                  onSubmit={handleSubmit}
                  className="form-validate"
                  noValidate
                  encType="multipart/form-data"
                >

                  <div className="row">
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-body py-4">
                          <div className="tab-content">
                            <div
                              className="tab-pane active"
                              id="account"
                              aria-labelledby="account-tab"
                              role="tabpanel"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div
                                  className="col-12 col-lg-4"
                                  style={{
                                    flex: "0 0 auto",
                                    position: "relative",
                                    padding: "8px",
                                    alignSelf: 'center'
                                  }}
                                >
                                  {imagePreview && (
                                    <>
                                      <div className="d-flex justify-content-center content-center">
                                        <div className="position-relative " style={{ width: "100%", maxWidth: "300px" }}>
                                          <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                              marginTop: "10px",
                                              marginBottom: "20px",
                                              width: "100%",
                                              height: "auto",
                                              maxWidth: "300px",
                                              height: "300px",
                                              objectFit: "cover",
                                              borderRadius: "20px",
                                            }}
                                          />
                                          <label
                                            htmlFor="image"
                                            style={{
                                              position: "absolute",
                                              bottom: "12px",
                                              right: "0",
                                              cursor: "pointer",
                                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                                              borderRadius: "10%",
                                              padding: "5px",
                                              width: "50px",
                                              textAlign: "center",
                                              borderEndEndRadius: "20px"
                                            }}
                                          >
                                            <FontAwesomeIcon icon={faPenNib} size="lg" color="#185A96" />
                                          </label>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <input
                                    type="file"
                                    style={{ display: "none" }}
                                    id="image"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleImageChange}
                                  />
                                  {errors.image && (
                                    <p style={{ color: "red" }}>
                                      {errors.image}
                                    </p>
                                  )}
                                </div>

                                <div
                                  className="col-12 col-lg-8"
                                  style={{ flex: "1", marginLeft: "16px" }}
                                >


                                  <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                      type="text"
                                      required
                                      style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
                                      placeholder="Name"
                                      name="name"
                                      id="name"
                                      value={data.name}
                                      onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                                  </div>

                                  <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="phone">Phone Number</label>
                                    <PhoneInput
                                      country={'us'}
                                      value={`${data.country_code}${data.phone_no}`}
                                      onChange={(value, country) => {
                                        const dialCode = country?.dialCode || '';
                                        const nationalNumber = value.replace(dialCode, '');
                                        setData(prev => ({
                                          ...prev,
                                          country_code: dialCode,
                                          phone_no: nationalNumber,
                                        }));
                                      }}
                                      inputStyle={{ width: "100%", borderRadius: "4px" }}
                                      inputProps={{
                                        required: true,
                                        name: 'phone',
                                        autoFocus: true,
                                      }}
                                    />
                                    {errors.phone_no && <p style={{ color: "red" }}>{errors.phone_no}</p>}
                                  </div>


                                  <div style={{ marginBottom: "16px" }}>
                                    <label htmlFor="location">Address</label>
                                    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
                                      <GooglePlaceInput
                                        value={data.location}
                                        onChange={({ location, latitude, longitude }) =>
                                          setData(prev => ({ ...prev, location, latitude, longitude }))
                                        }
                                      />
                                    </LoadScript>
                                    {errors.location && <p style={{ color: "red" }}>{errors.location}</p>}
                                  </div>




                                  <div style={{ marginBottom: "16px" }}>
                                    <label
                                      style={{
                                        display: "block",
                                        marginBottom: "8px",
                                      }}
                                      htmlFor="email"
                                    >
                                      Email
                                    </label>
                                    <input
                                      type="email"
                                      required
                                      readOnly
                                      style={{
                                        width: "100%",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        backgroundColor: "grey",
                                        color: 'white',
                                      }}
                                      placeholder="Email"
                                      name="email"
                                      id="email"
                                      value={data.email}
                                    />
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      marginTop: "16px",
                                    }}
                                  >
                                    <button
                                      type="submit"
                                      className="btn btn-info"
                                      style={{
                                        color: 'white'
                                      }}
                                    >
                                      Update
                                    </button>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;