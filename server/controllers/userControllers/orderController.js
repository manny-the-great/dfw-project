const { models } = require('../../models');
const { orders, address, users, service_types, services, notifications, transactions } = models;
const { Op } = require("sequelize");
const helper = require('../../helper/helper');
const { createPaymentIntent, capturePaymentIntent, cancelPaymentIntent } = require('../../stripe/stripe.config');

module.exports = {
    create_order: async (req, res) => {
        const user_id = req.user.id;
        const customerId = req.user?.customer_id;
        // const { type, service_type_name, service_type_id, service_description, pickup_location, pickup_location_latitude, pickup_location_longitude, pickup_person_name, pickup_country_code, pickup_phone_no, delivery_location, delivery_location_latitude, delivery_location_longitude, delivery_person_name, delivery_country_code, delivery_phone_no, order_name, store_name, date, time, user_address_id, is_order_prepaid, product_price, delivery_fee, total_price, cardId, currency, card_holder_name, card_last4_digits } = req.body;
        const { type, service_name, service_id, service_description, pickup_location, pickup_location_latitude, pickup_location_longitude, delivery_location, delivery_location_latitude, delivery_location_longitude, order_name, store_name, date, time, user_address_id, is_order_prepaid, product_price, delivery_fee, total_price, cardId, currency, card_holder_name, card_last4_digits, utc_date, utc_time } = req.body;

        let paymentIntent;
        let paymentCaptured;
        try {
            let order_address_id = null;
            const adminExists = await users.findOne({ where: { role: 0 } });
            if (!adminExists) {
                return res.status(404).json({ message: "Something went wrong" })
            }
            // let serviceTypeExists;
            // if (type == 1) {
            //     serviceTypeExists = await service_types.findOne({ where: { id: service_type_id } });
            //     if (!serviceTypeExists) {
            //         return helper.failed(res, "Service type not found");
            //     }
            // }

            let serviceExists;
            if (type == 1) {
                serviceExists = await services.findOne({ where: { id: service_id } });
                if (!serviceExists) {
                    return helper.failed(res, "Service not found");
                }
            }
            if ((type == 0) && (!customerId || !cardId)) {
                return helper.failed(res, "Card is required for payment.");
            }
            let transaction_id
            if (type == 0) {
                paymentIntent = await createPaymentIntent(customerId, total_price, currency ? currency : 'usd', cardId);
                if (paymentIntent.status !== "requires_capture") {
                    return helper.failed(res, "Payment could not be authorized.");
                }
            }

            if (user_address_id) {

                const addressExists = await address.findOne({ where: { id: user_address_id }, raw: true });

                if (!addressExists) {
                    return helper.failed(res, "Address not found");
                }

                const { id, createdAt, updatedAt, deletedAt, type, ...restFields } = addressExists;

                const newAddress = await address.create({
                    ...restFields,
                    type: 1
                });

                order_address_id = newAddress.id;
            }
            const createOrder = await orders.create({
                user_id: user_id ?? null,
                type: type ?? null,
                // service_type_name: service_type_name ?? null,
                service_name: serviceExists?.name ?? null,
                // service_type_id: service_type_id ?? null,
                service_description: service_description ?? null,

                pickup_location: pickup_location ?? null,
                pickup_location_latitude: pickup_location_latitude ?? null,
                pickup_location_longitude: pickup_location_longitude ?? null,
                // pickup_person_name: pickup_person_name??null,
                // pickup_country_code: pickup_country_code ?? null,
                // pickup_phone_no: pickup_phone_no ?? null,

                delivery_location: delivery_location ?? null,
                delivery_location_latitude: delivery_location_latitude ?? null,
                delivery_location_longitude: delivery_location_longitude ?? null,
                // delivery_person_name: delivery_person_name??null,
                // delivery_country_code: delivery_country_code ?? null,
                // delivery_phone_no: delivery_phone_no ?? null,

                order_name: order_name ?? null,
                store_name: store_name ?? null,
                date: date ?? null,
                time: time ?? null,

                user_address_id: order_address_id ?? null,

                is_order_prepaid: is_order_prepaid ?? 0,

                product_price: product_price ?? 0,
                delivery_fee: delivery_fee ?? 0,
                total_price: total_price ?? 0,
                utc_date: utc_date ?? null,
                utc_time: utc_time ?? null
            });
            await createOrder.update({ order_id: `#${createOrder.id}` })

            if (type == 0) {
                paymentCaptured = await capturePaymentIntent(paymentIntent.id);

                const chargeId =
                    paymentCaptured?.latest_charge
                        ? paymentCaptured.latest_charge
                        : null;

                if (!chargeId) {
                    return helper.failed(res, "Charge ID not found for PaymentIntent");
                }

                transaction_id = chargeId;

                if (total_price) {
                    const updatedWallet = Number(total_price) + Number(adminExists.wallet)
                    await adminExists.update({ wallet: updatedWallet })
                }
                if (delivery_fee) {
                    const updatedRevenue = Number(delivery_fee) + Number(adminExists.revenue)
                    await adminExists.update({ revenue: updatedRevenue })
                }
                await transactions.create({
                    transaction_id,
                    user_id,
                    order_id: createOrder.id,
                    total_amount: total_price,
                    delivery_fee,
                    amount_to_pay: product_price || 0,
                    card_holder_name,
                    card_last4_digits,
                    payment_status: 1
                })
            }
            await notifications.create({
                sender_id: user_id,
                receiver_id: adminExists.id,
                title: "New Order",
                description: "New order has been placed"
            })
            return helper.success(res, "Booking created successfully!");
        } catch (error) {
            if (paymentIntent && !paymentCaptured && paymentIntent.status == "requires_capture") {
                const abc = await cancelPaymentIntent(paymentIntent.id);
                return helper.failed(
                    res,
                    "Something went wrong. Payment was cancelled and you were not charged."
                );
            }
            console.log(error)
            return helper.failed(res, "Something went wrong")
        }
    },

    order_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status || 0;
            const offset = (page - 1) * limit;

            const { count, rows: order_list } = await orders.findAndCountAll({
                where: {
                    status: status != 0 ? { [Op.in]: [1, 2] } : status,
                    user_id: req.user.id
                },
                include: [
                    {
                        model: address,
                        as: 'user_address',
                        paranoid: false
                    }
                ],
                paranoid: false,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                distinct: true,
            });

            return helper.success(res, "orders fetched", {
                order_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error', error });
        }
    },
    order_details: async (req, res) => {
        const { id } = req.params;
        try {
            const orderExists = await orders.findOne({
                where: {
                    id,
                    user_id: req.user.id
                },
                include: [
                    {
                        model: address,
                        as: 'user_address',
                        paranoid: false
                    },
                    {
                        model: transactions,
                        as: 'order_transactions',
                        required: false,
                        paranoid: false
                    }
                ],
                paranoid: false
            });
            if (!orderExists) {
                console.log("ppp")
                return helper.failed(res, "Order not found");
            }
            return helper.success(res, "Order details fetched", orderExists);
        } catch (error) {
            console.log(error)
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    }
}