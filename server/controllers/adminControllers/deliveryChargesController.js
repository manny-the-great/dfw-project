const { models } = require('../../models');
const { delivery_charges } = models;

module.exports = {


    get_deliveryFee: async (req, res) => {
        try {
            const charges = await delivery_charges.findAll();
            if (!charges) {
                return res.status(404).json({ message: "Delivery charges not found" });
            }
            res.status(200).json({ message: "Delivery fee fetched successfully", charges });
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    update_deliveryFee: async (req, res) => {
        const { updatedDeliveryFee } = req.body;
        const { role, delivery_charges_update } = req.user;

        if (role != 0 && !delivery_charges_update) {
            return res.status(403).json({ message: "You don't have permission to update delivery fee" })
        }
        try {
            if (!Array.isArray(updatedDeliveryFee)) {
                return res.status(400).json({ message: "updatedDeliveryFee must be an array" });
            }

            await Promise.all(
                updatedDeliveryFee.map(item => {
                    return delivery_charges.update(
                        { delivery_fee: item.delivery_fee },
                        { where: { id: item.id } }
                    );
                })
            );

            res.status(200).json({ message: "Delivery fees updated successfully" });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong" });
        }
    },

}