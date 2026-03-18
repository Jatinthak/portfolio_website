```javascript
/**
 * @file src/backend/app.js
 * @description Defines the backend application
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * @description Rate limiting middleware
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

/**
 * @description Retrieve a list of projects
 * @route GET /api/projects
 */
app.get('/api/projects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description');
    if (error) {
      throw error;
    }
    res.json({ projects: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve projects' });
  }
});

/**
 * @description Retrieve a single project by id
 * @route GET /api/projects/:id
 */
app.get('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, description')
      .eq('id', id);
    if (error) {
      throw error;
    }
    if (data.length === 0) {
      res.status(404).json({ message: 'Project not found' });
    } else {
      res.json({ project: data[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve project' });
  }
});

/**
 * @description Login to the application
 * @route POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const { data, error } = await supabase
      .from('users')
      .select('id, email, password')
      .eq('email', email);
    if (error) {
      throw error;
    }
    if (data.length === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = data[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid email or password' });
      } else {
        const token = jwt.sign({ userId: user.id }, jwtSecret, {
          expiresIn: '1h',
        });
        res.json({ token });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

/**
 * @description Signup for the application
 * @route POST /api/auth/signup
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }]);
    if (error) {
      throw error;
    }
    const token = jwt.sign({ userId: data[0].id }, jwtSecret, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to signup' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
```