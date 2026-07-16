import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import apiInstance from "../utils/apiInstance";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import AccessDenied from "../common/AccessDenied";
const DeliveryCharges = () => {
    const userDetails = useSelector((state) => state.users.user);
    const [deliveryCharges, setDeliveryCharges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchDeliveryCharges = async () => {
        try {
            const res = await apiInstance.get("/get_deliveryFee");
            setDeliveryCharges(res?.data?.charges || []);
        } catch (err) {
            toast.error("Failed to fetch delivery charges");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryCharges();
    }, []);

    const handleFeeChange = (id, value) => {
        if (value === "") {
            updateValue(id, value);
            return;
        }

        const regex = /^\d{0,8}(\.\d{0,2})?$/;

        if (!regex.test(value)) return; // block invalid input

        updateValue(id, value);
    };

    const updateValue = (id, value) => {
        const updated = deliveryCharges.map((item) =>
            item.id === id ? { ...item, delivery_fee: value } : item
        );
        setDeliveryCharges(updated);
    };


    const handleSave = async () => {
        setSaving(true);

        try {
            const payload = {
                updatedDeliveryFee: deliveryCharges.map((item) => ({
                    id: item.id,
                    delivery_fee: parseFloat(item.delivery_fee),
                })),
            };

            await apiInstance.put("/update_deliveryFee", payload);
            toast.success("Delivery fees updated successfully!");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error while updating fees");
        } finally {
            setSaving(false);
        }
    };

    const canUpdate = userDetails?.admin?.role == 0 || userDetails?.admin?.delivery_charges_update == 1;
    const hasAccess =
        userDetails?.admin?.role == 0 ||
        userDetails?.admin?.delivery_charges_view == 1;

    if (!userDetails || !userDetails.admin) {
        return null;
    }

    if (!hasAccess) {
        return <AccessDenied />;
    }
    return (
        <div className="container-fluid">
            <div className="card my-4">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div className="bg-info shadow-dark border-radius-lg d-flex justify-content-between">
                        <h6 className="text-white text-capitalize ps-3">Delivery Charges</h6>
                    </div>
                </div>


                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="section-body">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive mt-5">
                                    <table className="table  text-center resturent_table align-items-center">
                                        <thead className="">
                                            <tr>
                                                <th>S No.</th>
                                                <th>Distance in Mile</th>
                                                <th>Fee ($)</th>
                                                <th>Type</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {deliveryCharges.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>
                                                        {item.end_mile > 100000.9 ? `Above ${item?.start_mile} miles` : item.end_mile < 100000.9 ? `${item?.start_mile} - ${item.end_mile}` : null}
                                                    </td>
                                                    <td style={{ width: "150px" }}>
                                                        <input
                                                            type="text"
                                                            value={item.delivery_fee}
                                                            className="form-control text-center"
                                                            disabled={!canUpdate}
                                                            onChange={(e) =>
                                                                handleFeeChange(item.id, e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        {item.fee_type === 0 ? "Fixed" : "Per Mile"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-end mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
};

export default DeliveryCharges;
