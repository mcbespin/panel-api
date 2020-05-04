'use strict';
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(45)
    },
    path: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isProxy: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: false
  });
  Server.associate = function(models) {
    // associations can be defined here
  };
  return Server;
};