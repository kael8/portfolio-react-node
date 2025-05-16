import React, { useState, useEffect } from "react";
import colors from "../../utils/colors";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaEye,
  FaExclamationTriangle,
  FaBuilding,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import ProjectForm from "./ProjectForm";
import useProjects from "../../hooks/useProjects";

const ProjectsTab = ({
  isModalOpen,
  setIsModalOpen,
  setModalContent,
  styles,
}) => {
  // Use the projects hook instead of local state
  const {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
  } = useProjects();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsEditing(false);
    setFormError(null);
    renderProjectForm("Add New Project");
  };

  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsEditing(true);
    setFormError(null);
    renderProjectForm("Edit Project");
  };

  const handleDeleteConfirm = (project) => {
    setDeleteTarget(project);
    setModalContent(
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        <h3 style={styles.modalTitle}>Confirm Delete</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <FaExclamationTriangle size={24} color="#ff5252" />
          <p style={{ ...styles.modalText, margin: 0, color: "#ff5252" }}>
            This action cannot be undone.
          </p>
        </div>

        <p style={styles.modalText}>
          Are you sure you want to delete the project:{" "}
          <strong>"{project.title}"</strong>?
        </p>

        <div style={styles.modalActions}>
          <button
            style={styles.cancelButton}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.confirmDeleteButton,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={handleDelete}
          >
            <FaTrash size={14} /> Delete
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteTarget.id);
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || "Failed to delete project");
    }
  };

  const handleSubmitProject = async (formData) => {
    try {
      if (isEditing) {
        // Update existing project
        await updateProject(currentProject.id, {
          ...formData,
          // Make sure to convert fields as needed for the API
          id: currentProject.id,
          is_featured: formData.featured,
          is_current: formData.isCurrent,
          company_name: formData.companyName,
          start_date: formData.startDate,
          end_date: formData.endDate || null,
        });
      } else {
        // Add new project
        const projectData = {
          ...formData,
          is_featured: formData.featured,
          is_current: formData.isCurrent,
          company_name: formData.companyName,
          start_date: formData.startDate,
          end_date: formData.isCurrent ? null : formData.endDate,
          views: 0,
        };

        await addProject(projectData);
      }
      setFormError(null);
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || "An error occurred while saving the project");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const project = projects.find((p) => p.id === id);
      await toggleFeatured(id, !project.featured);
    } catch (err) {
      console.error("Error toggling featured status:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderProjectForm = (title) => {
    setModalContent(
      <div
        style={{
          animation: "fadeIn 0.3s ease-out",
          maxHeight: "80vh",
          overflow: "auto",
        }}
        className="themed-scrollbar"
      >
        <h3
          style={{
            ...styles.modalTitle,
            borderLeft: `4px solid ${colors.primary}`,
            paddingLeft: "15px",
            position: "sticky",
            top: 0,
            backgroundColor: colors.surface,
            zIndex: 1,
            margin: 0,
            padding: "15px",
          }}
        >
          {title}
        </h3>

        {formError && (
          <div
            style={{
              backgroundColor: "rgba(255, 82, 82, 0.1)",
              color: "#ff5252",
              padding: "12px 15px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "0.9rem",
            }}
          >
            {formError}
          </div>
        )}

        <ProjectForm
          project={currentProject}
          onSubmit={handleSubmitProject}
          onCancel={() => setIsModalOpen(false)}
          isEditing={isEditing}
          styles={styles}
        />
      </div>
    );
    setIsModalOpen(true);
  };

  return (
    <div style={{ ...styles.section, animation: "fadeIn 0.3s ease-out" }}>
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
          Manage Projects
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
          onClick={handleAddProject}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.25)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
        >
          <FaPlus size={16} /> Add New Project
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
            gap: "15px",
            color: colors.textSecondary,
          }}
        >
          <FaSpinner
            size={24}
            style={{
              animation: "spin 1s linear infinite",
            }}
          />
          <span>Loading projects...</span>
        </div>
      ) : error ? (
        <div
          style={{
            backgroundColor: "rgba(255, 82, 82, 0.1)",
            color: "#ff5252",
            padding: "20px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : projects.length === 0 ? (
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
              No projects found. Add your first project to get started.
            </p>
          </div>
        </div>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={styles.card}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.projectInfo}>
              <h3 style={styles.cardTitle}>
                {project.title}
                {project.featured && (
                  <span style={styles.featuredBadge}>
                    <FaStar size={10} style={{ marginRight: "4px" }} /> Featured
                  </span>
                )}
              </h3>
              <div
                style={{
                  ...styles.cardMeta,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                  }}
                >
                  <FaBuilding size={14} /> {project.companyName}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "0.9rem",
                    color: colors.textSecondary,
                  }}
                >
                  <FaCalendarAlt size={14} />
                  {formatDate(project.startDate)} -
                  {project.isCurrent ? "Present" : formatDate(project.endDate)}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <FaEye size={14} /> {project.views} views
                </div>
                {project.technologies && project.technologies.length > 0 ? (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: colors.textSecondary,
                    }}
                  >
                    <strong>Tech:</strong>{" "}
                    {project.technologies.map((tech) => tech.name).join(", ")}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: colors.textSecondary,
                      opacity: 0.7,
                    }}
                  >
                    <strong>Tech:</strong> No technologies specified
                  </div>
                )}
              </div>
            </div>
            <div style={styles.cardActions}>
              <button
                style={{
                  ...styles.button,
                  ...styles.featuredButton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() => handleToggleFeatured(project.id)}
              >
                {project.featured ? (
                  <>
                    <FaRegStar size={14} /> Unfeature
                  </>
                ) : (
                  <>
                    <FaStar size={14} /> Feature
                  </>
                )}
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.editButton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() => handleEditProject(project)}
              >
                <FaEdit size={14} /> Edit
              </button>
              <button
                style={{
                  ...styles.button,
                  ...styles.deleteButton,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onClick={() => handleDeleteConfirm(project)}
              >
                <FaTrash size={14} /> Delete
              </button>
            </div>
          </div>
        ))
      )}

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
            
            /* Custom scrollbar styling */
            .themed-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            
            .themed-scrollbar::-webkit-scrollbar-track {
              background: ${colors.dark};
              border-radius: 4px;
            }
            
            .themed-scrollbar::-webkit-scrollbar-thumb {
              background: ${colors.primary};
              border-radius: 4px;
            }
            
            .themed-scrollbar::-webkit-scrollbar-thumb:hover {
              background: ${colors.secondary};
            }
        `}
      </style>
    </div>
  );
};

export default ProjectsTab;
