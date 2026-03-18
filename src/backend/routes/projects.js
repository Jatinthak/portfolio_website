```javascript
/**
 * Handles requests for projects.
 * @module src/backend/routes/projects
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const { validateProject } = require('../models/project');

const pool = new Pool({
  user: process.env.SUPABASE_URL.split('@')[0].split(':')[0],
  host: process.env.SUPABASE_URL.split('@')[1].split(':')[0],
  database: process.env.SUPABASE_URL.split('@')[1].split(':')[1].split('/')[1],
  password: process.env.SUPABASE_KEY,
  port: process.env.SUPABASE_URL.split('@')[1].split(':')[1].split('/')[0],
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/**
 * Retrieves a list of projects.
 * @async
 * @function getProjects
 * @param {express.Request} req - The HTTP request.
 * @param {express.Response} res - The HTTP response.
 */
async function getProjects(req, res) {
  try {
    const projects = await pool.query('SELECT * FROM projects');
    res.json({ projects: projects.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}

/**
 * Retrieves a single project by id.
 * @async
 * @function getProject
 * @param {express.Request} req - The HTTP request.
 * @param {express.Response} res - The HTTP response.
 */
async function getProject(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Project id is required' });
      return;
    }
    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      res.json({ project: project.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
}

/**
 * Creates a new project.
 * @async
 * @function createProject
 * @param {express.Request} req - The HTTP request.
 * @param {express.Response} res - The HTTP response.
 */
async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required' });
      return;
    }
    const project = { id: uuidv4(), name, description };
    validateProject(project);
    await pool.query('INSERT INTO projects (id, name, description) VALUES ($1, $2, $3)', [project.id, project.name, project.description]);
    res.json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

/**
 * Updates a project.
 * @async
 * @function updateProject
 * @param {express.Request} req - The HTTP request.
 * @param {express.Response} res - The HTTP response.
 */
async function updateProject(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Project id is required' });
      return;
    }
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required' });
      return;
    }
    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      await pool.query('UPDATE projects SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
      res.json({ project: { id, name, description } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

/**
 * Deletes a project.
 * @async
 * @function deleteProject
 * @param {express.Request} req - The HTTP request.
 * @param {express.Response} res - The HTTP response.
 */
async function deleteProject(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Project id is required' });
      return;
    }
    const project = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
    } else {
      await pool.query('DELETE FROM projects WHERE id = $1', [id]);
      res.json({ message: 'Project deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

const router = express.Router();

router.get('/api/projects', limiter, getProjects);
router.get('/api/projects/:id', limiter, getProject);
router.post('/api/projects', limiter, createProject);
router.put('/api/projects/:id', limiter, updateProject);
router.delete('/api/projects/:id', limiter, deleteProject);

module.exports = router;
```