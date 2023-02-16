import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  flagRef: React.RefObject<THREE.Mesh>;
}

export default function Flag({ flagRef }: Props): JSX.Element {
  const flagTexture = useRef(
    new THREE.TextureLoader().load("./flag.jpg")
  ).current;

  const waveFlag = (elapsedTime: number) => {
    if (!flagRef.current) return;
    // @ts-ignore
    const arrays = flagRef.current.geometry.attributes.position.array;

    for (let i = 0; i < arrays.length; i += 3) {
      const x = arrays[i];
      const y = arrays[i + 1];
      const z = arrays[i + 2];

      const waveX1 = Math.cos(elapsedTime * 2 + x * 4) / 4;
      const waveX2 = Math.cos(elapsedTime * 3 + x * 2) / 8;
      const waveY1 = Math.cos(elapsedTime + y * 2) / 4;
      const waveY2 = Math.cos(elapsedTime + y) / 2;
      const multiplier = (x - 1) / 3;

      arrays[i + 2] = (waveX1 + waveX2 + waveY1 + waveY2) * multiplier;
    }

    flagRef.current.geometry.attributes.position.needsUpdate = true;
  };

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    waveFlag(time);
  });

  return (
    <group position={[6.5, .5, 15.3]} scale={.6} >
      <mesh position={[-3, 1.5, -10]} rotation={[0, -Math.PI * 0.2, Math.PI]}>
        <boxGeometry args={[0.04, 5, 0.04]} />
        <meshStandardMaterial />
      </mesh>
      <mesh
        position={[-2.2, 3.5, -10.55]}
        rotation={[0, -Math.PI * 0.8, 0]}
        ref={flagRef}
      >
        <planeGeometry args={[2, 1, 50, 30]} />
        <meshStandardMaterial
          map={flagTexture}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}
