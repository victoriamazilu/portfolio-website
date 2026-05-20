import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { a } from "@react-spring/three";
import * as THREE from "three";
import island2Scene from "../assets/3d/island2.glb";
import useIslandControls from "../hooks/useIslandControls";

const enhanceMaterials = (object) => {
  object.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    const source = child.material;
    if (!source) return;

    const materials = Array.isArray(source) ? source : [source];

    const upgraded = materials.map((mat) => {
      if (mat.isMeshLambertMaterial) {
        mat.needsUpdate = true;
        return mat;
      }

      return new THREE.MeshLambertMaterial({
        map: mat.map ?? null,
        color: mat.color
          ? mat.color.clone().multiplyScalar(1.2)
          : new THREE.Color("#ffffff"),
        transparent: mat.transparent ?? false,
        opacity: mat.opacity ?? 1,
        alphaMap: mat.alphaMap ?? null,
        side: mat.side ?? THREE.FrontSide,
        emissive: mat.emissive
          ? mat.emissive.clone().multiplyScalar(0.2)
          : new THREE.Color("#445566"),
      });
    });

    child.material = Array.isArray(source) ? upgraded : upgraded[0];
  });
};

const Island2 = ({
  isRotating,
  setIsRotating,
  setCurrentStage,
  setRotationSpeed,
  onFirstInteraction,
  setPlaneVerticalOffset,
  setPlaneCameraDepth,
  ...props
}) => {
  const { scene } = useGLTF(island2Scene);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    enhanceMaterials(clone);
    return clone;
  }, [scene]);

  const islandRef = useIslandControls({
    isRotating,
    setIsRotating,
    setCurrentStage,
    setRotationSpeed,
    onFirstInteraction,
    setPlaneVerticalOffset,
    setPlaneCameraDepth,
  });

  useEffect(() => {
    return () => {
      model.traverse((child) => {
        if (!child.isMesh) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => mat?.dispose?.());
      });
    };
  }, [model]);

  return (
    <a.group ref={islandRef} {...props}>
      <primitive object={model} />
    </a.group>
  );
};

useGLTF.preload(island2Scene);

export default Island2;
