import User from "./User.js";
import Student from "./Student.js";
import JobPoster from "./JobPoster.js";
import Client from "./Client.js";

// User <-> Student (1:1)
User.hasOne(Student, {
  foreignKey: "userId",
  as: "studentProfile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Student.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User <-> JobPoster (1:1)
User.hasOne(JobPoster, {
  foreignKey: "userId",
  as: "jobPosterProfile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
JobPoster.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User <-> Client (1:1)
User.hasOne(Client, {
  foreignKey: "userId",
  as: "clientProfile",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Client.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, Student, JobPoster, Client };
