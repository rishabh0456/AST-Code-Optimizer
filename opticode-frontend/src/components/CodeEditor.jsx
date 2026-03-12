import React from 'react';

function CodeEditor({ sourceCode, setSourceCode, sourceLang, setSourceLang }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: 'white', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Source Code</h3>
        <select 
          value={sourceLang} 
          onChange={(e) => setSourceLang(e.target.value)}
          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      <textarea
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        style={{ 
          width: '100%', 
          height: '350px', 
          fontFamily: 'monospace', 
          padding: '12px', 
          boxSizing: 'border-box',
          resize: 'vertical',
          backgroundColor: '#2d2d2d',
          color: '#e0e0e0',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px'
        }}
        placeholder="Paste your original code here..."
      />
    </div>
  );
}

export default CodeEditor;