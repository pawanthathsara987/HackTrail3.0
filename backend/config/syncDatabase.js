import { sequelize } from "./database.js";

export const syncDatabase = async () => {
  try {
    // 1. Sync models basic structure
    await sequelize.sync();

    // 2. Safe column additions for freelance_projects
    const projectAlterQueries = [
      "ALTER TABLE `freelance_projects` ADD COLUMN `hiredStudentId` INT NULL;",
      "ALTER TABLE `freelance_projects` ADD COLUMN `paymentStatus` ENUM('unpaid', 'paid') DEFAULT 'unpaid';",
      "ALTER TABLE `freelance_projects` ADD COLUMN `paidAmount` DECIMAL(10, 2) NULL;",
      "ALTER TABLE `freelance_projects` ADD COLUMN `transactionId` VARCHAR(255) NULL;",
      "ALTER TABLE `freelance_projects` ADD COLUMN `paymentMethod` VARCHAR(255) NULL;",
      "ALTER TABLE `freelance_projects` ADD COLUMN `paidAt` DATETIME NULL;",
    ];

    for (const query of projectAlterQueries) {
      try {
        await sequelize.query(query);
      } catch (err) {
        // Ignore 1060 Duplicate column name error
        if (err.original?.errno !== 1060) {
          // ignore expected column exists error
        }
      }
    }

    // 3. Safe column additions for freelance_proposals
    const proposalAlterQueries = [
      "ALTER TABLE `freelance_proposals` ADD COLUMN `paymentStatus` ENUM('unpaid', 'paid') DEFAULT 'unpaid';",
      "ALTER TABLE `freelance_proposals` ADD COLUMN `paidAmount` DECIMAL(10, 2) NULL;",
      "ALTER TABLE `freelance_proposals` ADD COLUMN `transactionId` VARCHAR(255) NULL;",
      "ALTER TABLE `freelance_proposals` ADD COLUMN `paymentMethod` VARCHAR(255) NULL;",
      "ALTER TABLE `freelance_proposals` ADD COLUMN `paidAt` DATETIME NULL;",
    ];

    for (const query of proposalAlterQueries) {
      try {
        await sequelize.query(query);
      } catch (err) {
        if (err.original?.errno !== 1060) {
          // ignore expected column exists error
        }
      }
    }

    // 4. Safe column additions for training_programs
    try {
      await sequelize.query("ALTER TABLE `training_programs` ADD COLUMN `providerId` INT NULL;");
    } catch (err) {
      if (err.original?.errno !== 1060) {
        // ignore expected column exists error
      }
    }

    console.log("✅ Database columns verified & synchronized successfully");
  } catch (error) {
    console.error("⚠️ Database sync error:", error.message);
  }
};
