"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* Scaled-down book dimensions */
const BW = 1.867;
const BH = 2.533;
const CD = 0.047;
const PD = 0.147;
const SPINE_X = -(BW / 2);

function SpinningBook({ color, speed = 0.5 }: { color: string; speed?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const coverMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.04 }),
    [color]
  );
  const pagesMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f5f0e8", roughness: 0.9, metalness: 0 }),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Front cover */}
      <mesh position={[0, 0, PD / 2 + CD / 2]} material={coverMat}>
        <boxGeometry args={[BW, BH, CD]} />
      </mesh>
      {/* Back cover */}
      <mesh position={[0, 0, -(PD / 2 + CD / 2)]} material={coverMat}>
        <boxGeometry args={[BW, BH, CD]} />
      </mesh>
      {/* Pages block */}
      <mesh position={[0.04, 0, 0]} material={pagesMat}>
        <boxGeometry args={[BW - 0.14, BH - 0.12, PD]} />
      </mesh>
      {/* Spine */}
      <mesh position={[SPINE_X - 0.025, 0, 0]} material={coverMat}>
        <boxGeometry args={[0.05, BH, PD + CD * 2]} />
      </mesh>
    </group>
  );
}

export function BookCover3D({
  color,
  speed,
}: {
  color: string;
  speed?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5.2], fov: 38 }}
      dpr={1}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-3, 1, 3]} intensity={0.4} color="#c8d8f0" />
      <Suspense fallback={null}>
        <SpinningBook color={color} speed={speed} />
      </Suspense>
    </Canvas>
  );
}
