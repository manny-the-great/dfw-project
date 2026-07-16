
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiInstance from '../utils/apiInstance';
import { useSearchParams } from 'react-router-dom';
import '../common/Table.css';
import { jwtDecode } from "jwt-decode";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const SendNotification = () => {
    const userDetails = useSelector((state) => state.users.user);
    const tableRef = useRef(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page")) || 1;
    const initialSearch = searchParams.get("search") || "";
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [roleFilter, setRoleFilter] = useState("2");
    const [notificationLoader, setNotificationLoader] = useState(0) //0-no loader,1-loader for send button,2-loader for send to all button 

    const [sendNotification, setSendNotification] = useState(true);
    const [sendEmail, setSendEmail] = useState(false);

    const fetchData = async (page = 1, search = '', role = roleFilter) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/user_list`, {
                params: {
                    page,
                    limit,
                    search,
                    roleFilter: role
                }
            });
            setData(response.data?.user_list);
            setTotalPages(response.data?.totalPages);
            setCurrentPage(response.data?.currentPage);
            setSearchParams({ page, search, role: role });
        } catch (error) {
            setError("An error occurred while fetching users...");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get("page")) || 1;
        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || "2";
        setRoleFilter(role);
        fetchData(page, search, role);
    }, [searchParams]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";

            if (searchQuery !== currentSearch) {
                fetchData(1, searchQuery);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        fetchData(page, searchQuery);
        tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.notification_permit == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const handleSendNotification = async (sendToAll, btnType) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decode = jwtDecode(token);
        const id = decode.id;

        if (title.length > 50) {
            toast.error("Title must be within 50 characters");
            return;
        }
        if (message.length > 500) {
            toast.error("Message must be within 500 characters");
            return;
        }
        if (!sendNotification && !sendEmail) {
            return toast.error("Please select at least one option: Notification or Email");
        }
        setNotificationLoader(btnType);
        try {
            await apiInstance.post('/sendNotification', {
                user_ids: selectedUsers,
                title,
                message,
                sendToAll,
                send_notification: sendNotification,
                send_email: sendEmail
            });
            toast.success("Notification sent successfully!");
            setSelectedUsers([]);
            setTitle('');
            setMessage('');
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send notification.");
        } finally {
            setNotificationLoader(0);
        }
    };

    const options = ['S No.', 'Name', 'Email', 'Select'];

    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;

    return (
        <>
            <div className="container-fluid" id="tableContainer">
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between align-items-center">
                                    <h6 className="text-white text-capitalize ps-3" id="tableHead">
                                        Send Notification
                                    </h6>
                                </div>
                            </div>

                            <div className="my-3 px-2">
                                <input
                                    className="form-control mb-2"
                                    type="text"
                                    placeholder="Enter notification title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <textarea
                                    className="form-control"
                                    placeholder="Enter your notification message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={3}
                                />
                                <div className="my-2">
                                    <label className="me-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sendNotification}
                                            onChange={(e) => setSendNotification(e.target.checked)}
                                        /> Send Notification
                                    </label>
                                    <label className='cursor-pointer'>
                                        <input
                                            type="checkbox"
                                            checked={sendEmail}
                                            onChange={(e) => setSendEmail(e.target.checked)}
                                        /> Send Email
                                    </label>
                                </div>

                                <button
                                    className="btn btn-primary mt-2 me-2 text-white"
                                    disabled={!message.trim() || selectedUsers.length === 0}
                                    onClick={() => handleSendNotification(0, 1)}
                                >
                                    {notificationLoader == 1 ? "Sending.." : "Send"}
                                </button>
                                <button
                                    className="btn btn-primary mt-2 text-white"
                                    disabled={!message.trim() || !title.trim()}
                                    onClick={() => handleSendNotification(1, 2)}
                                >
                                    {notificationLoader == 2 ? "Sending.." : "Send To All"}
                                </button>
                            </div>

                            <div className="section-body" ref={tableRef}>
                                <div className="card">
                                    <div className="card-body position-relative">
                                        {loading && (
                                            <div className="loader" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="align-items-center d-flex justify-content-between mb-3">
                                            <div className='me-1'>
                                                <input
                                                    type="text"
                                                    placeholder='Search'
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="border-1 form-control px-2"
                                                    style={{ maxWidth: '300px', backgroundColor: 'white' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table text-center align-items-center resturent_table">
                                                <thead>
                                                    <tr>
                                                        {options.map((option, indx) => (
                                                            <th key={indx}>{option}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {data &&
                                                        data.map((user, index) => (
                                                            <tr key={user.id}>
                                                                <td>{index + 1 + (currentPage - 1) * limit}</td>
                                                                <td>
                                                                    {user?.name || ''}
                                                                </td>
                                                                <td>
                                                                    {user?.email || ''}
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedUsers.includes(user.id)}
                                                                        style={{ cursor: "pointer" }}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedUsers((prev) => [...new Set([...prev, user.id])]);
                                                                            } else {
                                                                                setSelectedUsers((prev) => prev.filter((id) => id !== user.id));
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {loading ? <div></div> : data.length === 0 && <div className='text-info text-center' style={{ fontSize: '20px' }}>No data found..</div>}
                                        <div className="row">
                                            {totalPages > 1 && (
                                                <nav aria-label="Page navigation example" className="d-flex justify-content-end w-100" style={{ background: "none" }}>
                                                    <ul className="pagination">
                                                        {/* Previous Button */}
                                                        {currentPage > 1 && (
                                                            <li className="page-item">
                                                                <button
                                                                    className="page-link orange_last"
                                                                    style={{ color: "#185A96" }}
                                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                                >
                                                                    <i className="fas fa-chevron-left"></i>
                                                                </button>
                                                            </li>
                                                        )}

                                                        {(() => {
                                                            const pageNumbers = [];

                                                            if (totalPages <= 4) {
                                                                // Show all pages if totalPages <= 4
                                                                for (let i = 1; i <= totalPages; i++) {
                                                                    pageNumbers.push(i);
                                                                }
                                                            } else {
                                                                if (currentPage <= 2) {
                                                                    pageNumbers.push(1, 2, '...', totalPages);
                                                                } else if (currentPage >= totalPages - 1) {
                                                                    pageNumbers.push(1, '...', totalPages - 1, totalPages);
                                                                } else {
                                                                    pageNumbers.push(1, '...', currentPage, totalPages);
                                                                }
                                                            }

                                                            return pageNumbers.map((page, idx) => {
                                                                const isActive = page === currentPage;
                                                                return (
                                                                    <li key={idx} className={`page-item ${isActive ? 'active' : ''}`}>
                                                                        {page === '...' ? (
                                                                            <span className="page-link" style={{ color: "#185A96" }}>...</span>
                                                                        ) : (
                                                                            <button
                                                                                className="page-link"
                                                                                style={{
                                                                                    color: isActive ? "white" : "#185A96",
                                                                                    backgroundColor: isActive ? "#185A96" : "transparent",
                                                                                    borderColor: isActive ? "#185A96" : "#dee2e6"
                                                                                }}
                                                                                onClick={() => handlePageChange(page)}
                                                                            >
                                                                                {page}
                                                                            </button>
                                                                        )}
                                                                    </li>
                                                                );
                                                            });

                                                        })()}

                                                        {/* Next Button */}
                                                        {currentPage < totalPages && (
                                                            <li className="page-item">
                                                                <button
                                                                    className="page-link orange_last"
                                                                    style={{ color: "#185A96" }}
                                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                                >
                                                                    <i className="fas fa-chevron-right"></i>
                                                                </button>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </nav>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer
                position='top-right'
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

        </>
    );
};

export default SendNotification;