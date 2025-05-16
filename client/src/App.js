import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/auth/AdminLogin";
import Register from "./components/auth/AdminRegister";
import AdminDashboard from "./components/auth/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import colors from "./utils/colors"; // Import the color scheme
import { useEffect } from "react";
import api from "./config";

// Placeholder components - you'll create these as separate files later
const Projects = () => <h2 style={{ color: colors.textPrimary }}>Projects</h2>;
const About = () => <h2 style={{ color: colors.textPrimary }}>About Me</h2>;
const Experience = () => (
  <h2 style={{ color: colors.textPrimary }}>Work Experience</h2>
);
const Contact = () => <h2 style={{ color: colors.textPrimary }}>Contact</h2>;

function App() {
  // Apply background color to both html and body to ensure it extends while scrolling
  useEffect(() => {
    document.documentElement.style.backgroundColor = colors.background;
    document.body.style.backgroundColor = colors.background;
    document.body.style.margin = "0";

    // Clean up when component unmounts
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
    };
  }, []);

  const styles = {
    app: {
      backgroundColor: colors.background,
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      display: "flex",
      flexDirection: "column",
    },
    nav: {
      backgroundColor: colors.surface,
      padding: "15px 0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    },
    navLinks: {
      display: "flex",
      listStyle: "none",
      padding: 0,
      gap: "2rem",
      justifyContent: "center",
      margin: "0",
    },
    navLink: {
      textDecoration: "none",
      color: colors.textPrimary,
      fontWeight: 500,
      padding: "0.7rem 1.2rem",
      borderRadius: "4px",
      transition: "all 0.3s ease",
      border: `1px solid transparent`,
    },
    mainContent: {
      flex: 1, // This allows the content area to expand with its content
    },
  };

  return (
    <BrowserRouter>
      <div className="App" style={styles.app}>
        <nav style={styles.nav}>
          <ul style={styles.navLinks}>
            <li>
              <Link
                to="/"
                style={styles.navLink}
                onMouseOver={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.dark;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                style={styles.navLink}
                onMouseOver={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.dark;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                style={styles.navLink}
                onMouseOver={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.dark;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/experience"
                style={styles.navLink}
                onMouseOver={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.dark;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Experience
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                style={styles.navLink}
                onMouseOver={(e) => {
                  e.target.style.borderColor = colors.primary;
                  e.target.style.backgroundColor = colors.dark;
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = "transparent";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/auth/login" element={<AdminLogin />} />
            <Route path="/auth/register" element={<Register />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
