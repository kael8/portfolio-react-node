import React from "react";
import { Link } from "react-router-dom";
import colors from "../utils/colors"; // Import shared color scheme

const Dashboard = () => {
  // Sample portfolio data - replace with your own
  const portfolioData = {
    name: "John Doe",
    title: "Full Stack Developer",
    summary:
      "Passionate developer with 5+ years of experience building web applications with React, Node.js, and modern cloud technologies.",
    featuredProjects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description:
          "A full-featured online store with payment processing, inventory management, and analytics dashboard.",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        image: "https://via.placeholder.com/300x200",
        demoUrl: "https://project1.example.com",
        repoUrl: "https://github.com/yourusername/project1",
      },
      {
        id: 2,
        title: "Task Management App",
        description:
          "A collaborative task tracking system with real-time updates and team management features.",
        tags: ["React", "Firebase", "Material UI"],
        image: "https://via.placeholder.com/300x200",
        demoUrl: "https://project2.example.com",
        repoUrl: "https://github.com/yourusername/project2",
      },
      {
        id: 3,
        title: "Weather Dashboard",
        description:
          "An interactive weather forecast application with data visualization and location tracking.",
        tags: ["JavaScript", "APIs", "D3.js"],
        image: "https://via.placeholder.com/300x200",
        demoUrl: "https://project3.example.com",
        repoUrl: "https://github.com/yourusername/project3",
      },
    ],
    skills: [
      {
        category: "Frontend",
        items: [
          "React",
          "JavaScript",
          "HTML5/CSS3",
          "Responsive Design",
          "Redux",
        ],
      },
      {
        category: "Backend",
        items: ["Node.js", "Express", "MongoDB", "RESTful APIs", "GraphQL"],
      },
      {
        category: "DevOps",
        items: ["Git", "Docker", "AWS", "CI/CD", "Vercel/Netlify"],
      },
      {
        category: "Other",
        items: [
          "Agile Methodology",
          "UI/UX Basics",
          "Performance Optimization",
        ],
      },
    ],
    socialLinks: [
      { name: "GitHub", url: "https://github.com/yourusername", icon: "🔗" },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/yourusername",
        icon: "🔗",
      },
      { name: "Twitter", url: "https://twitter.com/yourusername", icon: "🔗" },
    ],
  };

  // Styles using imported colors
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      color: colors.textPrimary,
      backgroundColor: colors.background,
    },
    hero: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "60px",
      flexWrap: "wrap",
      padding: "30px",
      borderRadius: "15px",
      backgroundColor: colors.surface,
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    },
    heroInfo: {
      flex: "1",
      minWidth: "300px",
    },
    heroImage: {
      width: "250px",
      height: "250px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `5px solid ${colors.primary}`,
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      margin: "20px",
    },
    name: {
      fontSize: "3rem",
      marginBottom: "5px",
      color: colors.textPrimary,
      position: "relative",
      display: "inline-block",
    },
    title: {
      color: colors.secondary,
      fontSize: "1.5rem",
      marginBottom: "20px",
    },
    summary: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      maxWidth: "600px",
      color: colors.textSecondary,
    },
    socialLinks: {
      display: "flex",
      gap: "15px",
      marginTop: "20px",
    },
    socialLink: {
      padding: "10px 15px",
      backgroundColor: colors.dark,
      color: colors.textSecondary,
      borderRadius: "5px",
      textDecoration: "none",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      border: `1px solid ${colors.primary}`,
    },
    section: {
      marginBottom: "60px",
      padding: "30px",
      borderRadius: "15px",
      backgroundColor: colors.surface,
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    },
    sectionTitle: {
      fontSize: "2rem",
      marginBottom: "30px",
      position: "relative",
      paddingBottom: "10px",
      color: colors.textPrimary,
    },
    sectionTitleUnderline: {
      content: "''",
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "60px",
      height: "4px",
      backgroundColor: colors.primary,
    },
    projectsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "30px",
    },
    projectCard: {
      backgroundColor: colors.cardBg,
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      border: `1px solid ${colors.dark}`,
    },
    projectImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    projectContent: {
      padding: "20px",
    },
    projectTitle: {
      fontSize: "1.3rem",
      marginBottom: "10px",
      color: colors.textPrimary,
    },
    projectDescription: {
      fontSize: "0.95rem",
      marginBottom: "15px",
      color: colors.textSecondary,
      lineHeight: "1.5",
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginBottom: "15px",
    },
    tag: {
      padding: "4px 10px",
      backgroundColor: colors.dark,
      color: colors.secondary,
      borderRadius: "15px",
      fontSize: "0.8rem",
      fontWeight: "500",
      border: `1px solid ${colors.primary}`,
    },
    projectLinks: {
      display: "flex",
      gap: "10px",
      marginTop: "15px",
    },
    projectLink: {
      padding: "8px 15px",
      backgroundColor: colors.primary,
      color: "#0f0a18",
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    projectRepo: {
      padding: "8px 15px",
      backgroundColor: colors.dark,
      color: colors.textPrimary,
      textDecoration: "none",
      borderRadius: "5px",
      fontSize: "0.9rem",
      fontWeight: "500",
      border: `1px solid ${colors.primary}`,
    },
    skillsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "30px",
    },
    skillCategory: {
      backgroundColor: colors.cardBg,
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      border: `1px solid ${colors.dark}`,
    },
    skillCategoryTitle: {
      fontSize: "1.2rem",
      marginBottom: "15px",
      color: colors.primary,
      borderBottom: `2px solid ${colors.dark}`,
      paddingBottom: "10px",
    },
    skillList: {
      listStyle: "none",
      padding: "0",
    },
    skillItem: {
      padding: "8px 0",
      fontSize: "1rem",
      color: colors.textSecondary,
      position: "relative",
      paddingLeft: "20px",
    },
    skillBullet: {
      position: "absolute",
      left: "0",
      color: colors.secondary,
    },
    ctaContainer: {
      textAlign: "center",
      marginTop: "40px",
    },
    ctaButton: {
      padding: "12px 25px",
      backgroundColor: colors.accent,
      color: colors.dark,
      border: "none",
      borderRadius: "5px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroInfo}>
          <h1 style={styles.name}>{portfolioData.name}</h1>
          <h2 style={styles.title}>{portfolioData.title}</h2>
          <p style={styles.summary}>{portfolioData.summary}</p>
          <div style={styles.socialLinks}>
            {portfolioData.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
              >
                <span>{link.icon}</span> {link.name}
              </a>
            ))}
          </div>
        </div>
        <img
          src="/images/profile/arcayl.png"
          alt={portfolioData.name}
          style={styles.heroImage}
        />
      </section>

      {/* Featured Projects Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Featured Projects
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.projectsGrid}>
          {portfolioData.featuredProjects.map((project) => (
            <div key={project.id} style={styles.projectCard}>
              <img
                src={project.image}
                alt={project.title}
                style={styles.projectImage}
              />
              <div style={styles.projectContent}>
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <p style={styles.projectDescription}>{project.description}</p>
                <div style={styles.tagsContainer}>
                  {project.tags.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={styles.projectLinks}>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.projectLink}
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.projectRepo}
                  >
                    GitHub Repo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.ctaContainer}>
          <Link to="/projects" style={styles.ctaButton}>
            View All Projects
          </Link>
        </div>
      </section>

      {/* Skills Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Skills & Technologies
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.skillsContainer}>
          {portfolioData.skills.map((skillGroup, index) => (
            <div key={index} style={styles.skillCategory}>
              <h3 style={styles.skillCategoryTitle}>{skillGroup.category}</h3>
              <ul style={styles.skillList}>
                {skillGroup.items.map((skill, skillIndex) => (
                  <li key={skillIndex} style={styles.skillItem}>
                    <span style={styles.skillBullet}>▹</span> {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Let's Work Together
          <div style={styles.sectionTitleUnderline}></div>
        </h2>
        <div style={styles.ctaContainer}>
          <Link to="/contact" style={styles.ctaButton}>
            Contact Me
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
