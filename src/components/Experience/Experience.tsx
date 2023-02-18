import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Perf } from "r3f-perf";
import Congress from "@src/models/Congress";
import Car from "@src/models/Car";
import Bill from "@src/models/Bill";
import { OrbitControls } from "@react-three/drei";
import Flag from "@src/models/Flag";
import MoneyBox from "@src/models/MoneyBox";
import Camera from "@src/models/Camera";
import Lights from "@src/models/Lights";
import Text from "@src/models/Text";
import { Physics, Debug } from '@react-three/cannon'
import "./styles.scss";

interface CanvasProps {
  viewRef: React.RefObject<HTMLDivElement>;
}

const Experience = ({ viewRef }: CanvasProps): JSX.Element => {
  const flagRef = useRef<any>(null);

  return (
    <>
      {/* <Perf /> */}
      <OrbitControls
        makeDefault
        minDistance={10}
        maxDistance={50}
        dampingFactor={0.1}
        enableDamping
        rotateSpeed={0.3}
        maxPolarAngle={Math.PI * .45}
      />
      <Camera viewRef={viewRef} />
      <Lights targetRef={flagRef} />

      <Suspense>{/* <MoneyBlocks /> */}</Suspense>
      {/* <Suspense>
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
      </Suspense> */}
      <Suspense>
        <Flag flagRef={flagRef} />
      </Suspense>
      <Suspense>
        <Physics>
          <Debug scale={1} />
          <Bill />
          <Bill />
            <Congress />
        </Physics>
      </Suspense>
      <Suspense>
        <Car />
      </Suspense>
    </>
  );
};

export default Experience;
