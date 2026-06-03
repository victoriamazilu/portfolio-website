import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DECORATIONS } from "../constants/navigation";

const Hoop = ({ position, rotation = [0, 0, 0], scale = 1, color = "#ffdd57" }) => {
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.6;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.22, 16, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
};

const Cloud = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    {[
      [0, 0, 0, 1],
      [1.1, -0.1, 0.2, 0.8],
      [-1.0, -0.05, -0.2, 0.75],
      [0.5, 0.4, -0.1, 0.7],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[r, 14, 14]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#dfeeff"
          emissiveIntensity={0.25}
          roughness={1}
        />
      </mesh>
    ))}
  </group>
);

const Decorations = () => (
  <group>
    {DECORATIONS.hoops.map((h, i) => (
      <Hoop key={`hoop-${i}`} {...h} />
    ))}
    {DECORATIONS.clouds.map((c, i) => (
      <Cloud key={`cloud-${i}`} {...c} />
    ))}
  </group>
);

export default Decorations;
