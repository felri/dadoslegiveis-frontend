import React, {
  useEffect,
  useState,
} from "react";
import { useGLTF } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { MapDataObject } from "@src/app/types";
import Text from "@src/models/Text";
import { debounce } from "@src/app/utils";

interface Props {
  groupRef: React.MutableRefObject<any>;
  data: MapDataObject;
  handleClick: (name: string) => void;
}

interface StateProps {
  name: string;
  geometry: any;
  material: any;
  position: number[];
  data: any;
  handleClick: (name: string) => void;
}

const State = ({
  name,
  geometry,
  material,
  position,
  data,
  handleClick,
}: StateProps): JSX.Element => {
  const [hovered, setHovered] = useState(false);
  const scaleNormalized = data.normalized_expense * 30;

  const getTextIncreasedPosition = () => {
    const textPosition = position.map((coord, index) => {
      if (index % 2 === 0) {
        return coord;
      }
      return coord + scaleNormalized * 0.03;
    });
    return textPosition;
  };

  const { emissive } = useSpring({
    emissive: hovered ? "white" : "black",
  });

  const spring = useSpring({
    from: {
      scale: [1, 1, 1],
      color: "green",
      position: position,
    },
    to: {
      scale: [1, scaleNormalized, 1],
      position: getTextIncreasedPosition(),
      color: getExpenseColor(data.normalized_expense),
    },
    config: {
      duration: 2000,
    },
  });

  function getExpenseColor(normalizedExpense: number) {
    // hue ranges from green (120) to red (0)
    let hue = Math.round((1 - normalizedExpense) * 180);
    // saturation and lightness are fixed at 100% and 50%, respectively
    const saturation = 100;
    const lightness = 30;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  return (
    <>
      <a.mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={0.3}
        // @ts-ignore
        position={spring.position}
        rotation={[-Math.PI * 0.5, 0, -Math.PI * 0.01]}
      >
        <Text text={name} size={0.5} />
      </a.mesh>

      <a.mesh
        onClick={() => handleClick(name)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        name={name}
        geometry={geometry}
        material={material}
        // @ts-ignore
        position={position}
        // @ts-ignore
        scale={spring.scale}
      >
        {/* @ts-ignore */}
        <a.meshStandardMaterial
          emissive={emissive}
          emissiveIntensity={.5}
          color={spring.color}
          roughness={1}
          metalness={0}
        />
      </a.mesh>
    </>
  );
};

function Model({ groupRef, data, handleClick }: Props): JSX.Element {
  const [hovered, setHovered] = useState(false);

  // @ts-ignore
  const { nodes } = useGLTF("/map.glb");

  const states = [
    ["AC", [0.4, 0, 1.86]],
    ["AL", [4.69, 0, 1.85]],
    ["AM", [1.18, 0, 1.03]],
    ["AP", [2.77, 0, 0.47]],
    ["BA", [4.1, 0, 2.24]],
    ["CE", [4.35, 0, 1.37]],
    ["DF", [3.32, 0, 2.66]],
    ["ES", [4.19, 0, 3.14]],
    ["GO", [3.12, 0, 2.68]],
    ["MA", [3.64, 0, 1.22]],
    ["MG", [3.63, 0, 3.05]],
    ["MS", [2.45, 0, 3.26]],
    ["MT", [2.27, 0, 2.39]],
    ["PA", [2.86, 0, 0.86]],
    ["PB", [4.67, 0, 1.56]],
    ["PE", [4.52, 0, 1.71]],
    ["PI", [3.93, 0, 1.56]],
    ["PR", [2.92, 0, 3.88]],
    ["RJ", [3.87, 0, 3.55]],
    ["RN", [4.68, 0, 1.43]],
    ["RO", [1.35, 0, 2.01]],
    ["RR", [1.53, 0, 0.35]],
    ["RS", [2.65, 0, 4.63]],
    ["SC", [2.99, 0, 4.21]],
    ["SE", [4.61, 0, 2.03]],
    ["SP", [3.26, 0, 3.56]],
    ["TO", [3.27, 0, 1.87]],
  ];

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  const handleStateClick = debounce((name: string) => {
    handleClick(name);
  }, 100);

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      ref={groupRef}
      dispose={null}
      position={[-2, 2.4, 1]}
      rotation={[Math.PI * 0.5, 0, 0]}
    >
      {states.map((state) => {
        const { geometry, material } = nodes[`BR-${state[0]}`];
        return (
          <State
            handleClick={handleStateClick}
            // @ts-ignore
            key={state[0]}         
            // @ts-ignore
            name={state[0]}
            geometry={geometry}
            material={material}
            // @ts-ignore
            position={state[1]}
            // @ts-ignore
            data={data[state[0]]}
          />
        );
      })}
    </group>
  );
}

export default Model;

useGLTF.preload("/map.glb");
