import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { SPAWN_POSITION } from "../constants/navigation";

const CAMERA_OFFSET = new Vector3(0, 10, -10);
const LOOK_AHEAD_OFFSET = new Vector3(0, 7, 12);
const UP_AXIS = new Vector3(0, 1, 0);

const ChaseCamera = ({ bodyRef, getRotationY }) => {
  const { camera } = useThree();
  const camOffset = useRef(new Vector3());
  const lookPoint = useRef(new Vector3());
  const planePos = useRef(new Vector3());

  useEffect(() => {
    planePos.current.set(...SPAWN_POSITION);
    camOffset.current.copy(CAMERA_OFFSET);
    lookPoint.current.copy(LOOK_AHEAD_OFFSET).add(planePos.current);

    camera.position.set(
      planePos.current.x + CAMERA_OFFSET.x,
      planePos.current.y + CAMERA_OFFSET.y,
      planePos.current.z + CAMERA_OFFSET.z
    );
    camera.lookAt(lookPoint.current);
    camera.updateMatrixWorld();
  }, [camera]);

  useFrame(() => {
    if (!bodyRef.current) return;

    const t = bodyRef.current.translation();
    planePos.current.set(t.x, t.y, t.z);
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
