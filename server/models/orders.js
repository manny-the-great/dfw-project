const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0:pickup service,1:other errands"
    },
    service_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    service_type_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    service_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pickup_location: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    pickup_location_latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    pickup_location_longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    pickup_person_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    pickup_country_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    pickup_phone_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    delivery_location: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    delivery_location_latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    delivery_location_longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    delivery_person_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    delivery_country_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ""
    },
    delivery_phone_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    order_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    store_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    utc_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    utc_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    user_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_order_prepaid: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "0:not prepaid,1:prepaid"
    },
    product_price: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    delivery_fee: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    total_price: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    current_order_location: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    current_location_latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    current_location_longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "0:ongoing,1:completed,2:cancelled"
    }
  }, {
    sequelize,
    tableName: 'orders',
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
