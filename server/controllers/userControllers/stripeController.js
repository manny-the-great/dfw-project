const helper = require('../../helper/helper');
const db = require('../../models');


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

const { payment_methods, cardAdd, createPayment, activeCard, removeCard, setDefaultCard } = require('../../stripe/stripe.config');


module.exports = {

    add_card: async (req, res) => {
        try {
            const { customerId, token } = req.body;
            const addedCard = await cardAdd(customerId, token);
            console.log("added", customerId, token)
            return helper.success(res, "card added", addedCard)
        } catch (error) {
            console.log(error);
            return helper.failed(res, "Something went wrong")
        }
    },
    card_list: async (req, res) => {
        try {
            const id = req.user?.customer_id;
            const card = await payment_methods(id);
            // console.log(card)
            return helper.success(res, "list fetched", card);
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong");
        }
    },
    active_card: async (req, res) => {
        try {
            const id = req.user?.customer_id;
            const card = await activeCard(id);
            // console.log(card)
            return helper.success(res, "card activated", card);
        } catch (error) {
            // console.log(error)
            return helper.failed(res, "Something went wrong");
        }
    },
    payment: async (req, res) => {
        try {
            const { customerId, amount, currency, cardId } = req.body;
            const make_payment = await createPayment(customerId, amount, currency, cardId);
            return helper.success(res, "payment made", make_payment)
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong")
        }
    },
    set_default_card: async (req, res) => {
        try {
            const customerId = req?.user?.customer_id
            const { sourceId } = req.body;
            await setDefaultCard(customerId, sourceId);
            return helper.success(res, "card updated",)
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong")
        }
    },
    remove_card: async (req, res) => {
        try {
            const customerId = req.user?.customer_id
            const { cardId } = req.params;
            await removeCard(customerId, cardId);
            return helper.success(res, "card deleted",)
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong")
        }
    },




};
