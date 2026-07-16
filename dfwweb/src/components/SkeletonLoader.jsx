import Skeleton from "react-loading-skeleton";

const OrderDetailsSkeleton = () => (
    <div className="w-full px-8 py-6">
        <Skeleton height={25} width={200} className="mb-4" />
        <Skeleton height={20} width={"80%"} className="mb-2" />
        <Skeleton height={20} width={"60%"} className="mb-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <Skeleton height={80} />
            <Skeleton height={80} />
            <Skeleton height={80} />
        </div>

        <Skeleton height={30} width={250} className="mt-6 mb-3" />
        <Skeleton count={6} height={18} />
    </div>
);

const OrderHeaderSkeleton = () => (
    <div className="flex justify-between items-center bg-[#185A96] text-white px-6 py-3 rounded-t-lg">
        <Skeleton height={28} width={180} baseColor="#1a4f7d" highlightColor="#2e6ea1" />
        <Skeleton height={28} width={150} baseColor="#1a4f7d" highlightColor="#2e6ea1" />
    </div>
);

const OrderCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">

            {/* Blue Header */}
            <div className="flex justify-between items-center bg-[#185A96] px-5 py-4 rounded-t-lg">
                <Skeleton width={150} height={28} baseColor="#1a4f7d" highlightColor="#2e6ea1" />
                <Skeleton width={120} height={28} baseColor="#1a4f7d" highlightColor="#2e6ea1" />
            </div>

            {/* Body */}
            <div className="px-10 py-4">

                {/* Grid 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={28} width={120} />
                </div>

                {/* Section Title */}
                <Skeleton height={28} width={250} />

                {/* Grid 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                </div>

            </div>
        </div>
    );
};

const NotificationSkeleton = () => {
    return (
        <div className="px-5 xl:px-10 py-5 flex flex-col sm:flex-row border border-[#DCDCDC] rounded-[10px] gap-5 w-full my-10">

            {/* Image Skeleton */}
            <Skeleton circle={true} height={60} width={60} />

            <div className="w-full space-y-3">
                {/* Title + Date */}
                <div className="flex justify-between items-center">
                    <Skeleton width={150} height={20} />
                    <Skeleton width={90} height={20} />
                </div>

                {/* Description */}
                <Skeleton count={2} height={16} />
            </div>
        </div>
    );
};

const WelcomeSkeleton = () => (
    <div className="container py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
            <Skeleton height={40} width={300} className="mb-4" />
            <Skeleton count={6} height={18} />
        </div>
        <Skeleton height={260} className="rounded-xl" />
    </div>
);

const WorksSkeleton = () => (
    <div className="bg-black py-16">
        <div className="text-center mb-10">
            <Skeleton height={40} width={250} className="mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-6 text-center"
                >
                    <Skeleton circle height={80} width={80} className="mx-auto mb-4" />
                    <Skeleton height={22} width={150} className="mx-auto mb-2" />
                    <Skeleton height={14} width={100} className="mx-auto" />
                </div>
            ))}
        </div>
    </div>
);
const RatingSkeleton = () => (
    <div className="py-16 px-6">
        <div className="text-center mb-10">
            <Skeleton height={40} width={300} className="mx-auto mb-3" />
            <Skeleton height={32} width={200} className="mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <Skeleton circle height={50} width={50} />
                        <div>
                            <Skeleton height={18} width={120} />
                            <Skeleton height={14} width={80} />
                        </div>
                    </div>
                    <Skeleton count={3} height={14} />
                    <Skeleton height={16} width={100} className="mt-3" />
                </div>
            ))}
        </div>
    </div>
);

const TotalSkeleton = () => (
    <div className="bg-black py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-2xl p-8 text-center"
                >
                    <Skeleton circle height={70} width={70} className="mx-auto mb-4" />
                    <Skeleton height={22} width={150} className="mx-auto mb-2" />
                    <Skeleton height={36} width={80} className="mx-auto" />
                </div>
            ))}
        </div>
    </div>
);

const ContactSkeleton = () => (
    <div className="container py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
            <Skeleton height={40} width={200} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={120} />
            <Skeleton height={45} width={150} />
        </div>

        <Skeleton height={350} className="rounded-xl" />
    </div>
);
export { OrderDetailsSkeleton, OrderHeaderSkeleton, OrderCardSkeleton, NotificationSkeleton, WelcomeSkeleton, WorksSkeleton, RatingSkeleton, TotalSkeleton, ContactSkeleton }