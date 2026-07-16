import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { get_delivery_charges } from '../utils/thunkApis';

const Summary = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleOk = () => {
    setShowModal(false);
    navigate('/current-order');
  };

  const AxiosInstance = axiosInstance();
  const deliveryCharges = useSelector((state) => state.users.deliveryCharges);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [serviceData, setServiceData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0.00)
  const [distanceMiles, setDistanceMiles] = useState();
  const [isLoader, setIsLoader] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const address = sessionStorage.getItem("selectedUserAddress");
    const productPrice = sessionStorage.getItem("productPrice");
    const service = sessionStorage.getItem("pickupServiceData");
    const selectedCard = sessionStorage.getItem("selectedCard");

    if (!productPrice || !service || !selectedCard) {
      navigate("/");
      return;
    }

    if (address) {
      setSelectedAddress(JSON.parse(address));
    }
    setProductPrice(JSON.parse(productPrice));
    setServiceData(JSON.parse(service));
    setSelectedCard(JSON.parse(selectedCard));
    const data = JSON.parse(service);

    if (data?.pickupLat && data?.pickupLng && data?.deliveryLat && data?.deliveryLng) {

      const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;

        const R = 3958.8; // Radius of Earth in miles
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const miles = haversineDistance(
        data.pickupLat,
        data.pickupLng,
        data.deliveryLat,
        data.deliveryLng
      );

      setDistanceMiles(miles.toFixed(2));
    }
  }, []);

  const fetchDeliveryCharges = async () => {
    try {
      await dispatch(get_delivery_charges());
    } catch (error) {
      // console.log("error charges", error)
    }
  }
  useEffect(() => {
    fetchDeliveryCharges();
  }, [])

  const calculateDeliveryFee = (distance, tiers) => {
    // if (!distance || distance <= 0) return 0;
    if (distance == null || isNaN(distance)) return 0;
    if (distance === 0) {
      const fixedTier = tiers.find(t => t.fee_type === 0);
      return fixedTier ? Number(fixedTier.delivery_fee) : 0;
    }

    // Normalize tier boundaries (fix incorrect DB issues)
    tiers = tiers.map(t => ({
      ...t,
      start_mile: Number(Number(t.start_mile).toFixed(2)),
      end_mile: Number(Number(t.end_mile).toFixed(2)),
      delivery_fee: Number(t.delivery_fee),
    }));

    let totalFee = 0;

    // First, find the FIXED fee tier (fee_type = 0)
    const fixedTier = tiers.find(t => t.fee_type === 0);

    if (!fixedTier) return 0;

    const fixedStart = fixedTier.start_mile;
    const fixedEnd = fixedTier.end_mile;

    // CASE 1: Distance within fixed tier → direct $8
    if (distance <= fixedEnd) {
      return Number(fixedTier.delivery_fee);
    }

    // CASE 2: Distance exceeds fixed tier → add fixed fee first
    totalFee += fixedTier.delivery_fee;
    let remainingDistance = distance - fixedEnd;

    // Get all per-mile tiers (fee_type = 1), sorted by start
    const perMileTiers = tiers
      .filter(t => t.fee_type === 1)
      .sort((a, b) => a.start_mile - b.start_mile);

    // Iterate each tier to calculate extra miles
    for (const tier of perMileTiers) {
      const tierStart = tier.start_mile;
      const tierEnd = tier.end_mile;

      // If no remaining distance → stop
      if (remainingDistance <= 0) break;

      // Calculate miles in this tier
      let milesInTier = Math.min(distance, tierEnd) - tierStart;

      // Fix DB boundary gap issues (e.g., 5.5 vs 5.6)
      if (milesInTier < 0) milesInTier = 0;

      if (milesInTier > 0) {
        totalFee += milesInTier * tier.delivery_fee;
        remainingDistance -= milesInTier;
      }
    }

    return Number(totalFee.toFixed(2));
  };


  useEffect(() => {
    if (!deliveryCharges || deliveryCharges.length === 0) return;
    if (!distanceMiles) return;

    const calculated = calculateDeliveryFee(Number(distanceMiles), deliveryCharges);

    setDeliveryFee(calculated.toFixed(2));
    // sessionStorage.setItem("deliveryFee", calculated.toFixed(2));

  }, [deliveryCharges, distanceMiles]);


  useEffect(() => {
    if (!deliveryCharges || deliveryCharges.length === 0) return;
    if (!distanceMiles) return;

    const calculated = calculateDeliveryFee(Number(distanceMiles), deliveryCharges);

    setDeliveryFee(calculated.toFixed(2));
    // sessionStorage.setItem("deliveryFee", calculated.toFixed(2));

  }, [deliveryCharges, distanceMiles]);
  const handleCheckout = async () => {
    if (
      !serviceData?.pickupLocation ||
      !serviceData?.pickupLat ||
      !serviceData?.pickupLng ||
      !serviceData?.deliveryLocation ||
      !serviceData?.deliveryLat ||
      !serviceData?.deliveryLng ||
      !serviceData?.order_name ||
      !serviceData?.store_name ||
      productPrice < 0.00 ||
      !deliveryFee ||
      !serviceData?.date ||
      !serviceData?.time ||
      !selectedCard?.id
    ) {
      toast.error("Something went wrong!")
      return
    }

    const [year, month, day] = serviceData.date.split("-").map(Number);
    const [hour, minute] = serviceData.time.split(":").map(Number);

    // Local date object
    const localDateTime = new Date(year, month - 1, day, hour, minute);

    // UTC conversion
    const utcISOString = localDateTime.toISOString();
    const utc_date = utcISOString.split("T")[0];
    const utc_time = utcISOString.split("T")[1].substring(0, 5);

    setIsLoader(true);
    try {
      const body = {
        type: 0,
        pickup_location: serviceData?.pickupLocation,
        pickup_location_latitude: serviceData?.pickupLat,
        pickup_location_longitude: serviceData?.pickupLng,
        // pickup_person_name: serviceData?.pickup_person_name,
        // pickup_country_code: serviceData?.pickup_country_code,
        // pickup_phone_no: serviceData?.pickup_phone,
        delivery_location: serviceData?.deliveryLocation,
        delivery_location_latitude: serviceData?.deliveryLat,
        delivery_location_longitude: serviceData?.deliveryLng,
        // delivery_person_name: serviceData?.delivery_person_name,
        // delivery_country_code: serviceData?.delivery_country_code,
        // delivery_phone_no: serviceData?.delivery_phone,
        order_name: serviceData?.order_name,
        store_name: serviceData?.store_name,
        is_order_prepaid: productPrice > 0 ? 0 : 1,
        product_price: productPrice,
        delivery_fee: deliveryFee,
        total_price: (Number(productPrice || 0.00) + Number(deliveryFee || 0.00)).toFixed(2),
        date: serviceData.date,
        time: serviceData.time,
        utc_date,
        utc_time,
        user_address_id: selectedAddress?.id || null,
        cardId: selectedCard?.id,
        card_holder_name: selectedCard?.billing_details?.name,
        card_last4_digits: selectedCard?.card?.last4
      };

      await AxiosInstance.post("/user/create_order", body);

      // Clear session
      sessionStorage.removeItem("pickupServiceData");
      sessionStorage.removeItem("productPrice");
      sessionStorage.removeItem("selectedUserAddress");
      sessionStorage.removeItem("selectedCard");

      setShowModal(true);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!")
      // console.log(err);
    } finally {
      setIsLoader(false);
    }
  };
  return (
    <div>


      {/* MAIN BODY */}
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full px-3 sm:px-6">
          {/* ✅ STEPPER (unchanged, now responsive) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-10 px-2 sm:px-4 max-w-[620px] mx-auto  sm:gap-4">
            {["Address", "Schedule", "Payment", "Summary"].map((label) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center w-1/4 sm:w-auto text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                    <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
                  </div>
                  <p className="text-xs sm:text-sm mt-1">{label}</p>
                </div>
                {label !== "Summary" && (
                  <div className="hidden sm:block flex-1 h-px bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ✅ Summary Card */}
          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-10 max-w-[800px] mx-auto">
            <h2 className="text-[26px] sm:text-[35px] font-semibold mb-6 uppercase flex flex-col sm:flex-row sm:justify-between gap-2">
              Summary
              <span className="text-[22px] sm:text-[26px] text-end sm:text-right">
                Order Name-<br />
                <span className="text-[18px] sm:text-[22px] font-normal">
                  {serviceData?.order_name}
                </span>
              </span>
            </h2>
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2">Store Name</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {serviceData?.store_name}
              </p>
            </div>
            {/* Pickup Location */}
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2">Pickup Location</p>
              {/* <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {serviceData?.pickupLocation}<br />
                    Phone Number: +{serviceData?.pickup_country_code} {serviceData?.pickup_phone}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/location?summary=true')}
                  className="text-sm font-medium underline self-end sm:self-auto cursor-pointer">
                  Change Address
                </button>
              </div> */}
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 relative">
                <div className="w-full">
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm text-gray-600 leading-relaxed break-words">
                    {serviceData?.pickupLocation}<br />
                    {/* Phone Number: +{serviceData?.pickup_country_code} {serviceData?.pickup_phone} */}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/location?summary=true')}
                  className="absolute top-0 right-0 py-2 pe-2 text-sm font-medium underline sm:ml-auto whitespace-nowrap cursor-pointer"
                >
                  Change Address
                </button>
              </div>

            </div>

            {/* Delivery Location */}
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2">Delivery Location</p>
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start gap-3 relative">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {serviceData?.deliveryLocation}<br />
                    {/* Phone Number: +{serviceData?.delivery_country_code} {serviceData?.delivery_phone} */}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/location?summary=true')}
                  className="absolute top-0 right-0 py-2 pe-2 text-sm font-medium underline self-end sm:self-auto cursor-pointer">
                  Change Address
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-start space-x-4">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full">
                  <i className="fa-solid fa-calendar-days text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Date</p>
                  <p className="text-base sm:text-lg text-gray-600">
                    {(serviceData && serviceData?.date) ? formatDate(serviceData?.date) : null}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 justify-start">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full">
                  <i className="fa-solid fa-clock text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Time</p>
                  <p className="text-base sm:text-lg text-gray-600">
                    {serviceData && serviceData?.time && new Date(`1970-01-01T${serviceData?.time}:00`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border border-gray-200 rounded-lg p-5 mb-8">
              <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
              {(productPrice && productPrice > 0) ?
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <p className="text-gray-700">Product Price</p>
                  <p className="font-medium">${Number(productPrice).toFixed(2)}</p>
                </div>
                :
                null
              }
              <div className="flex justify-between mb-2 text-sm sm:text-base">
                <p className="text-gray-700">Delivery Fee</p>
                <p className="font-medium">${deliveryFee}</p>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base sm:text-lg">
                <p className="font-semibold">Total Price</p>
                <p className="font-semibold text-[#F59E0B]">${(Number(productPrice.toFixed(2)) + Number(deliveryFee)).toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-gray-200 rounded-lg p-5 mb-8">
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <label className="flex flex-row items-center justify-between border border-gray-200 rounded-lg p-4 py-6 cursor-pointer hover:shadow-md transition gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    alt="Visa"
                    className="w-10 sm:w-12"
                  />
                  <div>
                    <p className="font-medium">{selectedCard?.billing_details?.name}</p>
                    <p className="text-gray-500 text-sm">**** **** **** {selectedCard?.card?.last4}</p>
                  </div>
                </div>
              </label>
            </div>

            {/* ✅ Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoader}
              className="w-full max-w-[550px] bg-[#185A96] text-white py-4 text-[18px] sm:text-[20px] rounded-lg m-auto flex justify-center cursor-pointer"
            >
              {isLoader ? "Processing.." : "Checkout"}
            </button>
          </div>
        </div>
      </div>


      {/* ✅ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[300px] sm:w-[370px] text-center relative">
            <div className="flex justify-center mb-4">
              <div className="w-17 h-17 bg-[#32BA7C] rounded-full flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-[40px] font-bold"></i>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-1">Thank you!</h2>
            <p className="text-md text-gray-600 mb-6">Your payment has been done successfully!</p>
            <button
              onClick={handleOk}
              className="bg-[#185A96] hover:bg-[#164d82] text-white px-15 py-2 rounded-md text-xl font-medium cursor-pointer"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
