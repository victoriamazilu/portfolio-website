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

  // useFrame(({clock, camera}) => {
  //   //In order for the motion to look like a bird, opposed to a straight line, alter its motion like the sine function
  //   birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.5 + 2;
    
  //   //If bird has exited the camera
  //   if(birdRef.current.position.x > camera.position.x + 10){ 
  //     //Change direction by PI
  //     birdRef.current.rotation.y = Math.PI;
  //   } else if(birdRef.current.position.x < camera.position.x){
  //     //Change direction to forward (reset)
  //     birdRef.current.rotation.y = 0;
  //   }
  
  //   //Updating x and z positions
  //   if(birdRef.current.rotation.y === 0){
  //     //Moving forward
  //     birdRef.current.position.x += 0.01;
  //     birdRef.current.position.z -= 0.005;
  //   } else{
  //     //Moving backward
  //     birdRef.current.position.x -= 0.01;
  //     birdRef.current.position.z += 0.005;
  //   }
  // })

  useFrame(({ clock, camera }) => {
    const radius = 9; // Radius for flight path
    const speed = 0.25; // Movement speed
    const angle = clock.getElapsedTime() * speed;
    const depthOffset = -15; // Center the circle deeper in the screen
    const normalizedZPos = (birdRef.current.position.z - camera.position.z) / depthOffset;

    // Update x and z for circular motion
    birdRef.current.position.x = camera.position.x + Math.cos(angle) * radius;
    birdRef.current.position.z = camera.position.z + Math.sin(angle) * radius + depthOffset;

    // Adjust height based on z position (higher when further from screen)
    const verticalVariation = 5; // Adjust this value for more or less vertical movement
    birdRef.current.position.y = 1 + (Math.cos(clock.getElapsedTime()) * 0.5 ) + (normalizedZPos * verticalVariation);

    // Rotate the bird to face direction of motion
    birdRef.current.rotation.y = -angle + Math.PI;
});



  return (
    <mesh ref={birdRef} position={[0, 2, 0]} scale={[0.75, 0.75, 0.75]}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Bird