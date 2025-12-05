import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Plus, Trash2, Brain, Video, ZoomIn, ZoomOut } from 'lucide-react';
import { NewBodyParams, CelestialBody } from '../types';
import { DEFAULT_BODY, PRESETS } from '../constants';

interface ControlPanelProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onLoadPreset: (bodies: any[]) => void;
  onAddBody: (body: NewBodyParams) => void;
  onClearBodies: () => void;
  onAnalyze: () => void;
  analysisResult: string;
  isAnalyzing: boolean;
  bodies: CelestialBody[];
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  onTogglePlay,
  onReset,
  onLoadPreset,
  onAddBody,
  onClearBodies,
  onAnalyze,
  analysisResult,
  isAnalyzing,
  bodies,
  onZoomIn,
  onZoomOut
}) => {
  const [newBody, setNewBody] = useState<NewBodyParams>(DEFAULT_BODY);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBody(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'color' ? value : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBody(newBody);
  };

  return (
    <div className="w-full md:w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          Orbital Architect
        </h1>
        <p className="text-xs text-slate-400 mt-1">Newtonian Physics Engine</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Playback Controls */}
        <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Simulation</h2>
            <div className="flex gap-2">
            <button
                onClick={onTogglePlay}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
                isRunning 
                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/50' 
                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/50'
                }`}
            >
                {isRunning ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
            </button>
            <button
                onClick={onReset}
                className="p-2 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-600"
                title="Reset View"
            >
                <RefreshCw size={18} />
            </button>
             <button
                onClick={onClearBodies}
                className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                title="Clear All"
            >
                <Trash2 size={18} />
            </button>
            </div>
             <div className="flex gap-2">
                 <button onClick={onZoomOut} className="flex-1 p-2 bg-slate-800 rounded hover:bg-slate-700"><ZoomOut size={16} className="mx-auto"/></button>
                 <button onClick={onZoomIn} className="flex-1 p-2 bg-slate-800 rounded hover:bg-slate-700"><ZoomIn size={16} className="mx-auto"/></button>
             </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Presets</h2>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => onLoadPreset(PRESETS.SOLAR_SYSTEM)}
                    className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700"
                >
                    Solar System
                </button>
                <button 
                    onClick={() => onLoadPreset(PRESETS.BINARY_STAR)}
                    className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700"
                >
                    Binary Star
                </button>
            </div>
        </div>

        {/* Add Body Form */}
        <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Add Celestial Body</h2>
            <form onSubmit={handleSubmit} className="space-y-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <div>
                    <label className="text-xs text-slate-400">Name</label>
                    <input 
                        type="text" 
                        name="name"
                        value={newBody.name}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-400">Mass</label>
                        <input 
                            type="number" 
                            name="mass"
                            value={newBody.mass}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Radius</label>
                        <input 
                            type="number" 
                            name="radius"
                            value={newBody.radius}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-400">Pos X</label>
                        <input 
                            type="number" 
                            name="x"
                            value={newBody.x}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Pos Y</label>
                        <input 
                            type="number" 
                            name="y"
                            value={newBody.y}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-slate-400">Vel X</label>
                        <input 
                            type="number" 
                            name="vx"
                            value={newBody.vx}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Vel Y</label>
                        <input 
                            type="number" 
                            name="vy"
                            value={newBody.vy}
                            onChange={handleChange}
                            step="0.1"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-400">Color</label>
                    <div className="flex gap-2 mt-1">
                        <input 
                            type="color" 
                            name="color"
                            value={newBody.color}
                            onChange={handleChange}
                            className="h-8 w-full bg-transparent cursor-pointer rounded"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Add Object
                </button>
            </form>
        </div>

        {/* AI Analysis */}
        <div className="space-y-2 pb-4">
             <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Brain size={16} /> AI Analyst
            </h2>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-300 mb-3 min-h-[60px] leading-relaxed">
                    {analysisResult || "Add some planets and ask for an analysis of your solar system!"}
                </p>
                <button 
                    onClick={onAnalyze}
                    disabled={isAnalyzing || bodies.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                    {isAnalyzing ? "Analyzing..." : "Analyze Stability"}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;
