import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Experience from "@src/components/Experience";
import "./styles.scss";

interface CanvasProps {
  viewRef: React.RefObject<HTMLDivElement>;
}

const ButtonScrollTop = ({ viewRef }: CanvasProps): JSX.Element => {
  const [showButton, setShowButton] = React.useState(false);
  const handleScroll = () => {
    if (window.scrollY > 800) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    viewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`scroll-top-button  ${showButton ? "show" : ""}`}
      onClick={handleClick}
    >
      <span>^</span>
    </div>
  );
};

const CanvasWrapper = ({ viewRef }: CanvasProps): JSX.Element => {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  return (
    <div className="canvas-container">
      {isMobile && <ButtonScrollTop viewRef={viewRef} />}
      <Suspense>
        <Canvas
          shadows
          gl={{
            antialias: true,
            outputEncoding: THREE.sRGBEncoding,
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [7, 12, 25],
          }}
        >
          <Experience viewRef={viewRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default CanvasWrapper;
