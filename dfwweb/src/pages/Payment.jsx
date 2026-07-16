import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { get_delivery_charges } from '../utils/thunkApis';

const Payment = () => {
  const navigate = useNavigate();
  const deliveryCharges = useSelector((state) => state.users.deliveryCharges);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [productPrice, setProductPrice] = useState(0.00);
  const [pickupServiceData, setPickupServiceData] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0.00)
  const [distanceMiles, setDistanceMiles] = useState();


  useEffect(() => {
    const address = sessionStorage.getItem("selectedUserAddress");
    const pickupServiceData = sessionStorage.getItem("pickupServiceData");
    const productPrice = sessionStorage.getItem("productPrice");

    if (!pickupServiceData || !productPrice) {
      navigate("/");
      return;
    }
    if (address) {
      setSelectedAddress(JSON.parse(address));
    }
    setProductPrice(JSON.parse(productPrice));
    setPickupServiceData(JSON.parse(pickupServiceData));
    const data = JSON.parse(pickupServiceData);

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
    if (distance == null || isNaN(distance)) return 0;
    if (distance === 0) {
      const fixedTier = tiers.find(t => t.fee_type === 0);
      return fixedTier ? Number(fixedTier.delivery_fee) : 0;
    }

    tiers = tiers.map(t => ({
      ...t,
      start_mile: Number(Number(t.start_mile).toFixed(2)),
      end_mile: Number(Number(t.end_mile).toFixed(2)),
      delivery_fee: Number(t.delivery_fee),
    }));

    let totalFee = 0;

    const fixedTier = tiers.find(t => t.fee_type === 0);

    if (!fixedTier) return 0;

    const fixedStart = fixedTier.start_mile;
    const fixedEnd = fixedTier.end_mile;

    if (distance <= fixedEnd) {
      return Number(fixedTier.delivery_fee);
    }

    totalFee += fixedTier.delivery_fee;
    let remainingDistance = distance - fixedEnd;

    const perMileTiers = tiers
      .filter(t => t.fee_type === 1)
      .sort((a, b) => a.start_mile - b.start_mile);

    for (const tier of perMileTiers) {
      const tierStart = tier.start_mile;
      const tierEnd = tier.end_mile;

      if (remainingDistance <= 0) break;

      let milesInTier = Math.min(distance, tierEnd) - tierStart;

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

  }, [deliveryCharges, distanceMiles]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>

      {/* MAIN BODY */}
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full">

          <div className="flex flex-wrap items-center justify-center sm:justify-between mb-10 px-2 sm:px-4 max-w-[620px] mx-auto gap-y-4">
            <div className="flex flex-col items-center w-1/4 sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Address</p>

            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center w-1/4 sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Schedule</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center w-1/4 sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Payment</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center w-1/4 sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Summary</p>
            </div>
          </div>

          {/* ✅ PAYMENT CARD */}
          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-10 max-w-[800px] w-[95%] mx-auto">
          
            <h2 className="text-[26px] sm:text-[35px] font-semibold mb-6 uppercase text-center sm:text-left">
              PAYMENT
            </h2>

            {/* Pickup Location */}
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2">Pickup Location</p>
              <div className="border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {pickupServiceData?.pickupLocation}
                    <br />
                  </p>
                </div>
                <button
                  onClick={() => navigate('/location?changeAddress=true')}
                  className="text-sm sm:text-base font-medium hover:underline whitespace-nowrap cursor-pointer">
                  Change Address
                </button>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="mb-6">
              <p className="text-lg sm:text-xl font-medium mb-2">Delivery Location</p>
              <div className="border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start gap-3">
                <div>
                  <p className="text-base sm:text-lg font-medium mb-1">Address</p>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {pickupServiceData?.deliveryLocation}
                    <br />
                  </p>
                </div>
                <button
                  onClick={() => navigate('/location?changeAddress=true')}
                  className="text-sm sm:text-base font-medium hover:underline whitespace-nowrap cursor-pointer">
                  Change Address
                </button>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 sm:p-5 flex items-center justify-start space-x-4">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full flex-shrink-0">
                  <i className="fa-solid fa-calendar-days text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Date</p>
                  <p className="text-sm sm:text-lg text-gray-600">
                    {(pickupServiceData && pickupServiceData?.date) ? formatDate(pickupServiceData?.date) : null}

                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-5 flex items-center space-x-4 justify-start">
                <div className="bg-[#F5F5F5] p-4 sm:p-5 rounded-full flex-shrink-0">
                  <i className="fa-solid fa-clock text-[#F59E0B] text-[24px] sm:text-[30px]"></i>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium">Time</p>
                  <p className="text-sm sm:text-lg text-gray-600">
                    {pickupServiceData && pickupServiceData?.time && new Date(`1970-01-01T${pickupServiceData?.time}:00`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-5 mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-3">Payment Details</h3>
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
                <p className="font-semibold text-[#F59E0B]">
                  ${(Number(deliveryFee) + Number(productPrice)).toFixed(2)}
                </p>

              </div>
            </div>

            <button onClick={() => navigate('/Cardpayment')} className="w-full sm:max-w-[550px] bg-[#185A96] text-white py-3 sm:py-4 text-[18px] sm:text-[20px] rounded-lg mx-auto flex justify-center cursor-pointer">
              Continue
            </button>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Payment
