```javascript
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Login to the application
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object} - The user's token
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, password')
      .eq('email', email);

    if (error) {
      return res.status(500).json({ error: 'Failed to retrieve user' });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = data[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login' });
  }
}

/**
 * Signup for the application
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {object} - The user's token
 */
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password }]);

    if (error) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    const user = data[0];
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to signup' });
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.post('/login', limiter, login);
router.post('/signup', limiter, signup);

module.exports = router;
```