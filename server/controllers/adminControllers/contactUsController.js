const { models } = require('../../models');
const { contact_us } = models;
const { Op } = require('sequelize');


module.exports = {

    contactUs_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;

            const { count, rows: contactUs_list } = await contact_us.findAndCountAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } }
                    ]
                },
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                contactUs_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error', error });
        }
    },
    view_contactUs: async (req, res) => {
        const { id } = req.params;
        try {
            const details = await contact_us.findOne({ where: { id } });
            res.status(200).json({ message: "category view", details });
        } catch (error) {
            throw error
        }
    },

    delete_contactUs: async (req, res) => {
        const { id } = req.params;
        const { role, contact_us_delete_permission } = req.user;
        try {
            if (role != 0 && !contact_us_delete_permission) {
                return res.status(403).json({ message: "You don't have permission to delete contact us entries." });
            }
            const isExist = await contact_us.findOne({ where: { id } });
            if (!isExist) {
                return res.status(404).json({ message: "Not found" });
            }
            await contact_us.destroy({ where: { id } });
            res.status(200).json({ message: "deleted" });
        } catch (error) {
            throw error
        }
    },
}