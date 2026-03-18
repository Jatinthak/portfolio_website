```javascript
/**
 * Project model
 * @module src/backend/models/project
 */

const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

/**
 * Create a new project
 * @param {Object} project - Project data
 * @param {string} project.name - Project name
 * @param {string} project.description - Project description
 * @returns {Promise<Object>} Created project
 */
async function createProject(project) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          id: uuidv4(),
          name: project.name,
          description: project.description,
        },
      ]);
    if (error) {
      throw error;
    }
    return data[0];
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

/**
 * Get all projects
 * @returns {Promise<Array<Object>>} List of projects
 */
async function getProjects() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw new Error(`Failed to retrieve projects: ${error.message}`);
  }
}

/**
 * Get a project by ID
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Project data
 */
async function getProjectById(id) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id);
    if (error) {
      throw error;
    }
    if (data.length === 0) {
      throw new Error(`Project not found: ${id}`);
    }
    return data[0];
  } catch (error) {
    throw new Error(`Failed to retrieve project: ${error.message}`);
  }
}

module.exports = {
  createProject,
  getProjects,
  getProjectById,
};
```