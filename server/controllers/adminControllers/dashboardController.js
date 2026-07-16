const { models } = require('../../models');
const { users, services, orders } = models;
const { Op, fn, col } = require('sequelize');


module.exports = {

    dashboard_data: async (req, res) => {
        try {
            const user_count = await users.count({ where: { role: 2 } });
            const sub_admin_count = await users.count({ where: { role: 1 } });
            const service_count = await services.count();
            const order_count = await orders.count();
            res.status(200).json({
                message: "Data fetched",
                data: { user_count, sub_admin_count, service_count, order_count }
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    },

    getMonthlyUserStats: async (req, res) => {
        try {
            const currentYear = new Date().getFullYear();

            const usersData = await users.findAll({
                attributes: [
                    [fn('MONTH', col('createdAt')), 'month'],
                    'role',
                    [fn('COUNT', col('id')), 'count']
                ],
                where: {
                    role: 2,
                    createdAt: {
                        [Op.gte]: new Date(`${currentYear}-01-01`),
                        [Op.lte]: new Date(`${currentYear}-12-31`)
                    }
                },
                group: ['month'],
                raw: true
            });

            const ordersData = await orders.findAll({
                attributes: [
                    [fn('MONTH', col('createdAt')), 'month'],
                    [fn('COUNT', col('id')), 'count']
                ],
                where: {
                    createdAt: {
                        [Op.gte]: new Date(`${currentYear}-01-01`),
                        [Op.lte]: new Date(`${currentYear}-12-31`)
                    }
                },
                group: ['month'],
                raw: true
            });

            const monthlyData = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                user: 0,
                order: 0,
            }));

            usersData.forEach(({ month, count }) => {
                const index = month - 1;
                monthlyData[index].user = parseInt(count);
            });

            ordersData.forEach(({ month, count }) => {
                const index = month - 1;
                monthlyData[index].order = parseInt(count);
            });
            res.status(200).json({ message: "data fetched", data: monthlyData });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error", error });
        }
    }


}