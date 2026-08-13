import { sequelize } from "../config/database.js";
import { FreelanceProject, User } from "../models/index.js";

async function checkProjects() {
  try {
    await sequelize.authenticate();
    const projects = await FreelanceProject.findAll({
      limit: 10,
    });
    console.log(`Found ${projects.length} projects in DB:`);
    projects.forEach((p) => {
      console.log(`ID: ${p.id}, Title: ${p.title}, clientId: ${p.clientId}, status: ${p.status}`);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkProjects();
