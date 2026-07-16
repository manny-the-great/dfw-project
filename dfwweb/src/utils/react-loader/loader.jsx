import React from 'react'

const CustomLoader = () => {
  return (
    <div className="flex justify-center my-5">
      <div
        className="w-8 h-8 border-4 border-[#185A96]  border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
};

export { CustomLoader };
