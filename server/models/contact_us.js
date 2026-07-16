const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contact_us', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contact_us',
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
