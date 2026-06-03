import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import islandScene from "../assets/3d/island.glb";

const StaticIsland = (props) => {
  const { scene } = useGLTF(islandScene);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
};

useGLTF.preload(islandScene);

export default StaticIsland;
