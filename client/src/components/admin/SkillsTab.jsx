import React, { useEffect, useState } from "react";
import colors from "../../utils/colors";
import useSkills from "../../hooks/useSkills";
// Add icon imports for better UI
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";

const debugLevel = (level, location, getNumericLevel, skillLevelMap) => {
  console.log(`Skill level at ${location}:`, level, typeof level);

  // If it's already a number between 1-5, just return it
  if (typeof level === "number" && level >= 1 && level <= 5 && !isNaN(level)) {
    return level;
  }

  // If it's a string like "Intermediate", convert it using getNumericLevel
  if (typeof level === "string" && skillLevelMap) {
    // Find the numeric key for this level string
    const numericLevel = getNumericLevel(level);
    if (numericLevel >= 1 && numericLevel <= 5) {
      return numericLevel;
    }
  }

  // Try to parse it as a number
  const parsed = parseInt(level);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
    return parsed;
  }

  // If we got here, use a default
  console.warn(`Couldn't determine level at ${location}, using fallback`);
  return 3; // Fallback to Intermediate
};

const getLevelNumber = (levelString) => {
  // Map string levels to numbers (1-5)
  switch (levelString) {
    case "Beginner":
      return 1;
    case "Elementary":
      return 2;
    case "Intermediate":
      return 3;
    case "Advanced":
      return 4;
    case "Expert":
      return 5;
    default:
      return 3; // Default to Intermediate
  }
};

