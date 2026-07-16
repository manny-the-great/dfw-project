require('dotenv').config();
const { models } = require('../../models');
const { users } = models;
const jwt = require('jsonwebtoken');
const helper = require("../../helper/helper")
const { createCustomer } = require('../../stripe/stripe.config')
const { fileUpload } = require('../../utils/fileUpload');
const sendOtp = require('../../utils/sendOtp');

module.exports = {
    signup: async (req, res) => {
        try {
            // const otp = Math.floor(100000 + Math.random() * 900000);
            const otp = 111111;

            const { name, email, country_code, phone_no } = req.body;
            const imageFile = req?.files ? req.files?.profile_picture : undefined;

            if (!name || !email || !country_code || !phone_no) {
                return helper.failed(res, "All fields are required");
            }

            const emailExists = await users.findOne({ where: { email } });
            if (emailExists) {
                return helper.failed(res, "Email already exists");
            }

            const phoneExists = await users.findOne({
                where: { country_code, phone_no }
            });
            if (phoneExists) {
                return helper.failed(res, "Phone number already exists");
            }
            let profile_picture = null;
            if (imageFile) {
                const fileUploader = await fileUpload(imageFile);
                profile_picture = `images/${fileUploader}`;
            }
            // await sendOtp(country_code, phone_no, otp)
            const user = await users.create({
                name,
                email,
                country_code,
                phone_no,
                profile_picture,
                role: 2,
                otp,
                status: 1
            });

            const userDetails = {
                id: user.id,
                country_code: user.country_code,
                phone_no: user.phone_no,
                type: "signup"
            };

            return helper.success(res, "Signup successful", {
                userDetails
            });

        } catch (error) {

            if (error.code) {
                switch (error.code) {
                    case 21211:
                        return helper.failed(res, "The phone number you entered is invalid or not reachable. Please check and try again.");
                    case 21614:
                        return helper.failed(res, "This phone number cannot receive SMS.");
                    case 21408:
                        return helper.failed(res, "SMS not enabled for this destination.");
                    default:
                        return helper.failed(res, "Something went wrong. Please try again later.");
                }
            }

            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

    verify_otp: async (req, res) => {
        const { otp, id, device_token } = req.body;
        try {
            const user = await users.findOne({ where: { id } });
            if (!user) {
                return helper.failed(res, "Account not found")
            }
            if (user.otp != otp) {
                return helper.failed(res, "The OTP you entered is incorrect")
            }
            let time = Math.floor(Date.now() / 1000);
            if (!user.customer_id) {
                const customer = await createCustomer({
                    name: user.name,
                    email: user.email
                });
                await user.update({ customer_id: customer.id });
            }
            const updateData = {
                otp: null,
                otp_verified: 1,
                login_time: time,
            };

            if (device_token && device_token.trim() !== "") {
                updateData.device_token = device_token;
            }

            await user.update(updateData);

            const userInfo = await users.findOne({ where: { id } });
            const token = jwt.sign({ id: user.id, name: user.name, login_time: userInfo.login_time }, process.env.SECRET_KEY);
            let userData = JSON.parse(JSON.stringify(userInfo));
            userData.authToken = token;
            return helper.success(res, "OTP verified successfully", { userData })
        } catch (error) {
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

    resendOTP: async (req, res) => {
        const { id } = req.body;
        try {
            // const otp = Math.floor(100000 + Math.random() * 900000);
            const otp = 111111;
            if (!id) {
                return helper.failed(res, "Something went wrong");
            }
            const userExists = await users.findOne({ where: { id } });
            if (!userExists) {
                return helper.failed(res, "Account not found");
            }
            // await sendOtp(userExists.country_code, userExists.phone_no, otp)
            await userExists.update(
                { otp }
            );
            return helper.success(res, "Resent OTP successfully");
        } catch (error) {
            console.log(error)
            if (error.code) {
                switch (error.code) {
                    case 21211:
                        return helper.failed(res, "The phone number you entered is invalid or not reachable. Please check and try again.");
                    case 21614:
                        return helper.failed(res, "This phone number cannot receive SMS.");
                    case 21408:
                        return helper.failed(res, "SMS not enabled for this destination.");
                    default:
                        return helper.failed(res, "Something went wrong. Please try again later.");
                }
            }
            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

    login: async (req, res) => {
        const { country_code, phone_no } = req.body;
        try {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const user = await users.findOne({ where: { country_code, phone_no, role: 2 } });
            if (!user) {
                return helper.failed(res, "Account not found")
            }

            if (user.status != 1) {
                return helper.failed(res, "Your account has been deactivated")
            }
            await sendOtp(country_code, phone_no, otp)
            await users.update({ otp }, { where: { id: user.id } });
            const userDetails = {
                id: user.id,
                country_code: user.country_code,
                phone_no: user.phone_no,
                type: "login"
            };

            return helper.success(res, "OTP sent successfully", { userDetails })
        } catch (error) {
            if (error.code) {
                switch (error.code) {
                    case 21211:
                        return helper.failed(res, "The phone number you entered is invalid or not reachable. Please check and try again.");
                    case 21614:
                        return helper.failed(res, "This phone number cannot receive SMS.");
                    case 21408:
                        return helper.failed(res, "SMS not enabled for this destination.");
                    default:
                        return helper.failed(res, "Something went wrong. Please try again later.");
                }
            }

            return helper.failed(res, "Something went wrong. Please try again later.");
        }
    },

}