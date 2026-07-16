const { models } = require('../../models');
const { dummy_ratings } = models;
const { Op } = require('sequelize');
const { fileUpload } = require('../../utils/fileUpload');

module.exports = {
    add_ratings: async (req, res) => {
        const { role, dummy_rating_add } = req.user;
        if (role != 0 && !dummy_rating_add) {
            return res.status(403).json({ message: "You don't have permission to add ratings" })
        }
        try {
            const { review, ratings, name } = req.body;
            const imageFile = req.files ? req.files?.image : undefined;
            let image;
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                image = `images/${fileUploader}`;
            }
            await dummy_ratings.create({
                review,
                ratings,
                name,
                image
            });
            res.status(200).json({ message: "ratings added successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error', error });
        }
    },

    edit_ratings: async (req, res) => {
        const { role, dummy_rating_update } = req.user;
        if (role != 0 && !dummy_rating_update) {
            return res.status(403).json({ message: "You don't have permission to update ratings" })
        }
        try {
            const { review, ratings, name, id } = req.body;
            const imageFile = req.files ? req.files?.image : undefined;
            const reviewExists = await dummy_ratings.findOne({ where: { id } });
            if (!reviewExists) {
                res.status(404).json({ message: "Ratings not found" })
            }
            const updatedData = {
                review,
                ratings,
                name
            }
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                updatedData.image = `images/${fileUploader}`;
            }
            await dummy_ratings.update(updatedData, { where: { id } });
            res.status(200).json({ message: "ratings updated successfully" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error' });
        }
    },

    get_rating_list: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const offset = (page - 1) * limit;

            const whereCondition = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                ]
            };

            const { count, rows: rating_list } = await dummy_ratings.findAndCountAll({
                where: whereCondition,
                distinct: true,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                rating_list,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit)
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Server Error', error });
        }
    },


    view_rating: async (req, res) => {
        const { id } = req.params;
        try {
            const details = await dummy_ratings.findOne({
                where: { id },
            });
            if (!details) {
                return res.status(404).json({ message: "Rating not found" });
            }
            res.status(200).json({ message: "rating details fetched successfully", details });
        } catch (error) {
            throw error;
        }
    },
    delete_dummy_rating: async (req, res) => {
        const { role, dummy_rating_delete } = req.user;
        if (role != 0 && !dummy_rating_delete) {
            return res.status(403).json({ message: "You don't have permission to delete ratings" })
        }
        try {
            const ratingId = parseInt(req.params.id);

            if (!ratingId) {
                return res.status(400).json({ message: "Invalid rating ID" });
            }

            const exists = await dummy_ratings.findOne({ where: { id: ratingId } });

            if (!exists) {
                return res.status(404).json({ message: "Rating not found" });
            }

            const deleted = await dummy_ratings.destroy({
                where: { id: ratingId },
            });

            return res.json({ message: "Dummy rating deleted" });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

}