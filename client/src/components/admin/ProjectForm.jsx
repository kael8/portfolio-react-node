import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaPlus,
} from "react-icons/fa";
import colors from "../../utils/colors";
import useSkills from "../../hooks/useSkills";

const ProjectForm = ({ project, onSubmit, onCancel, isEditing, styles }) => {
  const { skills, loading } = useSkills();
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    technologies: [], // Changed to array to store skill IDs
    featured: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Load project data when editing
  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        // Ensure technologies is an array of IDs
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : [],
      });

      // If project has technologies, set as selected skills
      if (project.technologies && Array.isArray(project.technologies)) {
        setSelectedSkills(project.technologies);
      }
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Special handling for isCurrent checkbox
    if (name === "isCurrent" && checked) {
      setFormData((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
  };

  // Handle skill selection/deselection
  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) => {
      // Convert to string for comparison to handle both string and ObjectId values
      const stringId = String(skillId);
      const isSelected = prev.some((id) => String(id) === stringId);

      // If already selected, remove it
      if (isSelected) {
        const newSelected = prev.filter((id) => String(id) !== stringId);

        // Update formData with new selection
        setFormData((prevData) => ({
          ...prevData,
          technologies: newSelected,
        }));

        return newSelected;
      }
      // Otherwise add it
      else {
        const newSelected = [...prev, skillId];

        // Update formData with new selection
        setFormData((prevData) => ({
          ...prevData,
          technologies: newSelected,
        }));

        return newSelected;
      }
    });

    // Clear any technologies error
    if (formErrors.technologies) {
      setFormErrors((prev) => ({
        ...prev,
        technologies: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.companyName.trim())
      errors.companyName = "Company name is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.isCurrent && !formData.endDate)
      errors.endDate = "End date is required for completed projects";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.technologies.length)
      errors.technologies = "At least one technology is required";

    // Check if end date is after start date
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      errors.endDate = "End date must be after start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        technologies: selectedSkills, // Pass the array of skill IDs
      });
    }
  };

  // Get skill name by id
  const getSkillNameById = (id) => {
    const skill = skills.find((s) => s._id === id);
    return skill ? skill.name : "Unknown Skill";
  };

  return (
    <form style={{ ...styles.form, position: "relative", zIndex: 5 }}>
      <div style={styles.formGroup}>
        <label
          style={{ ...styles.label, fontSize: "0.95rem", fontWeight: "500" }}
        >
          Project Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter project title"
          style={{
            ...styles.input,
            borderColor: formErrors.title
              ? "#ff5252"
              : styles.input.borderColor,
          }}
          value={formData.title || ""}
          onChange={handleInputChange}
        />
        {formErrors.title && (
          <div style={{ color: "#ff5252", fontSize: "0.8rem" }}>
            {formErrors.title}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label
          style={{
            ...styles.label,
            fontSize: "0.95rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <FaBuilding size={14} /> Company Name
        </label>
        <input
          type="text"
          name="companyName"
          placeholder="Enter company or client name"
          style={{
            ...styles.input,
            borderColor: formErrors.companyName
              ? "#ff5252"
              : styles.input.borderColor,
          }}
          value={formData.companyName || ""}
          onChange={handleInputChange}
        />
        {formErrors.companyName && (
          <div style={{ color: "#ff5252", fontSize: "0.8rem" }}>
            {formErrors.companyName}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaCalendarAlt size={14} /> Start Date
          </label>
          <input
            type="date"
            name="startDate"
            style={{
              ...styles.input,
              borderColor: formErrors.startDate
                ? "#ff5252"
                : styles.input.borderColor,
            }}
            value={formData.startDate || ""}
            onChange={handleInputChange}
          />
          {formErrors.startDate && (
            <div style={{ color: "#ff5252", fontSize: "0.8rem" }}>
              {formErrors.startDate}
            </div>
          )}
        </div>

        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label
            style={{
              ...styles.label,
              fontSize: "0.95rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              opacity: formData.isCurrent ? 0.6 : 1,
            }}
          >
            <FaCalendarAlt size={14} /> End Date
          </label>
          <input
            type="date"
            name="endDate"
            style={{
              ...styles.input,
              borderColor: formErrors.endDate
                ? "#ff5252"
                : styles.input.borderColor,
              opacity: formData.isCurrent ? 0.5 : 1,
            }}
            value={formData.endDate || ""}
            onChange={handleInputChange}
            disabled={formData.isCurrent}
          />
          {formErrors.endDate && (
            <div style={{ color: "#ff5252", fontSize: "0.8rem" }}>
              {formErrors.endDate}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          ...styles.checkboxGroup,
          marginTop: "5px",
          marginBottom: "15px",
        }}
      >
        <input
          type="checkbox"
          id="isCurrent"
          name="isCurrent"
          checked={formData.isCurrent || false}
          onChange={handleInputChange}
          style={styles.checkbox}
        />
        <label
          htmlFor="isCurrent"
          style={{
            ...styles.checkboxLabel,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Current / Ongoing Project
        </label>
      </div>

      <div style={styles.formGroup}>
        <label
          style={{ ...styles.label, fontSize: "0.95rem", fontWeight: "500" }}
        >
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter project description"
          style={{
            ...styles.textarea,
            borderColor: formErrors.description
              ? "#ff5252"
              : styles.textarea.borderColor,
          }}
          value={formData.description || ""}
          onChange={handleInputChange}
        ></textarea>
        {formErrors.description && (
          <div style={{ color: "#ff5252", fontSize: "0.8rem" }}>
            {formErrors.description}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label
          style={{
            ...styles.label,
            fontSize: "0.95rem",
            fontWeight: "500",
            marginBottom: "10px",
          }}
        >
          Technologies
        </label>

        {loading ? (
          <div style={{ color: colors.textSecondary }}>Loading skills...</div>
        ) : skills.length === 0 ? (
          <div style={{ color: colors.textSecondary }}>
            No skills available. Add skills in the Skills tab first.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              backgroundColor: colors.dark,
              padding: "15px",
              borderRadius: "5px",
              border: formErrors.technologies
                ? "1px solid #ff5252"
                : `1px solid ${colors.primary}`,
            }}
          >
            {skills.map((skill) => (
              <div
                key={skill._id}
                onClick={() => handleSkillToggle(skill._id)}
                style={{
                  backgroundColor: selectedSkills.some(
                    (id) => String(id) === String(skill._id)
                  )
                    ? colors.primary
                    : "transparent",
                  color: selectedSkills.some(
                    (id) => String(id) === String(skill._id)
                  )
                    ? colors.dark
                    : colors.textSecondary,
                  border: `1px solid ${colors.primary}`,
                  borderRadius: "15px",
                  padding: "8px 12px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {skill.name}
                {selectedSkills.some(
                  (id) => String(id) === String(skill._id)
                ) && <span style={{ fontSize: "0.8rem" }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {formErrors.technologies && (
          <div
            style={{ color: "#ff5252", fontSize: "0.8rem", marginTop: "5px" }}
          >
            {formErrors.technologies}
          </div>
        )}

        {selectedSkills.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "5px",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ color: colors.textSecondary, marginBottom: "5px" }}>
              Selected:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {selectedSkills.map((id) => (
                <span
                  key={id}
                  style={{
                    backgroundColor: colors.surface,
                    padding: "3px 8px",
                    borderRadius: "10px",
                    color: colors.textPrimary,
                    fontSize: "0.85rem",
                  }}
                >
                  {getSkillNameById(id)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured || false}
          onChange={handleInputChange}
          style={styles.checkbox}
        />
        <label
          htmlFor="featured"
          style={{
            ...styles.checkboxLabel,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {formData.featured ? (
            <FaStar size={16} color={colors.secondary} />
          ) : (
            <FaRegStar size={16} />
          )}
          Featured Project
        </label>
      </div>

      <div style={{ ...styles.modalActions, marginTop: "25px" }}>
        <button
          type="button"
          style={{ ...styles.cancelButton, transition: "all 0.2s ease" }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          style={{
            ...styles.submitButton,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={handleSubmit}
        >
          {isEditing ? (
            <>Save Changes</>
          ) : (
            <>
              <FaPlus size={14} /> Add Project
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
