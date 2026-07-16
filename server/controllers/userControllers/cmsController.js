const { models } = require('../../models');
const { cms } = models;
const helper = require('../../helper/helper');

module.exports = {
    getCms: async (req, res) => {
        const { type } = req.params
        try {
            if (!type) {
                return helper.failed(res, "Something went wrong")
            }
            const data = await cms.findOne({ where: { type } });
            if (!data) {
                return helper.failed(res, "cms not found")
            }
            return helper.success(res, "cms found", data)
        } catch (error) {
            throw error
        }
    },
}