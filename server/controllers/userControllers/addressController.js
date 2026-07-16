require('dotenv').config();
const { models } = require('../../models');
const { address, users } = models;
const helper = require("../../helper/helper")

module.exports = {

    address_list: async (req, res) => {
        try {
            const { id } = req.user;
            const list = await address.findAll({
                where: {
                    user_id: id,
                    type: 0,
                },
                order: [['createdAt', 'DESC']],
            });
            return helper.success(res, "address fetched", list)
        } catch (error) {
            return helper.failed(res, 'Something went wrong');
        }
    },

    address_details: async (req, res) => {
        const { id } = req.params;
        try {
            const data = await address.findOne({
                where: {
                    id
                }
            });
            if (!data) {
                return helper.failed(res, 'Address not found');
            }
            return helper.success(res, 'Address details', data);
        } catch (error) {
            return helper.failed(res, 'Something went wrong');
        }
    },

    add_address: async (req, res) => {
        const user_id = req.user.id;
        const { name, country_code, phone_no, city, apartment_no, location, latitude, longitude } = req.body;
        try {
            req.body.user_id = user_id;
            await address.create(req.body);
            return helper.success(res, "address added");
        } catch (error) {
            return helper.failed(res, "Server error")
        }
    },

    update_address: async (req, res) => {
        const { id, name, country_code, phone_no, city, apartment_no, location, latitude, longitude } = req.body;
        try {
            const addressExists = await address.findOne({ where: { id } });
            if (!addressExists) {
                return helper.failed(res, 'Address not found');
            }
            await addressExists.update({
                name: name ?? addressExists.name,
                country_code: country_code ?? addressExists.country_code,
                phone_no: phone_no ?? addressExists.phone_no,
                city: city ?? addressExists.city,
                apartment_no: apartment_no ?? addressExists.apartment_no,
                location: location ?? addressExists.location,
                latitude: latitude ?? addressExists.latitude,
                longitude: longitude ?? addressExists.longitude
            });

            return helper.success(res, "address updated")
        } catch (error) {
            console.log(error)
            return helper.failed(res, 'Something went wrong');
        }
    },

    delete_address: async (req, res) => {
        const { id } = req.params;
        try {
            const addressExists = await address.findOne({ where: { id } });
            if (!addressExists) {
                return helper.failed(res, 'Address not found');
            }
            await addressExists.destroy();
            return helper.success(res, "address deleted")
        } catch (error) {
            console.log(error)
            return helper.failed(res, 'Something went wrong');
        }
    },
}