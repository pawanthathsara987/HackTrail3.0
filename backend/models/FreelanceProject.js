import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const FreelanceProject = sequelize.define(
  "FreelanceProject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientRating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 5.0,
    },
    clientLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Fixed Price",
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budgetMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    budgetMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    skillsRequired: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    proposalsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "completed", "closed"),
      defaultValue: "open",
    },
  },
  {
    timestamps: true,
    tableName: "freelance_projects",
  }
);

export default FreelanceProject;
