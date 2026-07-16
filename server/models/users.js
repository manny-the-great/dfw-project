const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "0:admin,1:sub-admin,2:user"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    profile_picture: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    phone_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "0:inactive,1:active"
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    otp_verified: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:not verified,1:verified"
    },
    login_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    wallet: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    revenue: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0-default,1:ios,2:android"
    },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    cms_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    cms_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    user_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    user_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    sub_admin_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    sub_admin_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    sub_admin_add: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    delete_sub_admin: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1-yes"
    },
    dummy_rating_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    dummy_rating_add: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    dummy_rating_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    dummy_rating_delete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1-yes"
    },
    service_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    service_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    service_add: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    delete_service_permission: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1-yes"
    },
    service_type_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    service_type_add: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    service_type_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    service_type_delete_permission: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    wallet_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    notification_permit: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    order_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    order_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    contact_us_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    contact_us_delete_permission: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    dashboard_view_permission: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no,1:yes"
    },
    delivery_charges_view: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no access,1:access"
    },
    delivery_charges_update: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:no access,1:access"
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
