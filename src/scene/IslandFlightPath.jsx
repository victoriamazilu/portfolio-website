import { useMemo, useRef, useState } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import {
  ISLAND_FLIGHT_PATH,
  PLANE_VISUAL_Y_OFFSET,
} from "../constants/navigation";

const COLLECT_DIST = 2.8;
const COLLECT_DURATION = 0.5;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const PathMarker = ({ position, color, emissive, bodyRef, onCollect }) => {
  const coreRef = useRef();
  const coreMat = useRef();
  const ringRef = useRef();
  const ringMat = useRef();
  const phase = useRef("idle"); // idle -> collecting -> done
  const elapsed = useRef(0);
  const bob = useRef(Math.random() * Math.PI * 2);
  const [done, setDone] = useState(false);

  useFrame((_, delta) => {
    if (done) return;
    const core = coreRef.current;
    if (!core) return;

    if (phase.current === "idle") {
      bob.current += delta;
      core.position.y = Math.sin(bob.current * 2.2) * 0.18;
      core.rotation.y += delta * 1.6;

      if (bodyRef?.current) {
        const p = bodyRef.current.translation();
        const dx = p.x - position[0];
        const dy = p.y + PLANE_VISUAL_Y_OFFSET - position[1];
        const dz = p.z - position[2];
        if (dx * dx + dy * dy + dz * dz < COLLECT_DIST * COLLECT_DIST) {
          phase.current = "collecting";
          elapsed.current = 0;
          onCollect?.();
        }
      }
      return;
    }

    if (phase.current === "collecting") {
      elapsed.current += delta;
      const k = Math.min(elapsed.current / COLLECT_DURATION, 1);
      const e = easeOut(k);

      // Coin pickup: spin fast, hop straight up, then pop out at the top.
      core.rotation.y += delta * 22;
      core.position.y = e * 2.8;

      const grow = 1 + Math.min(k / 0.25, 1) * 0.3; // quick little bump
      const shrink = k < 0.65 ? 1 : 1 - (k - 0.65) / 0.35; // vanish at the peak
      core.scale.setScalar(Math.max(grow * shrink, 0.001));

      if (coreMat.current) {
        coreMat.current.emissiveIntensity = 0.45 + Math.min(k / 0.25, 1) * 2;
        coreMat.current.opacity = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
      }

      // Quick sparkle flash at the pickup spot
      if (ringRef.current && ringMat.current) {
        const s = Math.sin(Math.min(k / 0.4, 1) * Math.PI);
        ringRef.current.scale.setScalar(0.4 + s * 1.6);
        ringMat.current.opacity = s * 0.9;
      }

      if (k >= 1) {
        phase.current = "done";
        setDone(true);
      }
    }
  });

  if (done) return null;

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial
          ref={coreMat}
          color={color}
          emissive={emissive}
          emissiveIntensity={0.45}
          metalness={0.35}
          roughness={0.25}
          transparent
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} visible scale={0.4}>
        <torusGeometry args={[0.7, 0.06, 12, 32]} />
        <meshBasicMaterial ref={ringMat} color={emissive} transparent opacity={0} />
      </mesh>
    </group>
  );
};

const IslandFlightPath = ({ bodyRef, onCollect }) => {
  const config = ISLAND_FLIGHT_PATH;

  const { linePoints, markerPoints } = useMemo(() => {
    const curve = new CatmullRomCurve3(
      config.waypoints.map((p) => new Vector3(...p)),
      config.closed,
      "catmullrom",
      0.5
    );

    const line = curve.getPoints(config.segments).map((v) => [v.x, v.y, v.z]);
    const markers = curve
      .getSpacedPoints(config.markerCount)
      .map((v) => [v.x, v.y, v.z]);

    return { linePoints: line, markerPoints: markers };
  }, [config]);

  return (
    <group>
      <Line
        points={linePoints}
        color={config.lineColor}
        lineWidth={config.lineWidth}
        dashed
        dashSize={0.8}
        gapSize={0.55}
        transparent
        opacity={0.85}
      />

      {markerPoints.map((point, index) => (
        <PathMarker
          key={index}
          position={point}
          color={config.markerColor}
          emissive={config.markerEmissive}
          bodyRef={bodyRef}
          onCollect={onCollect}
        />
      ))}
    </group>
  );
};

export default IslandFlightPath;
