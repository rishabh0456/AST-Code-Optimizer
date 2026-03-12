import React from 'react';

function Sidebar() {
  return (
    <div style={{
      width: '300px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2>⚡ OptiCode</h2>
      
      <div style={{ marginTop: '20px', marginBottom: '30px', fontSize: '0.9rem', color: '#bdc3c7', lineHeight: '1.5' }}>
        <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>Madhav Institute of Technology and Science</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '0.8rem', fontStyle: 'italic' }}>Deemed University</p>
        
        <p style={{ margin: '5px 0' }}><strong>Submitted to:</strong> Prof. Jigyasa Mishra</p>
        <p style={{ margin: '5px 0' }}><strong>Submitted by:</strong> Rishabh Jha</p>
        <p style={{ margin: '5px 0' }}><strong>Enrollment No:</strong> 0901CS231114</p>
        <p style={{ margin: '5px 0' }}>5th Semester, 3rd year</p>
      </div>
      
      <hr style={{ borderColor: '#34495e', width: '100%', marginBottom: '30px' }} />

      {/* API Key input has been completely removed! */}
      <div style={{ color: '#2ecc71', fontSize: '0.9rem', fontWeight: 'bold' }}>
        ✓ API Key Secured in Backend
      </div>
    </div>
  );
}

export default Sidebar;