var DataTypes = require("sequelize").DataTypes;
var _address = require("./address");
var _cms = require("./cms");
var _contact_us = require("./contact_us");
var _dummy_ratings = require("./dummy_ratings");
var _notifications = require("./notifications");
var _orders = require("./orders");
var _service_types = require("./service_types");
var _services = require("./services");
var _transactions = require("./transactions");
var _users = require("./users");
var _delivery_charges = require("./delivery_charges");





function allModels(sequelize) {
    var address = _address(sequelize, DataTypes);
    var cms = _cms(sequelize, DataTypes);
    var contact_us = _contact_us(sequelize, DataTypes);
    var dummy_ratings = _dummy_ratings(sequelize, DataTypes);
    var notifications = _notifications(sequelize, DataTypes);
    var orders = _orders(sequelize, DataTypes);
    var service_types = _service_types(sequelize, DataTypes);
    var services = _services(sequelize, DataTypes);
    var transactions = _transactions(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);
    var delivery_charges = _delivery_charges(sequelize, DataTypes);

    orders.belongsTo(address, { as: "user_address", foreignKey: "user_address_id" });
    address.hasMany(orders, { as: "orders_address", foreignKey: "user_address_id", onDelete: 'CASCADE' });
    transactions.belongsTo(orders, { as: "order", foreignKey: "order_id" });
    orders.hasOne(transactions, { as: "order_transactions", foreignKey: "order_id", onDelete: 'CASCADE' });
    orders.belongsTo(service_types, { as: "order_service_type", foreignKey: "service_type_id" });
    service_types.hasMany(orders, { as: "service_type_order", foreignKey: "service_type_id", onDelete: 'CASCADE' });
    service_types.belongsTo(services, { as: "service", foreignKey: "service_id" });
    services.hasMany(service_types, { as: "service_type", foreignKey: "service_id", onDelete: 'CASCADE' });
    address.belongsTo(users, { as: "address_user", foreignKey: "user_id" });
    users.hasMany(address, { as: "user_addresses", foreignKey: "user_id", onDelete: 'CASCADE' });
    notifications.belongsTo(users, { as: "receiver", foreignKey: "receiver_id" });
    users.hasMany(notifications, { as: "receiver_notifications", foreignKey: "receiver_id", onDelete: 'CASCADE' });
    notifications.belongsTo(users, { as: "sender", foreignKey: "sender_id" });
    users.hasMany(notifications, { as: "sender_notifications", foreignKey: "sender_id", onDelete: 'CASCADE' });
    orders.belongsTo(users, { as: "buyer", foreignKey: "user_id" });
    users.hasMany(orders, { as: "orders", foreignKey: "user_id", onDelete: 'CASCADE' });
    transactions.belongsTo(users, { as: "paid_by", foreignKey: "user_id" });
    users.hasMany(transactions, { as: "user_transactions", foreignKey: "user_id", onDelete: 'CASCADE' });

    return {
        address,
        cms,
        contact_us,
        dummy_ratings,
        notifications,
        orders,
        service_types,
        services,
        transactions,
        users,
        delivery_charges,
    };
}
module.exports = allModels;
module.exports.allModels = allModels;
module.exports.allModels = allModels;