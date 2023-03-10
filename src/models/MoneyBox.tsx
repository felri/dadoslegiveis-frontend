/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import * as THREE from "three";
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useSpring, a } from "@react-spring/three";
import Text from "@src/models/Text";
import { useI18n } from "react-simple-i18n";
import moneyBoxGlb from "@src/assets/moneyBox.glb?url";
interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Model({ isOpen, setIsOpen }: Props): JSX.Element {
  const { t } = useI18n();
  const groupRef = useRef<any>(null);
  const directionalLightRef = useRef<any>(null);
  const bottomRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  // @ts-ignore
  const { nodes } = useGLTF(moneyBoxGlb);

  const handleBoxClick = () => {
    setIsOpen(!isOpen);
  };

  const spring = useSpring({
    scale: isHovered ? 0.75 : 0.7,
    color: isHovered ? "#fcba03" : "#e6e035",
  });

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  const startRotation = [0, 0, Math.PI];
  const endRotation = [0, 0, Math.PI * 0.2];

  const { rotation } = useSpring({
    from: { rotation: startRotation },
    to: { rotation: isOpen ? endRotation : startRotation },
  });

  useThree(({ gl }) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (directionalLightRef?.current) {
      directionalLightRef.current.target = bottomRef.current;
    }
  });

  return (
    <group position={[-1.1, 5.5, -10]} ref={groupRef}>
      <directionalLight
        castShadow
        position={[2, -6, 26]}
        intensity={0.2}
        ref={directionalLightRef}
      />
      {/* {directionalLightRef.current && (
        <directionalLightHelper args={[directionalLightRef.current, 1]} />
      )} */}
      <Text
        text={t("moneyBox.first")}
        position={[3.5, 0.5, 10.2]}
        size={0.5}
        rotation={[0, 0, 0]}
        hovered={isHovered}
      />
      <Text
        text={t("moneyBox.second")}
        position={[3.5, -0.25, 10.2]}
        size={0.5}
        rotation={[0, 0, 0]}
        hovered={isHovered}
      />

      <a.mesh
        onClick={handleBoxClick}
        geometry={nodes.Cube.geometry}
        position={[2, 0.2, 8.2]}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        scale={spring.scale}
      >
        <Text
          text={"$"}
          position={[0.45, -0.2, 4]}
          size={1.2}
          rotation={[0, 0, 0]}
          hovered={isHovered}
          color={"#00b500"}
        />
        {/* @ts-ignore */}
        <a.meshStandardMaterial color={spring.color} />
      </a.mesh>
      <a.mesh
        ref={bottomRef}
        geometry={nodes.moneyBox.geometry}
        position={[1.83, -0.4, 10.3]}
        scale={spring.scale}
        // @ts-ignore
        rotation={rotation}
      >
        <a.meshStandardMaterial color={spring.color} side={THREE.DoubleSide} />
      </a.mesh>
    </group>
  );
}