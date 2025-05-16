import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../config";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        const response = await api.auth.validate();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication failed:", error);
        // Clear invalid token
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
