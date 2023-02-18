import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  viewRef: React.RefObject<HTMLDivElement>;
}

export default function Camera({ viewRef }: Props): JSX.Element {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const followMouse = (camera: any, x: number, y: number) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x * 0.9, x, 0.01
    ) - 1;
    camera.position.y = Math.max(
      THREE.MathUtils.lerp(camera.position.y * 0.2, y, 0.1),
      1
    ) + 2;
    camera.lookAt(-2, 3, 0);
    camera.updateProjectionMatrix();
  };

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    });

    return () => {
      window.removeEventListener("mousemove", () => {});
    };
  }, []);

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();

    const offsetWidth = viewRef?.current?.offsetWidth || 0;
    const offsetHeight = viewRef?.current?.offsetHeight || 0;

    const correctMouseX = mouse.x - offsetWidth / 2;
    const correctMouseY = mouse.y - offsetHeight / 2;

    const x = correctMouseX * 0.02;
    const y = correctMouseY * 0.02;

    // followMouse(camera, x, y);
  });

  return <></>;
}
