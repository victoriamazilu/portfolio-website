import React, { useRef, useState, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import scene from "../assets/3d/pointer.glb";

// Animation durations - keeping the sequence but shortening
const ANIMATION_DURATION_WAIT_AT_START_POS = 0.7;
const ANIMATION_DURATION_PRESS = 0.1;
const ANIMATION_DURATION_WAIT_PRESSED = 0.3;
const ANIMATION_DURATION_DRAG = 0.8;
const ANIMATION_DURATION_WAIT_SWIPED = 0.3;
const ANIMATION_DURATION_RELEASE = 0.1;
const ANIMATION_DURATION_PAUSE_AT_END_POS = 0.7;

const TOTAL_CYCLE_DURATION = 
  ANIMATION_DURATION_WAIT_AT_START_POS +
  ANIMATION_DURATION_PRESS + 
  ANIMATION_DURATION_WAIT_PRESSED + 
  ANIMATION_DURATION_DRAG + 
  ANIMATION_DURATION_WAIT_SWIPED + 
  ANIMATION_DURATION_RELEASE + 
  ANIMATION_DURATION_PAUSE_AT_END_POS;

const DRAG_DISTANCE_X = 2.3; // 15% bigger
const MAX_OPACITY = 0.85;
const FADE_SPEED = 3.0; 
const PRESSED_SCALE_FACTOR = 0.85;

// Use the 3D cursor model from pointer.glb
const CursorModel = forwardRef(({ animatedOpacity, ...props }, ref) => {
  const { nodes, materials } = useGLTF(scene);

  const blackMaterial = useMemo(() => {
    const mat = materials.Black.clone();
    mat.transparent = true;
    mat.opacity = animatedOpacity;
    return mat;
  }, [materials.Black, animatedOpacity]);

  const whiteMaterial = useMemo(() => {
    const mat = materials.White.clone();
    mat.transparent = true;
    mat.opacity = animatedOpacity;
    return mat;
  }, [materials.White, animatedOpacity]);

  return (
    <group ref={ref} {...props} dispose={null}> 
      {/* Apply an overall scale at this root level to drastically reduce size */}
      <group 
        position={[-0.106, -0.137, 0.549]} 
        rotation={[-Math.PI, -0.535, 2.005]} 
        scale={0.1258} // Original scale increased by 15% (0.1094 * 1.15)
      >
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-1, 7.5, 5.5]} scale={0.088}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_4.geometry}
              material={blackMaterial}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_5.geometry}
              material={whiteMaterial}
            />
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload(scene);

