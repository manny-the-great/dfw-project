const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
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
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    building_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    floor: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    apartment_no: {
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
    type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0:user-address,1:order-address"
    }
  }, {
    sequelize,
    tableName: 'address',
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
