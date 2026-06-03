import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import island2Scene from "../assets/3d/island2.glb";

export const enhanceIsland2Materials = (object) => {
  object.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    const source = child.material;
    if (!source) return;

    const materials = Array.isArray(source) ? source : [source];

    const upgraded = materials.map((mat) => {
      const baseColor = mat.color
        ? mat.color.clone()
        : new THREE.Color("#ffffff");

      baseColor.multiplyScalar(1.12);

      const hsl = { h: 0, s: 0, l: 0 };
      baseColor.getHSL(hsl);
      baseColor.setHSL(hsl.h, Math.min(hsl.s * 1.12, 1), hsl.l);

      if (mat.isMeshLambertMaterial) {
        mat.color.copy(baseColor);
        mat.emissive.set("#000000");
        mat.needsUpdate = true;
        return mat;
      }

      return new THREE.MeshLambertMaterial({
        map: mat.map ?? null,
        color: baseColor,
        transparent: mat.transparent ?? false,
        opacity: mat.opacity ?? 1,
        alphaMap: mat.alphaMap ?? null,
        side: mat.side ?? THREE.FrontSide,
        emissive: new THREE.Color("#000000"),
      });
    });

    child.material = Array.isArray(source) ? upgraded : upgraded[0];
  });
};

const StaticIsland2 = (props) => {
  const { scene } = useGLTF(island2Scene);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    enhanceIsland2Materials(clone);
    return clone;
  }, [scene]);

  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
};

useGLTF.preload(island2Scene);

export default StaticIsland2;
