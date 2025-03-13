import React from 'react';
import './Dashboard.css';

function Profile() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-title">
            <h1>Dashboard Title</h1>
          </div>
          <nav className="header-navigation">
            <ul>
              <li><a href="/dashboard">Home</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/login">Logout</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="dashboard-content">
        <h1>User Profile</h1>
        <p>This is the profile page.</p>
      </main>
    </div>
  );
}

export default Profile;