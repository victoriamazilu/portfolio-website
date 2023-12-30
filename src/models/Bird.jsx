import {useRef, useEffect} from 'react'
import { useFrame } from "@react-three/fiber";
import birdScene from '../assets/3d/birds.glb'
import {useAnimations, useGLTF} from '@react-three/drei'

const Bird = () => {
  const {scene, animations} = useGLTF(birdScene);
  const birdRef = useRef();
  const {actions} = useAnimations(animations, birdRef);

  useEffect(() => {
    actions['Scene'].play();
  }, [])

  useFrame(({ clock, camera }) => {
    const radius = 9; //Radius for flight path
    const speed = 0.25;
    const angle = clock.getElapsedTime() * speed;
    const depthOffset = -15; //Centre the flight path deeper in the screen
    const normalizedZPos = (birdRef.current.position.z - camera.position.z) / depthOffset;

    //Update x and z for circular motion
    birdRef.current.position.x = camera.position.x + Math.cos(angle) * radius;
    birdRef.current.position.z = camera.position.z + Math.sin(angle) * radius + depthOffset;

    //Adjust height based on z position (higher when further from screen)
    const verticalVariation = 5;
    birdRef.current.position.y = 1 + (Math.cos(clock.getElapsedTime()) * 0.5 ) + (normalizedZPos * verticalVariation);

    //Rotate the bird to face direction of motion
    birdRef.current.rotation.y = -angle + Math.PI;
});

  return (
    <mesh ref={birdRef} position={[0, 2, 0]} scale={[0.75, 0.75, 0.75]}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Bird