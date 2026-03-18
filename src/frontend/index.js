```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Projects from './components/projects';
import Project from './components/project';
import Login from './components/login';
import Signup from './components/signup';
import { supabase } from './supabase';

/**
 * Defines the frontend application.
 */
function App() {
  /**
   * Handles login functionality.
   * @param {object} event - The login event.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      const { data, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      localStorage.setItem('token', data.session.access_token);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles signup functionality.
   * @param {object} event - The signup event.
   */
  const handleSignup = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      localStorage.setItem('token', data.session.access_token);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches projects from the API.
   * @returns {Promise<object[]>} A promise resolving to an array of projects.
   */
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/api/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  /**
   * Fetches a single project from the API.
   * @param {string} id - The ID of the project to fetch.
   * @returns {Promise<object>} A promise resolving to the project.
   */
  const fetchProject = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projects fetchProjects={fetchProjects} />} />
        <Route path="/projects/:id" element={<Project fetchProject={fetchProject} />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```