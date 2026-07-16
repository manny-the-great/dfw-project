import React, { useState, useEffect } from "react";
import apiInstance, { imageBaseUrl } from "../utils/apiInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const AboutUs = () => {
  const userDetails = useSelector((state) => state.users.user);
  const type = 0
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fetchingError, setFetchingError] = useState(null);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const canEdit = userDetails?.admin?.role == 0 || userDetails?.admin?.cms_update === 1;

  useEffect(() => {
    const fetchAboutUs = async () => {
      setLoading(true);
      try {
        const response = await apiInstance.get(`/getCms/${type}`);
        const { data } = response.data;
        setTitle(data?.title || "");
        setDescription(data?.description || "<p><br></p>");
        const imgUrl = data?.image ? `${imageBaseUrl}/${data.image}` : "/noimage.png";
        setPreviewUrl(imgUrl);
      } catch (error) {
        setFetchingError("An error occurred while fetching the about us data..")
      } finally {
        setLoading(false);
      }
    };
    fetchAboutUs();
  }, []);

  const hasAccess =
    userDetails?.admin?.role == 0 ||
    userDetails?.admin?.cms_view == 1;

  if (!userDetails || !userDetails.admin) {
    return null;
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canEdit) {
      toast.error("You don't have permission to update this section.");
      return;
    }
    const tempElement = document.createElement("div");
    tempElement.innerHTML = description;
    const plainText = tempElement.textContent || tempElement.innerText;

    if (!plainText.trim()) {
      setError("About Us section cannot be empty.");
      return;
    }
    if (image && image.size > 20 * 1024 * 1024) {
      toast.error("Image exceeds 20MB size limit");
      setLoading(false);
      return;
    }
    setError("");
    setSubmitError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("type", type);
      formData.append("title", title);
      if (image) {
        formData.append("image", image);
      }

      await apiInstance.put("/updateCms", formData);
      toast.success("About Us updated successfully");
    } catch (error) {
      setSubmitError("Error submitting About Us. Please try again.");
      toast.error("Error submitting About Us. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingError) return <div>{fetchingError}<br />Please try again after some time or check your internet connection.</div>


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
                    About Us
                  </h6>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-4 position-relative">
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
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        id="title"
                        type="text"
                        className="form-control "
                        value={title}
                        disabled
                        style={{
                          paddingLeft: "10px",
                          color: 'white'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <input
                    type="file"
                    id="image"
                    disabled={!canEdit}
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <div
                    className="position-relative d-inline-block mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => document.getElementById("image").click()}
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #ccc"
                      }}
                    />
                    <div
                      className="position-absolute top-0 end-0 p-2"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: "50%",
                        transform: "translate(30%, -30%)"
                      }}
                    >
                      <i
                        className="fas fa-camera text-white"
                        style={{ fontSize: "1.2rem" }}
                      ></i>
                    </div>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <div className="position-relative">
                        <ReactQuill
                          id="content"
                          style={{ height: "300px", marginBottom: "50px" }}
                          theme="snow"
                          value={description}
                          readOnly={!canEdit}
                          onChange={setDescription}
                          modules={{
                            toolbar: [
                              [{ header: "1" }, { header: "2" }, { font: [] }],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["bold", "italic", "underline"],
                              [{ color: [] }, { background: [] }],
                              [{ align: [] }],
                              ["clean"],
                            ],
                          }}
                        />
                        {description.trim() === "<p><br></p>" && (
                          <div className="text-danger"
                            style={{
                              position: "absolute",
                              top: 55,
                              left: 18,
                              right: 0,
                              bottom: 0,
                              pointerEvents: "none",
                              fontStyle: "italic",
                            }}
                          >
                            About Us section cannot be empty.
                          </div>
                        )}
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      {submitError && (
                        <p className="text-danger">{submitError}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {canEdit &&
                    <div className="col-12 d-flex justify-content-end mt-5">
                      <button
                        type="submit"
                        className="btn bg-info"
                        style={{ color: "white" }}
                      >
                        Update
                      </button>
                    </div>
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
