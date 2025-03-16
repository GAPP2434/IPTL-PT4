import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './components/firebase-config';
//import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
//import { storage } from './components/firebase-config';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    setProfilePicture(file);
    setError('');
  };
  
  /*
  // Convert file to base64 for easier handling
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Create user authentication record
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Update the user profile with the name
      await updateProfile(user, {
        displayName: name
      });

      let profileURL = null;
      
      // 3. Handle profile picture upload first if provided
      /*if (profilePicture) {
        try {
          // Convert to base64 for temporary display
          const base64 = await convertToBase64(profilePicture);
          
          // Create a simple blob reference
          const storageRef = ref(storage, `profile_pictures/${user.uid}`);
          
          // Upload directly from file object, not arrayBuffer
          await uploadBytes(storageRef, profilePicture);
          
          // Get the download URL
          profileURL = await getDownloadURL(storageRef);
          
          // Update user profile with photo URL
          await updateProfile(user, { 
            photoURL: profileURL 
          });
          
          console.log("Profile picture uploaded successfully");
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          // Continue with registration without picture
        }
      }*/
      
      // 4. Create the user document in Firestore with all user data
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        profilePicture: profileURL,
        createdAt: new Date()
      });
      
      console.log("User registered successfully!");
      navigate('/login');
      
    } catch (error) {
      console.error("Registration error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please use another email or login.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture (optional):</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
          {profilePicture && <p style={{fontSize: '0.8em', margin: '5px 0'}}>Selected: {profilePicture.name}</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;