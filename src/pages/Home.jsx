import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader";
import ContactModal from "../components/ContactModal";
import ExperienceModal from "../components/ExperienceModal";
import ProjectsModal from "../components/ProjectsModal";
import InstructionsModal from "../components/InstructionsModal";
import MovementInstructions from "../components/MovementInstructions";
import TouchControls from "../components/TouchControls";
import FlightWorld from "../scene/FlightWorld";
import useIsMobile from "../hooks/useIsMobile";
import { keyboardMap, INITIAL_CAMERA_POSITION } from "../constants/navigation";

const Home = () => {
  const [showGestureHint, setShowGestureHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [flightFrozen, setFlightFrozen] = useState(false);
  const [assistEnabled, setAssistEnabled] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const isMobile = useIsMobile();
  const desktopControlsLocked = !isMobile && !hasStarted;

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowInstructions(true);
  };

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
    <section className="w-full relative" style={{ height: "100dvh" }}>
      <div
        className={`absolute bottom-6 right-6 z-20 ${
          introComplete && !isMobile ? "" : "hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => setAssistEnabled((v) => !v)}
          aria-pressed={assistEnabled}
          className="hud-chip"
        >
          <span>Flight assist</span>
          <span className={`hud-state${assistEnabled ? " is-on" : ""}`}>
            {assistEnabled ? "On" : "Off"}
          </span>
        </button>
      </div>

      {isMobile && introComplete && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => setAssistEnabled((v) => !v)}
            aria-pressed={assistEnabled}
            className="hud-chip"
          >
            <span>Flight assist</span>
            <span className={`hud-state${assistEnabled ? " is-on" : ""}`}>
              {assistEnabled ? "On" : "Off"}
            </span>
          </button>
        </div>
      )}

      {!isMobile && (
        <MovementInstructions visible={introComplete && showGestureHint} />
      )}

      {!isMobile && introComplete && showGestureHint && (
        <div className="absolute bottom-24 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-sm text-center neo-brutalism-blue py-2 px-6 text-white mx-10 opacity-90 animate-pulse">
            Press W to fly forward — follow the dotted ring around the island
          </div>
        </div>
      )}

      <KeyboardControls map={keyboardMap}>
        <Canvas
          className="w-full h-full bg-transparent"
          style={{ touchAction: "none" }}
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          camera={{
            fov: isMobile ? 62 : 55,
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
              flightFrozen={flightFrozen || desktopControlsLocked}
              onExperienceUnlockStart={() => setFlightFrozen(true)}
              onExperienceUnlock={() => setIsExperienceOpen(true)}
              onProjectsUnlockStart={() => setFlightFrozen(true)}
              onProjectsUnlock={() => setIsProjectsOpen(true)}
              onIntroComplete={handleIntroComplete}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {isMobile &&
        introComplete &&
        !showInstructions &&
        !isExperienceOpen &&
        !isProjectsOpen &&
        !isContactModalOpen && <TouchControls />}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <ExperienceModal
        isOpen={isExperienceOpen}
        onClose={() => {
          setIsExperienceOpen(false);
          setFlightFrozen(false);
        }}
      />

      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => {
          setIsProjectsOpen(false);
          setFlightFrozen(false);
        }}
      />

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => {
          setShowInstructions(false);
          setHasStarted(true);
        }}
        assistEnabled={assistEnabled}
        onAssistChange={setAssistEnabled}
        isMobile={isMobile}
      />
    </section>
  );
};

export default Home;
