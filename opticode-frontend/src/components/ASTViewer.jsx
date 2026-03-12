import React from 'react';
import { Graphviz } from 'graphviz-react';

function ASTViewer({ astData }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Logic Tree (AST)</h3>
      
      <div style={{ 
        flex: 1, 
        minHeight: '400px', 
        border: '1px dashed #aaa', 
        backgroundColor: '#fafafa',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex'
      }}>
        
        {/* CSS Override: This forces the D3-Graphviz SVG to fill the entire container */}
        <style>
          {`
            #graphviz-wrapper {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            #graphviz-wrapper > div {
              width: 100%;
              height: 100%;
            }
            #graphviz-wrapper svg {
              width: 100% !important;
              height: 100% !important;
            }
          `}
        </style>

        {astData ? (
          <div id="graphviz-wrapper">
            <Graphviz 
              dot={astData} 
              options={{ 
                zoom: true, 
                fit: true 
                // Removed the conflicting string dimensions
              }} 
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#888', fontStyle: 'italic' }}>Run optimization to view the AST structure.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ASTViewer;