export function GestureHint({ visible, ...props }) {
  const cursorRef = useRef();
  const guidelineRef = useRef();
  const [animationTime, setAnimationTime] = useState(0);
  const [currentOpacity, setCurrentOpacity] = useState(0);
  
  const initialDragPositionX = -DRAG_DISTANCE_X/2;
  const baseScale = 1.15; // 15% bigger

  useFrame((state, delta) => {
    const targetOpacity = visible ? MAX_OPACITY : 0;
    if (currentOpacity !== targetOpacity) {
      const newOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, FADE_SPEED * delta);
      setCurrentOpacity(newOpacity);
    }

    // Skip animation if not visible
    if (currentOpacity < 0.001 && !visible) {
      if(cursorRef.current) cursorRef.current.visible = false;
      if(guidelineRef.current) guidelineRef.current.visible = false;
      // Also hide text and its background if applicable
      return;
    }
    
    if(cursorRef.current) cursorRef.current.visible = true;
    if(guidelineRef.current) guidelineRef.current.visible = true;
    if(guidelineRef.current) guidelineRef.current.material.opacity = currentOpacity * 0.3; // Guideline opacity

    if (!cursorRef.current) return;

    let newTime = (animationTime + delta) % TOTAL_CYCLE_DURATION;
    setAnimationTime(newTime);

    // Define animation phase boundaries
    const waitAtStartEndTime = ANIMATION_DURATION_WAIT_AT_START_POS;
    const pressEndTime = waitAtStartEndTime + ANIMATION_DURATION_PRESS;
    const waitPressedEndTime = pressEndTime + ANIMATION_DURATION_WAIT_PRESSED;
    const dragEndTime = waitPressedEndTime + ANIMATION_DURATION_DRAG;
    const waitSwipedEndTime = dragEndTime + ANIMATION_DURATION_WAIT_SWIPED;
    const releaseEndTime = waitSwipedEndTime + ANIMATION_DURATION_RELEASE;

    // Animation phases
    if (newTime < waitAtStartEndTime) {
      // Wait at start
      cursorRef.current.position.x = initialDragPositionX;
      cursorRef.current.scale.set(baseScale, baseScale, baseScale);
      const hoverPhase = (newTime / waitAtStartEndTime) * Math.PI * 2;
      cursorRef.current.position.y = -0.03 + Math.sin(hoverPhase) * 0.01;
    } else if (newTime < pressEndTime) {
      // Press
      cursorRef.current.position.x = initialDragPositionX;
      const pressProgress = (newTime - waitAtStartEndTime) / ANIMATION_DURATION_PRESS;
      const currentGUIScale = THREE.MathUtils.lerp(baseScale, PRESSED_SCALE_FACTOR, pressProgress); // Renamed to avoid conflict
      cursorRef.current.scale.set(currentGUIScale, currentGUIScale, currentGUIScale);
      cursorRef.current.position.y = -0.03 - pressProgress * 0.02;
    } else if (newTime < waitPressedEndTime) {
      // Wait pressed
      cursorRef.current.scale.set(PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR);
      cursorRef.current.position.x = initialDragPositionX;
      cursorRef.current.position.y = -0.05;
    } else if (newTime < dragEndTime) {
      // Drag
      cursorRef.current.scale.set(PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR);
      const dragProgress = (newTime - waitPressedEndTime) / ANIMATION_DURATION_DRAG;
      cursorRef.current.position.x = initialDragPositionX + dragProgress * DRAG_DISTANCE_X;
      cursorRef.current.position.y = -0.05;
    } else if (newTime < waitSwipedEndTime) {
      // Wait at end
      cursorRef.current.scale.set(PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR, PRESSED_SCALE_FACTOR);
      cursorRef.current.position.x = initialDragPositionX + DRAG_DISTANCE_X;
      cursorRef.current.position.y = -0.05;
    } else if (newTime < releaseEndTime) {
      // Release
      cursorRef.current.position.x = initialDragPositionX + DRAG_DISTANCE_X;
      const releaseProgress = (newTime - waitSwipedEndTime) / ANIMATION_DURATION_RELEASE;
      const currentGUIScale = THREE.MathUtils.lerp(PRESSED_SCALE_FACTOR, baseScale, releaseProgress); // Renamed
      cursorRef.current.scale.set(currentGUIScale, currentGUIScale, currentGUIScale);
      cursorRef.current.position.y = -0.05 + releaseProgress * 0.02;
    } else {
      // Wait at end
      cursorRef.current.scale.set(baseScale, baseScale, baseScale);
      cursorRef.current.position.x = initialDragPositionX + DRAG_DISTANCE_X;
      const hoverPhase = ((newTime - releaseEndTime) / (TOTAL_CYCLE_DURATION - releaseEndTime)) * Math.PI * 2;
      cursorRef.current.position.y = -0.03 + Math.sin(hoverPhase) * 0.01;
    }
  });
  
  return (
    <group {...props} visible={currentOpacity > 0.001}>
      {/* Text and background removed - will be integrated into main header */}
      
      {/* Guideline/rail position stays at -0.05 */}
      <mesh ref={guidelineRef} position={[0, -0.05, -0.02]} rotation={[0, 0, 0]}> {/* Pushed guideline further back */}
        <planeGeometry args={[DRAG_DISTANCE_X + 0.23, 0.0345]} /> {/* 15% bigger */}
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true}
          opacity={currentOpacity * 0.3} // Made guideline more subtle
          depthWrite={false}
        />
      </mesh>
      
      {/* Initial cursor position adjusted to match animation start */}
      <CursorModel 
        ref={cursorRef} 
        animatedOpacity={currentOpacity} 
        position={[initialDragPositionX, -0.03, 0]} 
      />
      
      {/* Arrow stays aligned with guideline */}
      <mesh position={[initialDragPositionX + DRAG_DISTANCE_X + 0.1725, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.0575, 0.115, 16]} /> {/* 15% bigger */}
        <meshBasicMaterial 
          color="#ffffff"
          transparent={true}
          opacity={currentOpacity * 0.7}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default GestureHint; 