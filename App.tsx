import React, { useState, useRef, useCallback } from 'react';
import { CelestialBody, NewBodyParams, Vector2 } from './types';
import { PRESETS } from './constants';
import ControlPanel from './components/ControlPanel';
import SimulationCanvas from './components/SimulationCanvas';
import { analyzeSystem } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid'; // Actually we don't have uuid installed, let's just use simple ID generation

// Simple ID generator to avoid deps
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  // We use a ref for bodies to avoid constant React re-renders during the high-freq physics loop.
  // We force update only when we need to reflect changes in the UI (like list updates).
  const bodiesRef = useRef<CelestialBody[]>(JSON.parse(JSON.stringify(PRESETS.SOLAR_SYSTEM)));
  const [isRunning, setIsRunning] = useState(true);
  const [scale, setScale] = useState(0.8);
  const [offset, setOffset] = useState<Vector2>({ x: 0, y: 0 });
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Need a state trigger to force re-render of sidebar lists if we were displaying a list of bodies there
  const [bodiesListVersion, setBodiesListVersion] = useState(0);

  const handleTogglePlay = () => setIsRunning(prev => !prev);
  
  const handleReset = () => {
    setOffset({ x: 0, y: 0 });
    setScale(0.8);
  };

  const handleLoadPreset = (presetBodies: any[]) => {
    bodiesRef.current = JSON.parse(JSON.stringify(presetBodies));
    setBodiesListVersion(v => v + 1);
    setAnalysisResult("");
    handleReset();
  };

  const handleAddBody = (params: NewBodyParams) => {
    const newBody: CelestialBody = {
      id: generateId(),
      name: params.name,
      mass: params.mass,
      radius: params.radius,
      color: params.color,
      position: { x: params.x, y: params.y },
      velocity: { x: params.vx, y: params.vy },
      trail: [],
      isLocked: false
    };
    bodiesRef.current.push(newBody);
    setBodiesListVersion(v => v + 1);
  };

  const handleClearBodies = () => {
    bodiesRef.current = [];
    setBodiesListVersion(v => v + 1);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSystem(bodiesRef.current);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.1));

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 font-sans">
      <ControlPanel 
        isRunning={isRunning}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onLoadPreset={handleLoadPreset}
        onAddBody={handleAddBody}
        onClearBodies={handleClearBodies}
        onAnalyze={handleAnalyze}
        analysisResult={analysisResult}
        isAnalyzing={isAnalyzing}
        bodies={bodiesRef.current}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <SimulationCanvas 
        bodiesRef={bodiesRef}
        isRunning={isRunning}
        scale={scale}
        offset={offset}
        setOffset={setOffset}
      />
    </div>
  );
}

export default App;
