const { models } = require('../../models');
const { users, transactions } = models;
const { Op } = require('sequelize');

module.exports = {

    get_transaction_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;

            const { count, rows: payments } = await transactions.findAndCountAll({
                include: [
                    {
                        model: users,
                        as: "paid_by",
                        attributes: ["id", "name", "email"],
                        paranoid: false
                    }
                ],
                where: {
                    [Op.or]: [
                        { '$paid_by.name$': { [Op.like]: `%${search}%` } },
                        { '$paid_by.email$': { [Op.like]: `%${search}%` } }
                    ]
                },
                distinct: true,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({
                payments,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error', error });
        }
    },
}