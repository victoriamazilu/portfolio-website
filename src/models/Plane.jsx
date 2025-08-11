import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import planeScene from "../assets/3d/plane.glb";
import { useAnimations, useGLTF } from "@react-three/drei";

const Plane = ({ isRotating, currentRotationSpeed, ...props }) => {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95; // Same as island's damping factor

  useEffect(() => {
    if (isRotating && Math.abs(currentRotationSpeed) > 0.001) {
      rotationSpeed.current = currentRotationSpeed;
      actions["Take 001"].play();
    }
  }, [actions, isRotating, currentRotationSpeed]);

  useFrame(() => {
    // Apply damping when not actively rotating
    if (!isRotating || Math.abs(currentRotationSpeed) <= 0.001) {
      rotationSpeed.current *= dampingFactor;
    }

    // Stop the animation when speed is very low
    if (Math.abs(rotationSpeed.current) < 0.001) {
      actions["Take 001"].stop();
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Plane;
