import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    servicesInterested: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    projectCategories: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    budgetRange: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferredSkills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hiringDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "clients",
  }
);

export default Client;
