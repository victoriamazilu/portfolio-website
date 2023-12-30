import {Suspense, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import Loader from '../components/Loader'
import Island from '../models/Island'
import Sky from "../models/Sky"
import Bird from "../models/Bird"
import Plane from "../models/Plane"


const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  const adjustIsland = () => {
    let screenScale= null;
    let screenPos = [0, -30, -40];
    let rotation = [0, 0, 0];

    if(window.innerWidth < 768){
      screenScale = [0.03, 0.03, 0.03];
    } else{
      screenScale = [0.05, 0.05, 0.05];
    }

    return [screenScale, screenPos, rotation];
  } 

  const adjustPlane = () => {
    let screenScale= null;
    let screenPos = null;

    if(window.innerWidth < 768){
      screenScale = [1.3, 1.3, 1.3];
      screenPos = [0, -1, 0];
    } else{
      screenScale = [2.5, 2.5, 2.5];
      screenPos= [0, -5, -5];
    }

    return [screenScale, screenPos];
  } 

  const [islandScale, islandPos, islandRot] = adjustIsland();
  const [planeScale, planePos] = adjustPlane();

  return (
    <section className="w-full h-screen relative">
      {/* <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        popup
      </div> */}

      <Canvas 
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing': 'cursor-grab'}`} camera={{near: 0.1, far: 1000}}>
        <Suspense fallback={<Loader />}>
          <directionalLight postion={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={1}/>
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>
          <pointLight/>

          <Bird />
          <Sky 
            isRotating={isRotating}
          />
          <Island 
            scale={islandScale}
            position={islandPos}
            rotation={islandRot}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          <Plane 
            planeScale = {planeScale}
            planePos = {planePos}
            isRotating = {isRotating}
            rotation = {[0, 20, 0]}
          />
        </Suspense>
      </Canvas>
    </section>
  )
}

export default Home