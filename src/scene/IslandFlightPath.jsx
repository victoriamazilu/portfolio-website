import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { ISLAND_FLIGHT_PATH, getRingPoint } from "../constants/navigation";

const buildRingPoints = ({ center, radiusX, radiusZ, segments }) => {
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    points.push(getRingPoint({ center, radiusX, radiusZ }, t));
  }

  return points;
};

const PathMarker = ({ position, color, emissive }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.55, 16, 16]} />
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={0.45}
      metalness={0.35}
      roughness={0.25}
    />
  </mesh>
);

const IslandFlightPath = () => {
  const config = ISLAND_FLIGHT_PATH;

  const { ringPoints, markerPoints } = useMemo(() => {
    const ring = buildRingPoints(config);
    const step = Math.max(1, Math.floor(config.segments / config.markerCount));
    const markers = [];

    for (let i = 0; i < config.markerCount; i++) {
      const index = i * step;
      if (ring[index]) markers.push(ring[index]);
    }

    return { ringPoints: ring, markerPoints: markers };
  }, [config]);

  return (
    <group>
      <Line
        points={ringPoints}
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
        />
      ))}
    </group>
  );
};

export default IslandFlightPath;
