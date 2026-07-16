
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { models } = require('../models');
const { users } = models;
const helper = require('../helper/helper');

module.exports = {
    auth: async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return helper.unauthorized(res, "Unauthorized");
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (!decoded.id) {
                return helper.unauthorized(res, "Unauthorized");
            }
            const user = await users.findOne({ where: { id: decoded.id } });
            if (!user) {
                return helper.unauthorized(res, "user not found");
            }
            if (user) {
                if (user.login_time != decoded.login_time) {
                    return helper.unauthorized(res, "Logged in from another device");
                }
                if (user.role != 0) {
                    if (user.status == 0) {
                        return helper.unauthorized(res, "account is blocked")
                    }
                }
            } else {
                return helper.unauthorized(res, "Please Login First");
            }
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return helper.unauthorized(res, 'Invalid token');
            } else if (error.name === 'TokenExpiredError') {
                return helper.unauthorized(res, 'token expired');
            }
            throw error;
        }
    },

};
