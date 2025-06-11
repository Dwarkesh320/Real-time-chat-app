import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import '../styles/Login.css';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

  

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
     
    } catch (err) {
      setError('Invalid email or password.');
      toast.error(err.message,{
        position: "bottom-right",
autoClose: 5000,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: true,
draggable: true,
progress: undefined,
theme: "light",
transition: slide,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="login-header" >
          <h2>Welcome Back</h2>
          
        </div>
        
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="/forgot-password" className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={slide}
        />
    </div>
  );
}

export default Login;