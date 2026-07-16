import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const DeleteNotificationModal = ({ handleDelete, handleClose, isLoader }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[400px] p-6 shadow-[0_0_25px_rgba(0,0,0,0.18)] text-center">

                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <FaTrashAlt className="text-red-600 text-3xl" />
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">
                    Are you sure you want to clear all notifications?
                </h2>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDelete}
                        disabled={isLoader}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
                    >
                        Yes
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isLoader}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                    >
                        No
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteNotificationModal;
