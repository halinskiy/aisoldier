"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

import {
  createFrontCoverTexture,
  createBackCoverTexture,
  createInsideCoverTexture,
  createPageSpreadTexture,
  createPageEdgeTexture,
  createSpineTexture,
} from "./createBookTextures";
import { type BookState } from "@/contexts/BookContext";
import copy from "@content/copy.json";

export type BookSceneProps = {
  bookStateRef: MutableRefObject<BookState>;
};

export function BookScene({ bookStateRef }: BookSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7.5], fov: 44 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#fdf8f5", "#e8e0d8", 0.65]} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color="#c8d8f0" />
      <directionalLight position={[0, 1, 7]} intensity={0.8} />

      <Suspense fallback={null}>
        <BookModel bookStateRef={bookStateRef} />
      </Suspense>
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/* Book dimensions (world units)                                               */
/* -------------------------------------------------------------------------- */

const BW = 1.867;
const BH = 2.533;
const COVER_D = 0.047;
const PAGES_D = 0.147;
const SPINE_X = -(BW / 2);

/* -------------------------------------------------------------------------- */
/* Material helpers                                                            */
/* -------------------------------------------------------------------------- */

function solidMat(color: string, roughness = 0.55, metalness = 0.04) {
  return new THREE.MeshPhysicalMaterial({ color, roughness, metalness, clearcoat: 0.2, clearcoatRoughness: 0.4 });
}

function texMat(texture: THREE.Texture, roughness = 0.55) {
  texture.anisotropy = 8;
  return new THREE.MeshPhysicalMaterial({ map: texture, roughness, metalness: 0.02, clearcoat: 0.15, clearcoatRoughness: 0.3 });
}

function buildMaterials(
  fallback: THREE.Material,
  overrides: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, THREE.Material>>,
): THREE.Material[] {
  return [0, 1, 2, 3, 4, 5].map((i) => overrides[i as 0] ?? fallback);
}

/* -------------------------------------------------------------------------- */

function BookModel({ bookStateRef }: BookSceneProps) {
  const bookGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const shadowGroupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const textures = useMemo(() => {
    const { praise } = copy;
    const firstBlurb = praise.blurbs[0];
    return {
      front: createFrontCoverTexture(),
      spine: createSpineTexture(),
      back: createBackCoverTexture(
        firstBlurb.quote,
        firstBlurb.source,
        "In Edinburgh, the maps on a dead man's wall lead his estranged daughter " +
          "across the continent he once refused to name.",
      ),
      inside: createInsideCoverTexture(),
      pages: createPageSpreadTexture(),
      edge: createPageEdgeTexture(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  const coverSideMat = useMemo(() => solidMat("#8A1813", 0.65, 0.04), []);
  const pageSideMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: textures.edge, roughness: 0.95, metalness: 0 }),
    [textures.edge],
  );

  const frontCoverMats = useMemo(
    () => buildMaterials(coverSideMat, { 4: texMat(textures.front), 5: texMat(textures.inside) }),
    [coverSideMat, textures.front, textures.inside],
  );
  const backCoverMats = useMemo(
    () => buildMaterials(coverSideMat, { 5: texMat(textures.back), 4: texMat(textures.inside) }),
    [coverSideMat, textures.back, textures.inside],
  );
  const spineMat = useMemo(() => texMat(textures.spine, 0.6), [textures.spine]);
  const pagesMats = useMemo(
    () => buildMaterials(pageSideMat, { 4: texMat(textures.pages, 0.92), 5: texMat(textures.pages, 0.92) }),
    [pageSideMat, textures.pages],
  );

  const lerp = THREE.MathUtils.lerp;

  useFrame((state) => {
    const s = bookStateRef.current;
    const tilt = tiltGroupRef.current;
    const bookGrp = bookGroupRef.current;
    const pivot = coverPivotRef.current;
    const shadowGrp = shadowGroupRef.current;
    if (!tilt || !bookGrp || !pivot) return;

    const t = state.clock.getElapsedTime();

    // Idle Y float
    tilt.position.y = lerp(tilt.position.y, Math.sin(t * 0.75) * 0.07, 0.06);

    // Mouse parallax tilt
    tilt.rotation.y = lerp(tilt.rotation.y, mouseRef.current.x * 0.14, 0.04);
    tilt.rotation.x = lerp(tilt.rotation.x, -mouseRef.current.y * 0.09, 0.04);

    // Book world position + scale
    bookGrp.position.x = lerp(bookGrp.position.x, s.x, 0.05);
    bookGrp.scale.setScalar(lerp(bookGrp.scale.x, s.scale, 0.05));
    bookGrp.rotation.y = lerp(bookGrp.rotation.y, s.bookRotY, 0.08);

    // Cover open/close
    pivot.rotation.y = lerp(pivot.rotation.y, s.coverAngle, 0.1);

    // Shadow follows book X
    if (shadowGrp) {
      shadowGrp.position.x = lerp(shadowGrp.position.x, s.x, 0.05);
    }
  });

  return (
    <>
      <group position={[0, 0.4, 0]}>
        <group ref={tiltGroupRef}>
          <group ref={bookGroupRef}>
            {/* Back cover */}
            <mesh position={[0, 0, -(PAGES_D / 2 + COVER_D / 2)]} material={backCoverMats}>
              <boxGeometry args={[BW, BH, COVER_D]} />
            </mesh>

            {/* Pages block */}
            <mesh position={[0.04, 0, 0]} material={pagesMats}>
              <boxGeometry args={[BW - 0.14, BH - 0.12, PAGES_D]} />
            </mesh>

            {/* Spine */}
            <mesh position={[SPINE_X - 0.025, 0, 0]} material={spineMat}>
              <boxGeometry args={[0.05, BH, PAGES_D + COVER_D * 2]} />
            </mesh>

            {/* Front cover pivot */}
            <group ref={coverPivotRef} position={[SPINE_X, 0, PAGES_D / 2 + COVER_D / 2]}>
              <mesh position={[BW / 2, 0, 0]} material={frontCoverMats}>
                <boxGeometry args={[BW, BH, COVER_D]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* Contact shadow — follows book X independently */}
      <group ref={shadowGroupRef}>
        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.2}
          scale={8}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </group>
    </>
  );
}
