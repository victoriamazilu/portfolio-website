export const SHOW_ISLAND_2 = false;

/** Plane spawn — back of the scene, facing +Z toward the island */
export const SPAWN_POSITION = [0, 2, -105];

/** The plane mesh is rendered this far above its rigid body on Y */
export const PLANE_VISUAL_Y_OFFSET = 5;

/**
 * Explore path: starts at the plane spawn, flies forward through the
 * island, then curves around it to guide the user. Smoothed into a
 * curve in IslandFlightPath.jsx.
 */
export const ISLAND_FLIGHT_PATH = {
  // Starts at the spawn point (heading +Z), eases into one big circular
  // arc (center ~[7.6,-51.6], radius ~23u) that threads all three hoops.
  // Single sustained ~32deg bank — easy to hold, well under max turn.
  waypoints: [
    [0, 6, -100], // spawn — straight ahead, +Z
    [-8, 7, -80], // ease toward the circle
    [-14, 7, -60], // hoop 1 — start of the arc
    [-15, 8, -47], // arc...
    [-7, 8, -34], // arc...
    [6, 8, -29], // arc...
    [20, 8.5, -32], // hoop 2 — middle of the arc
    [35, 8, -43], // arc...
    [35, 8, -55], // arc...
    [24, 8.5, -68], // hoop 3 — end of the arc
    // [10, 8, -82], // sweep back toward spawn
    [0, 8, -82], // sweep back toward spawn
  ],
  closed: false,
  segments: 160,
  markerCount: 12,
  lineColor: "#ffffff",
  markerColor: "#ffdd57",
  markerEmissive: "#ffb800",
  lineWidth: 2.5,
};

/** Camera sits behind the plane — not on the ring itself */
export const CAMERA_CHASE_OFFSET = [0, 10, -14];

export const getCameraPositionForPlane = (planePosition) => [
  planePosition[0] + CAMERA_CHASE_OFFSET[0],
  planePosition[1] + CAMERA_CHASE_OFFSET[1],
  planePosition[2] + CAMERA_CHASE_OFFSET[2],
];

export const INITIAL_CAMERA_POSITION = getCameraPositionForPlane(SPAWN_POSITION);

export const ISLANDS = {
  original: {
    id: "original",
    label: "Original",
    scale: [3.8, 3.8, 3.8],
    position: [0, -45, -45],
    rotation: [0, 24.2, 0],
  },
  island2: {
    id: "island2",
    label: "Island 2",
    scale: [0.20, 0.20, 0.20],
    position: [45, 2, -38],
    rotation: [0, 24.2, 0],
  },
};

/**
 * Floating props for visual interest. Hoops are glowing rings the plane
 * can fly through along the path; clouds add atmosphere.
 * Tune positions/scales freely — purely decorative, no collision.
 */
export const DECORATIONS = {
  hoops: [
    { position: [-14, 7, -60], rotation: [0, 0.2, 0], scale: 1.4, color: "#ffdd57" },
    { position: [20, 8.5, -32], rotation: [0, 1.5, 0], scale: 1.5, color: "#7ee0ff" },
    { position: [24, 8.5, -68], rotation: [0, 1.5, 0], scale: 1.4, color: "#ffb86b" },
  ],
  clouds: [
    { position: [-22, 18, -40], scale: 2.6 },
    { position: [24, 20, -52], scale: 3.0 },
    { position: [8, 24, -28], scale: 2.2 },
    { position: [-14, 16, -64], scale: 2.4 },
    { position: [30, 14, -38], scale: 2.0 },
  ],
};

/** Point the camera toward on load and while cruising */
export const ISLANDS_LOOK_AT = [0, 6, -45];

export const WORLD_BOUNDS = 120;

export const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "up", keys: ["Space"] },
  { name: "down", keys: ["ShiftLeft"] },
];
