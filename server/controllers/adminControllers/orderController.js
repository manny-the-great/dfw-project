const { models } = require('../../models');
const { orders, users, address, transactions, service_types, services } = models;
const { Op } = require('sequelize');
const { refundPayment } = require('../../stripe/stripe.config');

module.exports = {

    order_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const status = req.query.status;
            const { order_type } = req.query;
            const user_id = req.query.user_id;
            const offset = (page - 1) * limit;

            const whereCondition = {
                [Op.or]: [
                    { order_id: { [Op.like]: `%${search}%` } },
                ]
            };

            if (status == 0 || status == 1 || status == 2) {
                whereCondition.status = parseInt(status);
            }
            if (user_id) {
                whereCondition.user_id = parseInt(user_id);
            }
            if (order_type !== undefined) {
                whereCondition.type = order_type;
            }
            const { count, rows: order_list } = await orders.findAndCountAll({
                where: whereCondition,
                paranoid: false,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
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

    view_order: async (req, res) => {
        const { id } = req.params;

        try {
            const orderExists = await orders.findOne({ where: { id }, paranoid: false });

            if (!orderExists) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const orderDetails = await orders.findOne({
                where: {
                    id
                },
                paranoid: false,
                include: [
                    {
                        model: users,
                        as: 'buyer',
                        attributes: ['id', 'name', 'email', 'country_code', 'phone_no'],
                        paranoid: false,
                    },
                    {
                        model: address,
                        as: 'user_address',
                        paranoid: false
                    },
                    {
                        model: service_types,
                        as: 'order_service_type',
                        paranoid: false,
                        required: false,
                        include: [
                            {
                                model: services,
                                as: "service",
                                paranoid: false,
                                required: false,
                            }
                        ]
                    }
                ]
            })


            res.status(200).json({ orderDetails });
        } catch (err) {
            console.error("Error fetching product:", err);
            res.status(500).json({ message: "Server error" });
        }
    },
    update_order_status: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const { role, order_update } = req.user;
        if (role != 0 && !order_update) {
            return res.status(403).json({ message: "You don't have permission to update order status" })
        }
        try {
            const order = await orders.findOne({ where: { id }, paranoid: false });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (status == 2 && order?.type == 0) {
                const transaction = await transactions.findOne({ where: { order_id: id } });
                if (!transaction) {
                    return res.status(404).json({ message: 'Transaction not found' });
                }
                const chargeId = transaction.transaction_id
                await refundPayment(chargeId);
                const adminUser = await users.findOne({ where: { role: 0 } });
                if (adminUser) {
                    const updatedWallet = Number(adminUser.wallet) - Number(order.total_price);
                    const updatedRevenue = Number(adminUser.revenue) - Number(order.delivery_fee);

                    await adminUser.update({
                        wallet: Math.max(0, updatedWallet),
                        revenue: Math.max(0, updatedRevenue)
                    });
                }

            }
            await order.update({ status });
            res.status(200).json({ message: 'Order status updated successfully' });
        } catch (err) {
            console.log("Error updating order status:", err);
            res.status(500).json({ message: "Server error" });
        }
    },
    update_order_location: async (req, res) => {
        const { id, location, latitude = 1111, longitude = "1111" } = req.body;
        const { role, order_update } = req.user;
        if (role != 0 && !order_update) {
            return res.status(403).json({ message: "You don't have permission to update location" })
        }
        try {
            const order = await orders.findOne({ where: { id }, paranoid: false });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            order.current_order_location = location;
            order.current_location_latitude = latitude;
            order.current_location_longitude = longitude;

            await order.save();
            res.status(200).json({ message: 'Order location updated successfully' });
        } catch (err) {
            console.log("Error updating order status:", err);
            res.status(500).json({ message: "Server error" });
        }
    },

}