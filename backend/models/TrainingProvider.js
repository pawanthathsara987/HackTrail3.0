import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const TrainingProvider = sequelize.define(
  "TrainingProvider",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationType: {
      type: DataTypes.STRING,
      defaultValue: "Training Institute",
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specializations: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    verificationStatus: {
      type: DataTypes.STRING,
      defaultValue: "verified",
    },
  },
  {
    timestamps: true,
    tableName: "training_providers",
  }
);

export default TrainingProvider;
