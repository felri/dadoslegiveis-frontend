import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Center, Text3D } from "@react-three/drei";
import { useSpring, animated } from "react-spring";

import * as THREE from "three";

interface Props {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const AnimatedText = animated(Text3D);

export default function Text({ text, ...props }: Props): JSX.Element {
  const mesh = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(
    () => ({
      font: "./helvetiker_regular.typeface.json",
    }),
    []
  );

  const spring = useSpring({
    scale: isHovered ? 1 : 0.8,
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (mesh.current) {
      mesh.current.rotation.x = time * 0.2;
      mesh.current.rotation.y = time * 0.2;
    }
  });

  return (
    <>
      <mesh
        // onPointerEnter={() => setIsHovered(true)}
        // onPointerLeave={() => setIsHovered(false)}
        position={[2, 2, 2]}
        ref={mesh}
      >
        <planeGeometry 
          args={[1, 1]} 
          attach="geometry"
        />
        <meshBasicMaterial
          attach="material"
          color="red"
          transparent
          opacity={0}
        />
      </mesh>

      {/* <AnimatedText
        ref={mesh}
        font={config.font}
        letterSpacing={0.1}
        // onPointerEnter={() => setIsHovered(true)}
        // onPointerLeave={() => setIsHovered(false)}
        {...props}
        {...spring}
      >
        {text}
      </AnimatedText> */}
    </>
  );
}
