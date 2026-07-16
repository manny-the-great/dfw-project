import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const CustomPagination = ({ count = 1, page = 1, onChange = () => { } }) => {
    const getPages = () => {
        const pages = [];

        if (count <= 3) {
            for (let i = 1; i <= count; i++) pages.push(i);
            return pages;
        }

        if (page <= 2) {
            return [1, 2, "...", count];
        }

        if (page >= count - 1) {
            return [1, "...", count - 1, count];
        }

        return [1, "...", page, "...", count];
    };

    const handlePageClick = (p) => {
        if (p !== "..." && p !== page) onChange(null, p);
    };

    return (
        <div className="flex justify-end w-full py-4">
            <div className="flex items-center space-x-2">

                <button
                    onClick={() => page > 1 && onChange(null, page - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full 
                     text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                    <IoChevronBack size={16} />
                </button>

                {getPages().map((p, i) => (
                    <button
                        key={i}
                        disabled={p === "..."}
                        onClick={() => handlePageClick(p)}
                        className={`w-7 h-7 flex items-center justify-center rounded-full mx-[2px]
              text-[13px] font-semibold
              ${p === page ? "text-white bg-[#185A96]" : "text-gray-600"}
              ${p === "..." ? "cursor-default" : "cursor-pointer hover:bg-gray-100"}
            `}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => page < count && onChange(null, page + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full 
                     text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                    <IoChevronForward size={16} />
                </button>

            </div>
        </div>
    );
};

export default CustomPagination;
