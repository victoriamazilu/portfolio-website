// Spawn facing the islands — W flies toward +Z
export const SPAWN_POSITION = [0, 6, -62];

export const ISLANDS = {
  original: {
    id: "original",
    label: "Original",
    scale: [0.08, 0.08, 0.08],
    position: [0, -18, -38],
    rotation: [0, 24.2, 0],
  },
  island2: {
    id: "island2",
    label: "Island 2",
    scale: [0.22, 0.22, 0.22],
    position: [42, 2, -38],
    rotation: [0, 24.2, 0],
  },
};

/** Point the camera toward on load and while cruising */
export const ISLANDS_LOOK_AT = [21, -4, -38];

export const WORLD_BOUNDS = 120;

export const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "up", keys: ["Space"] },
  { name: "down", keys: ["ShiftLeft"] },
];
