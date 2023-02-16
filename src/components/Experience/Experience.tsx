import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Perf } from "r3f-perf";
import Congress from "@src/models/Congress";
import { PresentationControls } from "@react-three/drei";
import Flag from "@src/models/Flag";
import Camera from "@src/models/Camera";
import Lights from "@src/models/Lights";
import Text from "@src/models/Text";
import "./styles.scss";

interface CanvasProps {
  viewRef: React.RefObject<HTMLDivElement>;
}

const Experience = ({ viewRef }: CanvasProps): JSX.Element => {
  const flagRef = useRef<any>(null);

  return (
    <>
      <Perf />

      <Camera viewRef={viewRef} />
      <Lights targetRef={flagRef} />

      <Suspense>{/* <MoneyBlocks /> */}</Suspense>
      <Suspense>
        <Text
          text="CIRCLE"
          position={[0.8, 0.8, 1]}
          rotation={[0, Math.PI, 0]}
          scale={0.7}
        />
      </Suspense>
      <Suspense>
        <Text
          text="LINE"
          position={[-2, 0.12, -2]}
          rotation={[0, -Math.PI, 0]}
          scale={0.7}
        />
      </Suspense>
      <Suspense>
        <Text
          text="SQUARE"
          position={[-4.5, 0.8, -1]}
          rotation={[0, -Math.PI, 0]}
          scale={0.7}
        />
      </Suspense>
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[0, Math.PI / 2]} // Vertical limits
        azimuth={[-Infinity, Infinity]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
      >
        <Suspense>
          <Flag flagRef={flagRef} />
        </Suspense>
        <Suspense>
          <Congress />
        </Suspense>
      </PresentationControls>
    </>
  );
};

export default Experience;
