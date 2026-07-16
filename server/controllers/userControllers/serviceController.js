const { models } = require('../../models');
const { services, service_types } = models;
const helper = require('../../helper/helper')

module.exports = {
    service_list: async (req, res) => {
        try {
            const service_list = await services.findAll({
                order: [['createdAt', 'DESC']]
            });

            return helper.success(res, "Service list fetched", service_list);
        } catch (error) {
            console.log("error///", error);
            return helper.failed(res, "Something went wrong");
        }
    },
    service_type_list: async (req, res) => {
        const { service_id } = req.params;
        try {
            const service_type_list = await service_types.findAll({
                where: { service_id },
                order: [['createdAt', 'DESC']]
            })
            return helper.success(res, "Service type list fetched", service_type_list)
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

}