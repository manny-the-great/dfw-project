const { models } = require('../../models');
const { contact_us } = models;
const helper = require('../../helper/helper')

module.exports = {
    contact_Us: async (req, res) => {
        const { name, email, country_code, phone_no, message } = req.body;
        try {
            await contact_us.create({ name, email, country_code, phone_no, message })
            return helper.success(res, "Thank you for contacting us. Our team will get back to you shortly.");
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },
}