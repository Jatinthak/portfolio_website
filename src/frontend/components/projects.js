```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Renders a list of projects.
 * @returns {JSX.Element} A list of projects.
 */
function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the list of projects from the API.
   * @async
   */
  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (projects.length === 0) {
    return <div>No projects found.</div>;
  }

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
```