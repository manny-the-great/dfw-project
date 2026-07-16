require('dotenv').config();
const { models } = require('../../models');
const { users, address } = models;
const { Op } = require('sequelize');
const { fileUpload } = require('../../utils/fileUpload');
const bcrypt = require('bcrypt');

module.exports = {
    user_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;
            const role = req.query.role || 2;

            const whereClause = {
                [Op.and]: [
                    { role },
                    { id: { [Op.ne]: req.user.id } },
                    {
                        [Op.or]: [
                            { name: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } }
                        ]
                    }
                ]
            };
            const { count, rows: user_list } = await users.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                user_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error', error });
        }
    },
    view_user: async (req, res) => {
        const { id } = req.params;
        try {
            const user_details = await users.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: address,
                        as: 'user_addresses',
                        where: {
                            type: 0
                        },
                        required: false
                    },
                ]
            }
            );
            res.status(200).json({ message: "user view", user_details });
        } catch (error) {
            throw error
        }
    },
    toggle_status: async (req, res) => {
        const { id } = req.params;
        const { role, sub_admin_update, user_update } = req.user;

        try {
            const user_exists = await users.findOne({ where: { id } });
            if (!user_exists) {
                return res.status(404).json({ message: "user not found" });
            }
            if (role != 0 && user_exists?.role == 1 && !sub_admin_update) {
                return res.status(403).json({ message: "You don't have permission to update sub admin status" })
            }
            if (role != 0 && user_exists?.role == 2 && !user_update) {
                return res.status(403).json({ message: "You don't have permission to update user status" })
            }
            const status = user_exists.status == 0 ? 1 : 0;
            await users.update({ status }, { where: { id } });
            res.status(200).json({ message: "status toggled" });
        } catch (error) {
            throw error
        }
    },

    add_sub_admin: async (req, res) => {
        const { role, sub_admin_add } = req.user;
        if (role != 0 && !sub_admin_add) {
            return res.status(403).json({ message: "You don't have permission to add sub admin" })
        }
        try {
            const {
                role, name, email, country_code, phone_no, password,

                // CMS
                cms_view, cms_update,

                // USERS
                user_view, user_update,

                // SUB ADMIN
                sub_admin_view, sub_admin_update, sub_admin_add, delete_sub_admin,

                // DUMMY RATING
                dummy_rating_view, dummy_rating_add, dummy_rating_update, dummy_rating_delete,

                // SERVICES
                service_view, service_update, service_add, delete_service_permission,

                // SERVICE TYPES
                service_type_view, service_type_add,
                service_type_update, service_type_delete_permission,

                // WALLET
                wallet_view,

                // NOTIFICATIONS
                notification_permit,

                // ORDERS
                order_view, order_update,

                // CONTACT US
                contact_us_view,
                contact_us_delete_permission,

                // DASHBOARD
                dashboard_view_permission,

                //delivery charges
                delivery_charges_view, delivery_charges_update

            } = req.body;

            // check email exists
            const emailExists = await users.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            req.body.password = hashedPassword;

            // image upload
            const imageFile = req.files?.profile_picture;
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                req.body.profile_picture = `images/${fileUploader}`;
            } else {
                req.body.profile_picture = null
            }

            // CREATE THE USER
            await users.create(req.body);

            res.status(200).json({ message: "Sub Admin Added Successfully" });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong", error });
        }
    },

    edit_sub_admin: async (req, res) => {
        const { role, sub_admin_update } = req.user;
        if (role != 0 && !sub_admin_update) {
            return res.status(403).json({ message: "You don't have permission to update sub admin" })
        }
        try {
            const id = req.params.id; // subadmin id

            const { name, email, country_code, phone_no,

                // CMS
                cms_view, cms_update,

                // USERS
                user_view, user_update,

                // SUB ADMIN
                sub_admin_view, sub_admin_update, sub_admin_add, delete_sub_admin,

                // DUMMY RATING
                dummy_rating_view, dummy_rating_add, dummy_rating_update, dummy_rating_delete,

                // SERVICES
                service_view, service_update, service_add, delete_service_permission,

                // SERVICE TYPES
                service_type_view, service_type_add, service_type_update, service_type_delete_permission,

                // WALLET
                wallet_view,

                // NOTIFICATIONS
                notification_permit,

                // ORDERS
                order_view, order_update,

                // CONTACT US
                contact_us_view,
                contact_us_delete_permission,

                // DASHBOARD
                dashboard_view_permission,

                //Delivery Charges
                delivery_charges_view, delivery_charges_update

            } = req.body;

            // Fetch user first
            let user = await users.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: "Sub admin not found" });
            }

            // 🔍 Check email uniqueness (Allow same email for same user)
            const emailExists = await users.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });

            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // 📷 Profile picture update
            const imageFile = req.files?.profile_picture;
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                req.body.profile_picture = `images/${fileUploader}`;
            }

            // ✅ Update the user
            await users.update(req.body, { where: { id } });

            return res.status(200).json({ message: "Sub admin updated successfully" });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong", error });
        }
    },
    delete_sub_admin: async (req, res) => {
        const { id } = req.params;
        const { role, delete_sub_admin } = req.user;
        if (role != 0 && !delete_sub_admin) {
            return res.status(403).json({ message: "You don't have permission to delete sub admin" })
        }
        try {
            const sub_admin_exists = await users.findOne({ where: { id } });
            if (!sub_admin_exists) {
                return res.status(404).json({ message: "Sub-admin not found" });
            }
            await users.destroy({ where: { id } });
            res.status(200).json({ message: "Sub-admin deleted" });
        } catch (error) {
            throw error
        }
    },
}