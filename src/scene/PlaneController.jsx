import { useEffect, useMemo, useRef } from "react";
import { useKeyboardControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { MathUtils, Vector3 } from "three";
import planeScene from "../assets/3d/plane.glb";
import { SPAWN_POSITION } from "../constants/navigation";
import {
  FLIGHT_CONFIG,
  createFlightState,
  stepFlightPhysics,
} from "./flightPhysics";

const PLANE_SCALE_MOBILE = 0.605;
const PLANE_SCALE_DESKTOP = 1.21;
const PLANE_VISUAL_Y_OFFSET = 5;

const PlaneController = ({
  bodyRef,
  headingRef,
  motionRef,
  onFirstMove,
  onFlightChange,
}) => {
  const orientation = useRef();
  const planeRef = useRef();
  const hasMoved = useRef(false);
  const lastReportedSpeed = useRef(-1);

  const flight = useRef(createFlightState(0));
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  const targetVelocity = useRef(new Vector3(0, 0, 0));
  const smoothedHeading = useRef(0);
  const previousHeading = useRef(0);
  const hasSpawned = useRef(false);

  const { scene, animations } = useGLTF(planeScene);
  const model = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, planeRef);
  const [, get] = useKeyboardControls();
  const { viewport } = useThree();
  const planeScale = viewport.width < 768 ? PLANE_SCALE_MOBILE : PLANE_SCALE_DESKTOP;

  useEffect(() => {
    flight.current = createFlightState(0);
    smoothedHeading.current = 0;
    hasSpawned.current = false;
  }, []);

  useFrame((_, delta) => {
    if (!bodyRef.current || !orientation.current || !planeRef.current) {
      return;
    }

    if (!hasSpawned.current) {
      bodyRef.current.setTranslation(
        { x: SPAWN_POSITION[0], y: SPAWN_POSITION[1], z: SPAWN_POSITION[2] },
        true
      );
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      hasSpawned.current = true;
    }

    const input = get();
    const { velocity, attitude, speed, isMoving } = stepFlightPhysics(
      flight.current,
      input,
      delta
    );

    if (isMoving && !hasMoved.current) {
      hasMoved.current = true;
      onFirstMove?.();
    }

    targetVelocity.current.set(velocity.x, velocity.y, velocity.z);
    currentVelocity.current.lerp(targetVelocity.current, FLIGHT_CONFIG.velocitySmoothing);

    bodyRef.current.setLinvel(
      {
        x: currentVelocity.current.x,
        y: currentVelocity.current.y,
        z: currentVelocity.current.z,
      },
      true
    );

    smoothedHeading.current = MathUtils.lerp(
      smoothedHeading.current,
      attitude.yaw,
      FLIGHT_CONFIG.headingSmoothing
    );

    orientation.current.rotation.y = smoothedHeading.current;
    headingRef.current = smoothedHeading.current;

    const actualSpeed = currentVelocity.current.length();
    const yawRate =
      delta > 0
        ? (smoothedHeading.current - previousHeading.current) / delta
        : 0;
    previousHeading.current = smoothedHeading.current;

    if (motionRef) {
      motionRef.current.speed = actualSpeed;
      motionRef.current.yawRate = yawRate;
    }

    planeRef.current.rotation.x = MathUtils.lerp(
      planeRef.current.rotation.x,
      -attitude.pitch,
      0.12
    );
    planeRef.current.rotation.z = MathUtils.lerp(
      planeRef.current.rotation.z,
      attitude.roll,
      0.12
    );

    if (speed > 0.5 && actions["Take 001"]) {
      actions["Take 001"].play();
    } else if (actions["Take 001"]) {
      actions["Take 001"].stop();
    }

    const roundedSpeed = Math.round(speed * 10) / 10;
    if (roundedSpeed !== lastReportedSpeed.current) {
      lastReportedSpeed.current = roundedSpeed;
      onFlightChange?.(roundedSpeed);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={SPAWN_POSITION}
      colliders={false}
      gravityScale={0}
      linearDamping={0.5}
      angularDamping={1}
      name="plane"
    >
      <CapsuleCollider args={[0.5, 0.35]} />

      <group ref={orientation}>
        <group rotation={[0, Math.PI, 0]}>
          <group
            ref={planeRef}
            position={[0, PLANE_VISUAL_Y_OFFSET, 0]}
            scale={planeScale}
          >
            <primitive object={model} />
          </group>
        </group>
      </group>
    </RigidBody>
  );
};

export default PlaneController;

useGLTF.preload(planeScene);
