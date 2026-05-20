import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import HomeInfo from "../components/HomeInfo";
import ContactModal from "../components/ContactModal";
import Island from "../models/Island";
import Island2 from "../models/Island2";
import Sky from "../models/Sky";
import Bird from "../models/Bird";
import Plane from "../models/Plane";
import GestureHint from "../models/GestureHint";

const Home = () => {
  const [useIsland2, setUseIsland2] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [showGestureHint, setShowGestureHint] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [planeOrbitRadius, setPlaneOrbitRadius] = useState(1.0);
  const [planeVerticalOffset, setPlaneVerticalOffset] = useState(0);
  const [planeCameraDepth, setPlaneCameraDepth] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
  const island2Pos = [islandPos[0], islandPos[1] + 25, islandPos[2]];
  const [planeScale, planePos] = adjustPlane();

  useEffect(() => {
    if (!hasInteracted) {
      setShowGestureHint(true);
    } else {
      setShowGestureHint(false);
    }
  }, [hasInteracted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "i" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = e.target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setUseIsland2((prev) => !prev);
        setPlaneVerticalOffset(0);
        setPlaneCameraDepth(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const switchIsland = (next) => {
    setUseIsland2(next);
    setPlaneVerticalOffset(0);
    setPlaneCameraDepth(0);
  };

  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowGestureHint(false);
    }
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-20 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} onContactClick={handleContactClick} />}
      </div>

      {/* Island toggle */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1.5">
        <div className="flex rounded-lg overflow-hidden shadow-md border border-white/60">
          <button
            type="button"
            onClick={() => switchIsland(false)}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              !useIsland2
                ? "bg-[#2b77e7] text-white"
                : "bg-white/90 text-slate-600 hover:bg-white"
            }`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => switchIsland(true)}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
              useIsland2
                ? "bg-[#2b77e7] text-white"
                : "bg-white/90 text-slate-600 hover:bg-white"
            }`}
          >
            Island 2
          </button>
        </div>
        <span className="text-[10px] text-slate-500 bg-white/70 px-2 py-0.5 rounded self-start">
          Press I to toggle
        </span>
      </div>

      {/* Gesture Hint Footer */}
      {showGestureHint && (
        <div className="absolute bottom-20 left-0 right-0 z-10 flex items-center justify-center">
          <div className="text-sm sm:text-base text-center neo-brutalism-blue py-2 px-6 text-white mx-10 opacity-90 mb-10">
          <span className="animate-pulse">Click and drag or use WASD to move the island!</span>
            <br />
            <span className="text-xs opacity-75">W: Up • S: Down • A: Out • D: In</span>
          </div>
        </div>
      )}

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
        shadows={useIsland2}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = useIsland2 ? 1.35 : 1;
        }}
      >
        <Suspense fallback={<Loader />}>
          {useIsland2 ? (
            <>
              {/* Key — strong, creates depth + shadows */}
              <directionalLight
                castShadow
                position={[45, 70, 35]}
                intensity={3.8}
                color="#fff8f0"
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0003}
                shadow-camera-near={0.5}
                shadow-camera-far={500}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={80}
                shadow-camera-bottom={-80}
              />
              {/* Cool fill — colour without flattening */}
              <directionalLight position={[-40, 25, 20]} intensity={0.9} color="#7eb8ff" />
              {/* Warm accent */}
              <directionalLight position={[20, 15, 40]} intensity={0.5} color="#ffb88a" />
              {/* Back lights — readable when spinning, without flattening */}
              <directionalLight position={[0, 28, -50]} intensity={1.6} color="#9ec8ff" />
              <directionalLight position={[-35, 22, -45]} intensity={0.85} color="#a8d4ff" />
              <directionalLight position={[35, 18, -40]} intensity={0.7} color="#c8b8ff" />
              <ambientLight intensity={0.55} />
              <hemisphereLight
                skyColor="#b1e1ff"
                groundColor="#4a6741"
                intensity={0.85}
              />
            </>
          ) : (
            <>
              <directionalLight position={[1, 1, 1]} intensity={2} />
              <ambientLight intensity={2} />
              <hemisphereLight
                skyColor="#b1e1ff"
                groundColor="#000000"
                intensity={1}
              />
            </>
          )}

          <Bird />
          <Sky isRotating={isRotating} currentRotationSpeed={rotationSpeed} />
          {!useIsland2 && (
            <Island
              scale={islandScale}
              position={islandPos}
              rotation={islandRot}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
              setRotationSpeed={setRotationSpeed}
              onFirstInteraction={handleFirstInteraction}
              setPlaneVerticalOffset={setPlaneVerticalOffset}
              setPlaneCameraDepth={setPlaneCameraDepth}
            />
          )}
          {useIsland2 && (
            <Island2
              scale={islandScale.map((s) => s * 3)}
              position={island2Pos}
              rotation={islandRot}
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              setCurrentStage={setCurrentStage}
              setRotationSpeed={setRotationSpeed}
              onFirstInteraction={handleFirstInteraction}
              setPlaneVerticalOffset={setPlaneVerticalOffset}
              setPlaneCameraDepth={setPlaneCameraDepth}
            />
          )}
          <Plane
            scale={planeScale}
            position={planePos}
            isRotating={isRotating}
            rotation={[0, 20, 0]}
            currentRotationSpeed={rotationSpeed}
            orbitRadius={planeOrbitRadius}
            verticalOffset={planeVerticalOffset}
            cameraDepth={planeCameraDepth}
          />
          <GestureHint 
            visible={showGestureHint} 
            position={[0, -3, -3]}
            // scale={[0.1875, 0.1875, 0.1875]}
            // scale={[2, 2, 2]}
          />
        </Suspense>
      </Canvas>
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </section>
  );
};

export default Home;
