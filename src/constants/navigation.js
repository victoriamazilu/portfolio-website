export const SHOW_ISLAND_2 = false;

/** Dotted flight ring around island 1 (Rafael-style coin path) */
export const ISLAND_FLIGHT_PATH = {
  center: [0, 9, -45],
  radiusX: 28,
  radiusZ: 28,
  segments: 72,
  markerCount: 18,
  lineColor: "#ffffff",
  markerColor: "#ffdd57",
  markerEmissive: "#ffb800",
  lineWidth: 2.5,
  /** Reference angle for the back of the ring (used by flight path only) */
  spawnAngle: -Math.PI / 2,
};

export const getRingPoint = (path, angle) => {
  const [cx, cy, cz] = path.center;
  return [
    cx + Math.cos(angle) * path.radiusX,
    cy,
    cz + Math.sin(angle) * path.radiusZ,
  ];
};

/**
 * Plane spawn — edit this without touching the ring or camera offset.
 * [x, y, z] in world space. Heading 0 = facing +Z (toward the island).
 *
 * Tip: use PLANE_SPAWN_OFFSET below to nudge from the ring’s back marker.
 */
export const RING_BACK_POINT = getRingPoint(
  ISLAND_FLIGHT_PATH,
  ISLAND_FLIGHT_PATH.spawnAngle
);

export const PLANE_SPAWN_OFFSET = [0, -5, -2];

export const PLANE_SPAWN_POSITION = [
  RING_BACK_POINT[0] + PLANE_SPAWN_OFFSET[0],
  RING_BACK_POINT[1] + PLANE_SPAWN_OFFSET[1],
  RING_BACK_POINT[2] + PLANE_SPAWN_OFFSET[2],
];

/** Used by PlaneController + ChaseCamera follow (not by the ring) */
export const SPAWN_POSITION = PLANE_SPAWN_POSITION;

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
    scale: [2.2, 2.2, 2.2],
    position: [0, -20, -45],
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
