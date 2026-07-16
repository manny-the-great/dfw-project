const { models } = require('../../models');
const { cms, dummy_ratings, orders, users } = models;
const helper = require('../../helper/helper');
const { Op } = require("sequelize");

module.exports = {
    get_dashboard_content: async (req, res) => {
        try {
            const types = [3, 4, 5, 6, 7, 8];

            const data = await cms.findAll({
                where: { type: { [Op.in]: types } },
                order: [['type', 'ASC']]
            });

            if (data.length === 0) {
                return helper.failed(res, "CMS not found");
            }

            const ratingsList = await dummy_ratings.findAll({
                order: [['updatedAt', 'DESC']]
            });

            const userCount = await users.count({ where: { role: 2 } });
            const currentOrderCount = await orders.count({ where: { status: 0 } });
            const pastOrderCount = await orders.count({ where: { status: { [Op.in]: [1, 2] } } });

            return helper.success(res, "Dashboard data found", {
                cmsData: data,
                ratingsList,
                userCount,
                currentOrderCount,
                pastOrderCount
            });

        } catch (error) {
            console.log(error);
            return helper.failed(res, "Internal server error");
        }
    },
}