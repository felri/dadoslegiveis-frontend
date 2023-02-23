import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import vertexShader from "@src/glsl/main.vert";
import fragmentShader from "@src/glsl/main.frag";
import * as THREE from "three";

function Backgroung(): JSX.Element {
  const meshRef = useRef();

  const [mouse, setMouse] = useState([0, 0]);
  const resolution = [window.innerWidth, window.innerHeight];

  useEffect(() => {
    const handleResize = () => {
      resolution[0] = window.innerWidth;
      resolution[1] = window.innerHeight;
      meshRef.current.material.uniforms.resolution.value = resolution;
      meshRef.current.material.uniforms.resolution.needsUpdate = true;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame(({ clock }) => {
    if(!meshRef.current) return;
    meshRef.current.material.uniforms.time.value = clock.elapsedTime;
    meshRef.current.material.uniforms.mouse.value = mouse;
  });

  const handleMouseMove = (event) => {
    const x = event.clientX / window.innerWidth;
    const y = 1 - event.clientY / window.innerHeight;
    setMouse([x, y]);
  };

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={resolution} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
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
        zIndex: -1,
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
