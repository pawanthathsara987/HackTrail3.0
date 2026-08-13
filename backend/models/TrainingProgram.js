import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const TrainingProgram = sequelize.define(
  "TrainingProgram",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    providerLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skillLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Beginner",
    },
    trainingType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Online",
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationWeeks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    curriculum: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enrolledCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 4.8,
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    whatYouWillLearn: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Online",
    },
    learningFormat: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Online",
    },
  },
  {
    timestamps: true,
    tableName: "training_programs",
  }
);

export default TrainingProgram;
