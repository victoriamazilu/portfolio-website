import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import skyScene from "../assets/3d/sky.glb";

const Sky = ({ isRotating, currentRotationSpeed }) => {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95; // Same as island's damping factor

  useFrame((_, delta) => {
    // Handle smooth rotation transition
    if (isRotating && Math.abs(currentRotationSpeed) > 0.001) {
      rotationSpeed.current = currentRotationSpeed;
    } else {
      // Apply damping when not rotating
      rotationSpeed.current *= dampingFactor;
    }

    if (Math.abs(rotationSpeed.current) > 0.001) {
      skyRef.current.rotation.y -=
        0.1 * delta * Math.sign(rotationSpeed.current);
    }
  });

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
};

export default Sky;
