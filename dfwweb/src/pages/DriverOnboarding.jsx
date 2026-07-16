import React from 'react';
import { FaAndroid, FaApple } from 'react-icons/fa';
import { MdPhoneIphone } from 'react-icons/md';

const DriverOnboarding = () => {
  return (
    <div className="min-h-[80vh] bg-[#F8F9FA] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#495057] mb-4">Driver Onboarding</h1>
          <p className="text-[#6C757D] text-lg max-w-2xl mx-auto">
            Welcome! Please download the driver application below and follow the instructions to install it on your device.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-10" />

        {/* Download Buttons Section */}
        <div className="flex flex-col space-y-4 max-w-xl mx-auto mb-10">
          <a 
            href="#" 
            className="flex items-center justify-center gap-3 bg-[#185A96] hover:bg-[#134978] text-white text-lg font-semibold py-4 px-6 rounded-lg transition duration-200"
          >
            <FaAndroid className="text-2xl text-[#A4C639]" />
            Download Android APK
          </a>
          <a 
            href="#" 
            className="flex items-center justify-center gap-3 bg-[#212529] hover:bg-[#121416] text-white text-lg font-semibold py-4 px-6 rounded-lg transition duration-200"
          >
            <FaApple className="text-2xl" />
            Download via Apple TestFlight
          </a>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-10" />

        {/* Android Steps */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MdPhoneIphone className="text-2xl text-[#343A40]" />
            <h2 className="text-xl font-bold text-[#343A40]">Android Installation Steps</h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-[#495057] text-lg ml-2">
            <li>Tap <strong>'Download Android APK'</strong> button.</li>
            <li>Allow installation from <strong>"Unknown Sources"</strong>.</li>
            <li>Open the downloaded file and tap <strong>"Install"</strong>.</li>
            <li>Launch the app and sign in with your driver credentials.</li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-10" />

        {/* iPhone Steps */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaApple className="text-2xl text-[#E3000F]" />
            <h2 className="text-xl font-bold text-[#343A40]">iPhone Installation Steps <span className="font-normal text-gray-500">(TestFlight)</span></h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-[#495057] text-lg ml-2">
            <li>Tap <strong>'Download via Apple TestFlight'</strong> button.</li>
            <li>Install TestFlight if prompted.</li>
            <li>Open TestFlight and tap <strong>'Install'</strong> on the driver app.</li>
            <li>Launch the app and sign in with your driver credentials.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default DriverOnboarding;
