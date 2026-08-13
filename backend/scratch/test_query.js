import { sequelize } from "../config/database.js";
import { TrainingProgram } from "../models/index.js";

async function testQuery() {
  try {
    await sequelize.authenticate();
    const { count, rows } = await TrainingProgram.findAndCountAll({
      limit: 5,
    });
    console.log(`✅ TrainingProgram query SUCCESS! Found ${count} programs.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Test query failed:", err);
    process.exit(1);
  }
}

testQuery();
