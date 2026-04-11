import React, { useRef, useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { FileArchive, FileDown, Code, CheckCircle, Package } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ReportsPanel() {
  const { sourceCode, optimizedResult, reviewFindings } = useWorkspace();
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // Markdown Export
  const downloadJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      source_code: sourceCode,
      optimization_result: optimizedResult,
      review: reviewFindings
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OptiCode_Audit.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadMarkdown = () => {
    const md = `
# OptiCode Audit Report
**Date:** ${new Date().toLocaleDateString()}

## Source Code
\`\`\`
${sourceCode || 'N/A'}
\`\`\`

## AI Optimization Result
${optimizedResult || 'N/A'}

## Review Findings
**Global Score:** ${reviewFindings ? reviewFindings.score : 'N/A'}/100

${(reviewFindings?.findings || []).map(f => `- [${f.severity}] ${f.category}: ${f.title}\n  - ${f.description}`).join('\n')}
    `;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'OptiCode_Report.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  // PDF Export
  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    
    // Convert DOM to Canvas
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#0a0a0c' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('OptiCode_Enterprise_Audit.pdf');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert("Failed to render PDF.");
    } finally {
      setDownloading(false);
    }
  };

  if (!sourceCode && !optimizedResult && !reviewFindings) {
    return (
      <div className="card empty-state fade-in-up" style={{ padding: '60px', textAlign: 'center' }}>
        <FileArchive size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--text-muted)', margin: '0 auto' }} />
        <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>Reports & Export</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto' }}>
          Run an optimization or standard code review in the workspace first to generate a master audit report.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Export Master Audit</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Download branded PDF reports or raw JSON payloads for CI/CD ingestion.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={downloadJSON} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: 'none' }}>
             Raw JSON
          </button>
          <button className="btn-primary" onClick={downloadMarkdown} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: 'none' }}>
             Markdown
          </button>
          <button className="btn-primary" onClick={downloadPDF} disabled={downloading}>
            {downloading ? <span className="spinner"></span> : <><FileDown size={16} /> Render PDF</>}
          </button>
        </div>
      </div>

      {/* Hidden layout specifically structured for the PDF Canvas to grab cleanly */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 0 }}>
        <div ref={reportRef} style={{ width: '800px', backgroundColor: '#0a0a0c', color: '#fff', padding: '40px', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', color: '#00d4ff', margin: '0 0 8px 0' }}>OptiCode Enterprise</h1>
              <p style={{ margin: 0, color: '#aeb3bc', fontSize: '14px' }}>Automated Static Analysis & Architecture Audit</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#aeb3bc', fontSize: '14px' }}>Date: {new Date().toLocaleDateString()}</p>
              {reviewFindings && (
                 <p style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: reviewFindings.score > 80 ? '#00ffaa' : '#ff4d4d' }}>
                   Security Score: {reviewFindings.score}/100
                 </p>
              )}
            </div>
          </div>

          {sourceCode && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={16}/> Source State Payload</h3>
              <pre style={{ backgroundColor: '#161b22', padding: '16px', borderRadius: '8px', fontSize: '11px', overflow: 'hidden', whiteSpace: 'pre-wrap', border: '1px solid #30363d', color: '#e6edf3' }}>
                {sourceCode.substring(0, 1000) + (sourceCode.length > 1000 ? '\n... [TRUNCATED]' : '')}
              </pre>
            </div>
          )}

          {reviewFindings && reviewFindings.findings && reviewFindings.findings.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Package size={16}/> Top Review Findings</h3>
              {reviewFindings.findings.slice(0, 5).map((f, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', marginBottom: '8px', borderLeft: `3px solid ${f.severity === 'CRITICAL' ? '#ff4d4d' : '#ffcc00'}` }}>
                  <strong style={{ fontSize: '12px', color: '#fff' }}>[{f.severity}] {f.title}</strong>
                  <p style={{ fontSize: '11px', color: '#aeb3bc', margin: '4px 0 0 0' }}>{f.description}</p>
                </div>
              ))}
            </div>
          )}

          {optimizedResult && (
             <div style={{ marginBottom: '30px' }}>
               <h3 style={{ fontSize: '16px', color: '#00ffaa', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16}/> AI Optimization Trace</h3>
               <p style={{ fontSize: '11px', color: '#aeb3bc', margin: '0 0 12px 0' }}>Transformation engine generated the following structural adjustments.</p>
               <pre style={{ backgroundColor: '#161b22', padding: '16px', borderRadius: '8px', fontSize: '11px', overflow: 'hidden', whiteSpace: 'pre-wrap', border: '1px solid #30363d', color: '#e6edf3' }}>
                 {optimizedResult.substring(0, 1000) + (optimizedResult.length > 1000 ? '\n... [TRUNCATED]' : '')}
               </pre>
             </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <p style={{ fontSize: '10px', color: '#6e7681' }}>Generated automatically by OptiCode MERN Ecosystem. Internal Use Only.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
