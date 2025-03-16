import React, { useState } from 'react';
import './Login.css'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './components/firebase-config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Move this hook to the top level

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user info in localStorage (token is handled by Firebase SDK)
      localStorage.setItem('userId', user.uid);
      console.log('Login successful:', user);
      
      // Use location from the component scope
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if this Google user exists in Firestore, if not create an entry
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create a new user document for Google users
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email || '',
          profilePicture: user.photoURL || null,
          createdAt: new Date()
        });
      }
      
      // Store user info in localStorage
      localStorage.setItem('userId', user.uid);
      console.log('Google sign-in successful:', user);
      
      // Use location from the component scope
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="divider" style={{margin: '20px 0', textAlign: 'center', borderBottom: '1px solid #ddd', lineHeight: '0.1em'}}>
        <span style={{background: '#fff', padding: '0 10px'}}>OR</span>
      </div>
      
      <button 
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{
          backgroundColor: '#fff',
          color: '#757575',
          border: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '10px',
          width: '100%',
          marginBottom: '15px',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
          alt="Google logo" 
          style={{height: '18px', width: '18px'}}
        />
        Sign in with Google
      </button>
      
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;