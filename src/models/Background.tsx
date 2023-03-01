// @ts-nocheck
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
// @ts-ignore
import vertexShader from "@src/glsl/main.vert";
// @ts-ignore
import fragmentShader from "@src/glsl/main.frag";
import * as THREE from "three";

interface BackgroundProps {
  resolution: [number, number];
  mouse: [number, number];
  time: number;
}

function Backgroung(): JSX.Element {
  const meshRef = useRef<THREE.Mesh>();

  const [mouse, setMouse] = useState([0, 0]);
  const resolution = [window.innerWidth, window.innerHeight];

  useEffect(() => {
    const handleResize = () => {
      resolution[0] = window.innerWidth;
      resolution[1] = window.innerHeight;
      // @ts-ignore
      meshRef.current.material.uniforms.resolution.value = resolution;
      // @ts-ignore
      meshRef.current.material.uniforms.resolution.needsUpdate = true;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(({ clock }) => {
    if(!meshRef.current) return;
    // @ts-ignore
    meshRef.current.material.uniforms.u_time.value = clock.elapsedTime;
    // @ts-ignore
    meshRef.current.material.uniforms.mouse.value = mouse;
  });
  // @ts-ignore
  const handleMouseMove = (event) => {
    const x = event.clientX / window.innerWidth;
    const y = 1 - event.clientY / window.innerHeight;
    setMouse([x, y]);
  };

  return (
    // @ts-ignore
    <mesh ref={meshRef}>
      <planeGeometry args={resolution} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          mouse: { value: mouse },
          resolution: { value: resolution },
        }}
        onMouseMove={handleMouseMove}
      />
    </mesh>
  );
};

function CanvasWrapper() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        // zIndex: -1,
      }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <Backgroung />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default CanvasWrapper;
