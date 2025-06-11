import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import '../styles/Register.css';
import { toast } from 'react-toastify';

function Register() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName,
      });

      await setDoc(doc(db, 'users', res.user.uid)), {
        uid: res.user.uid,
        displayName,
        email,
        createdAt: new Date(),
        photoURL: '',
        status: 'online'
        
      };
         toast.success("User Created Successfully");
      navigate('/');
    } catch (err) {
      setError(err.message.includes('email-already') 
        ? 'Email already in use' 
        : 'Registration failed. Please try again.');
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="register-header">
          <h2>Create Account</h2>
        </div>
        
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label htmlFor="displayName">Full Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

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
            minLength="6"
          />
          <p className="password-hint">Use at least 6 characters</p>
        </div>

        <button 
          type="submit" 
          className="auth-button register-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        
        <p className="terms-notice">
          By registering, you agree to our Terms of Service
        </p>
      </form>
    </div>
  );
}

export default Register;