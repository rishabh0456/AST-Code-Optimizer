import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const LANGUAGES = [
  { value: 'cpp',        label: 'C++' },
  { value: 'java',       label: 'Java' },
  { value: 'python',     label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
];

function CodeEditor({ sourceCode, setSourceCode, sourceLang, setSourceLang }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const extToLang = {
      cpp: 'cpp', c: 'cpp', cc: 'cpp', h: 'cpp', hpp: 'cpp',
      java: 'java',
      py: 'python',
      js: 'javascript', jsx: 'javascript', ts: 'javascript', tsx: 'javascript'
    };

    if (extToLang[extension]) {
      setSourceLang(extToLang[extension]);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceCode(event.target.result);
    };
    reader.readAsText(file);
    
    e.target.value = null; // Clear so same file can be selected again
  };

  return (
    <div className="card" style={{ minHeight: '420px' }}>
      {/* Card Header */}
      <div className="card-header">
        <span className="card-title">Source Code</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="lang-select" 
            onClick={() => fileInputRef.current.click()} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Upload a code file"
          >
            <Upload size={14} />
            <span>Upload</span>
          </button>
          
          <select
            id="source-lang-select"
            className="lang-select"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            aria-label="Select source language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
          accept=".cpp,.c,.cc,.h,.hpp,.java,.py,.js,.jsx,.ts,.tsx"
        />
      </div>

      {/* Card Body — Textarea */}
      <div className="card-body">
        <textarea
          id="source-code-input"
          className="code-textarea"
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          placeholder="// Paste your source code here..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

export default CodeEditor;