
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiInstance from '../utils/apiInstance';
import { Link, useSearchParams } from 'react-router-dom';
import { imageBaseUrl } from '../utils/apiInstance';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import '../common/Table.css';
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const UserList = () => {
    const userDetails = useSelector((state) => state.users.user);
    const tableRef = useRef(null);
    const role = 2;
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [statusLoading, setStatusLoading] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = parseInt(searchParams.get("page")) || 1;
    const initialSearch = searchParams.get("search") || "";
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    const fetchData = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/user_list`, {
                params: {
                    page,
                    limit,
                    search,
                    role
                }
            });
            setData(response.data?.user_list);
            setTotalPages(response.data?.totalPages);
            setCurrentPage(response.data?.currentPage);
            setSearchParams({ page, search }, { replace: true });
        } catch (error) {
            setError("An error occurred while fetching users...");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get("page")) || 1;
        const search = searchParams.get("search") || "";
        fetchData(page, search);
    }, [searchParams]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentSearch = searchParams.get("search") || "";
            const currentPage = parseInt(searchParams.get("page")) || 1;

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
        userDetails?.admin?.user_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }


    const handleSwitchChange = async (id) => {
        setStatusLoading(id)
        try {
            await apiInstance.put(`/toggle_status/${id}`);
            toast.success('User status updated successfully');
            setData((prevData) =>
                prevData.map((item) =>
                    item.id === id
                        ? { ...item, status: item.status === 1 ? 0 : 1 }
                        : item
                )
            );
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setStatusLoading(null)
        }
    }

    const canView = userDetails?.admin?.role == 0 || userDetails?.admin?.user_view == 1;
    const canUpdate = userDetails?.admin?.role == 0 || userDetails?.admin?.user_update == 1;
    const options = ['S No.', 'Image', 'Name', 'email'];
    if (canUpdate) {
        options.push('Status');
    }
    if (canView) {
        options.push('Actions');
    }
    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;
    return (
        <>
            <div className="container-fluid" id="tableContainer" ref={tableRef}>
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between align-items-center">
                                    <h6 className="text-white text-capitalize ps-3" id="tableHead">
                                        Users
                                    </h6>
                                </div>
                            </div>

                            <div className="section-body">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="align-items-center d-flex justify-content-end mb-3">
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

                                                    {data && data?.length > 0 &&
                                                        data.map((user, index) => (
                                                            <tr key={user.id}>
                                                                <td>{index + 1 + (currentPage - 1) * limit}</td>
                                                                <td>
                                                                    {user?.profile_picture ? (
                                                                        <img
                                                                            src={`${imageBaseUrl}/${user.profile_picture}`}
                                                                            alt="profile"
                                                                            className='tableimg'
                                                                            style={{ objectFit: "cover" }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src="/user.png"
                                                                            alt="profile"
                                                                            className='tableimg'
                                                                            style={{ objectFit: "cover" }}
                                                                        />
                                                                    )}
                                                                </td>
                                                                <td>{user?.name || ''}</td>
                                                                <td>{user?.email || ''}</td>
                                                                {canUpdate && (
                                                                    <td>
                                                                        {statusLoading === user.id ? (
                                                                            <div className="spinner-border text-secondary text-info" style={{ width: "1.5rem", height: "1.5rem" }} />
                                                                        ) : (
                                                                            <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="checkbox"
                                                                                    id={`toggleStatus${user.id}`}
                                                                                    checked={user?.status == 1}
                                                                                    onChange={() => handleSwitchChange(user.id)}
                                                                                    style={{
                                                                                        backgroundColor: user?.status == 1 ? '#185A96' : 'lightgray',
                                                                                        borderColor: user?.status == 1 ? '#185A96' : 'lightgray',
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                )}
                                                                {canView && (
                                                                    <td>
                                                                        <Link
                                                                            data-tooltip-id="my-tooltip" data-tooltip-content="view"
                                                                            to={`/viewUser/${user.id}?page=${currentPage}&search=${searchQuery}`}
                                                                            className="has-icon btn m-1 bg-info"
                                                                            style={{
                                                                                color: 'white',
                                                                            }}
                                                                        >
                                                                            <i className="me-100 fas fa-eye" />
                                                                        </Link>
                                                                    </td>
                                                                )}
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

export default UserList;