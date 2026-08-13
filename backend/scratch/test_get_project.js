import { sequelize } from "../config/database.js";
import { FreelanceProject, User } from "../models/index.js";

async function testGet() {
  try {
    await sequelize.authenticate();
    const projWithoutInclude = await FreelanceProject.findByPk(12);
    console.log("findByPk(12) without include:", projWithoutInclude ? "Found" : "Not Found");

    const projWithInclude = await FreelanceProject.findByPk(12, {
      include: [
        {
          model: User,
          as: "client",
          required: false,
          attributes: ["id", "fullName", "email", "phone", "location", "profilePhoto", "role"],
        },
      ],
    });
    console.log("findByPk(12) with required:false:", projWithInclude ? "Found" : "Not Found");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

testGet();
