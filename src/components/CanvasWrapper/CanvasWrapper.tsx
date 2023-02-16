import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from '@react-three/fiber'
import Experience from '@src/components/Experience'
import "./styles.scss";

interface CanvasProps {
  viewRef: React.RefObject<HTMLDivElement>;
}

const CanvasWrapper = ({viewRef}: CanvasProps): JSX.Element => {
  return (
    <div className="canvas-container">
      <Canvas 
        shadows
        gl={{
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
        }}
        camera={ {
            fov: 55,
            near: 0.1,
            far: 200,
            position: [ 1, 7, 25 ],
        } }
      >
        <Suspense>
          <Experience viewRef={viewRef}/>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanvasWrapper;
