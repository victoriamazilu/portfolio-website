import { useRef, useEffect, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const VALID_KEYS = [
  "w",
  "s",
  "a",
  "d",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
];

const useIslandControls = ({
  isRotating,
  setIsRotating,
  setCurrentStage,
  setRotationSpeed,
  onFirstInteraction,
  setPlaneVerticalOffset,
  setPlaneCameraDepth,
}) => {
  const islandRef = useRef();
  const { gl, viewport } = useThree();

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;

  const [keysPressed, setKeysPressed] = useState(new Set());
  const keyboardRotationSpeed = useRef(0);
  const keyboardVerticalSpeed = useRef(0);
  const keyboardCameraDepthSpeed = useRef(0);
  const planeVerticalOffset = useRef(0);
  const planeCameraDepth = useRef(0);
  const maxVerticalOffset = 1.75;
  const maxCameraDepth = 3.5;

  const handlePointerDown = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setIsRotating(true);
      if (onFirstInteraction) onFirstInteraction();

      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      lastX.current = clientX;
    },
    [onFirstInteraction, setIsRotating]
  );

  const handlePointerUp = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      setIsRotating(false);
    },
    [setIsRotating]
  );

  const handlePointerMove = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (isRotating && islandRef.current) {
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const delta = (clientX - lastX.current) / viewport.width;

        islandRef.current.rotation.y += delta * 0.01 * Math.PI;
        lastX.current = clientX;
        rotationSpeed.current = delta * 0.01 * Math.PI;
        setRotationSpeed(rotationSpeed.current);
      }
    },
    [isRotating, setRotationSpeed, viewport.width]
  );

  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key.toLowerCase();

      if (VALID_KEYS.includes(key)) {
        event.preventDefault();
        if (onFirstInteraction) onFirstInteraction();

        setKeysPressed((prev) => {
          const newSet = new Set(prev);
          newSet.add(key);
          return newSet;
        });

        if (!isRotating) setIsRotating(true);
      }
    },
    [isRotating, onFirstInteraction, setIsRotating]
  );

  const handleKeyUp = useCallback(
    (event) => {
      const key = event.key.toLowerCase();

      if (VALID_KEYS.includes(key)) {
        event.preventDefault();

        setKeysPressed((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          if (newSet.size === 0) setIsRotating(false);
          return newSet;
        });
      }
    },
    [setIsRotating]
  );

  useFrame(() => {
    if (!islandRef.current) return;

    const forwardSpeed = 0.006;
    const verticalSpeed = 0.02;
    const cameraDepthSpeed = 0.05;
    const keyboardDampingFactor = 0.92;

    const hasForward = keysPressed.has("w") || keysPressed.has("arrowup");
    const hasVertical = keysPressed.has("s") || keysPressed.has("arrowdown");
    const hasLeftRight =
      keysPressed.has("a") ||
      keysPressed.has("arrowleft") ||
      keysPressed.has("d") ||
      keysPressed.has("arrowright");

    if (keysPressed.has("w") || keysPressed.has("arrowup")) {
      keyboardRotationSpeed.current += forwardSpeed * 0.25;
      keyboardVerticalSpeed.current += verticalSpeed * 0.3;
    }

    if (keysPressed.has("s") || keysPressed.has("arrowdown")) {
      keyboardVerticalSpeed.current -= verticalSpeed * 0.3;
      keyboardRotationSpeed.current += forwardSpeed * 0.15;
    }

    if (keysPressed.has("a") || keysPressed.has("arrowleft")) {
      keyboardCameraDepthSpeed.current += cameraDepthSpeed * 0.3;
      keyboardRotationSpeed.current += forwardSpeed * 0.15;
    }
    if (keysPressed.has("d") || keysPressed.has("arrowright")) {
      keyboardCameraDepthSpeed.current -= cameraDepthSpeed * 0.3;
      keyboardRotationSpeed.current += forwardSpeed * 0.15;
    }

    if (!hasForward) {
      keyboardRotationSpeed.current *= keyboardDampingFactor;
      if (Math.abs(keyboardRotationSpeed.current) < 0.0003) {
        keyboardRotationSpeed.current = 0;
      }
    }

    if (!hasVertical) {
      keyboardVerticalSpeed.current *= keyboardDampingFactor;
      if (Math.abs(keyboardVerticalSpeed.current) < 0.0003) {
        keyboardVerticalSpeed.current = 0;
      }
    }

    if (!hasLeftRight) {
      keyboardCameraDepthSpeed.current *= keyboardDampingFactor;
      if (Math.abs(keyboardCameraDepthSpeed.current) < 0.0003) {
        keyboardCameraDepthSpeed.current = 0;
      }
    }

    const maxRotationSpeed = forwardSpeed * 1.5;
    const maxVerticalSpeed = verticalSpeed * 1.5;
    const maxCameraDepthSpeed = cameraDepthSpeed * 1.5;
    keyboardRotationSpeed.current = Math.max(
      -maxRotationSpeed,
      Math.min(maxRotationSpeed, keyboardRotationSpeed.current)
    );
    keyboardVerticalSpeed.current = Math.max(
      -maxVerticalSpeed,
      Math.min(maxVerticalSpeed, keyboardVerticalSpeed.current)
    );
    keyboardCameraDepthSpeed.current = Math.max(
      -maxCameraDepthSpeed,
      Math.min(maxCameraDepthSpeed, keyboardCameraDepthSpeed.current)
    );

    if (Math.abs(keyboardRotationSpeed.current) > 0.0003) {
      islandRef.current.rotation.y += keyboardRotationSpeed.current;
      setRotationSpeed(keyboardRotationSpeed.current);
    }

    if (Math.abs(keyboardVerticalSpeed.current) > 0.0003) {
      const newVerticalOffset =
        planeVerticalOffset.current + keyboardVerticalSpeed.current;
      planeVerticalOffset.current = Math.max(
        -maxVerticalOffset,
        Math.min(maxVerticalOffset, newVerticalOffset)
      );
      setPlaneVerticalOffset?.(planeVerticalOffset.current);
    }

    if (Math.abs(keyboardCameraDepthSpeed.current) > 0.0003) {
      const newDepth = planeCameraDepth.current + keyboardCameraDepthSpeed.current;
      planeCameraDepth.current = Math.max(
        -maxCameraDepth,
        Math.min(maxCameraDepth, newDepth)
      );
      setPlaneCameraDepth?.(planeCameraDepth.current);
    }

    const hasAnyInput = hasForward || hasVertical || hasLeftRight;

    if (!isRotating || !hasAnyInput) {
      rotationSpeed.current *= dampingFactor;

      if (!hasVertical && Math.abs(keyboardVerticalSpeed.current) < 0.001) {
        const targetVertical = 0;
        const verticalDampingFactor = 0.992;
        planeVerticalOffset.current =
          planeVerticalOffset.current * verticalDampingFactor +
          targetVertical * (1 - verticalDampingFactor);

        if (Math.abs(planeVerticalOffset.current - targetVertical) < 0.001) {
          planeVerticalOffset.current = targetVertical;
        }

        setPlaneVerticalOffset?.(planeVerticalOffset.current);
      }

      if (!hasLeftRight && Math.abs(keyboardCameraDepthSpeed.current) < 0.001) {
        const targetDepth = 0;
        const depthDampingFactor = 0.993;
        planeCameraDepth.current =
          planeCameraDepth.current * depthDampingFactor +
          targetDepth * (1 - depthDampingFactor);

        if (Math.abs(planeCameraDepth.current - targetDepth) < 0.001) {
          planeCameraDepth.current = targetDepth;
        }

        setPlaneCameraDepth?.(planeCameraDepth.current);
      }

      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      if (Math.abs(rotationSpeed.current) > 0.001) {
        islandRef.current.rotation.y += rotationSpeed.current;
        setRotationSpeed(rotationSpeed.current);
      }
    }

    const rotation = islandRef.current.rotation.y;
    const normalizedRotation =
      ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    if (normalizedRotation >= 0 && normalizedRotation < Math.PI / 2) {
      setCurrentStage(2);
    } else if (
      normalizedRotation >= Math.PI / 2 &&
      normalizedRotation < Math.PI
    ) {
      setCurrentStage(3);
    } else if (
      normalizedRotation >= Math.PI &&
      normalizedRotation < (3 * Math.PI) / 2
    ) {
      setCurrentStage(4);
    } else if (
      normalizedRotation >= (3 * Math.PI) / 2 &&
      normalizedRotation <= 2 * Math.PI
    ) {
      setCurrentStage(1);
    } else {
      setCurrentStage(null);
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    gl,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleKeyDown,
    handleKeyUp,
  ]);

  return islandRef;
};

export default useIslandControls;
