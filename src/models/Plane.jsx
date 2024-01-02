import {useRef, useEffect} from 'react'
import {useFrame} from '@react-three/fiber'
import planeScene from '../assets/3d/plane.glb'
import {useAnimations, useGLTF} from '@react-three/drei'

const Plane = ({isRotating, ...props}) => {
  const ref = useRef();
  const {scene, animations} = useGLTF(planeScene);
  const {actions} = useAnimations(animations, ref);
  let isAscending = true;
  let originalY;
  let currentY;
let speed = 0.05;
  
  useEffect(() => {
    if(isRotating) {
      actions['Take 001'].play();
    } else {
      actions['Take 001'].stop();
    }
    originalY = ref.current.position.y;
    currentY = originalY;
    }, [actions, isRotating]);

  const origYPO = originalY + 1;
  const origYMO = originalY - 1;
  useFrame(() => {
    if (isRotating) {
      if (isAscending) {
        // Ascend until reaching the threshold
        if (currentY < originalY + 1) {
          currentY += speed;
        } else {
          isAscending = false; // Change direction
        }
      } else {
        // Descend until reaching the lower threshold
        if (currentY > originalY - 1) {
          currentY -= speed;
        } else {
          isAscending = true; // Change direction
        }
      }
      ref.current.position.y = currentY; // Apply the updated position
    } else {
      // Update originalY with the last position when rotation stops
      originalY = currentY;
    }
  });
  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Plane