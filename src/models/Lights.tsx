import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface Props {
  targetRef: React.RefObject<HTMLDivElement>;
}

export default function Lights({ targetRef }: Props): JSX.Element {
  const rectAreaLightRef = useRef<any>(null);
  const directionalLightRef = useRef<any>(null);

  useThree(({ gl }) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;

    if (rectAreaLightRef?.current && targetRef?.current) {
      rectAreaLightRef.current.target = targetRef.current;
    }
  });

  return (
    <>
      <directionalLight
        castShadow
        position={[10, 2, 6]}
        intensity={0.2}
        ref={directionalLightRef}
      />
      {
        directionalLightRef.current && (
          <directionalLightHelper args={[directionalLightRef.current, 1]} />
        )
      }
      <rectAreaLight
        ref={rectAreaLightRef}
        position={[-10, 1, -16]}
        rotation={[-Math.PI, -Math.PI * 0.5, 0]}
        width={5}
        height={5}
        intensity={.1}
      />
      <ambientLight intensity={0.05} />
    </>
  );
}
