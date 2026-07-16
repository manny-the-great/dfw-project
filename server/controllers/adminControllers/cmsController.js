const { models } = require('../../models');
const { cms } = models;
const { fileUpload } = require('../../utils/fileUpload');

module.exports = {


    getCms: async (req, res) => {
        try {
            const data = await cms.findOne({ where: { type: req.params.type } });
            if (!data) {
                return res.status(404).json({ message: "data not found" });
            }
            res.status(200).json({ message: "CMS content fetched successfully", data });
        } catch (error) {
            throw error
        }
    },

    updateCms: async (req, res) => {
        const { role, cms_update } = req.user;
        if (role != 0 && !cms_update) {
            return res.status(403).json({ message: "You don't have permission to update cms" })
        }
        try {
            const { type, title, description } = req.body;
            const imageFile = req.files && req.files?.image || undefined;
            const cmsContent = await cms.findOne({ where: { type: type } });
            if (!cmsContent) {
                return res.status(404).json({ message: "data not found" });
            }
            const updatedData = { title, description };
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                updatedData.image = `images/${fileUploader}`;
            }
            await cms.update(updatedData, { where: { type } })
            res.status(200).json({ message: "cms updated" });
        } catch (error) {
            throw error
        }
    },


    addCms: async (req, res) => {
        try {
            const { type, title, description } = req.body;
            const imageFile = req.files && req.files?.image || undefined;
            const cmsContent = await cms.findOne({ where: { type } });
            if (cmsContent) {
                return res.status(404).json({ message: "exists" });
            }
            const updatedData = { title, description, type };
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                updatedData.image = `images/${fileUploader}`;
            }
            await cms.create(updatedData)
            res.status(200).json({ message: "cms added" });
        } catch (error) {
            throw error
        }
    },
}