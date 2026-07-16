require('dotenv').config();
const { models } = require('../../models');
const { users } = models;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fileUpload } = require('../../utils/fileUpload');


module.exports = {

    signup: async (req, res) => {
        const { name, email, password, country_code, phone_no, location } = req.body;
        try {
            const emailExists = await users.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const imageFile = req.files?.profile_picture;
            const fileUploader = await fileUpload(imageFile);
            const image = `images/${fileUploader}`;
            const admin = await users.create({
                name,
                email,
                password: hashedPassword,
                country_code,
                phone_no,
                profile_picture: image,
                location,
                latitude: 0,
                longitude: 0,
                role: 0,
            });
            res.status(201).json({ message: 'Signup successful', admin });
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await users.findOne({ where: { email } });
            if (!admin) {
                return res.status(404).json({ message: 'Email not found' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            }
            if (admin.role != 0 && admin.status == 0) {
                return res.status(403).json({ message: "Your account has been blocked.Please contact to admin." });
            }
            let time = Math.floor(Date.now() / 1000);
            await admin.update({ login_time: time });
            const token = jwt.sign({ id: admin.id, name: admin.name, login_time: time }, process.env.SECRET_KEY);
            res.status(200).json({ message: "Login successfully", token });
        } catch (error) {
            throw error
        }
    },

    adminProfile: async (req, res) => {
        const { id } = req.params;
        try {
            const admin = await users.findOne({ where: { id } });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            res.status(200).json({ message: "Admin profile", admin });
        } catch (err) {
            throw err
        }
    },

    updateProfile: async (req, res) => {
        const { id } = req.params;
        const { name, email, country_code, phone_no, location, latitude, longitude } = req.body;
        const imageFile = req.files ? req.files.profile_picture : undefined;
        try {
            const admin = await users.findOne({ where: { id } });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            const updatedData = { name, email, country_code, phone_no, location, latitude, longitude };
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                updatedData.profile_picture = `images/${fileUploader}`;
            } else {
                updatedData.profile_picture = admin.profile_picture;
            }
            await users.update(updatedData, { where: { id } });
            res.status(200).json({ message: "Admin profile updated" });
        } catch (err) {
            throw err

        }
    },

    updatePassword: async (req, res) => {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;
        try {
            const admin = await users.findOne({ where: { id } });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            const isValidPassword = await bcrypt.compare(oldPassword, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: "Incorrect current password" });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await users.update({ password: hashedPassword }, { where: { id } });
            res.status(200).json({ message: "Password reset successfully" });
        } catch (err) {
            throw err

        }
    },
    wallet_details: async (req, res) => {
        try {
            const admin = await users.findOne({ where: { role: 0 }, attribute: ["wallet", "revenue"] });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            res.status(200).json({ message: "Admin profile", admin });
        } catch (err) {
            throw err
        }
    },
}