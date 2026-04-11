import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('cpp');
  const [astData, setAstData] = useState(null);
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Future state placeholders for features 3, 5, 7, 8, 9
  const [reviewFindings, setReviewFindings] = useState(null);
  const [transpiledCode, setTranspiledCode] = useState('');
  const [logicFlowData, setLogicFlowData] = useState(null);

  const value = {
    sourceCode, setSourceCode,
    sourceLang, setSourceLang,
    astData, setAstData,
    optimizedResult, setOptimizedResult,
    isLoading, setIsLoading,
    reviewFindings, setReviewFindings,
    transpiledCode, setTranspiledCode,
    logicFlowData, setLogicFlowData
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
