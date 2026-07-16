const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('delivery_charges', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_mile: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: true,
      defaultValue: 0.0
    },
    end_mile: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: true,
      defaultValue: 0.0
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    fee_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: "0:total fee from start to end mile,1:fee per mile"
    }
  }, {
    sequelize,
    tableName: 'delivery_charges',
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
