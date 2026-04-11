import React, { useState, useEffect } from 'react';
import { ArrowRight, Code2, Zap, BrainCircuit, Sun, Moon } from 'lucide-react';
import '../index.css';

export default function LandingPage({ onStart }) {
  const [isDark, setIsDark] = useState(!document.body.classList.contains('light-theme'));

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  return (
    <div className="landing-container">
      {/* Theme Toggle — top right */}
      <button
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 100,
          background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)', borderRadius: '50%',
          width: '42px', height: '42px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <main className="landing-content">
        <div className="hero-section text-center">
          <div className="status-badge glow-pulse mx-auto mb-6">
            <span>●</span> OptiCode v1.0 Live
          </div>
          <h1 className="hero-title text-gradient">Intelligent Code Performance Analyzer</h1>
          <p className="hero-subtitle">
            Instantly parse, visualize, and optimize source code algorithms across multiple languages using deep AST tracking and Generative AI.
          </p>
          <button className="btn-primary hero-btn" onClick={onStart}>
            Enter workspace <ArrowRight size={16} />
          </button>
        </div>

        <div className="features-grid">
          <div className="card feature-card glass">
            <div className="feature-icon"><Code2 size={24} /></div>
            <h3>Deep AST Parsing</h3>
            <p>Translates source code into a universal Abstract Syntax Tree for deep structural algorithmic analysis.</p>
          </div>
          <div className="card feature-card glass">
            <div className="feature-icon"><BrainCircuit size={24} /></div>
            <h3>AI Code Refactoring</h3>
            <p>Uses advanced generative AI to effortlessly rewrite legacy algorithms into clean, modern language paradigms.</p>
          </div>
          <div className="card feature-card glass">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Big-O Detection</h3>
            <p>Intelligently parses nested lexical scopes to flag computational complexity and optimize toward O(N) linear time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
