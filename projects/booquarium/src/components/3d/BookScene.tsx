"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

import {
  createFrontCoverTexture,
  createBackCoverTexture,
  createInsideCoverTexture,
  createPageSpreadTexture,
  createPageEdgeTexture,
} from "./createBookTextures";
import copy from "@content/copy.json";

export type BookSceneProps = {
  /** 0 = closed, -Math.PI*0.67 = fully open (120°). Driven by scroll. */
  coverAngle: MotionValue<number>;
  /** 0 = front facing viewer, Math.PI = back cover facing viewer. */
  bookRotY: MotionValue<number>;
};

export function BookScene({ coverAngle, bookRotY }: BookSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      shadows
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Transparent canvas — page bg shows through */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fdf8f5", "#e8e0d8", 0.5]} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 3, 3]} intensity={0.4} color="#ffe2d4" />

      <Suspense fallback={null}>
        <BookModel coverAngle={coverAngle} bookRotY={bookRotY} />
      </Suspense>
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/* Book dimensions (in world units)                                            */
/* -------------------------------------------------------------------------- */

const BW = 2.8;   // book width
const BH = 3.8;   // book height
const COVER_D = 0.07;  // cover thickness
const PAGES_D = 0.22;  // pages block thickness
const SPINE_X = -(BW / 2); // x position of spine centre

/* -------------------------------------------------------------------------- */
/* Material helpers                                                            */
/* -------------------------------------------------------------------------- */

function solidMat(color: string, roughness = 0.7, metalness = 0.02) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function texMat(texture: THREE.Texture, roughness = 0.65) {
  return new THREE.MeshStandardMaterial({ map: texture, roughness, metalness: 0.01 });
}

/**
 * Build a 6-element material array for BoxGeometry.
 * Indices: 0=+X, 1=-X, 2=+Y, 3=-Y, 4=+Z (front face), 5=-Z (back face).
 */
function buildMaterials(
  fallback: THREE.Material,
  overrides: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, THREE.Material>>
): THREE.Material[] {
  return [0, 1, 2, 3, 4, 5].map((i) => overrides[i as 0] ?? fallback);
}

/* -------------------------------------------------------------------------- */

function BookModel({ coverAngle, bookRotY }: BookSceneProps) {
  const bookGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Build textures once (browser only — Canvas API)
  const textures = useMemo(() => {
    const { praise } = copy;
    const firstBlurb = praise.blurbs[0];
    return {
      front: createFrontCoverTexture(),
      back: createBackCoverTexture(
        firstBlurb.quote,
        firstBlurb.source,
        "In Edinburgh, the maps on a dead man's wall lead his estranged daughter " +
          "across the continent he once refused to name."
      ),
      inside: createInsideCoverTexture(),
      pages: createPageSpreadTexture(),
      edge: createPageEdgeTexture(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dispose textures on unmount
  useEffect(() => {
    return () => {
      Object.values(textures).forEach((t) => t.dispose());
    };
  }, [textures]);

  // Global mouse tracking (not just canvas) for a cinematic parallax feel
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  // Materials
  const coverSideMat = useMemo(() => solidMat("#8A1813", 0.65, 0.04), []);
  const pageSideMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: textures.edge,
      roughness: 0.95,
      metalness: 0,
    });
    return m;
  }, [textures.edge]);

  // Front cover — face 4 (+Z) = fantasy cover art, face 5 (-Z) = inside bookplate
  const frontCoverMats = useMemo(
    () =>
      buildMaterials(coverSideMat, {
        4: texMat(textures.front),
        5: texMat(textures.inside),
      }),
    [coverSideMat, textures.front, textures.inside]
  );

  // Back cover — face 5 (-Z, outer back) = blurb, face 4 (+Z, inner) = page-like cream
  const backCoverMats = useMemo(
    () =>
      buildMaterials(coverSideMat, {
        5: texMat(textures.back),
        4: texMat(textures.inside),
      }),
    [coverSideMat, textures.back, textures.inside]
  );

  // Pages block — face 4 (+Z, top visible when open) = spread, others = edge texture
  const pagesMats = useMemo(
    () =>
      buildMaterials(pageSideMat, {
        4: texMat(textures.pages, 0.92),
        5: texMat(textures.pages, 0.92),
      }),
    [pageSideMat, textures.pages]
  );

  useFrame((state) => {
    const tilt = tiltGroupRef.current;
    const bookGrp = bookGroupRef.current;
    const pivot = coverPivotRef.current;
    if (!tilt || !bookGrp || !pivot) return;

    const t = state.clock.getElapsedTime();

    // Idle Y float on tilt group
    const floatY = Math.sin(t * 0.75) * 0.07;
    tilt.position.y = THREE.MathUtils.lerp(tilt.position.y, floatY, 0.06);

    // Mouse parallax tilt (subtle)
    const targetRotY = mouseRef.current.x * 0.14;
    const targetRotX = -mouseRef.current.y * 0.09;
    tilt.rotation.y = THREE.MathUtils.lerp(tilt.rotation.y, targetRotY, 0.04);
    tilt.rotation.x = THREE.MathUtils.lerp(tilt.rotation.x, targetRotX, 0.04);

    // Scroll-driven book Y rotation (front → back cover flip)
    const targetBookRotY = bookRotY.get();
    bookGrp.rotation.y = THREE.MathUtils.lerp(bookGrp.rotation.y, targetBookRotY, 0.08);

    // Scroll-driven cover open angle
    const targetCoverAngle = coverAngle.get();
    pivot.rotation.y = THREE.MathUtils.lerp(pivot.rotation.y, targetCoverAngle, 0.1);
  });

  return (
    // tiltGroup: handles float + mouse parallax
    <group ref={tiltGroupRef} rotation={[0.04, -0.2, 0]}>
      {/* bookGroup: handles the full Y-axis flip to show back cover */}
      <group ref={bookGroupRef}>
        {/* Back cover (fixed, forms the base) */}
        <mesh
          position={[0, 0, -(PAGES_D / 2 + COVER_D / 2)]}
          castShadow
          receiveShadow
          material={backCoverMats}
        >
          <boxGeometry args={[BW, BH, COVER_D]} />
        </mesh>

        {/* Pages block */}
        <mesh
          position={[0.04, 0, 0]}
          castShadow
          receiveShadow
          material={pagesMats}
        >
          <boxGeometry args={[BW - 0.14, BH - 0.12, PAGES_D]} />
        </mesh>

        {/* Spine strip */}
        <mesh
          position={[SPINE_X - 0.025, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.05, BH, PAGES_D + COVER_D * 2]} />
          <meshStandardMaterial color="#6e1410" roughness={0.62} metalness={0.06} />
        </mesh>

        {/* Front cover pivot — rotates around the spine (left edge) */}
        {/*
          The pivot origin is at the spine (SPINE_X, 0, COVER_D/2 above pages top).
          The mesh inside is offset +BW/2 on X so it hangs to the right of the pivot.
        */}
        <group
          ref={coverPivotRef}
          position={[SPINE_X, 0, PAGES_D / 2 + COVER_D / 2]}
        >
          <mesh
            position={[BW / 2, 0, 0]}
            castShadow
            receiveShadow
            material={frontCoverMats}
          >
            <boxGeometry args={[BW, BH, COVER_D]} />
          </mesh>
        </group>

        {/* Ground shadow plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -(BH / 2 + 0.12), 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.1} />
        </mesh>
      </group>
    </group>
  );
}
