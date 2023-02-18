/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import * as THREE from "three";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function Model(): JSX.Element {
  const meshRef = useRef<any>(null);
  // @ts-ignore
  const { nodes, animations } = useGLTF("./car.glb");
  const { mixer, clips } = useAnimations(animations);

  const bakedTexture = useTexture("./car-baked.jpg");
  bakedTexture.flipY = false;
  bakedTexture.encoding = THREE.sRGBEncoding;

  const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture,
  });

  useEffect(() => {
    const clipAction = mixer.clipAction(clips[0], meshRef.current);
    clipAction.play();
  }, [animations]);

  return (
    <group position={[1, .1, -.8]}>
      <mesh
        ref={meshRef}
        material={bakedMaterial}
        geometry={nodes.car.geometry}
        position={[2, 0.2, 8.2]}
        scale={1}
      />
    </group>
  );
}

useGLTF.preload("./car.glb");