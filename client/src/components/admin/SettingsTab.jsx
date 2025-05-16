import React from "react";

const SettingsTab = ({ styles }) => {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>
        Account Settings
        <div style={styles.sectionTitleUnderline}></div>
      </div>

      <div style={styles.card}>
        <div style={styles.projectInfo}>
          <h3 style={styles.cardTitle}>Profile Information</h3>
          <div style={styles.cardMeta}>
            Update your name, profile image, and biography
          </div>
        </div>
        <button style={{ ...styles.button, ...styles.editButton }}>Edit</button>
      </div>

      <div style={styles.card}>
        <div style={styles.projectInfo}>
          <h3 style={styles.cardTitle}>Password & Security</h3>
          <div style={styles.cardMeta}>
            Change your password and security settings
          </div>
        </div>
        <button style={{ ...styles.button, ...styles.editButton }}>Edit</button>
      </div>
    </div>
  );
};

export default SettingsTab;
