import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import skyScene from "../assets/3d/sky.glb";

const SKY_SPEED_SCALE = 0.022;
const YAW_INFLUENCE = 0.18;
const SMOOTHING = 0.06;
const COAST_DAMPING = 0.985;

const Sky = ({ motionRef }) => {
  const sky = useGLTF(skyScene);
  const skyRef = useRef();
  const rotationSpeed = useRef(0);

  useFrame((_, delta) => {
    if (!skyRef.current) return;

    const motion = motionRef?.current ?? { speed: 0, yawRate: 0 };
    const targetSpeed =
      motion.speed * SKY_SPEED_SCALE +
      Math.abs(motion.yawRate) * YAW_INFLUENCE;

    rotationSpeed.current = MathUtils.lerp(
      rotationSpeed.current,
      targetSpeed,
      SMOOTHING
    );

    if (targetSpeed < 0.001) {
      rotationSpeed.current *= COAST_DAMPING;
    }

    if (Math.abs(rotationSpeed.current) > 0.0001) {
      skyRef.current.rotation.y -= rotationSpeed.current * delta;
    }
  });

  return (
    <mesh ref={skyRef}>
      <primitive object={sky.scene} />
    </mesh>
  );
};

export default Sky;
