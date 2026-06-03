import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { CatmullRomCurve3, Vector3 } from "three";
import { ISLAND_FLIGHT_PATH } from "../constants/navigation";

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
        />
      ))}
    </group>
  );
};

export default IslandFlightPath;
