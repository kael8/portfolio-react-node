import { useState, useEffect, useMemo } from "react";
import api from "../config";

const useSkills = () => {
  // All the state variables from SkillsTab
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  // Skill level mapping for UI display
  const skillLevelMap = {
    1: "Beginner",
    2: "Elementary",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  // Convert text level to number
  const getNumericLevel = (textLevel) => {
    return (
      Object.entries(skillLevelMap).find(
        ([num, text]) => text === textLevel
      )?.[0] || 3
    );
  };

  // Group skills by type for display
  const groupedSkills = useMemo(() => {
    const groups = {};

    if (!Array.isArray(skills)) return [];

    skills.forEach((skill) => {
      const type = skill.type || "Other";
      if (!groups[type]) {
        groups[type] = {
          id: type,
          category: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize
          items: [],
        };
      }
      groups[type].items.push(skill);
    });

    return Object.values(groups);
  }, [skills]);

  // Fetch skills from the API
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await api.skills.getAll();

      // Process skills data if needed
      if (response && response.data) {
        // Use skills directly from API response
        console.log("Fetched skills:", response.data);
        setSkills(response.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  // Load skills on initial render
  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle submit for new skill
  const handleSubmitNewSkill = async (skill) => {
    setIsSubmitting(true);
    try {
      // Ensure the level is in the correct format for your backend
      // (if your backend expects string values)
      const formattedSkill = {
        ...skill,
        level:
          typeof skill.level === "number"
            ? skillLevelMap[skill.level]
            : skill.level,
      };

      // Call the API to create the skill
      const response = await api.skills.create(formattedSkill);

      // If successful, add to our local state
      if (response && response.data) {
        setSkills((prevSkills) => [...prevSkills, response.data]);
        return { success: true, data: response.data };
      } else {
        setFormError("Error creating skill. Please try again.");
        return {
          success: false,
          error: "Error creating skill. Please try again.",
        };
      }
    } catch (error) {
      console.error("Error creating skill:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to create skill";
      setFormError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for submitting edits
  const handleSubmitEditSkill = async (skill) => {
    try {
      setIsEditing(true);
      setEditFormError("");

      // Get the correct ID (MongoDB uses _id but sometimes we have id in the frontend)
      const skillId = skill._id;

      // Convert the numeric level to text before sending to API
      const formattedSkill = {
        ...skill,
        // If it's already in the correct format, this won't change anything
        level:
          typeof skill.level === "number"
            ? skillLevelMap[skill.level]
            : skill.level,
      };

      // Use the correct ID for the API call
      const response = await api.skills.update(skillId, formattedSkill);

      if (response && response.data) {
        // Fix the ID comparison to properly update the state
        setSkills((prevSkills) =>
          prevSkills.map((s) => {
            // Check both possible ID fields
            if (s._id === skillId || s._id === skill._id) {
              // Ensure the response data has the same ID format used in your UI
              return {
                ...response.data,
                id: response.data._id, // Make sure id exists for UI usage
              };
            }
            return s;
          })
        );
        return { success: true, data: response.data };
      } else {
        setEditFormError("Error updating skill");
        return { success: false, error: "Error updating skill" };
      }
    } catch (error) {
      console.error("Error updating skill:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update skill";
      setEditFormError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsEditing(false);
    }
  };

  // Handler for confirming deletion
  const handleDeleteSkill = async (skillId) => {
    const skill = skills.find((s) => s._id === skillId);
    if (!skill) return { success: false, error: "Skill not found" };

    setSkillToDelete(skill);
    try {
      setIsDeleting(true);
      // Delete skill via API
      await api.skills.delete(skill._id);

      // Remove from local state
      setSkills(skills.filter((s) => s._id !== skill._id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting skill:", error);
      return { success: false, error: "Failed to delete skill" };
    } finally {
      setIsDeleting(false);
      setSkillToDelete(null);
    }
  };

  // Return all state and handlers to be used in components
  return {
    // State
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

    // Setters
    setFormError,
    setEditFormError,
    setIsEditing, // This is the important one that's missing
    setIsDeleting,
    setSkills,
    setIsSubmitting,

    // Utility functions
    getNumericLevel,

    // API handlers
    fetchSkills,
    handleSubmitNewSkill,
    handleSubmitEditSkill,
    handleDeleteSkill,
  };
};

export default useSkills;
