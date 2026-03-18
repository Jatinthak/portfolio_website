```javascript
const { v4: uuidv4 } = require('uuid');
const { supabaseClient } = require('../app');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * User model class
 */
class User {
  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  constructor(email, password) {
    this.id = uuidv4();
    this.email = email;
    this.password = password;
  }

  /**
   * Save the user to the database
   * @returns {Promise<void>}
   */
  async save() {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      const { data, error } = await supabaseClient
        .from('users')
        .insert([{ id: this.id, email: this.email, password: hashedPassword }]);
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  /**
   * Generate a JWT token for the user
   * @returns {string} JWT token
   */
  generateToken() {
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }

  /**
   * Verify the user's password
   * @param {string} password - Password to verify
   * @returns {Promise<boolean>} Whether the password is valid
   */
  async verifyPassword(password) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('password')
        .eq('id', this.id);
      if (error) {
        throw error;
      }
      const isValid = await bcrypt.compare(password, data[0].password);
      return isValid;
    } catch (error) {
      throw new Error(`Failed to verify password: ${error.message}`);
    }
  }

  /**
   * Find a user by email
   * @param {string} email - Email to search for
   * @returns {Promise<User|null>} Found user or null
   */
  static async findByEmail(email) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('id, email, password')
        .eq('email', email);
      if (error) {
        throw error;
      }
      if (data.length === 0) {
        return null;
      }
      const user = new User(data[0].email, data[0].password);
      user.id = data[0].id;
      return user;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Find a user by ID
   * @param {string} id - ID to search for
   * @returns {Promise<User|null>} Found user or null
   */
  static async findById(id) {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('id, email, password')
        .eq('id', id);
      if (error) {
        throw error;
      }
      if (data.length === 0) {
        return null;
      }
      const user = new User(data[0].email, data[0].password);
      user.id = data[0].id;
      return user;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }
}

module.exports = User;
```