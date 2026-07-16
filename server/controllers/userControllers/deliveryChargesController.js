const { models } = require('../../models');
const { delivery_charges } = models;
const helper = require('../../helper/helper');

module.exports = {

    get_delivery_charges: async (req, res) => {
        try {
            const charges = await delivery_charges.findAll();
            return helper.success(res, "Delivery fee fetched successfully", charges);
        } catch (error) {
            console.log(error)
            throw error
        }
    },
}