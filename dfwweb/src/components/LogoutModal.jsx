import React from 'react'
import {  logout } from "../common/common-assets/assets-images";

const LogoutModal = ({ showModal, closeModal,handleLogout }) => {

    return (
        <>
            {showModal &&
                <div className="fixed inset-0 bg-black/50 flex justify-center  items-center z-50">
                    <div className="bg-white rounded-[30px] shadow-lg px-4 md:px-8 py-10 md:py-15 w-[300px] sm:w-[340px] md:w-[370px] text-center relative">
                        <div className="flex justify-center mb-4">
                            <img src={logout} alt="" />
                        </div>
                        <h2 className="text-[20px] font-medium mb-7">Are you sure want to Log Out?</h2>
                        <div className='flex items-center justify-center gap-3'>
                            <button
                                onClick={handleLogout}
                                className="bg-[#185A96] hover:bg-[#164d82] text-white px-10 py-2 rounded-[12px] text-xl font-medium cursor-pointer"
                            >
                                Yes
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-[#a5a5a5] hover:bg-[#a1a1a1] text-white px-10 py-2 rounded-[12px] text-xl font-medium cursor-pointer"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default LogoutModal
