import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { axiosInstance } from "../utils/axios.config";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Addcard = () => {
  const userDetails = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const AxiosInstance = axiosInstance();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [addCardLoading, setAddCardLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    const address = sessionStorage.getItem("selectedUserAddress");
    const pickupServiceData = sessionStorage.getItem("pickupServiceData");
    const productPrice = sessionStorage.getItem("productPrice");

    if (!pickupServiceData || !productPrice) {
      navigate("/");
      return;
    }
  }, [])

  const handleStripeValidation = (event, field) => {
    if (event.error) {
      setErrors((prev) => ({ ...prev, [field]: event.error.message }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const validateName = (value) => {
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else if (!nameRegex.test(value.trim())) {
      setErrors((prev) => ({ ...prev, name: "Please enter a valid name" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    let newErrors = { ...errors };

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!name.trim().length > 30) {
      newErrors.name = "Name should be within 30 characters";
    } else if (!nameRegex.test(name.trim())) {
      newErrors.name = "Please enter a valid name";
    } else {
      newErrors.name = "";
    }

    const cardNumEl = elements.getElement(CardNumberElement);
    const expEl = elements.getElement(CardExpiryElement);
    const cvcEl = elements.getElement(CardCvcElement);

    if (cardNumEl?._empty) {
      newErrors.cardNumber = "Card number is required";
    }
    if (expEl?._empty) {
      newErrors.expiry = "Expiry date is required";
    }
    if (cvcEl?._empty) {
      newErrors.cvc = "CVV is required";
    }


    if (Object.values(newErrors).some((val) => val !== "")) {
      setErrors(newErrors);
      return;
    }

    setAddCardLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { token, error } = await stripe.createToken(cardNumberElement, {
      name,
    });

    if (error) {
      toast.error(error.message);
      setAddCardLoading(false);
      return;
    }
    const customer_id = userDetails?.customer_id
    if (!customer_id) {
      setAddCardLoading(false)
      return
    }
    try {
      await AxiosInstance.post("/user/add_card", {
        token: token.id,
        customerId: customer_id
      });

      const t = toast.success("Card added successfully");

      setName("");
      elements.getElement(CardNumberElement)?.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();
      setTimeout(() => {
        toast.dismiss(t);
        navigate('/Cardpayment');
      }, 1000)
    } catch (err) {
      toast.error("Failed to add card");
    }

    setAddCardLoading(false);
  };

  const elementStyle = {
    base: {
      fontSize: "16px",
      color: "#000",
      "::placeholder": { color: "#999" },
    },
    invalid: { color: "#e5424d" },
  };

  return (
    <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full px-4 sm:px-6 md:px-8">

        <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-8 md:p-10 md:px-[60px] lg:px-[80px] max-w-[860px] mx-auto">

          <h2 className="text-[22px] sm:text-[28px] md:text-[35px] font-semibold mb-2 uppercase text-center sm:text-left">
            ADD NEW CARD
          </h2>

          <p className="text-xs sm:text-sm mb-6 text-center sm:text-left">
            Select a Card
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            <div>
              <label className="text-xs sm:text-sm font-medium">Card Number</label>

              <div className="w-full border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md">
                <CardNumberElement
                  options={{ style: elementStyle }}
                  onChange={(e) => handleStripeValidation(e, "cardNumber")}
                />
              </div>

              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">
                Card Holder's Name
              </label>
              <input
                type="text"
                placeholder="Enter"
                className="w-full border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg outline-none shadow-md text-sm sm:text-base"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}

            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Expiry Date</label>

              <div className="w-full border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md">
                <CardExpiryElement
                  options={{ style: elementStyle }}
                  onChange={(e) => handleStripeValidation(e, "expiry")}
                />
              </div>

              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">CVV</label>

              <div className="w-full border border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md">
                <CardCvcElement
                  options={{ style: elementStyle }}
                  onChange={(e) => handleStripeValidation(e, "cvc")}
                />
              </div>

              {errors.cvc && (
                <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleAddCard}
            disabled={addCardLoading}
            className="mt-10 w-full max-w-[420px] bg-[#185A96] text-white py-2.5 sm:py-3 rounded-lg hover:bg-[#eea62e] transition m-auto flex justify-center cursor-pointer text-[18px] sm:text-[20px] md:text-[24px]"
          >
            {addCardLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addcard;
