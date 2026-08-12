import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobPosterId: {
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
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jobType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Part-Time",
    },
    workingHours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salaryMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    salaryMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    salaryType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Monthly",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    responsibilities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "closed", "draft"),
      defaultValue: "active",
    },
  },
  {
    timestamps: true,
    tableName: "jobs",
  }
);

export default Job;
