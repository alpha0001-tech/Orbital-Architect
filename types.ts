export interface Vector2 {
  x: number;
  y: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  mass: number;
  radius: number;
  position: Vector2;
  velocity: Vector2;
  color: string;
  isLocked?: boolean; // If true, unaffected by gravity (e.g. fixed sun)
  trail: Vector2[];
}

export interface SimulationState {
  bodies: CelestialBody[];
  isRunning: boolean;
  timeScale: number;
  gConstant: number;
  scale: number; // Viewport zoom
  offset: Vector2; // Viewport pan
}

export interface NewBodyParams {
  mass: number;
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  name: string;
}
