import User from "./User.js";
import Student from "./Student.js";
import JobPoster from "./JobPoster.js";
import Client from "./Client.js";
import Job from "./Job.js";
import JobApplication from "./JobApplication.js";
import JobBookmark from "./JobBookmark.js";
import TrainingProgram from "./TrainingProgram.js";
import TrainingEnrollment from "./TrainingEnrollment.js";
import FreelanceProject from "./FreelanceProject.js";
import FreelanceProposal from "./FreelanceProposal.js";

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

// User (JobPoster) <-> Job (1:N)
User.hasMany(Job, {
  foreignKey: "jobPosterId",
  as: "postedJobs",
});
Job.belongsTo(User, {
  foreignKey: "jobPosterId",
  as: "poster",
});

// Job <-> JobApplication (1:N)
Job.hasMany(JobApplication, {
  foreignKey: "jobId",
  as: "applications",
});
JobApplication.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});
User.hasMany(JobApplication, {
  foreignKey: "studentId",
  as: "jobApplications",
});
JobApplication.belongsTo(User, {
  foreignKey: "studentId",
  as: "applicant",
});

// Job <-> JobBookmark (1:N)
User.hasMany(JobBookmark, {
  foreignKey: "userId",
  as: "bookmarks",
});
JobBookmark.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
Job.hasMany(JobBookmark, {
  foreignKey: "jobId",
  as: "bookmarks",
});
JobBookmark.belongsTo(Job, {
  foreignKey: "jobId",
  as: "job",
});

// TrainingProgram <-> TrainingEnrollment (1:N)
TrainingProgram.hasMany(TrainingEnrollment, {
  foreignKey: "trainingId",
  as: "enrollments",
});
TrainingEnrollment.belongsTo(TrainingProgram, {
  foreignKey: "trainingId",
  as: "program",
});
User.hasMany(TrainingEnrollment, {
  foreignKey: "studentId",
  as: "trainingEnrollments",
});
TrainingEnrollment.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});

// User (Client) <-> FreelanceProject (1:N)
User.hasMany(FreelanceProject, {
  foreignKey: "clientId",
  as: "freelanceProjects",
});
FreelanceProject.belongsTo(User, {
  foreignKey: "clientId",
  as: "client",
});

// FreelanceProject <-> FreelanceProposal (1:N)
FreelanceProject.hasMany(FreelanceProposal, {
  foreignKey: "projectId",
  as: "proposals",
});
FreelanceProposal.belongsTo(FreelanceProject, {
  foreignKey: "projectId",
  as: "project",
});
User.hasMany(FreelanceProposal, {
  foreignKey: "studentId",
  as: "freelanceProposals",
});
FreelanceProposal.belongsTo(User, {
  foreignKey: "studentId",
  as: "student",
});

export {
  User,
  Student,
  JobPoster,
  Client,
  Job,
  JobApplication,
  JobBookmark,
  TrainingProgram,
  TrainingEnrollment,
  FreelanceProject,
  FreelanceProposal,
};
