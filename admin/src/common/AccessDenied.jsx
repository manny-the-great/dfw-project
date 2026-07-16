import React from "react";

const AccessDenied = () => {
    return (
        <div
            style={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                textAlign: "center"
            }}
        >
            <div
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "#f1f1f1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
            >
                <i className="material-icons" style={{ fontSize: 60, color: "#b3b3b3" }}>
                    lock
                </i>
            </div>

            <h2 style={{ color: "#333", fontWeight: 600 }}>Access Restricted</h2>

            <p style={{ color: "#777", maxWidth: 350, marginTop: 10 }}>
                You don’t have permission to access this page.
                Please contact the admin if you believe this is an error.
            </p>
        </div>
    );
};

export default AccessDenied;
