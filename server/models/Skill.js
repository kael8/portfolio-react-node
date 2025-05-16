const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  level: {
    type: String,
    enum: ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"],
    default: "Beginner",
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Save skill to the database
SkillSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }

  try {
    next();
  } catch (error) {
    next(error);
  }
});

// Method to get a formatted skill object
SkillSchema.methods.getFormattedSkill = function () {
  return {
    id: this._id,
    name: this.name,
    level: this.level,
    type: this.type,
    createdAt: this.createdAt,
  };
};

const Skill = mongoose.model("Skill", SkillSchema);
module.exports = Skill;
