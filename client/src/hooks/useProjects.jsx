import { useState, useEffect, useCallback } from "react";
import api from "../config";

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.projects.getAll();

      if (response.error) {
        throw new Error(response.error);
      }

      // Transform data to match our frontend structure
      const transformedProjects = response.data.map((project) => ({
        id: project._id,
        title: project.title,
        companyName: project.company_name,
        description: project.description,
        technologies: project.technologies,
        startDate: project.start_date,
        endDate: project.end_date,
        isCurrent: project.is_current,
        featured: project.is_featured,
        views: project.views,
      }));

      setProjects(transformedProjects);
    } catch (err) {
      setError(err.message || "Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Add a new project
  const addProject = async (projectData) => {
    try {
      setLoading(true);
      // Transform frontend data structure to backend format
      const apiData = {
        title: projectData.title,
        company_name: projectData.companyName,
        description: projectData.description,
        technologies: projectData.technologies, // Array of skill IDs
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        is_current: projectData.isCurrent,
        is_featured: projectData.featured,
      };

      const response = await api.projects.create(apiData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Transform the new project to match frontend structure
      const newProject = {
        id: response.data._id,
        title: response.data.title,
        companyName: response.data.company_name,
        description: response.data.description,
        technologies: response.data.technologies,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        isCurrent: response.data.is_current,
        featured: response.data.is_featured,
        views: response.data.views || 0,
      };

      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      const errorMsg = err.message || "Failed to add project";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async (id, projectData) => {
    try {
      setLoading(true);
      // Transform frontend data structure to backend format
      const apiData = {
        title: projectData.title,
        company_name: projectData.companyName,
        description: projectData.description,
        technologies: projectData.technologies, // Array of skill IDs
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        is_current: projectData.isCurrent,
        is_featured: projectData.featured,
      };

      const response = await api.projects.update(id, apiData);

      if (response.error) {
        throw new Error(response.error);
      }

      // Transform the updated project to match frontend structure
      const updatedProject = {
        id: response.data._id,
        title: response.data.title,
        companyName: response.data.company_name,
        description: response.data.description,
        technologies: response.data.technologies,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        isCurrent: response.data.is_current,
        featured: response.data.is_featured,
        views: response.data.views,
      };

      setProjects((prev) =>
        prev.map((project) => (project.id === id ? updatedProject : project))
      );

      return updatedProject;
    } catch (err) {
      const errorMsg = err.message || "Failed to update project";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      const response = await api.projects.delete(id);

      if (response.error) {
        throw new Error(response.error);
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err) {
      const errorMsg = err.message || "Failed to delete project";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id, featuredValue) => {
    try {
      setLoading(true);
      const response = await api.projects.toggleFeatured(id, featuredValue);

      if (response.error) {
        throw new Error(response.error);
      }

      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, featured: featuredValue } : project
        )
      );
    } catch (err) {
      const errorMsg = err.message || "Failed to update featured status";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    clearError,
  };
};

export default useProjects;
