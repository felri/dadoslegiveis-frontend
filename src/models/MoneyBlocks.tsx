import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

export default function MoneyBlocks(): JSX.Element {
  // const moneyGroupRef = useRef<any>(null);
  // const modelBill = useGLTF("./BILL.glb");

  // useFrame(({ clock }) => {
  //   const time = clock.getElapsedTime();

  //   moneyGroupRef.current.rotation.y = time * 0.05;
  //   for (let i = 0; i < moneyGroupRef.current.children.length; i++) {
  //     const child = moneyGroupRef.current.children[i];
  //     // rotate children randomly
  //     child.rotation.x = (Math.sin(time) + i) * 0.3;
  //     child.rotation.y = (Math.cos(time) + i) * 0.3;
  //     child.rotation.z = (Math.sin(time) + i) * 0.3;
  //   }
  // });

  // const moneyBlocks = useMemo(() => {
  //   return (
  //     <group ref={moneyGroupRef}>
  //       {[...Array(500)].map((value, index) => (
  //         <mesh
  //           scale={0.3}
  //           key={index}
  //           position={[
  //             (Math.random() - 0.5) * 100,
  //             (Math.random() - 0.5) * 100,
  //             (Math.random() - 0.5) * 100,
  //           ]}
  //         >
  //           <Clone object={modelBill.scene} />
  //         </mesh>
  //       ))}
  //     </group>
  //   );
  // }, []);

  return null
}