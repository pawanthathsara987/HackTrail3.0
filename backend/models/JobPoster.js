import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const JobPoster = sequelize.define(
  "JobPoster",
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
    organizationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizationDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "job_posters",
  }
);

export default JobPoster;
