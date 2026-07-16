
import React, { useEffect, useState, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import apiInstance from '../utils/apiInstance';
import { Link, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import '../common/Table.css';

const UserBookings = ({ id }) => {
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

    const initialBookingPage = parseInt(searchParams.get("bookingPage")) || 1;
    const initialBookingSearch = searchParams.get("bookingSearch") || "";

    const [bookingCurrentPage, setCurrentBookingPage] = useState(initialBookingPage);
    const [bookingSearchQuery, setBookingSearchQuery] = useState(initialBookingSearch);

    const fetchData = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/get_user_booking_list/${id}`, {
                params: {
                    page,
                    limit,
                    search
                }
            });
            setData(response.data?.booking_list);
            setTotalPages(response.data?.totalPages);
            setCurrentBookingPage(response.data?.currentPage);
            setSearchParams(prev => {
                const updatedParams = new URLSearchParams(prev);
                updatedParams.set("bookingPage", page);
                updatedParams.set("bookingSearch", search);
                return updatedParams;
            });

        } catch (error) {
            setError("An error occurred while fetching bookings...");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const page = parseInt(searchParams.get("bookingPage")) || 1;
        const search = searchParams.get("bookingSearch") || "";
        fetchData(page, search);
    }, [searchParams, id]);



    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const currentSearch = searchParams.get("bookingSearch") || "";
            const currentPage = parseInt(searchParams.get("bookingPage")) || 1;

            if (bookingSearchQuery !== currentSearch) {
                fetchData(1, bookingSearchQuery);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [bookingSearchQuery, id]);

    const handlePageChange = (page) => {
        fetchData(page, bookingSearchQuery);
        tableRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const options = ['S No.', 'Customer', 'Escort', 'Price', 'Status', 'Actions'];

    if (error) return <div>{error}<br />Please try again after some time or check your internet connection.</div>;

    return (
        <>
            <div className="container-fluid" id="tableContainer" ref={tableRef}>
                <div className="row">
                    <div className="col-12">
                        <div className="card my-4">
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between align-items-center">
                                    <h6 className="text-white text-capitalize ps-3 py-4" id="tableHead">
                                        {/* Bookings */}
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
                                                    value={bookingSearchQuery}
                                                    onChange={(e) => setBookingSearchQuery(e.target.value)}
                                                    className="border border-1 form-control px-2"
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
                                                        data.map((booking, index) => (
                                                            <tr key={booking.id}>
                                                                <td>{index + 1 + (bookingCurrentPage - 1) * limit}</td>
                                                                <td>{booking?.bookedBy?.name || ''}</td>
                                                                <td>{booking?.bookedTo?.name || ''}</td>
                                                                <td>{booking?.total_price?.toFixed(2) || ''}</td>
                                                                {/* <td>{request?.requestedTo?.escort_service?.serviceDetails_service?.name || ''}</td> */}
                                                                <td>
                                                                    {booking?.status === 1 && <span style={{ color: 'orange' }}>Upcoming</span>}
                                                                    {booking?.status === 2 && <span style={{ color: 'blue' }}>Ongoing</span>}
                                                                    {booking?.status === 3 && <span style={{ color: 'green' }}>Completed</span>}
                                                                </td>
                                                                <td>
                                                                    <Link
                                                                        data-tooltip-id="my-tooltip" data-tooltip-content="view"
                                                                        to={`/viewBookings/${booking.id}?page=${currentPage}&search=${searchQuery}&bookingPage=${bookingCurrentPage}&bookingSearch=${bookingSearchQuery}`}
                                                                        className="has-icon btn m-1 bg-info"
                                                                        style={{
                                                                            color: 'white',
                                                                        }}
                                                                    >
                                                                        <i className="me-100 fas fa-eye" />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {loading ? <div></div> : data.length === 0 && <div className='text-info text-center' style={{ fontSize: '20px' }}>No data found..</div>}

                                        <div className="row">
                                            <nav aria-label="Page navigation example" className="d-flex justify-content-end w-100" style={{ background: "none" }}>
                                                <ul className="pagination">
                                                    {/* Previous Button */}
                                                    {bookingCurrentPage > 1 && (
                                                        <li className="page-item">
                                                            <button
                                                                className="page-link orange_last"
                                                                style={{ color: "#185A96" }}
                                                                onClick={() => handlePageChange(bookingCurrentPage - 1)}
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
                                                            if (bookingCurrentPage <= 2) {
                                                                pageNumbers.push(1, 2, '...', totalPages);
                                                            } else if (bookingCurrentPage >= totalPages - 1) {
                                                                pageNumbers.push(1, '...', totalPages - 1, totalPages);
                                                            } else {
                                                                pageNumbers.push(1, '...', bookingCurrentPage, totalPages);
                                                            }
                                                        }

                                                        return pageNumbers.map((page, idx) => {
                                                            const isActive = page === bookingCurrentPage;
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
                                                    {bookingCurrentPage < totalPages && (
                                                        <li className="page-item">
                                                            <button
                                                                className="page-link orange_last"
                                                                style={{ color: "#185A96" }}
                                                                onClick={() => handlePageChange(bookingCurrentPage + 1)}

                                                            >
                                                                <i className="fas fa-chevron-right"></i>
                                                            </button>
                                                        </li>
                                                    )}
                                                </ul>
                                            </nav>
                                        </div>
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

export default UserBookings;



