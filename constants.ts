import { NewBodyParams } from "./types";

// Gravitational Constant tailored for pixel-space simulation to look good
// Real G is 6.674e-11, but that requires huge masses/distances. 
// We use a 'simulation G' for 60fps pixel coordinates.
export const SIMULATION_G = 0.5; 
export const TRAIL_LENGTH = 100;
export const COLLISION_DAMPING = 0.8;

export const DEFAULT_BODY: NewBodyParams = {
  name: "New Planet",
  mass: 50,
  radius: 10,
  x: 200,
  y: 0,
  vx: 0,
  vy: 1.5,
  color: "#3b82f6", // blue-500
};

export const PRESETS = {
  SOLAR_SYSTEM: [
    {
      id: "sun",
      name: "Sun",
      mass: 5000,
      radius: 40,
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      color: "#fbbf24", // amber-400
      isLocked: false,
      trail: [],
    },
    {
      id: "earth",
      name: "Earth",
      mass: 100,
      radius: 12,
      position: { x: 300, y: 0 },
      velocity: { x: 0, y: 2.8 }, // v = sqrt(GM/r) approx sqrt(0.5 * 5000 / 300) = sqrt(8.33) = 2.88
      color: "#3b82f6",
      isLocked: false,
      trail: [],
    },
    {
      id: "mars",
      name: "Mars",
      mass: 50,
      radius: 8,
      position: { x: 450, y: 0 },
      velocity: { x: 0, y: 2.3 },
      color: "#ef4444", // red-500
      isLocked: false,
      trail: [],
    }
  ],
  BINARY_STAR: [
    {
      id: "star1",
      name: "Alpha",
      mass: 3000,
      radius: 30,
      position: { x: -150, y: 0 },
      velocity: { x: 0, y: 1.5 },
      color: "#f472b6", // pink-400
      isLocked: false,
      trail: [],
    },
    {
      id: "star2",
      name: "Beta",
      mass: 3000,
      radius: 30,
      position: { x: 150, y: 0 },
      velocity: { x: 0, y: -1.5 },
      color: "#22d3ee", // cyan-400
      isLocked: false,
      trail: [],
    }
  ]
};
