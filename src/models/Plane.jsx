import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import planeScene from "../assets/3d/plane.glb";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Plane = ({ isRotating, currentRotationSpeed, orbitRadius = 1.0, verticalOffset = 0, cameraDepth = 0, ...props }) => {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;
  const currentRotationY = useRef(props.rotation ? props.rotation[1] : 0);
  const targetRotationY = useRef(props.rotation ? props.rotation[1] : 0);
  
  const currentBankAngle = useRef(0); // Roll rotation (banking left/right)
  const currentPitchAngle = useRef(0); // Pitch rotation (nose up/down)
  const previousVerticalOffset = useRef(0);
  const previousCameraDepth = useRef(0);

  useEffect(() => {
    if (isRotating && Math.abs(currentRotationSpeed) > 0.001) {
      rotationSpeed.current = currentRotationSpeed;
      actions["Take 001"].play();
    }
  }, [actions, isRotating, currentRotationSpeed]);

  useFrame((state) => {
    // Apply damping when not actively rotating
    if (!isRotating || Math.abs(currentRotationSpeed) <= 0.001) {
      rotationSpeed.current *= dampingFactor;
    }

    // Stop the animation when speed is very low
    if (Math.abs(rotationSpeed.current) < 0.001) {
      actions["Take 001"].stop();
    }
    
    // Update plane position based on all control inputs
    const time = state.clock.getElapsedTime();
    const baseRadius = 3; 
    const currentRadius = baseRadius * orbitRadius;
    
    const radiusDifference = currentRadius - baseRadius;
    const dramaticMultiplier = 1.8;
    
    // Enhanced orbital motion with more pronounced movement
    const orbitX = Math.sin(time * 0.4) * radiusDifference * dramaticMultiplier;
    const orbitZ = Math.cos(time * 0.4) * radiusDifference * dramaticMultiplier * 0.8;
    const orbitY = Math.sin(time * 0.25) * radiusDifference * dramaticMultiplier * 0.6;
    
    const secondaryX = Math.cos(time * 0.6) * radiusDifference * 0.3;
    const secondaryZ = Math.sin(time * 0.5) * radiusDifference * 0.4;
    
    // Apply dramatic orbit offset to original position
    if (ref.current) {
      // Base position with orbital motion
      const baseX = props.position[0] + orbitX + secondaryX;
      const baseY = props.position[1] + orbitY;
      const baseZ = props.position[2] + orbitZ + secondaryZ;
      
      // Apply keyboard-controlled offsets
      ref.current.position.x = baseX;
      ref.current.position.y = baseY + verticalOffset;
      ref.current.position.z = baseZ + cameraDepth;
      
      // Calculate smooth rotation based on orbit position
      const orbitAngle = Math.atan2(orbitX, orbitZ);
      const baseRotation = props.rotation ? props.rotation[1] : 0;
      
      // Calculate target rotation with banking effect
      targetRotationY.current = baseRotation + orbitAngle * 0.15;
      
      // Smooth interpolation to prevent choppy rotation
      const rotationDifference = targetRotationY.current - currentRotationY.current;
      
      // Handle angle wrapping (shortest path between angles)
      let shortestAngle = rotationDifference;
      if (Math.abs(shortestAngle) > Math.PI) {
        shortestAngle = shortestAngle > 0 ? shortestAngle - 2 * Math.PI : shortestAngle + 2 * Math.PI;
      }
      
      // Apply smooth rotation with damping
      const rotationLerpFactor = 0.05; // Adjust for smoothness (lower = smoother)
      currentRotationY.current += shortestAngle * rotationLerpFactor;
      
      
      // Banking (roll) based on current depth position
      const targetBankAngle = cameraDepth * 0.2;
      currentBankAngle.current = THREE.MathUtils.lerp(currentBankAngle.current, targetBankAngle, 0.08);
      
      // Pitching (nose up/down) based on current vertical position
      const targetPitchAngle = verticalOffset * 0.3;
      currentPitchAngle.current = THREE.MathUtils.lerp(currentPitchAngle.current, targetPitchAngle, 0.08);
      
      ref.current.rotation.x = (props.rotation ? props.rotation[0] : 0) + currentPitchAngle.current;
      ref.current.rotation.y = currentRotationY.current;
      ref.current.rotation.z = (props.rotation ? props.rotation[2] : 0) + currentBankAngle.current;
      
      previousVerticalOffset.current = verticalOffset;
      previousCameraDepth.current = cameraDepth;
    }
  });

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
};

export default Plane;
