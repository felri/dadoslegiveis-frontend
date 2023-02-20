import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Center, Text3D } from "@react-three/drei";
import { useSpring, animated } from "react-spring";

import * as THREE from "three";

interface Props {
  text: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: number;
  hovered?: boolean;
  color?: string;
}

const AnimatedText = animated(Text3D);

export default function Text({ text, hovered, color, ...props }: Props): JSX.Element {
  const mesh = useRef<any>(null);

  const config = useMemo(
    () => ({
      font: "./helvetiker_regular.typeface.json",
    }),
    []
  );

  const spring = useSpring({
    scale: hovered ? .8 : 0.7,
  });

  return (
    <>
      <mesh
        position={[2, 2, 2]}
        ref={mesh}
      >
        <planeGeometry 
          args={[1, 1]} 
          attach="geometry"
        />
        <meshStandardMaterial
          attach="material"
          transparent
          opacity={0}
        />
      </mesh>

      <AnimatedText
        ref={mesh}
        font={config.font}
        letterSpacing={0.1}
        {...props}
        {...spring}
      >
        {text}
        <meshStandardMaterial
          attach="material"
          color={color || "#fff"}
        />
      </AnimatedText>
    </>
  );
}
