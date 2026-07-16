
import React, { useEffect, useState, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from "sweetalert2";
import apiInstance from '../utils/apiInstance';
import { Link, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import '../common/Table.css';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const OrderList = () => {
    const userDetails = useSelector((state) => state.users.user);
    const tableRef = useRef(null);
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
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
    const [orderType, setOrderType] = useState(
        searchParams.get("order_type") || "all"
    );


    const fetchData = async (page = 1, search = '', status = 'all',orderType = 'all') => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/order_list`, {
                params: {
                    page,
                    limit,
                    search,
                    status: status !== "all" ? status : undefined,
                    order_type: orderType !== "all" ? orderType : undefined
                }
            });
            setData(response.data?.order_list);
            setTotalPages(response.data?.totalPages);
            setCurrentPage(response.data?.currentPage);
            setSearchParams({
                page,
                search,
                status,
                order_type: orderType
            }, { replace: true });
        } catch (error) {
            setError("An error occurred while fetching orders...");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get("page")) || 1;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const type = searchParams.get("order_type") || "all";
        setStatusFilter(status);
        setOrderType(type);
        fetchData(page, search, status, type);
    }, [searchParams]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            const currentStatus = searchParams.get("status") || "all";
            const currentType = searchParams.get("order_type") || "all";
            if (searchQuery !== currentSearch) {
                fetchData(1, searchQuery, currentStatus, currentType);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);




    const handlePageChange = (page) => {
        fetchData(page, searchQuery, statusFilter, orderType);
        tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const [orderLocationUpdate, setOrderLocationUpdate] = useState({});

    const handleInputChange = (orderId, value) => {
        setOrderLocationUpdate((prev) => ({
            ...prev,
            [orderId]: value,
        }));
    };

    const handleUpdate = async (id, current_order_location) => {
        const updatedValue = orderLocationUpdate[id];
        if (!id || (!updatedValue && !current_order_location)) {
            toast.error("Please enter location");
            return
        }
        try {
            await apiInstance.put("/update_order_location", { id, location: updatedValue ? updatedValue : current_order_location })
            toast.success("Order location updated")
            setOrderLocationUpdate(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });

            // 🔥 Re-fetch to get updated location in UI
            fetchData(currentPage, searchQuery, statusFilter);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    };

    const canView = userDetails?.admin?.role == 0 || userDetails?.admin?.order_view == 1;
    const canUpdate = userDetails?.admin?.role == 0 || userDetails?.admin?.order_update == 1;

    const options = ['S No.', 'Order Id', 'Service Type', "Store Name"];

    if (canUpdate) {
        options.push('Current Location', 'Status')
    }

    if (canView) {
        options.push('Actions');
    }

    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.order_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }
    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;

    return (
        <>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="container-fluid" id="tableContainer" ref={tableRef}>
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between align-items-center">
                                    <h6 className="text-white text-capitalize ps-3" id="tableHead">
                                        Orders
                                    </h6>

                                </div>
                            </div>

                            <div className="section-body">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="align-items-center d-flex justify-content-end flex-wrap mb-3">
                                            <div className='me-1 my-1'>
                                                <input
                                                    type="text"
                                                    placeholder="Search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="border-1 form-control px-2"
                                                    style={{
                                                        maxWidth: '300px',
                                                        backgroundColor: 'white',
                                                        height: "48px"       // ⭐ match height
                                                    }}
                                                />

                                            </div>
                                            <div className='me-2 my-1'>
                                                <select
                                                    className="form-select"
                                                    value={statusFilter}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        setStatusFilter(newStatus);
                                                        fetchData(1, searchQuery, newStatus);
                                                    }}
                                                    style={{
                                                        maxWidth: '200px',
                                                        minWidth: "100px",
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        border: "2px solid grey",
                                                        height: "48px",
                                                        fontSize: "16px"
                                                    }}
                                                >

                                                    <option value="all">All</option>
                                                    <option value="0">Ongoing</option>
                                                    <option value="1">Delivered</option>
                                                    <option value="2">Cancelled</option>
                                                </select>
                                            </div>
                                            <div className="me-2 my-1">
                                                <select
                                                    className="form-select"
                                                    value={orderType}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setOrderType(value);
                                                        fetchData(1, searchQuery, statusFilter, value);
                                                    }}
                                                    style={{
                                                        maxWidth: '200px',
                                                        minWidth: "150px",
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        border: "2px solid grey",
                                                        height: "48px",
                                                        fontSize: "16px"
                                                    }}
                                                >
                                                    <option value="all">All Services</option>
                                                    <option value="0">Pickup Service</option>
                                                    <option value="1">Other Services</option>
                                                </select>
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
                                                        data.map((order, index) => (
                                                            <tr key={order.id}>
                                                                <td>{index + 1 + (currentPage - 1) * limit}</td>
                                                                <td>{order?.order_id || ''}</td>
                                                                <td>{order?.type == 0 ? "Pickup Service" : 'Other Service'}</td>
                                                                <td className={order?.store_name ? "" : "text-danger"}>{order?.store_name ? order?.store_name : 'No Store'}</td>
                                                                {canUpdate && (
                                                                    <td>
                                                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    orderLocationUpdate[order.id] !== undefined
                                                                                        ? orderLocationUpdate[order.id]
                                                                                        : order?.current_order_location || ""
                                                                                }

                                                                                onChange={(e) => handleInputChange(order.id, e.target.value)}
                                                                                disabled={order.status != 0}
                                                                                style={{
                                                                                    width: "100%",
                                                                                    padding: "6px",
                                                                                    border: "1px solid #ccc",
                                                                                    borderRadius: "4px",
                                                                                }}
                                                                            />
                                                                            {order?.status == 0 &&
                                                                                <button
                                                                                    onClick={() => handleUpdate(order.id, order.current_order_location)}
                                                                                    style={{
                                                                                        padding: "6px 12px",
                                                                                        background: "#185A96",
                                                                                        color: "#fff",
                                                                                        border: "none",
                                                                                        borderRadius: "4px",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                >
                                                                                    Update
                                                                                </button>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                {canUpdate && (
                                                                    <td>
                                                                        <select
                                                                            className="form-select"
                                                                            style={{ maxWidth: "150px", margin: "0 auto" }}
                                                                            value={order.tempStatus ?? order.status}
                                                                            disabled={order.status === 1 || order.status === 2}
                                                                            onChange={async (e) => {
                                                                                const newStatus = parseInt(e.target.value);

                                                                                if (newStatus === order.status) return;
                                                                                if (![1, 2].includes(newStatus)) return;

                                                                                const result = await Swal.fire({
                                                                                    title: "Are you sure?",
                                                                                    text: `You are updating status to ${newStatus === 1 ? "Delivered" : "Cancelled"}. This cannot be undone.`,
                                                                                    icon: "warning",
                                                                                    showCancelButton: true,
                                                                                    confirmButtonColor: "#3085d6",
                                                                                    cancelButtonColor: "#d33",
                                                                                    confirmButtonText: "Yes, update it!"
                                                                                });

                                                                                if (result.isConfirmed) {
                                                                                    try {
                                                                                        await apiInstance.put(`/update_order_status/${order.id}`, { status: newStatus });

                                                                                        fetchData(currentPage, searchQuery, statusFilter);

                                                                                        Swal.fire("Updated!", "Order status has been updated.", "success");
                                                                                    } catch (err) {
                                                                                        Swal.fire("Error!", error?.response?.data?.message || "Failed to update status.", "error");
                                                                                    }
                                                                                } else {
                                                                                    // Reset back if cancelled
                                                                                    setData(prev =>
                                                                                        prev.map(o =>
                                                                                            o.id === order.id
                                                                                                ? { ...o, tempStatus: o.status }
                                                                                                : o
                                                                                        )
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value={0}>Ongoing</option>
                                                                            <option value={1}>Delivered</option>
                                                                            <option value={2}>Cancelled</option>
                                                                        </select>
                                                                    </td>
                                                                )}

                                                                {canView &&
                                                                    <td>
                                                                        <Link
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content="view"
                                                                            to={`/orderDetails/${order.id}?page=${currentPage}&search=${searchQuery}`}
                                                                            className="has-icon btn m-1 bg-info"
                                                                            style={{
                                                                                color: 'white',
                                                                            }}
                                                                        >
                                                                            <i className="me-100 fas fa-eye" />
                                                                        </Link>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {loading ? <div></div> : data?.length === 0 && <div className='text-info text-center' style={{ fontSize: '20px' }}>No data found..</div>}

                                        {totalPages > 1 &&
                                            <div className="row">
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
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loader" style={{ position: 'absolute', top: '50%', left: '59%', transform: 'translate(-50%, -50%)' }}>
                    <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <Tooltip id="my-tooltip" place="top" type="dark" effect="solid" />
        </>
    );
};

export default OrderList;



