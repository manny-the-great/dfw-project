require('dotenv').config();
const { models } = require('../../models');
const { notifications, users } = models;
const helper = require('../../helper/helper');

module.exports = {
    notification_list: async (req, res) => {
        try {
            const user = req.user;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const total = await notifications.count({
                where: { receiver_id: user.id }
            });

            const notification_list = await notifications.findAll({
                where: { receiver_id: user.id },
                include: [
                    {
                        model: users,
                        as: 'sender',
                        attributes: ['id', 'name', 'profile_picture']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            return helper.success(res, "Notification fetched", {
                data: notification_list,
                total,
                page,
                limit
            });

        } catch (error) {
            return helper.error(res, "Something went wrong", error);
        }
    },


    markAllAsRead: async (req, res) => {
        try {
            const receiver_id = req.user.id;
            await notifications.update({ is_read: 1 }, {
                where: {
                    receiver_id,
                    is_read: 0,
                }
            });
            return helper.success(res, "All notifications are marked as read");
        } catch (error) {
            return helper.failed(res, "Something went wrong");
        }
    },

    unread_notification_count: async (req, res) => {
        try {
            const receiver_id = req.user.id;
            const count = await notifications.count({
                where: {
                    receiver_id,
                    is_read: 0
                }
            });
            return helper.success(res, "notification count", count);
        } catch (error) {
            return helper.failed(res, "Something went wrong");
        }
    },

    clear_all_notifications: async (req, res) => {
        const { id } = req.user;
        try {
            await notifications.destroy({
                where: { receiver_id: id },
                force: true
            });

            return helper.success(res, "All notifications cleared")
        } catch (error) {
            return helper.failed(res, "Something went wrong");
        }
    },

}