

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

const createCustomer = async ({ name, email }) => {
  const customer = await stripe.customers.create({
    name,
    email,
  });
  return customer;
};

const cardAdd = async (customerId, token) => {
  try {
    const source = await stripe.customers.createSource(customerId, {
      source: token,
    });
    return source;
  } catch (error) {
    console.log("Error adding card:", error);
  }
};

const setDefaultCard = async (customerId, sourceId) => {
  try {
    await stripe.customers.update(customerId, {
      default_source: sourceId,
    });
  } catch (error) {
    console.log("Error setting default card:", error);
  }
};

const createPayment = async (
  customerId,
  amount,
  currency,
  cardId
) => {
  try {
    const totalAmount = Math.round(amount * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: currency,
      customer: customerId,
      payment_method: cardId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    return paymentIntent;
  } catch (error) {
    console.log("Error processing payment:", error);
    throw error;
  }
};

const createPaymentIntent = async (customerId, amount, currency, cardId) => {
  try {
    const totalAmount = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
      customer: customerId,
      payment_method: cardId,
      confirm: true,
      off_session: true,
      capture_method: "manual",
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};


const capturePaymentIntent = async (paymentIntentId) => {
  try {
    const captured = await stripe.paymentIntents.capture(paymentIntentId);
    return captured;
  } catch (error) {
    console.error("Error capturing payment:", error);
    throw error;
  }
};

const refundPayment = async (chargeId) => {
  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
    });
    console.log('refund', refund)
    return refund;
  } catch (error) {
    console.log("Error refund:", error);
    throw error;
  }
};

const payment_methods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
    });
    const customer = await stripe.customers.retrieve(customerId);
    return { ...paymentMethods, customer };
  } catch (error) {
    console.log("Error retrieving payment methods:", error);
  }
};

const activeCard = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
    const customer = await stripe.customers.retrieve(customerId);

    const actCard = paymentMethods?.data?.find(
      (crd) => crd?.id === customer.default_source
    );
    return actCard;
  } catch (error) {
    console.log("Error retrieving payment methods:", error);
  }
};

const removeCard = async (customerId, cardId) => {
  try {
    const customerSource = await stripe.customers.deleteSource(
      customerId,
      cardId
    );
    return customerSource;
  } catch (error) {
    console.log("Error retrieving payment methods:", error);
  }
};

const deleteBankAccount = async (accountId, bankAccountId) => {
  try {
    const deletedBankAccount = await stripe.accounts.deleteExternalAccount(
      accountId,
      bankAccountId
    );
    return deletedBankAccount;
  } catch (error) {
    console.log("Error deleting bank account:", error);
  }
}

const cancelPaymentIntent = async (paymentIntentId) => {
  try {
    const canceled = await stripe.paymentIntents.cancel(paymentIntentId);
    return canceled;
  } catch (error) {
    console.error("Error canceling payment:", error);
    throw error;
  }
};
module.exports = {
  createCustomer,
  cardAdd,
  createPayment,
  createPaymentIntent,
  refundPayment,
  payment_methods,
  setDefaultCard,
  activeCard,
  removeCard,
  deleteBankAccount,
  capturePaymentIntent,
  cancelPaymentIntent
};
