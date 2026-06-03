import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import {
  SPAWN_POSITION,
  CAMERA_CHASE_OFFSET,
} from "../constants/navigation";

const LOOK_AHEAD_OFFSET = new Vector3(0, 7, 12);
const UP_AXIS = new Vector3(0, 1, 0);
const CAMERA_OFFSET = new Vector3(...CAMERA_CHASE_OFFSET);

const ChaseCamera = ({ bodyRef, getRotationY }) => {
  const { camera } = useThree();
  const camOffset = useRef(new Vector3());
  const lookPoint = useRef(new Vector3());
  const planePos = useRef(new Vector3());
  const logTimer = useRef(0);

  useEffect(() => {
    planePos.current.set(...SPAWN_POSITION);
    lookPoint.current.copy(LOOK_AHEAD_OFFSET).add(planePos.current);

    camera.position.set(
      planePos.current.x + CAMERA_OFFSET.x,
      planePos.current.y + CAMERA_OFFSET.y,
      planePos.current.z + CAMERA_OFFSET.z
    );
    camera.lookAt(lookPoint.current);
    camera.updateMatrixWorld();
  }, [camera]);

  useFrame((_, delta) => {
    if (!bodyRef.current) return;

    const t = bodyRef.current.translation();
    planePos.current.set(t.x, t.y, t.z);

    logTimer.current += delta;
    if (logTimer.current >= 3) {
      logTimer.current = 0;
      const c = camera.position;
      const p = planePos.current;
      const fmt = (v) => `[${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)}]`;
      console.log(`camera ${fmt(c)} | plane ${fmt(p)}`);
    }
    const planeRotY = getRotationY();

    camOffset.current.copy(CAMERA_OFFSET);
    camOffset.current.applyAxisAngle(UP_AXIS, planeRotY);

    camera.position.set(
      planePos.current.x + camOffset.current.x,
      planePos.current.y + camOffset.current.y,
      planePos.current.z + camOffset.current.z
    );

    lookPoint.current.copy(LOOK_AHEAD_OFFSET);
    lookPoint.current.applyAxisAngle(UP_AXIS, planeRotY);
    lookPoint.current.add(planePos.current);

    camera.lookAt(lookPoint.current);
    camera.updateMatrixWorld();
  });

  return null;
};

export default ChaseCamera;
