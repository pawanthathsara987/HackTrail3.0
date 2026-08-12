import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const TrainingEnrollment = sequelize.define(
  "TrainingEnrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    trainingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "training_programs",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("enrolled", "completed", "dropped"),
      defaultValue: "enrolled",
    },
  },
  {
    timestamps: true,
    tableName: "training_enrollments",
  }
);

export default TrainingEnrollment;
