import React, { useState, useEffect } from 'react';
import { Code2, Network, Settings, ChevronLeft, ChevronRight, ArrowRightLeft, Sun, Moon } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'editor', icon: <Code2 size={18} />, label: 'Code Editor' },
  { id: 'ast', icon: <Network size={18} />, label: 'Logic Flow' },
  { id: 'transpiler', icon: <ArrowRightLeft size={18} />, label: 'Refactor / Transpile' },
];

function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const handleToggle = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} role="navigation" aria-label="Sidebar navigation">
      <div className="sidebar-header">
        <div className="sidebar-logo-block">
          <div className="sidebar-logo-icon" title="OptiCode">⚡</div>
          {!isCollapsed && (
            <div className="sidebar-logo-text">
              <h2>OptiCode</h2>
              <p>Workspace</p>
            </div>
          )}
        </div>
        <button className="sidebar-collapse-btn" title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} onClick={handleToggle}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav sidebar-scroll-area">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 0' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-icon ${activeTab === item.id ? 'active' : ''}`}
              title={item.label}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="sidebar-item-label">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Pinned Bottom */}
      <div className="sidebar-pinned-bottom">
        <button 
          className="sidebar-icon theme-toggle-btn" 
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} 
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {!isCollapsed && <span className="sidebar-item-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button 
          className={`sidebar-icon ${activeTab === 'settings' ? 'active' : ''}`} 
          title="Settings" 
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="sidebar-item-label">Settings</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;