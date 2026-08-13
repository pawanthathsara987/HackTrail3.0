import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const FreelanceProposal = sequelize.define(
  "FreelanceProposal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "freelance_projects",
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
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    proposedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relevantSkills: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    attachmentUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "paid"),
      defaultValue: "unpaid",
    },
    paidAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "freelance_proposals",
  }
);

export default FreelanceProposal;
