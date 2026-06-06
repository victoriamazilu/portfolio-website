import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DECORATIONS, PLANE_VISUAL_Y_OFFSET } from "../constants/navigation";

const UNLOCK_DURATION = 1.4;
const TRIGGER_DIST = 4.5;

const Hoop = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  color = "#ffdd57",
  unlockable = false,
  bodyRef,
  onUnlock,
  onUnlockStart,
}) => {
  const groupRef = useRef();
  const ringRef = useRef();
  const matRef = useRef();
  const shockRef = useRef();
  const shockMatRef = useRef();
  const phase = useRef("locked"); // locked -> unlocking -> done
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    const ring = ringRef.current;
    if (!ring) return;

    const spinSpeed = phase.current === "unlocking" ? 6 : 0.6;
    ring.rotation.z += delta * spinSpeed;

    if (unlockable && phase.current === "locked" && bodyRef?.current) {
      const p = bodyRef.current.translation();
      // The plane mesh sits PLANE_VISUAL_Y_OFFSET above the rigid body, so
      // compare against where the plane *looks* like it is, not the body.
      const dx = p.x - position[0];
      const dy = p.y + PLANE_VISUAL_Y_OFFSET - position[1];
      const dz = p.z - position[2];
      if (dx * dx + dy * dy + dz * dz < TRIGGER_DIST * TRIGGER_DIST) {
        phase.current = "unlocking";
        elapsed.current = 0;
        onUnlockStart?.();
      }
    }

    if (phase.current === "unlocking") {
      elapsed.current += delta;
      const k = Math.min(elapsed.current / UNLOCK_DURATION, 1);
      const wave = Math.sin(k * Math.PI);

      if (groupRef.current) groupRef.current.scale.setScalar(scale * (1 + wave * 0.55));
      if (matRef.current) matRef.current.emissiveIntensity = 0.85 + wave * 3.5;

      if (shockRef.current && shockMatRef.current) {
        shockRef.current.scale.setScalar(1 + k * 2.4);
        shockMatRef.current.opacity = (1 - k) * 0.9;
      }

      if (k >= 1) {
        phase.current = "done";
        if (groupRef.current) groupRef.current.scale.setScalar(scale);
        if (matRef.current) matRef.current.emissiveIntensity = 1.8;
        if (shockMatRef.current) shockMatRef.current.opacity = 0;
        onUnlock?.();
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.2, 0.22, 16, 40]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>

      {unlockable && (
        <mesh ref={shockRef}>
          <torusGeometry args={[2.2, 0.08, 16, 48]} />
          <meshBasicMaterial
            ref={shockMatRef}
            color={color}
            transparent
            opacity={0}
          />
        </mesh>
      )}
    </group>
  );
};

const Cloud = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    {[
      [0, 0, 0, 1],
      [1.1, -0.1, 0.2, 0.8],
      [-1.0, -0.05, -0.2, 0.75],
      [0.5, 0.4, -0.1, 0.7],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[r, 14, 14]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#dfeeff"
          emissiveIntensity={0.25}
          roughness={1}
        />
      </mesh>
    ))}
  </group>
);

const Decorations = ({
  bodyRef,
  onExperienceUnlock,
  onExperienceUnlockStart,
  onProjectsUnlock,
  onProjectsUnlockStart,
}) => {
  const unlockHandlers = [
    { onUnlock: onExperienceUnlock, onUnlockStart: onExperienceUnlockStart },
    { onUnlock: onProjectsUnlock, onUnlockStart: onProjectsUnlockStart },
  ];

  return (
  <group>
    {DECORATIONS.hoops.map((h, i) => (
      <Hoop
        key={`hoop-${i}`}
        {...h}
        unlockable={i < unlockHandlers.length}
        bodyRef={i < unlockHandlers.length ? bodyRef : undefined}
        onUnlock={unlockHandlers[i]?.onUnlock}
        onUnlockStart={unlockHandlers[i]?.onUnlockStart}
      />
    ))}
    {DECORATIONS.clouds.map((c, i) => (
      <Cloud key={`cloud-${i}`} {...c} />
    ))}
  </group>
  );
};

export default Decorations;
