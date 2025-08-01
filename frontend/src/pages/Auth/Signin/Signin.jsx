import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/auth';
import styles from './Signin.module.css';
import backgroundImage from '../../../assets/images/background.jpg';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.signin(email, password);
      localStorage.setItem('userToken', data.token);
      alert('Sign in successful!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = typeof err === 'object' && err.message 
        ? err.message 
        : typeof err === 'string' 
        ? err 
        : 'Sign in failed. Please check your email and password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignin = async (provider) => {
    alert(`Social sign-in with ${provider} will be implemented here.`);
  };

  return (
    <div className={styles.wrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.linkText}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
        <div className={styles.socialLogin}>
          <p>Or sign in with:</p>
          <button onClick={() => handleSocialSignin('google')} className={`${styles.socialButton} ${styles.google}`}>
            Google
          </button>
          <button onClick={() => handleSocialSignin('facebook')} className={`${styles.socialButton} ${styles.facebook}`}>
            Facebook
          </button>
        </div>
        <p className={styles.linkText}>
          Don't have an account? <Link to="/signup">Sign Up Now</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
