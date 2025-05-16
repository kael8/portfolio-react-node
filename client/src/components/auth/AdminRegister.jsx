import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import colors from "../../utils/colors";
import api from "../../config";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Submit registration data to backend
      const response = await api.auth.register({
        username: formData.username,
        password: formData.password,
        role: formData.role,
      });

      // Handle successful registration
      setSuccess("Registration successful! You can now log in.");

      // Optional: Auto-login the user
      // localStorage.setItem("authToken", response.data.token);
      // localStorage.setItem("isAuthenticated", "true");
      // navigate("/admin/dashboard");

      // Or reset the form
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed");
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
    selectGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    select: {
      padding: "14px 16px",
      backgroundColor: colors.dark,
      border: `1px solid ${colors.primary}`,
      borderRadius: "8px",
      color: colors.textPrimary,
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.2s ease",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${colors.textSecondary.replace(
        "#",
        "%23"
      )}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1em",
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
    success: {
      color: "#4caf50",
      fontSize: "0.9rem",
      padding: "10px",
      backgroundColor: "rgba(76, 175, 80, 0.1)",
      borderRadius: "5px",
      textAlign: "center",
      animation: "fadeIn 0.5s ease-out",
    },
    linksContainer: {
      marginTop: "20px",
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: "0.9rem",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
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
  };

  // Add keyframe animations to document if they don't exist
  useEffect(() => {
    if (!document.getElementById("register-animations")) {
      const style = document.createElement("style");
      style.id = "register-animations";
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
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register a new user account</p>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="username">
            <span>Username</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: error ? "#ff5252" : colors.primary,
            }}
            required
            autoFocus
            placeholder="Choose a username"
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
            value={formData.password}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: error ? "#ff5252" : colors.primary,
            }}
            required
            placeholder="Create a password"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="confirmPassword">
            <span>Confirm Password</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              ...styles.input,
              borderColor: error ? "#ff5252" : colors.primary,
            }}
            required
            placeholder="Confirm your password"
          />
        </div>

        <div style={styles.selectGroup}>
          <label style={styles.label} htmlFor="role">
            <span>Account Type</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
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
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div style={styles.linksContainer}>
        <div>
          <span>Already have an account? </span>
          <Link to="/auth/login" style={styles.link}>
            Sign in
          </Link>
        </div>
        <Link to="/" style={styles.link}>
          ← Back to home page
        </Link>
      </div>
    </div>
  );
};

export default Register;
