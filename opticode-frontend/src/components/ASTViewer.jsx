import React from 'react';
import { Graphviz } from 'graphviz-react';

function ASTViewer({ astData }) {
  return (
    <div className="card" style={{ minHeight: '420px' }}>
      {/* Card Header */}
      <div className="card-header">
        <span className="card-title">Logic Tree (AST)</span>
        {astData && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--green)',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            ● Generated
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        {astData ? (
          <div className="ast-graph-wrapper">
            <style>{`
              #graphviz-wrapper-inner { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
              #graphviz-wrapper-inner > div { width: 100%; height: 100%; }
              #graphviz-wrapper-inner svg { width: 100% !important; height: 100% !important; }
            `}</style>
            <div id="graphviz-wrapper-inner">
              <Graphviz
                dot={astData}
                options={{ zoom: true, fit: true }}
              />
            </div>
          </div>
        ) : (
          <div className="ast-empty">
            <div className="ast-empty-icon">🌐</div>
            <p className="ast-empty-text">Run optimization to view the AST structure</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ASTViewer;