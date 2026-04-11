import React, { useState } from 'react';
import { Graphviz } from 'graphviz-react';
import { getLogicFlow } from '../services/api';
import { useWorkspace } from '../context/WorkspaceContext';
import { Network, Play, Workflow, RefreshCw } from 'lucide-react';

export default function LogicFlowPanel() {
  const { sourceCode, sourceLang, logicFlowData, setLogicFlowData } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!sourceCode) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getLogicFlow(sourceCode, sourceLang);
      setLogicFlowData(response.data.logic_flow_dot);
    } catch (err) {
      console.error(err);
      setError('Failed to generate logic flow. Make sure you have code in the editor.');
    } finally {
      setLoading(false);
    }
  };

  // Empty state — no graph yet
  if (!logicFlowData && !loading && !error) {
    return (
      <div className="card empty-state fade-in-up" style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ margin: '0 auto 16px auto', opacity: 0.3, color: 'var(--text-muted)' }}>
          <Network size={48} />
        </div>
        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Code Logic Flow
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
          Visualize your code's logic as a simplified flowchart. See functions, loops, conditions, 
          and return statements mapped out in plain English — no compiler jargon.
        </p>
        <button className="btn-primary" onClick={handleGenerate} disabled={!sourceCode || loading}>
          {loading ? (
            <span className="btn-loading-text"><span className="spinner" /> Analyzing Code...</span>
          ) : (
            <>
              <Play size={16} style={{ marginRight: '6px' }} /> 
              Generate Logic Flow
            </>
          )}
        </button>
        {error && <p style={{ color: '#ff4d4d', marginTop: '12px', fontSize: '12px' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Network size={20} color="var(--accent)" />
          <div>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Simplified Logic Flow</span>
            <span style={{ marginLeft: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Human-readable code structure
            </span>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleGenerate} 
          disabled={loading}
          style={{ padding: '8px 16px', fontSize: '12px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: 'none' }}
        >
          {loading ? 'Regenerating...' : '↻ Regenerate'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center', padding: '12px' }}>{error}</div>
      )}

      {/* Legend */}
      <div className="card" style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legend:</span>
        <LegendItem color="#6366f1" label="Functions" shape="■" />
        <LegendItem color="#f59e0b" label="Conditions" shape="◆" />
        <LegendItem color="#10b981" label="Loops" shape="⬡" />
        <LegendItem color="#ef4444" label="Return / Break" shape="▰" />
        <LegendItem color="#3b82f6" label="Function Calls" shape="●" />
        <LegendItem color="#8b5cf6" label="Declarations" shape="□" />
      </div>

      {/* Graph */} 
      {logicFlowData && (
        <div className="card logic-flow-card" style={{ 
          padding: '0', 
          overflow: 'auto'
        }}>
          <style>{`
            .logic-flow-card { background: linear-gradient(135deg, rgba(15,15,20,0.95), rgba(20,20,30,0.95)); }
            .logic-flow-graph-wrapper { width: 100%; min-height: 70vh; display: flex; align-items: stretch; justify-content: center; }
            .logic-flow-graph-wrapper > div { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
            .logic-flow-graph-wrapper svg { width: 100% !important; height: 100% !important; min-height: 70vh; }
            .logic-flow-graph-wrapper svg text { fill: #e2e8f0 !important; }
            .logic-flow-graph-wrapper svg polygon[fill="#ffffff"] { fill: transparent !important; }
            .logic-flow-graph-wrapper svg polygon[stroke="#000000"] { stroke: transparent !important; }

            body.light-theme .logic-flow-card { background: linear-gradient(135deg, #f0f0f5, #e8e8f0) !important; }
            body.light-theme .logic-flow-graph-wrapper svg text { fill: #1a1a2e !important; }
            body.light-theme .logic-flow-graph-wrapper svg polygon[fill="#ffffff"] { fill: transparent !important; }
            body.light-theme .logic-flow-graph-wrapper svg polygon[stroke="#000000"] { stroke: transparent !important; }
            body.light-theme .logic-flow-graph-wrapper svg path[stroke="#64748b"] { stroke: #888899 !important; }
          `}</style>
          <div className="logic-flow-graph-wrapper">
            <Graphviz
              dot={logicFlowData}
              options={{ zoom: true, fit: true, width: null, height: null }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label, shape }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
      <span style={{ color, fontSize: '14px' }}>{shape}</span>
      {label}
    </div>
  );
}
