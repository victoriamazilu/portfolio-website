import { useRef } from "react";
import { Physics } from "@react-three/rapier";
import Sky from "../models/Sky";
import Bird from "../models/Bird";
import StaticIsland from "../models/StaticIsland";
import StaticIsland2 from "../models/StaticIsland2";
import PlaneController from "./PlaneController";
import ChaseCamera from "./ChaseCamera";
import IslandFlightPath from "./IslandFlightPath";
import { ISLANDS, SHOW_ISLAND_2 } from "../constants/navigation";

const WorldLights = () => (
  <>
    <directionalLight
      castShadow
      position={[45, 70, 35]}
      intensity={3.8}
      color="#fff8f0"
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0003}
    />
    <directionalLight position={[-40, 25, 20]} intensity={0.9} color="#7eb8ff" />
    <directionalLight position={[20, 15, 40]} intensity={0.5} color="#ffb88a" />
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
);

const FlightWorld = ({ onFirstMove }) => {
  const bodyRef = useRef();
  const headingRef = useRef(0);
  const motionRef = useRef({ speed: 0, yawRate: 0 });
  const original = ISLANDS.original;
  const island2 = ISLANDS.island2;

  const getRotationY = () => headingRef.current;

  return (
    <>
      <color attach="background" args={["#b1e1ff"]} />

      <WorldLights />
      <Sky motionRef={motionRef} />
      <Bird />

      <StaticIsland
        scale={original.scale}
        position={original.position}
        rotation={original.rotation}
      />

      {SHOW_ISLAND_2 && (
        <StaticIsland2
          scale={island2.scale}
          position={island2.position}
          rotation={island2.rotation}
        />
      )}

      <IslandFlightPath />

      <Physics gravity={[0, 0, 0]}>
        <PlaneController
          bodyRef={bodyRef}
          headingRef={headingRef}
          motionRef={motionRef}
          onFirstMove={onFirstMove}
        />
      </Physics>

      <ChaseCamera bodyRef={bodyRef} getRotationY={getRotationY} />
    </>
  );
};

export default FlightWorld;
