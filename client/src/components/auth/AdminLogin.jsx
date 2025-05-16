import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import colors from "../../utils/colors";
import axios from "axios"; // Make sure to install axios: npm install axios
import api from "../../config";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user has saved credentials
  useEffect(() => {
    const savedUsername = localStorage.getItem("adminUsername");
    if (savedUsername) {
      setCredentials((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }

    // Auto-login with token if it exists
    const token = localStorage.getItem("authToken");
    if (token) {
      validateToken(token);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await api.auth.validate({
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.valid) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      // Token invalid or expired, clear it
      localStorage.removeItem("authToken");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Make API call to Node.js backend
      const response = await api.auth.login(credentials);

      // Store the auth token
      const { token } = response.data;
      localStorage.setItem("authToken", token);

      // Store authentication state
      localStorage.setItem("isAuthenticated", "true");

      // Save username if remember me is checked
      if (rememberMe) {
        localStorage.setItem("adminUsername", credentials.username);
      } else {
        localStorage.removeItem("adminUsername");
      }

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Authentication failed");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "450px",
      margin: "80px auto",
      padding: "40px",
      borderRadius: "15px",
      backgroundColor: colors.surface,
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      color: colors.textPrimary,
      animation: "fadeIn 0.5s ease-out",
    },
    header: {
      marginBottom: "30px",
      textAlign: "center",
    },
    title: {
      fontSize: "2.2rem",
      marginBottom: "15px",
      color: colors.textPrimary,
      fontWeight: "600",
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: "1rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "1rem",
      color: colors.textSecondary,
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    input: {
      padding: "14px 16px",
      backgroundColor: colors.dark,
      border: `1px solid ${colors.primary}`,
      borderRadius: "8px",
      color: colors.textPrimary,
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.2s ease",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "5px",
    },
    checkbox: {
      accentColor: colors.primary,
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },
    button: {
      padding: "14px 25px",
      backgroundColor: colors.primary,
      color: colors.dark,
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "20px",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    },
    buttonLoading: {
      opacity: 0.8,
      cursor: "not-allowed",
    },
    error: {
      color: "#ff5252",
      fontSize: "0.9rem",
      padding: "10px",
      backgroundColor: "rgba(255, 82, 82, 0.1)",
      borderRadius: "5px",
      textAlign: "center",
      animation: "shake 0.5s ease-in-out",
    },
    homeLink: {
      marginTop: "20px",
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: "0.9rem",
    },
    link: {
      color: colors.secondary,
      textDecoration: "none",
    },
    loader: {
      width: "20px",
      height: "20px",
      border: `2px solid ${colors.dark}`,
      borderTop: `2px solid transparent`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
      marginRight: "10px",
    },
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(-10px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    "@keyframes shake": {
      "0%, 100%": { transform: "translateX(0)" },
      "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
      "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  // Add keyframe animations to document if they don't exist
  useEffect(() => {
    if (!document.getElementById("login-animations")) {
      const style = document.createElement("style");
      style.id = "login-animations";
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Portal</h2>
        <p style={styles.subtitle}>Login to access your dashboard</p>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="username">
            <span>Username</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: error ? "#ff5252" : colors.primary,
            }}
            required
            autoFocus
            placeholder="Enter your username"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">
            <span>Password</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: error ? "#ff5252" : colors.primary,
            }}
            required
            placeholder="Enter your password"
          />
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={handleRememberMe}
            style={styles.checkbox}
          />
          <label
            htmlFor="remember-me"
            style={{ ...styles.label, cursor: "pointer" }}
          >
            Remember me
          </label>
        </div>

        <div style={styles.homeLink}>
          <span>Don't have an account? </span>
          <Link to="/auth/register" style={styles.link}>
            Register here
          </Link>
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonLoading : {}),
          }}
          disabled={isLoading}
          onMouseOver={(e) => {
            if (!isLoading) {
              Object.assign(e.target.style, styles.buttonHover);
            }
          }}
          onMouseOut={(e) => {
            Object.assign(e.target.style, {
              transform: "translateY(0)",
              boxShadow: "none",
            });
          }}
        >
          {isLoading ? (
            <>
              <span style={styles.loader}></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div style={styles.homeLink}>
        <Link to="/" style={styles.link}>
          ← Back to home page
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
