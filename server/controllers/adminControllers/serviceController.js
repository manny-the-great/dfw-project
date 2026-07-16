const { models } = require('../../models');
const { service_types, services } = models;
const { Op } = require('sequelize');
const { fileUpload } = require('../../utils/fileUpload');


module.exports = {

    add_service: async (req, res) => {
        const { role, service_add } = req.user;
        if (role != 0 && !service_add) {
            return res.status(403).json({ message: "You don't have permission to add service" })
        }
        const { name } = req.body;
        try {
            const imageFile = req.files.image;
            const fileUploader = await fileUpload(imageFile);
            const image = `images/${fileUploader}`;
            const serviceExists = await services.findOne({ where: { name } });
            if (serviceExists) {
                return res.status(400).json({ message: "Service already exists" });
            }
            await services.create({ name, image });
            res.status(201).json({ message: "category added" });
        } catch (error) {
            throw error
        }
    },

    service_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search?.trim() || '';
            const offset = (page - 1) * limit;

            const whereCondition = {};

            if (search) {
                whereCondition.name = {
                    [Op.like]: `%${search}%`
                };
            }

            const { count, rows: service_list } = await services.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                service_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });

        } catch (error) {
            console.error("Service List Error:", error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    view_service: async (req, res) => {
        const { id } = req.params;
        try {
            const service_details = await services.findOne({ where: { id } });
            res.status(200).json({ message: "service view", service_details });
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    edit_service: async (req, res) => {
        const { role, service_update } = req.user;
        if (role != 0 && !service_update) {
            return res.status(403).json({ message: "You don't have permission to update service" })
        }
        const { name, id } = req.body;
        const imageFile = req.files && req.files?.image || undefined;
        try {
            const service_exists = await services.findOne({ where: { id } });
            if (!service_exists) {
                return res.status(404).json({ message: "Service not found" });
            }

            const nameExists = await services.findOne({
                where: {
                    name,
                    id: { [Op.ne]: id }
                }
            });

            if (nameExists) {
                return res.status(400).json({ message: "Service already exists" });
            }
            const updatedData = { name };
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                updatedData.image = `images/${fileUploader}`;
            } else {
                updatedData.image = service_exists.image;
            }
            await services.update(updatedData, { where: { id } });
            res.status(201).json({ message: "service updated" });
        } catch (error) {
            throw error
        }
    },
    delete_service: async (req, res) => {
        const { id } = req.params;
        const { role, delete_service_permission } = req.user;
        if (role != 0 && !delete_service_permission) {
            return res.status(403).json({ message: "You don't have permission to delete service" })
        }
        try {
            const service_exists = await services.findOne({ where: { id } });
            if (!service_exists) {
                return res.status(404).json({ message: "Service not found" });
            }
            await service_types.destroy({ where: { service_id: id } })
            await services.destroy({ where: { id } });
            res.status(200).json({ message: "Service deleted" });
        } catch (error) {
            throw error
        }
    },
    add_service_type: async (req, res) => {
        const { name, service_id } = req.body;
        const { role, service_type_add } = req.user;
        if (role != 0 && !service_type_add) {
            return res.status(403).json({ message: "You don't have permission to add service type" })
        }
        try {
            const serviceTypeExists = await service_types.findOne({ where: { name, service_id } });
            if (serviceTypeExists) {
                return res.status(400).json({ message: "Service Type already exists" });
            }
            await service_types.create({ name, service_id });
            res.status(201).json({ message: "Service Type added" });
        } catch (error) {
            throw error
        }
    },

    service_type_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;
            const service_id = parseInt(req.query.serviceId) || 1;
            const whereCondition = { service_id };

            if (search) {
                whereCondition.name = {
                    [Op.like]: `%${search}%`
                };
            }
            const { count, rows: service_type_list } = await service_types.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                service_type_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });
        } catch (error) {
            throw error;
        }
    },
    edit_service_type: async (req, res) => {
        const { name, id } = req.body;
        const { role, service_type_update } = req.user;
        if (role != 0 && !service_type_update) {
            return res.status(403).json({ message: "You don't have permission to update service type" })
        }
        try {
            const service_type_exists = await service_types.findOne({ where: { id } });
            if (!service_type_exists) {
                return res.status(404).json({ message: "Service type not found" });
            }

            const nameExists = await service_types.findOne({
                where: {
                    name,
                    id: { [Op.ne]: id }
                }
            });

            if (nameExists) {
                return res.status(400).json({ message: "Service type already exists" });
            }
            await service_types.update({ name }, { where: { id } });
            res.status(201).json({ message: "service type updated" });
        } catch (error) {
            throw error
        }
    },
    delete_service_type: async (req, res) => {
        const { id } = req.params;
        const { role, service_type_delete_permission } = req.user;
        if (role != 0 && !service_type_delete_permission) {
            return res.status(403).json({ message: "You don't have permission to delete service type" })
        }
        try {
            const service_type_exists = await service_types.findOne({ where: { id } });
            if (!service_type_exists) {
                return res.status(404).json({ message: "Service type not found" });
            }
            await service_types.destroy({ where: { id } });
            res.status(200).json({ message: "Service Type deleted" });
        } catch (error) {
            throw error
        }
    },
}