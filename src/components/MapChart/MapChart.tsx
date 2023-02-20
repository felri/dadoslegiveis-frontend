import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import Map from "@src/models/Map";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
import { MapDataObject } from "@src/app/types";
import Loading from "@src/components/Loading";

interface Props {
  data: MapDataObject;
  handleClick: (name: string) => void;
}

function MapChart({ data, handleClick }: Props): JSX.Element {
  const groupRef = useRef();

  return (
    <Suspense>
      <Canvas>
        <OrbitControls
          enablePan={false}
          makeDefault
          dampingFactor={0.1}
          rotateSpeed={0.3}
        />
        <ambientLight intensity={0.2} />
        <pointLight position={[40, 30, 20]} />
        <Map handleClick={handleClick} groupRef={groupRef} data={data} />
      </Canvas>
    </Suspense>
  );
}

export default MapChart;
