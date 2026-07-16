import React, { useState, useEffect } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CustomLoader } from '../utils/react-loader/loader';
import { axiosInstance } from '../utils/axios.config';
import { toast } from 'react-hot-toast';
import DeleteCardModal from '../components/DeleteCardModal';

const CardList = () => {

  const [openModal, setOpenModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const AxiosInstance = axiosInstance();
  const stripe = useStripe();
  const elements = useElements();
  const [isCardLoader, setIsCardLoader] = useState(false);
  const [activeCard, setActiveCard] = useState("");
  const [cardList, setCardList] = useState([]);
  const [deletingCardLoader, setDeletingCardLoader] = useState(false);


  useEffect(() => {
    const address = sessionStorage.getItem("selectedUserAddress");
    const pickupServiceData = sessionStorage.getItem("pickupServiceData");
    const productPrice = sessionStorage.getItem("productPrice");

    if (!pickupServiceData || !productPrice) {
      navigate("/");
      return;
    }
  }, [])

  const fetchCards = async () => {
    setIsCardLoader(true)
    try {
      const res = await AxiosInstance.get(`/user/card_list`);
      const activeRes = await AxiosInstance.get(`/user/active_card`);
      setCardList(res.data?.body?.data || []);
      setActiveCard(activeRes.data?.body || null);
    } catch (err) {
      setActiveCard(null);
    } finally {
      setIsCardLoader(false)
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenModal = (id) => {
    setDeleteId(id)
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setDeleteId(null);
    setOpenModal(false);
  }

  const setDefaultCard = async (sourceId) => {
    if (!stripe || !elements) return;
    if (sourceId == activeCard.id) {
      return
    }
    setIsCardLoader(true);
    try {
      await AxiosInstance.post("/user/set_default_card", { sourceId });
      const selectedCard = cardList.find((card) => card.id === sourceId);
      if (selectedCard) setActiveCard(selectedCard);
    } catch (err) {
      // console.log("setdefaultcardfailed", err);
    } finally {
      setIsCardLoader(false)
    }
  }

  const deleteCard = async () => {
    if (!stripe || !elements) return;
    setDeletingCardLoader(true);
    try {
      await AxiosInstance.delete(`/user/remove_card/${deleteId}`);
      toast.success("Card removed successfully");
      const selectedCardString = sessionStorage.getItem("selectedCard");

      if (selectedCardString) {
        const parsedSelectedCard = JSON.parse(selectedCardString);

        if (parsedSelectedCard?.id == deleteId) {
          sessionStorage.removeItem("selectedCard");
        }
      }
      setDeleteId(null)
      handleCloseModal();
      fetchCards();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred")
    } finally {
      setDeletingCardLoader(false)
    }
  };

  const handleContinue = () => {
    if (!activeCard) {
      toast.error('Please select a card for payment');
      return
    }
    sessionStorage.setItem('selectedCard', JSON.stringify(activeCard));
    navigate('/Summary')
  }

  return (
    <div>
      {(isCardLoader || deletingCardLoader) &&
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <CustomLoader />
        </div>
      }
      <div className="w-full flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8">

          <div className="flex flex-wrap items-center justify-center sm:justify-between mb-10 max-w-[620px] mx-auto gap-4 sm:gap-0">

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Address</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Schedule</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-[#54B685] border border-[#707070]">
                <i className="fa-solid fa-check text-[20px] sm:text-[25px]"></i>
              </div>
              <p className="text-xs sm:text-sm mt-1">Payment</p>
            </div>

            <div className="hidden sm:flex flex-1 h-px bg-gray-300"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F2F2F2]"></div>
              <p className="text-xs sm:text-sm mt-1">Summary</p>
            </div>

          </div>

          {/* ✅ CARD SECTION */}
          <div className="bg-white shadow-[0_0_25px_rgba(0,0,0,0.12)] rounded-2xl p-6 sm:p-8 md:p-10 md:px-[60px] lg:px-[80px] max-w-[860px] mx-auto">
            <h2 className="text-[24px] sm:text-[28px] md:text-[35px] font-semibold mb-2 uppercase text-center sm:text-left">PAYMENT</h2>
            <p className="text-xs sm:text-sm mb-6 text-center sm:text-left">Select a Card</p>

            {/* Card Selection List */}
            <div className="space-y-4 mb-8">

              {cardList && cardList.length > 0 ? cardList.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setDefaultCard(card.id)}
                  className="flex  sm:flex-row sm:items-center justify-between  border border-gray-200 rounded-lg p-4 sm:p-6 relative hover:shadow-md transition cursor-pointer"
                >
                  {/* Left side */}
                  <div
                    className="flex items-center space-x-3 mb-3 sm:mb-0 cursor-pointer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="w-10 sm:w-12"
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">{card?.billing_details?.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">**** **** **** {card?.card?.last4}</p>
                    </div>
                  </div>

                  {/* Radio Button */}
                  <span className="relative self-end sm:self-auto cursor-pointer me-5" onClick={() => setDefaultCard(card.id)}>
                    <input
                      type="radio"
                      name="selectedCard"
                      checked={activeCard?.id == card.id}
                      readOnly
                      className="peer appearance-none w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] sm:text-[12px] font-bold bg-[#185A96] rounded-full opacity-0 peer-checked:opacity-100 transition w-5 h-5 sm:w-6 sm:h-6">
                      ✓
                    </span>
                  </span>

                  {/* ❌ Delete icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(card.id);
                    }}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </div>
              )) : (
                !isCardLoader && <p className="text-center font-bold text-red-800 fs-30">Please Add A Card</p>
              )}

            </div>

            {cardList && cardList.length > 0 ?
              <button onClick={handleContinue} className="w-full max-w-[500px] mx-auto flex justify-center text-center bg-[#185A96] text-white py-3 rounded-lg hover:bg-[#eea62e] transition text-[16px] sm:text-[18px] md:text-[20px] font-medium cursor-pointer">
                Continue
              </button>
              :
              null}

            <p onClick={() => navigate('/AddCard')} className="text-center mt-4 text-[#eea62e] cursor-pointer font-semibold underline text-sm sm:text-base">
              Add New Card
            </p>
          </div>

        </div>
      </div>
      {openModal && (
        <DeleteCardModal handleDelete={deleteCard} handleClose={handleCloseModal} isLoader={deletingCardLoader} />
      )}
    </div>
  )
}

export default CardList