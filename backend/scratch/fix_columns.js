import { sequelize } from "../config/database.js";
import "../models/index.js";

async function fixDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL.");

    // Manually add providerId column to training_programs if not present
    try {
      await sequelize.query(
        "ALTER TABLE `training_programs` ADD COLUMN `providerId` INT NULL AFTER `provider`;"
      );
      console.log("✅ Added providerId column to training_programs table");
    } catch (e) {
      if (e.original && e.original.errno === 1060) {
        console.log("ℹ️ providerId column already exists");
      } else {
        console.log("Note on providerId column:", e.message);
      }
    }

    // Sync models
    await sequelize.sync({ alter: true });
    console.log("✅ Full DB sync completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database sync error:", err);
    process.exit(1);
  }
}

fixDatabase();
