import { useEffect, useMemo, useRef } from "react";
import { useKeyboardControls, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import planeScene from "../assets/3d/plane.glb";
import { SPAWN_POSITION } from "../constants/navigation";

const FLIGHT_SPEED = 14;
const VERTICAL_SPEED = 8;
const ROTATION_SPEED = degToRad(1.8);
const TILT_ANGLE = degToRad(8);
const MOVEMENT_SMOOTHING = 0.12;
const ROTATION_SMOOTHING = 0.1;

const PlaneController = ({ bodyRef, headingRef, onFirstMove, onFlightChange }) => {
  const orientation = useRef();
  const planeRef = useRef();
  const hasMoved = useRef(false);
  const lastReportedSpeed = useRef(-1);

  const targetTiltRef = useRef(0);
  const targetVelocity = useRef(new Vector3(0, 0, 0));
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  const heading = useRef(0);

  const { scene, animations } = useGLTF(planeScene);
  const model = useMemo(() => scene.clone(true), [scene]);
  const { actions } = useAnimations(animations, planeRef);
  const [, get] = useKeyboardControls();
  const { viewport } = useThree();
  const planeScale = viewport.width < 768 ? 0.55 : 1.1;

  useEffect(() => {
    heading.current = 0;
  }, []);

  useFrame((_, delta) => {
    if (!bodyRef.current || !orientation.current || !planeRef.current) {
      return;
    }

    let moveX = 0;
    let moveZ = 0;
    let moveY = 0;

    if (get().forward) moveZ = 1;
    if (get().backward) moveZ = -1;
    if (get().leftward) moveX = -1;
    if (get().rightward) moveX = 1;
    if (get().up) moveY = 1;
    if (get().down) moveY = -1;

    const isMovingHorizontally = moveX !== 0 || moveZ !== 0;
    const isMoving = isMovingHorizontally || moveY !== 0;

    if (isMoving && !hasMoved.current) {
      hasMoved.current = true;
      onFirstMove?.();
    }

    if (moveX !== 0) {
      heading.current += moveX * ROTATION_SPEED * 60 * delta;
    }

    if (isMovingHorizontally) {
      const moveAngle = Math.atan2(moveX, moveZ);
      const flightAngle = heading.current + moveAngle;

      targetVelocity.current.x = Math.sin(flightAngle) * FLIGHT_SPEED;
      targetVelocity.current.z = Math.cos(flightAngle) * FLIGHT_SPEED;
    } else {
      targetVelocity.current.x = MathUtils.lerp(targetVelocity.current.x, 0, 0.12);
      targetVelocity.current.z = MathUtils.lerp(targetVelocity.current.z, 0, 0.12);
    }

    targetVelocity.current.y = moveY * VERTICAL_SPEED;
    if (!isMoving) {
      targetVelocity.current.y = MathUtils.lerp(targetVelocity.current.y, 0, 0.12);
    }

    currentVelocity.current.lerp(targetVelocity.current, MOVEMENT_SMOOTHING);

    bodyRef.current.setLinvel(
      {
        x: currentVelocity.current.x,
        y: currentVelocity.current.y,
        z: currentVelocity.current.z,
      },
      true
    );

    orientation.current.rotation.y = MathUtils.lerp(
      orientation.current.rotation.y,
      heading.current,
      ROTATION_SMOOTHING
    );
    headingRef.current = orientation.current.rotation.y;

    targetTiltRef.current = isMovingHorizontally ? TILT_ANGLE : 0;
    planeRef.current.rotation.x = MathUtils.lerp(
      planeRef.current.rotation.x,
      targetTiltRef.current,
      0.1
    );
    planeRef.current.rotation.y = MathUtils.lerp(
      planeRef.current.rotation.y,
      moveX !== 0 ? moveX * 0.35 : 0,
      0.1
    );

    const speed = currentVelocity.current.length();
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
      linearDamping={0.35}
      angularDamping={1}
      name="plane"
    >
      <CapsuleCollider args={[0.5, 0.35]} />

      <group ref={orientation}>
        <group ref={planeRef} scale={planeScale} rotation={[0, Math.PI, 0]}>
          <primitive object={model} />
        </group>
      </group>
    </RigidBody>
  );
};

export default PlaneController;

useGLTF.preload(planeScene);
