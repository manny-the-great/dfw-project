const { models } = require('../../models');
const { users, } = models;
const bcrypt = require('bcrypt');
const { fileUpload } = require('../../utils/fileUpload');
const helper = require("../../helper/helper")

module.exports = {
    admin_details: async (req, res) => {
        try {
            const user = await users.findOne({ where: { role: 0 }, attributes: ['location', 'latitude', 'longitude'] });
            if (!user) {
                return helper.failed(res, "User not found")
            }
            return helper.success(res, "admin details", user)
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },
    profile_details: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await users.findOne({ where: { id } });
            if (!user) {
                return helper.failed(res, "User not found")
            }
            return helper.success(res, "User details", user)
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

    edit_profile: async (req, res) => {
        try {
            const { name, email } = req.body;
            const imageFile = req.files ? req.files.profile_picture : undefined;
            const userData = {
                name,
                email
            };

            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                const imagePath = `images/${fileUploader}`;
                userData.profile_picture = imagePath
            }
            await users.update(
                userData
                ,
                { where: { id: req.user.id } }
            );
            return helper.success(res, "Profile Updated Successfully");
        } catch (error) {
            console.log(error);
            return helper.failed(res, error);
        }
    },
    logout: async (req, res) => {
        const { id } = req.user;
        try {
            await users.update({ device_token: null, login_time: null }, { where: { id } });
            return helper.success(res, "Logout successfully")
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    }
}