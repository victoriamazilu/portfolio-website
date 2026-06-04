import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import ContactModal from "../components/ContactModal";
import MovementInstructions from "../components/MovementInstructions";
import FlightWorld from "../scene/FlightWorld";
import { keyboardMap, INITIAL_CAMERA_POSITION } from "../constants/navigation";

const Home = () => {
  const [showGestureHint, setShowGestureHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [assistEnabled, setAssistEnabled] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isContactModalOpen) return;
      if (e.key === " " || e.key === "Shift") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContactModalOpen]);

  const handleFirstMove = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowGestureHint(false);
    }
  };

  return (
    <section className="w-full h-screen relative">
      <div className="absolute top-24 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center neo-brutalism-blue py-3 px-8 text-white mx-6 max-w-lg">
          <p className="text-sm lg:text-lg font-semibold">Hi, I'm Victoria! 👋</p>
          <p className="text-xs lg:text-sm mt-1 opacity-90">
            Fly to the islands — Experience & Projects coming soon as destinations.
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20">
        <button
          type="button"
          onClick={() => setAssistEnabled((v) => !v)}
          aria-pressed={assistEnabled}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-white/60 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          <span>Flight assist</span>
          <span
            className={`relative w-9 h-5 rounded-full transition-colors ${
              assistEnabled ? "bg-blue-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                assistEnabled ? "translate-x-4" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <MovementInstructions visible={showGestureHint} />

      {showGestureHint && (
        <div className="absolute bottom-24 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-sm text-center neo-brutalism-blue py-2 px-6 text-white mx-10 opacity-90 animate-pulse">
            Press W to fly forward — follow the dotted ring around the island
          </div>
        </div>
      )}

      <KeyboardControls map={keyboardMap}>
        <Canvas
          className="w-full h-screen bg-transparent"
          shadows
          camera={{
            fov: 55,
            near: 0.1,
            far: 2000,
            position: INITIAL_CAMERA_POSITION,
          }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.35;
          }}
        >
          <Suspense fallback={<Loader />}>
            <FlightWorld
              onFirstMove={handleFirstMove}
              assistEnabled={assistEnabled}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};

export default Home;
