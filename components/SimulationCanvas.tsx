import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CelestialBody, Vector2 } from '../types';
import { SIMULATION_G, TRAIL_LENGTH } from '../constants';

interface SimulationCanvasProps {
  bodiesRef: React.MutableRefObject<CelestialBody[]>;
  isRunning: boolean;
  scale: number;
  offset: Vector2;
  setOffset: React.Dispatch<React.SetStateAction<Vector2>>;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ 
  bodiesRef, 
  isRunning, 
  scale,
  offset,
  setOffset
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<Vector2>({ x: 0, y: 0 });

  // Physics Step
  const updatePhysics = () => {
    const bodies = bodiesRef.current;
    
    // Sub-steps for better stability? For now, single step per frame is okay for simple demo
    // We could do multiple small steps
    const dt = 1.0; // Time step

    // 1. Calculate Forces
    for (let i = 0; i < bodies.length; i++) {
        if (bodies[i].isLocked) continue;

        let fx = 0;
        let fy = 0;

        for (let j = 0; j < bodies.length; j++) {
            if (i === j) continue;
            
            const dx = bodies[j].position.x - bodies[i].position.x;
            const dy = bodies[j].position.y - bodies[i].position.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Softening parameter to prevent infinity when bodies overlap
            if (dist < bodies[i].radius + bodies[j].radius) {
                // Simple collision: merge logic is complex, for now we just let them pass through 
                // but reduce gravity to prevent slinging
                continue; 
            }

            const force = (SIMULATION_G * bodies[i].mass * bodies[j].mass) / distSq;
            fx += force * (dx / dist);
            fy += force * (dy / dist);
        }

        // 2. Update Velocity
        bodies[i].velocity.x += (fx / bodies[i].mass) * dt;
        bodies[i].velocity.y += (fy / bodies[i].mass) * dt;
    }

    // 3. Update Positions
    for (let i = 0; i < bodies.length; i++) {
        if (bodies[i].isLocked) continue;
        
        bodies[i].position.x += bodies[i].velocity.x * dt;
        bodies[i].position.y += bodies[i].velocity.y * dt;

        // Update Trails
        // Optimization: Don't add every frame, add every 5th frame or if distance is significant
        if (bodies[i].trail.length === 0 || 
            Math.abs(bodies[i].position.x - bodies[i].trail[bodies[i].trail.length - 1].x) > 1 || 
            Math.abs(bodies[i].position.y - bodies[i].trail[bodies[i].trail.length - 1].y) > 1
        ) {
            bodies[i].trail.push({ x: bodies[i].position.x, y: bodies[i].position.y });
            if (bodies[i].trail.length > TRAIL_LENGTH) {
                bodies[i].trail.shift();
            }
        }
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Transform coordinate system
    ctx.save();
    // Center of screen
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX + offset.x, centerY + offset.y);
    ctx.scale(scale, scale);

    const bodies = bodiesRef.current;

    // Draw Grid (Optional, subtle)
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    const gridSize = 100;
    const visibleW = canvas.width / scale;
    const visibleH = canvas.height / scale;
    // ... Simplified grid drawing could go here, omitting for performance/simplicity

    // Draw Trails
    bodies.forEach(body => {
        if (body.trail.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = body.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2 / scale; // Keep line width constant regardless of zoom
        ctx.moveTo(body.trail[0].x, body.trail[0].y);
        for (let i = 1; i < body.trail.length; i++) {
            ctx.lineTo(body.trail[i].x, body.trail[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    });

    // Draw Bodies
    bodies.forEach(body => {
        ctx.beginPath();
        // Scale radius visually? No, keep accurate.
        // If radius is too small to see, clamp it for drawing?
        const visualRadius = Math.max(body.radius, 3 / scale); 

        ctx.arc(body.position.x, body.position.y, visualRadius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        
        // Glow effect
        ctx.shadowColor = body.color;
        ctx.shadowBlur = 10;
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Name label
        if (scale > 0.4) {
            ctx.fillStyle = '#cbd5e1'; // slate-300
            ctx.font = `${12 / scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(body.name, body.position.x, body.position.y - body.radius - (5/scale));
        }
    });

    ctx.restore();
  };

  const loop = useCallback(() => {
    if (isRunning) {
        updatePhysics();
    }
    draw();
    animationFrameRef.current = requestAnimationFrame(loop);
  }, [isRunning, scale, offset]); // Dependencies that might change draw behavior

  useEffect(() => {
    // Start loop
    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [loop]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || window.innerWidth;
            canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || window.innerHeight;
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-slate-950 cursor-move">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="block w-full h-full"
      />
      <div className="absolute top-4 left-4 pointer-events-none select-none">
        <div className="bg-slate-900/80 backdrop-blur text-slate-400 text-xs px-2 py-1 rounded border border-slate-700">
           Zoom: {scale.toFixed(2)}x | Pan: {offset.x.toFixed(0)}, {offset.y.toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default SimulationCanvas;
