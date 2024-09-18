// src/ProfilePage.jsx
import React, { useEffect, useState } from 'react';

function ProfilePage({ authToken }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3006/profile', {
          headers: { Authorization: authToken }
        });
        const data = await response.json();
        if (response.ok) {
          setProfile(data);
        } else {
          console.error(data);
          alert('Failed to fetch profile');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred');
      }
    };
    fetchProfile();
  }, [authToken]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.name}</p>
      {/* Display other profile details as needed */}
    </div>
  );
}

export default ProfilePage;
