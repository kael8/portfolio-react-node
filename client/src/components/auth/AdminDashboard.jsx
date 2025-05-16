import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/colors";
import api from "../../config";
// Import icons for better UI
import { FaSignOutAlt, FaProjectDiagram, FaTools, FaCog } from "react-icons/fa";

// Import tab components
import ProjectsTab from "../admin/ProjectsTab";
import SkillsTab from "../admin/SkillsTab";
import SettingsTab from "../admin/SettingsTab";
import useSkills from "../../hooks/useSkills";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [lastLogin, setLastLogin] = useState("");
  const [stats, setStats] = useState({
    projects: 0,
    featuredProjects: 0,
    skills: 0,
  });

  const { skills } = useSkills();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // Replace with actual API call when ready
        // const response = await api.dashboard.getStats();
        // setStats(response.data);
        // setLastLogin(response.data.lastLogin || "");
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [navigate]);

  // Add custom scrollbar styles to document head
  useEffect(() => {
    if (!document.getElementById("custom-scrollbar-styles")) {
      const style = document.createElement("style");
      style.id = "custom-scrollbar-styles";
      style.innerHTML = `
        /* Custom scrollbar styles */
        .themed-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .themed-scrollbar::-webkit-scrollbar-track {
          background: ${colors.dark};
          border-radius: 5px;
        }
        .themed-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.primary};
          border-radius: 5px;
          border: 2px solid ${colors.dark};
        }
        .themed-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.secondary};
        }
        .themed-scrollbar::-webkit-scrollbar-corner {
          background: ${colors.dark};
        }
        
        /* Firefox scrollbar */
        .themed-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${colors.primary} ${colors.dark};
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Add keyframe animations to document if they don't exist
  useEffect(() => {
    if (!document.getElementById("admin-dashboard-animations")) {
      const style = document.createElement("style");
      style.id = "admin-dashboard-animations";
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken");
      await api.auth.logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigate even if API call fails
      navigate("/auth/login");
    }
  };

  const dashCount = (item) => {
    return item.length;
  };

  // Add new styles for skill display and form errors
  const additionalStyles = {
    skillsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxHeight: "50vh",
      overflowY: "auto",
      marginBottom: "20px",
    },
    skillRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 15px",
      backgroundColor: colors.dark,
      borderRadius: "5px",
      border: `1px solid ${colors.primary}`,
    },
    skillLevel: {
      marginLeft: "10px",
      fontSize: "0.8rem",
      color: colors.textSecondary,
    },
    levelIndicator: {
      display: "inline-block",
      marginLeft: "8px",
      fontSize: "0.8rem",
      padding: "2px 6px",
      borderRadius: "10px",
      backgroundColor: colors.dark,
      color: colors.primary,
    },
    formError: {
      backgroundColor: "rgba(255, 82, 82, 0.1)",
      color: "#ff5252",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "15px",
      fontSize: "0.9rem",
    },
    tabIcon: {
      marginRight: "8px",
    },
    dismissableAlert: {
      padding: "12px 15px",
      backgroundColor: "rgba(255, 193, 7, 0.1)",
      border: "1px solid #ffc107",
      borderRadius: "5px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    alertText: {
      color: "#ffc107",
      fontSize: "0.9rem",
    },
    closeAlert: {
      backgroundColor: "transparent",
      border: "none",
      color: "#ffc107",
      cursor: "pointer",
      fontSize: "1rem",
    },
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "0",
      color: colors.textPrimary,
    },
    dashboard: {
      backgroundColor: colors.surface,
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "25px 30px",
      borderBottom: `1px solid ${colors.dark}`,
      backgroundColor: colors.dark,
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: colors.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      color: colors.dark,
      fontWeight: "bold",
    },
    headerInfo: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      fontSize: "1.8rem",
      color: colors.textPrimary,
      margin: 0,
    },
    subtitle: {
      fontSize: "0.9rem",
      color: colors.textSecondary,
      margin: "5px 0 0 0",
    },
    logoutButton: {
      padding: "8px 15px",
      backgroundColor: "transparent",
      color: colors.textSecondary,
      border: `1px solid ${colors.accent}`,
      borderRadius: "5px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      padding: "20px 30px",
      backgroundColor: colors.dark,
    },
    statCard: {
      backgroundColor: colors.surface,
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      border: `1px solid ${colors.primary}`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: colors.primary,
      margin: "0 0 10px 0",
    },
    statLabel: {
      fontSize: "0.9rem",
      color: colors.textSecondary,
      margin: 0,
    },
    tabs: {
      display: "flex",
      padding: "0 30px",
      backgroundColor: colors.surface,
      borderBottom: `1px solid ${colors.dark}`,
    },
    tab: {
      padding: "15px 20px",
      cursor: "pointer",
      color: colors.textSecondary,
      borderBottom: "3px solid transparent",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
    },
    activeTab: {
      borderBottom: `3px solid ${colors.primary}`,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    content: {
      padding: "30px",
    },
    section: {
      marginBottom: "40px",
      animation: "fadeIn 0.3s ease-in-out",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      marginBottom: "20px",
      color: colors.primary,
      position: "relative",
      paddingBottom: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitleUnderline: {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "40px",
      height: "3px",
      backgroundColor: colors.primary,
    },
    card: {
      backgroundColor: colors.cardBg,
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "15px",
      border: `1px solid ${colors.dark}`,
      transition: "all 0.2s ease",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    },
    projectInfo: {
      flex: 1,
    },
    cardTitle: {
      fontSize: "1.2rem",
      marginBottom: "5px",
      color: colors.textPrimary,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    featuredBadge: {
      backgroundColor: colors.primary,
      color: colors.dark,
      padding: "3px 8px",
      borderRadius: "10px",
      fontSize: "0.7rem",
      fontWeight: "bold",
    },
    cardMeta: {
      color: colors.textSecondary,
      fontSize: "0.9rem",
    },
    cardActions: {
      display: "flex",
      gap: "10px",
    },
    button: {
      padding: "8px 12px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      transition: "all 0.2s ease",
    },
    editButton: {
      backgroundColor: colors.dark,
      color: colors.textPrimary,
      border: `1px solid ${colors.primary}`,
    },
    deleteButton: {
      backgroundColor: "rgba(255, 82, 82, 0.1)",
      color: "#ff5252",
      border: "1px solid #ff5252",
    },
    featuredButton: {
      backgroundColor: colors.dark,
      color: colors.secondary,
      border: `1px solid ${colors.secondary}`,
    },
    addButton: {
      padding: "10px 15px",
      backgroundColor: colors.primary,
      color: colors.dark,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "15px",
      transition: "all 0.2s ease",
      alignSelf: "flex-start",
    },
    skillItem: {
      backgroundColor: colors.dark,
      padding: "6px 12px",
      borderRadius: "15px",
      display: "inline-block",
      margin: "0 8px 8px 0",
      fontSize: "0.9rem",
      color: colors.textSecondary,
      border: `1px solid ${colors.primary}`,
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "fadeIn 0.2s ease-out",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: "10px",
      padding: "30px",
      width: "100%",
      maxWidth: "500px",
      maxHeight: "80vh",
      position: "relative",
      animation: "slideUp 0.3s ease-out",
    },
    modalTitle: {
      fontSize: "1.5rem",
      marginBottom: "20px",
      color: colors.textPrimary,
      borderBottom: `2px solid ${colors.primary}`,
      paddingBottom: "10px",
    },
    modalText: {
      color: colors.textSecondary,
      marginBottom: "25px",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "15px",
      marginTop: "30px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    label: {
      color: colors.textSecondary,
      fontSize: "0.9rem",
    },
    input: {
      padding: "12px 15px",
      backgroundColor: colors.dark,
      border: `1px solid ${colors.primary}`,
      borderRadius: "5px",
      color: colors.textPrimary,
      fontSize: "1rem",
    },
    textarea: {
      padding: "12px 15px",
      backgroundColor: colors.dark,
      border: `1px solid ${colors.primary}`,
      borderRadius: "5px",
      color: colors.textPrimary,
      fontSize: "1rem",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    checkbox: {
      accentColor: colors.primary,
      width: "16px",
      height: "16px",
    },
    checkboxLabel: {
      color: colors.textSecondary,
      cursor: "pointer",
    },
    cancelButton: {
      padding: "10px 15px",
      backgroundColor: colors.dark,
      color: colors.textSecondary,
      border: `1px solid ${colors.textSecondary}`,
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    confirmDeleteButton: {
      padding: "10px 15px",
      backgroundColor: "#ff5252",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    submitButton: {
      padding: "10px 20px",
      backgroundColor: colors.primary,
      color: colors.dark,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "bold",
    },
    loadingText: {
      textAlign: "center",
      padding: "20px",
      color: colors.textSecondary,
    },
    // Add the new styles
    ...additionalStyles,
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboard}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>A</div>
            <div style={styles.headerInfo}>
              <h1 style={styles.title}>Admin Dashboard</h1>
              <p style={styles.subtitle}>
                Last login: {lastLogin || "Unknown"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = colors.accent;
              e.target.style.color = colors.dark;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = colors.textSecondary;
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </header>

        <div style={styles.statsContainer}>
          <div
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.statValue}>{stats.projects || 3}</div>
            <p style={styles.statLabel}>Projects</p>
          </div>
          <div
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.statValue}>{stats.featuredProjects || 2}</div>
            <p style={styles.statLabel}>Featured Projects</p>
          </div>
          <div
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={styles.statValue}>{dashCount(skills) || 0}</div>
            <p style={styles.statLabel}>Skills</p>
          </div>
        </div>

        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "projects" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("projects")}
          >
            <FaProjectDiagram style={styles.tabIcon} /> Projects
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "skills" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("skills")}
          >
            <FaTools style={styles.tabIcon} /> Skills
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === "settings" ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog style={styles.tabIcon} /> Settings
          </div>
        </div>

        <div style={styles.content} className="themed-scrollbar">
          {activeTab === "projects" && (
            <ProjectsTab
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              setModalContent={setModalContent}
              styles={styles}
            />
          )}

          {activeTab === "skills" && (
            <SkillsTab
              setIsModalOpen={setIsModalOpen}
              setModalContent={setModalContent}
              styles={styles}
            />
          )}

          {activeTab === "settings" && <SettingsTab styles={styles} />}
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.modal} onClick={() => setIsModalOpen(false)}>
          <div
            className="themed-scrollbar"
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
