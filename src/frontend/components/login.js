```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Handles login functionality.
 * 
 * @returns {JSX.Element} The login component.
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Handles the login form submission.
   * 
   * @param {Event} event The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_SUPABASE_URL}/api/auth/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/projects');
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('An error occurred while logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
```