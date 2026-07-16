import React from "react";
import { Link } from "react-router-dom";
import { pageNotFound } from "../common/common-assets/assets-images";

const PageNotFound = () => {
    return (
        <>
            <style>
                {`
                .page-container {
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .page-container img {
                    width: 220px;
                    margin-bottom: 20px;
                }
                .page-container h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    color: #333;
                }
                .page-container p {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                    color: #666;
                }
                .btn-gradient {
                    padding: 10px 20px;
                    font-size: 1rem;
                    background: linear-gradient(135deg, #007bff, #E43870);
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    display: inline-block;
                }
                .btn-gradient:hover {
                    background: linear-gradient(135deg, #E43870, #007bff);
                }
                `}
            </style>

            <div className="page-container">
                <img src={pageNotFound} alt="404 Not Found" />
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you are looking for doesn’t exist.</p>
                <Link to="/" className="btn-gradient">
                    Go Back Home
                </Link>
            </div>
        </>
    );
};

export default PageNotFound;
