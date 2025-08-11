import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import HomeInfo from "../components/HomeInfo";
import Island from "../models/Island";
import Sky from "../models/Sky";
import Bird from "../models/Bird";
import Plane from "../models/Plane";
import GestureHint from "../models/GestureHint";

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [showGestureHint, setShowGestureHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const adjustIsland = () => {
    let screenPos, screenScale;
    let rotation = [0, 24.2, 0];

    if (window.innerWidth < 768) {
      screenPos = [0, -30, -40];
      screenScale = [0.04, 0.04, 0.04];
    } else {
      screenPos = [0, -32, -40];
      screenScale = [0.05, 0.05, 0.05];
    }

    return [screenScale, screenPos, rotation];
  };

  const adjustPlane = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.5, 0.5, 0.5];
      screenPosition = [0, -0.8, 0];
    } else {
      screenScale = [1.2, 1.2, 1.2];
      screenPosition = [0, 0, -4];
    }

    return [screenScale, screenPosition];
  };

  const [islandScale, islandPos, islandRot] = adjustIsland();
  const [planeScale, planePos] = adjustPlane();

  useEffect(() => {
    let timer;
    if (!hasInteracted) {
      timer = setTimeout(() => {
        if (!hasInteracted) {
          setShowGestureHint(true);
        }
      }, 2000);
    } else {
      setShowGestureHint(false);
    }

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowGestureHint(false);
    }
  };

  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-20 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      {/* Gesture Hint Footer */}
      {showGestureHint && (
        <div className="absolute bottom-36 left-0 right-0 z-10 flex items-center justify-center">
          <div className="text-sm sm:text-base text-center neo-brutalism-blue py-2 px-6 text-white mx-10 opacity-90">
            <span className="animate-pulse">Click and drag to move the island!</span>
          </div>
        </div>
      )}

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={2} />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={1}
          />

          <Bird />
          <Sky isRotating={isRotating} currentRotationSpeed={rotationSpeed} />
          <Island
            scale={islandScale}
            position={islandPos}
            rotation={islandRot}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            setRotationSpeed={setRotationSpeed}
            onFirstInteraction={handleFirstInteraction}
          />
          <Plane
            scale={planeScale}
            position={planePos}
            isRotating={isRotating}
            rotation={[0, 20, 0]}
            currentRotationSpeed={rotationSpeed}
          />
          <GestureHint 
            visible={showGestureHint} 
            position={[0, -3, -3]}
            // scale={[0.1875, 0.1875, 0.1875]}
            // scale={[2, 2, 2]}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;
