import { CatmullRomCurve3, Vector3 } from "three";
import { ISLAND_FLIGHT_PATH } from "../constants/navigation";

const config = ISLAND_FLIGHT_PATH;

const curve = new CatmullRomCurve3(
  config.waypoints.map((p) => new Vector3(...p)),
  config.closed,
  "catmullrom",
  0.5
);

const SAMPLES = 240;
const points = curve.getPoints(SAMPLES);

/**
 * Given the plane's XZ position, return guidance toward the flight path:
 *  - heading:  travel heading of the nearest path segment (game convention,
 *              0 = +Z, forward = (sin, cos))
 *  - lateral:  signed offset from the path centerline (drives steer-back)
 *  - distance: straight-line distance to the nearest path point
 */
export const getPathGuidance = (x, z) => {
  let bestI = 0;
  let bestD = Infinity;
  for (let i = 0; i < points.length; i++) {
    const dx = points[i].x - x;
    const dz = points[i].z - z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }

  const a = points[bestI];
  let tx;
  let tz;
  if (bestI >= points.length - 1) {
    const p = points[bestI - 1];
    tx = a.x - p.x;
    tz = a.z - p.z;
  } else {
    const b = points[bestI + 1];
    tx = b.x - a.x;
    tz = b.z - a.z;
  }

  const len = Math.hypot(tx, tz) || 1;
  tx /= len;
  tz /= len;

  const heading = Math.atan2(tx, tz);
  const ox = x - a.x;
  const oz = z - a.z;
  const lateral = tx * oz - tz * ox;

  return { heading, lateral, distance: Math.sqrt(bestD) };
};
