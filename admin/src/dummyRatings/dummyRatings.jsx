
import React, { useEffect, useState, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiInstance from '../utils/apiInstance';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import '../common/Table.css';
import { imageBaseUrl } from '../utils/apiInstance';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";

const DummyRatings = () => {
    const userDetails = useSelector((state) => state.users.user);
    const navigate = useNavigate();
    const tableRef = useRef(null);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(20);
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
            const response = await apiInstance.get(`/get_rating_list`, {
                params: {
                    page,
                    limit,
                    search
                }
            });
            setData(response.data?.rating_list);
            setTotalPages(response.data?.totalPages);
            setCurrentPage(response.data?.currentPage);
            setSearchParams({ page, search }, { replace: true });
        } catch (error) {
            setError("An error occurred while fetching ratings...");
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
        userDetails?.admin?.dummy_rating_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }

    const renderStars = (count) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fas fa-star ${i <= count ? 'text-warning' : 'text-muted'}`}
                ></i>
            );
        }
        return stars;
    };

    const truncateText = (text, maxLength = 10) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleDeleteClick = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#185A96",
            cancelButtonColor: "#ed2121",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                content: 'custom-swal-content',
                confirmButton: 'custom-swal-button',
                cancelButton: 'custom-swal-button'
            }
        });
        if (result.isConfirmed) {
            if (id) {
                setLoading(true);
                try {
                    await apiInstance.delete(`/delete_rating/${id}`);
                    Swal.fire("Deleted!", "Rating has been deleted.", "success");
                    fetchData();
                } catch (error) {
                    Swal.fire(
                        "Error!",
                        error?.response?.data?.message || "Error deleting rating",
                        "error"
                    );
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const canView = userDetails?.admin?.role == 0 || userDetails?.admin?.dummy_rating_view == 1;
    const canUpdate = userDetails?.admin?.role == 0 || userDetails?.admin?.dummy_rating_update == 1;
    const canAdd = userDetails?.admin?.role == 0 || userDetails?.admin?.dummy_rating_add == 1;
    const canDelete = userDetails?.admin?.role == 0 || userDetails?.admin?.dummy_rating_delete == 1;
    const options = ['S No.', 'Image', 'Rated By', 'Ratings'];

    if (canView || canUpdate || canDelete || canAdd) {
        options.push('Actions')
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
                                        Dummy Ratings
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
                                                    className=" border-1 form-control px-2"
                                                    style={{ maxWidth: '300px', backgroundColor: 'white' }}
                                                />
                                            </div>
                                            {data && data?.length < 20 && canAdd &&
                                                <div>
                                                    <button
                                                        type="button"
                                                        data-tooltip-id="addBtn" data-tooltip-content="Add Ratings"
                                                        className="btn btn-info add_btn text-white my-0 mx-1"
                                                        onClick={() => navigate('/addDummyRating')}
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            }
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
                                                        data.map((rating, index) => (
                                                            <tr key={rating.id}>
                                                                <td>{index + 1 + (currentPage - 1) * limit}</td>
                                                                <td>
                                                                    <td className='d-flex justify-content-center align-items-center'>
                                                                        {rating?.image ? (
                                                                            <img
                                                                                src={`${imageBaseUrl}/${rating.image}`}
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
                                                                </td>
                                                                <td>{rating?.name || ''}</td>
                                                                <td>
                                                                    <div>{renderStars(rating.ratings)}</div>
                                                                </td>
                                                                {(canUpdate || canView || canDelete) && (
                                                                    <td>
                                                                        {canView && (
                                                                            <Link
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content="view"
                                                                                to={`/viewDummyRating/${rating.id}?page=${currentPage}&search=${searchQuery}`}
                                                                                className="has-icon btn m-1 bg-info"
                                                                                style={{
                                                                                    color: 'white',
                                                                                }}
                                                                            >
                                                                                <i className="me-100 fas fa-eye" />
                                                                            </Link>
                                                                        )}
                                                                        {canUpdate && (
                                                                            <Link
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content="Edit"
                                                                                to={`/editDummyRating/${rating.id}?page=${currentPage}&search=${searchQuery}`}
                                                                                className="has-icon btn m-1 bg-info"
                                                                                style={{
                                                                                    color: 'white',
                                                                                }}
                                                                            >
                                                                                <i className="me-100 fas fa-edit" />
                                                                            </Link>
                                                                        )}
                                                                        {canDelete && (
                                                                            <button
                                                                                onClick={() => handleDeleteClick(rating?.id)}
                                                                                className="has-icon btn m-1 bg-danger"
                                                                                data-tooltip-id="my-tooltip" data-tooltip-content="Delete"
                                                                                style={{
                                                                                    borderColor: '#110011',
                                                                                    color: '#fff',
                                                                                }}
                                                                            >
                                                                                <i className="me-100 fas fa-trash" />
                                                                            </button>
                                                                        )}
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

            {
                loading && (
                    <div className="loader" style={{ position: 'absolute', top: '50%', left: '59%', transform: 'translate(-50%, -50%)' }}>
                        <div className="spinner-border text-info" role="status" style={{ width: '50px', height: '50px' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )
            }
            <Tooltip id="my-tooltip" place="top" type="dark" effect="solid" />
        </>
    );
};

export default DummyRatings;


