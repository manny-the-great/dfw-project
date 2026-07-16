const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    card_holder_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    card_last4_digits: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: ""
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_amount: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    delivery_fee: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    amount_to_pay: {
      type: DataTypes.DOUBLE(20, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    payment_status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "1:success,2:failed"
    }
  }, {
    sequelize,
    tableName: 'transactions',
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
