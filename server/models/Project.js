const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company_name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
  ],
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
  },
  is_current: {
    type: Boolean,
    default: false,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update updated_at timestamp before saving
ProjectSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Method to get a formatted project object (basic version without populating skills)
ProjectSchema.methods.getFormattedProject = function () {
  return {
    id: this._id,
    title: this.title,
    company_name: this.company_name,
    description: this.description,
    technologies: this.technologies, // This will be an array of Skill ObjectIds
    start_date: this.start_date,
    end_date: this.end_date,
    is_current: this.is_current,
    is_featured: this.is_featured,
    views: this.views,
    created_at: this.created_at,
    updated_at: this.updated_at,
  };
};

// Method to get a formatted project with populated skills
ProjectSchema.methods.getFormattedProjectWithSkills = async function () {
  await this.populate("technologies");

  const formattedProject = this.getFormattedProject();
  formattedProject.technologies = this.technologies.map((skill) => ({
    id: skill._id,
    name: skill.name,
    level: skill.level,
    type: skill.type,
  }));

  return formattedProject;
};

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