// Create a separate modal component with internal state management
const AddSkillModal = ({
  initialSkill = { name: "", level: 3, type: "" },
  onSubmit,
  onCancel,
  externalFormError,
  isSubmitting,
  skillLevelMap,
  getNumericLevel,
  styles,
  title = "Add New Skill",
}) => {
  // Local state for the form - this is key to making inputs work
  const [skill, setSkill] = useState(initialSkill);
  const [formError, setFormError] = useState(externalFormError || "");

  // Update local error if external error changes
  useEffect(() => {
    if (externalFormError) {
      setFormError(externalFormError);
    }
  }, [externalFormError]);

  const handleSubmit = () => {
    // Validate locally
    if (!skill.name) {
      setFormError("Skill name is required");
      return;
    }

    if (!skill.type) {
      setFormError("Skill type is required");
      return;
    }

    // Convert numeric level to string if needed for backend compatibility
    const submissionData = {
      ...skill,
      level:
        typeof skill.level === "number"
          ? skillLevelMap[skill.level]
          : skill.level,
    };

    // Call the parent's onSubmit with our properly formatted data
    onSubmit(submissionData);
  };

  // Render star rating for visual selection
  const renderStarRating = () => {
    const stars = [];

    // Convert the level to a numeric value
    let numericLevel;
    if (typeof skill.level === "string") {
      numericLevel = getLevelNumber(skill.level);
    } else if (
      typeof skill.level === "number" &&
      skill.level >= 1 &&
      skill.level <= 5
    ) {
      numericLevel = skill.level;
    } else {
      numericLevel = 3; // Default
    }

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setSkill({ ...skill, level: i })}
          style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            color: i <= numericLevel ? colors.primary : colors.textSecondary,
            marginRight: "8px",
            transition: "all 0.2s ease",
          }}
        >
          {i <= numericLevel ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }

    return stars;
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <h3
        style={{
          ...styles.modalTitle,
          borderLeft: `4px solid ${colors.primary}`,
          paddingLeft: "15px",
        }}
      >
        {title}
      </h3>

      {formError && (
        <div
          style={{
            ...styles.formError,
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            border: "1px solid #ff5252",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "15px",
            color: "#ff5252",
            fontSize: "0.9rem",
          }}
        >
          {formError}
        </div>
      )}

      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Name
          </label>
          <input
            type="text"
            placeholder="Enter skill name"
            style={{
              ...styles.input,
              transition: "border-color 0.3s",
              ":focus": {
                borderColor: colors.primary,
                boxShadow: `0 0 0 2px ${colors.primary}33`,
              },
            }}
            value={skill.name || ""}
            onChange={(e) => setSkill({ ...skill, name: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Level
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: colors.dark,
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              {renderStarRating()}
            </div>

            <select
              style={styles.input}
              value={skillLevelMap[skill.level] || "Intermediate"}
              onChange={(e) =>
                setSkill({
                  ...skill,
                  level: parseInt(getNumericLevel(e.target.value)),
                })
              }
            >
              <option value={skillLevelMap[1]}>Beginner</option>
              <option value={skillLevelMap[2]}>Elementary</option>
              <option value={skillLevelMap[3]}>Intermediate</option>
              <option value={skillLevelMap[4]}>Advanced</option>
              <option value={skillLevelMap[5]}>Expert</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Type
          </label>
          <select
            style={styles.input}
            value={skill.type || ""}
            onChange={(e) => setSkill({ ...skill, type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="devops">DevOps</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div
          style={{
            ...styles.modalActions,
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            style={{
              ...styles.cancelButton,
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
              },
            }}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              },
            }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Adding..."
            ) : (
              <>
                <FaPlus size={14} /> Add Skill
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Enhanced edit skill modal with similar improvements
const EditSkillModal = ({
  initialSkill,
  onSubmit,
  onCancel,
  externalFormError,
  isEditing,
  skillLevelMap,
  getNumericLevel,
  styles,
}) => {
  // Local state for the form
  const [skill, setSkill] = useState(initialSkill);
  const [formError, setFormError] = useState(externalFormError || "");

  // Update local error if external error changes
  useEffect(() => {
    if (externalFormError) {
      setFormError(externalFormError);
    }
  }, [externalFormError]);

  const handleSubmit = () => {
    // Validate locally
    if (!skill.name) {
      setFormError("Skill name is required");
      return;
    }

    if (!skill.type) {
      setFormError("Skill type is required");
      return;
    }

    // Convert numeric level to string if needed for backend
    // Only needed if your backend requires string values
    const submissionData = {
      ...skill,
      level:
        typeof skill.level === "number"
          ? skillLevelMap[skill.level]
          : skill.level,
    };

    // Call the parent's onSubmit with our local state
    onSubmit(submissionData);
  };

  // Render star rating for visual selection
  const renderStarRating = () => {
    const stars = [];
    // Convert string level to number
    const level =
      typeof skill.level === "string"
        ? getNumericLevel(skill.level)
        : parseInt(skill.level || 3);

    console.log("Star rating level:", level, "from original:", skill.level);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setSkill({ ...skill, level: i })}
          style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            color: i <= level ? colors.primary : colors.textSecondary,
            marginRight: "8px",
            transition: "all 0.2s ease",
          }}
        >
          {i <= level ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }

    return stars;
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <h3
        style={{
          ...styles.modalTitle,
          borderLeft: `4px solid ${colors.primary}`,
          paddingLeft: "15px",
        }}
      >
        Edit Skill
      </h3>

      {formError && (
        <div
          style={{
            ...styles.formError,
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            border: "1px solid #ff5252",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "15px",
            color: "#ff5252",
            fontSize: "0.9rem",
          }}
        >
          {formError}
        </div>
      )}

      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Name
          </label>
          <input
            type="text"
            value={skill.name || ""}
            onChange={(e) => setSkill({ ...skill, name: e.target.value })}
            style={{
              ...styles.input,
              transition: "border-color 0.3s",
              ":focus": {
                borderColor: colors.primary,
                boxShadow: `0 0 0 2px ${colors.primary}33`,
              },
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Level
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
                backgroundColor: colors.dark,
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              {renderStarRating()}
            </div>

            <select
              style={styles.input}
              value={skillLevelMap[skill.level] || "Intermediate"}
              onChange={(e) =>
                setSkill({
                  ...skill,
                  level: parseInt(getNumericLevel(e.target.value)),
                })
              }
            >
              <option value={skillLevelMap[1]}>Beginner</option>
              <option value={skillLevelMap[2]}>Elementary</option>
              <option value={skillLevelMap[3]}>Intermediate</option>
              <option value={skillLevelMap[4]}>Advanced</option>
              <option value={skillLevelMap[5]}>Expert</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
            }}
          >
            Skill Type
          </label>
          <select
            style={styles.input}
            value={skill.type || ""}
            onChange={(e) => setSkill({ ...skill, type: e.target.value })}
          >
            <option value="">Select type</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="devops">DevOps</option>
            <option value="design">Design</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div
          style={{
            ...styles.modalActions,
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            style={{
              ...styles.cancelButton,
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
              },
            }}
            onClick={onCancel}
            disabled={isEditing}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              ...styles.submitButton,
              opacity: isEditing ? 0.7 : 1,
              cursor: isEditing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              },
            }}
            onClick={handleSubmit}
            disabled={isEditing}
          >
            {isEditing ? "Saving..." : <>Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

const SkillsTab = ({ setIsModalOpen, setModalContent, styles }) => {
  // Use the hook to access shared state and functions
  const {
    skills,
    loading,
    error,
    formError,
    isSubmitting,
    editFormError,
    isEditing,
    isDeleting,
    skillToDelete,
    groupedSkills,
    skillLevelMap,
    setFormError,
    setEditFormError,
    setIsEditing,
    setIsDeleting,
    setSkills,
    setIsSubmitting,
    getNumericLevel,
    fetchSkills,
    handleSubmitNewSkill,
    handleSubmitEditSkill,
    handleDeleteSkill,
  } = useSkills();

  useEffect(() => {
    // Ensure all skills have valid level values when loaded
    if (skills.length > 0) {
      console.log("Sample skill data:", skills.slice(0, 3));

      const normalizedSkills = skills.map((skill) => {
        // Handle string levels consistently (keep them as strings for backend compatibility)
        // but ensure they're valid values
        if (typeof skill.level === "string") {
          // Check if it's already a valid string level
          if (
            [
              "Beginner",
              "Elementary",
              "Intermediate",
              "Advanced",
              "Expert",
            ].includes(skill.level)
          ) {
            return skill; // Already valid string level
          }

          // Try to parse as number and convert back to string level
          const parsed = parseInt(skill.level);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
            return {
              ...skill,
              level: skillLevelMap[parsed] || "Intermediate",
            };
          }

          // Default to Intermediate if invalid
          return { ...skill, level: "Intermediate" };
        }

        // Handle numeric levels (for UI interactions)
        else if (typeof skill.level === "number") {
          if (skill.level >= 1 && skill.level <= 5) {
            return skill; // Valid numeric level
          }
          return { ...skill, level: 3 }; // Default to 3 (Intermediate) if invalid
        }

        // Handle undefined/null
        return { ...skill, level: "Intermediate" };
      });

      // Check if anything actually changed before updating state
      const needsUpdate = normalizedSkills.some(
        (s, i) => s.level !== skills[i].level
      );

      if (needsUpdate) {
        console.log("Normalizing skill levels in data");
        setSkills(normalizedSkills);
      }
    }
  }, [skills]);

  // Component-specific functions that need modal handling
  const handleAddSkill = () => {
    // Reset form state
    setFormError("");

    setModalContent(
      <AddSkillModal
        initialSkill={{ name: "", level: 3, type: "" }}
        onSubmit={async (skill) => {
          // Log the skill data for debugging
          console.log(
            "Submitting skill with level:",
            skill.level,
            typeof skill.level
          );
          const result = await handleSubmitNewSkill(skill);
          if (result.success) {
            setIsModalOpen(false);
          } else {
            // Update modal with new error
            setModalContent(
              <AddSkillModal
                initialSkill={skill}
                onSubmit={handleSubmitNewSkill}
                onCancel={() => setIsModalOpen(false)}
                externalFormError={result.error}
                isSubmitting={false}
                skillLevelMap={skillLevelMap}
                getNumericLevel={getNumericLevel}
                styles={styles}
              />
            );
          }
        }}
        onCancel={() => setIsModalOpen(false)}
        externalFormError={formError}
        isSubmitting={isSubmitting}
        skillLevelMap={skillLevelMap}
        getNumericLevel={getNumericLevel}
        styles={styles}
      />
    );
    setIsModalOpen(true);
  };

  // Render star rating for display
  const renderSkillLevel = (level) => {
    const stars = [];

    // Determine numeric level value based on input type
    let numericLevel;

    if (typeof level === "string") {
      numericLevel = getLevelNumber(level);
    } else if (typeof level === "number" && level >= 1 && level <= 5) {
      numericLevel = level;
    } else {
      numericLevel = 3; // Default to Intermediate
    }

    // Create star components
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= numericLevel ? colors.primary : colors.textSecondary,
            fontSize: "0.8rem",
            marginRight: "2px",
          }}
        >
          {i <= numericLevel ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
        {stars}
        <span
          style={{
            marginLeft: "8px",
            fontSize: "0.8rem",
            color: colors.textSecondary,
          }}
        >
          {typeof level === "string"
            ? level
            : skillLevelMap[numericLevel] || "Intermediate"}
        </span>
      </div>
    );
  };

  // Updated to handle skill schema fields with enhanced UI
  const handleEditSkills = (category) => {
    const skillsOfCategory = groupedSkills.find((s) => s.category === category);

    if (!skillsOfCategory) return;

    setModalContent(
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <h3
          style={{
            ...styles.modalTitle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderLeft: `4px solid ${colors.primary}`,
            paddingLeft: "15px",
          }}
        >
          <span>Edit {category} Skills</span>
          <button
            style={{
              ...styles.button,
              backgroundColor: colors.primary,
              color: colors.dark,
              border: "none",
              fontSize: "0.8rem",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            onClick={() => handleAddSkillOfType(category.toLowerCase())}
          >
            <FaPlus size={12} /> Add
          </button>
        </h3>

        <div
          style={{
            ...styles.skillsList,
            maxHeight: "400px",
            overflowY: "auto",
            padding: "5px",
            marginBottom: "20px",
          }}
        >
          {skillsOfCategory.items.map((skill) => (
            <div
              key={skill._id || skill.id || `skill-${skill.name}`}
              style={{
                ...styles.skillRow,
                padding: "12px 15px",
                borderRadius: "8px",
                marginBottom: "10px",
                backgroundColor: colors.dark,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                ":hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "500",
                    color: colors.textPrimary,
                  }}
                >
                  {skill.name}
                </div>
                {renderSkillLevel(skill.level)}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  style={{
                    ...styles.button,
                    ...styles.editButton,
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                    ":hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => handleEditSingleSkill(skill._id || skill.id)}
                >
                  <FaEdit size={14} /> Edit
                </button>
                <button
                  style={{
                    ...styles.button,
                    ...styles.deleteButton,
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                    ":hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 3px 8px rgba(255,82,82,0.2)",
                    },
                  }}
                  onClick={async () => {
                    const result = await handleDeleteSkill(
                      skill._id || skill.id
                    );
                    if (result && result.success) {
                      setIsModalOpen(false);
                    }
                  }}
                >
                  <FaTrash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            ...styles.modalActions,
            borderTop: `1px solid ${colors.dark}`,
            paddingTop: "15px",
          }}
        >
          <button
            type="button"
            style={{
              ...styles.cancelButton,
              transition: "all 0.2s ease",
              ":hover": {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
              },
            }}
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            style={{
              ...styles.submitButton,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => {
              // Add new skill of this category
              handleAddSkillOfType(category.toLowerCase());
            }}
          >
            <FaPlus size={14} /> Add New {category} Skill
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  // Fixed version that doesn't call useState inside
  const handleEditSingleSkill = (skillId) => {
    console.log("Editing skill with ID:", skillId);
    console.log("Skills:", skills);
    const skill = skills.find((s) => s._id === skillId || s.id === skillId);
    if (!skill) return;

    console.log("Skill level details:", {
      rawLevel: skill.level,
      type: typeof skill.level,
      mappedText:
        typeof skill.level === "string"
          ? skill.level
          : skillLevelMap[skill.level] || "Unknown",
      numericValue:
        typeof skill.level === "string"
          ? getNumericLevel(skill.level)
          : parseInt(skill.level),
    });

    // Reset edit form state
    setEditFormError("");
    setIsEditing(false);

    setModalContent(
      <EditSkillModal
        initialSkill={skill}
        onSubmit={async (skill) => {
          try {
            const result = await handleSubmitEditSkill(skill);
            if (result && result.success) {
              setIsModalOpen(false);
            }
          } catch (error) {
            console.error("Error during skill update:", error);
          }
        }}
        onCancel={() => setIsModalOpen(false)}
        externalFormError={editFormError}
        isEditing={isEditing}
        skillLevelMap={skillLevelMap}
        getNumericLevel={getNumericLevel}
        styles={styles}
      />
    );
    setIsModalOpen(true);
  };

  // Handler for adding a skill of specific type
  const handleAddSkillOfType = (type) => {
    // Reset form state
    setFormError("");
    setIsSubmitting(false);

    setModalContent(
      <AddSkillModal
        initialSkill={{ name: "", level: 3, type }}
        onSubmit={(skill) => {
          // Log the skill data for debugging
          console.log(
            "Submitting skill with level:",
            skill.level,
            typeof skill.level
          );
          handleSubmitNewSkill(skill);
        }}
        onCancel={() => setIsModalOpen(false)}
        externalFormError={formError}
        isSubmitting={isSubmitting}
        skillLevelMap={skillLevelMap}
        getNumericLevel={getNumericLevel}
        styles={styles}
        title={`Add New ${type.charAt(0).toUpperCase() + type.slice(1)} Skill`}
      />
    );
    setIsModalOpen(true);
  };

  return (
    <div
      style={{
        ...styles.section,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          ...styles.sectionTitle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          paddingBottom: "15px",
          borderBottom: `2px solid ${colors.dark}`,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.6rem",
            fontWeight: "600",
            color: colors.primary,
          }}
        >
          Manage Skills
        </span>
        <button
          style={{
            ...styles.addButton,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 15px",
            borderRadius: "8px",
            backgroundColor: colors.primary,
            color: colors.dark,
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={handleAddSkill}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
        >
          <FaPlus size={16} /> Add New Skill
        </button>
      </div>

      {loading ? (
        <div
          style={{
            ...styles.loadingText,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            fontSize: "1.1rem",
            color: colors.textSecondary,
          }}
        >
          <div
            className="loading-spinner"
            style={{
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              border: `3px solid ${colors.dark}`,
              borderTopColor: colors.primary,
              animation: "spin 1s linear infinite",
              marginRight: "15px",
            }}
          ></div>
          Loading skills...
        </div>
      ) : error ? (
        <div
          style={{
            ...styles.error,
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            border: "1px solid #ff5252",
            borderRadius: "8px",
            padding: "15px",
            color: "#ff5252",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : groupedSkills.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: "30px",
            borderStyle: "dashed",
            borderWidth: "2px",
            backgroundColor: "transparent",
          }}
        >
          <div
            style={{
              ...styles.projectInfo,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                color: colors.textSecondary,
              }}
            >
              No skills found. Add your first skill to get started.
            </p>
            <button
              style={{
                ...styles.addButton,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: colors.primary,
                color: colors.dark,
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={handleAddSkill}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.25)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
            >
              <FaPlus size={16} /> Add First Skill
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {groupedSkills.map((skillGroup, index) => (
            <div
              key={skillGroup._id || skillGroup.id || `group-${index}`}
              style={{
                ...styles.card,
                display: "flex",
                flexDirection: "column",
                padding: "0",
                overflow: "hidden",
                borderRadius: "10px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                ":hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                },
              }}
            >
              <div
                style={{
                  backgroundColor: colors.dark,
                  padding: "15px 20px",
                  borderBottom: `1px solid ${colors.primary}`,
                }}
              >
                <h3
                  style={{
                    ...styles.cardTitle,
                    fontSize: "1.2rem",
                    margin: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {skillGroup.category}
                  <span
                    style={{
                      fontSize: "0.8rem",
                      backgroundColor: colors.primary + "33",
                      color: colors.primary,
                      padding: "3px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {skillGroup.items.length} skills
                  </span>
                </h3>
              </div>

              <div
                style={{
                  ...styles.projectInfo,
                  padding: "15px 20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {skillGroup.items.map((skill, idx) => (
                    <span
                      key={skill._id || skill.id || `skill-${idx}`}
                      style={{
                        ...styles.skillItem,
                        display: "flex",
                        flexDirection: "column",
                        padding: "8px 12px",
                        backgroundColor: colors.dark,
                        borderRadius: "8px",
                        border: `1px solid ${colors.primary}33`,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{ fontWeight: "500", marginBottom: "5px" }}>
                        {skill.name}
                      </span>
                      {/* Pass the level as is, let renderSkillLevel handle the conversion */}
                      {renderSkillLevel(skill.level)}
                    </span>
                  ))}
                </div>

                <button
                  style={{
                    ...styles.button,
                    ...styles.editButton,
                    marginTop: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                    ":hover": {
                      backgroundColor: colors.primary + "22",
                    },
                  }}
                  onClick={() => handleEditSkills(skillGroup.category)}
                >
                  <FaEdit size={16} /> Manage {skillGroup.category} Skills
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add keyframe animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SkillsTab;
