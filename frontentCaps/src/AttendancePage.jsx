// src/AttendancePage.jsx
import React, { useState } from 'react';

function AttendancePage({ authToken }) {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3006/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken
        },
        body: JSON.stringify({ date, status })
      });
      if (response.ok) {
        alert('Attendance recorded');
        setDate('');
        setStatus('');
      } else {
        console.error(await response.json());
        alert('Failed to record attendance');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <h2>Record Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AttendancePage;
