"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

import {
  createFrontCoverTexture,
  createBackCoverTexture,
  createInsideCoverTexture,
  createPageSpreadTexture,
  createPageEdgeTexture,
  createSpineTexture,
} from "./createBookTextures";
import copy from "@content/copy.json";

export type BookSceneProps = {
  coverAngle: MotionValue<number>;
  bookRotY: MotionValue<number>;
  /** 1 = auto-spin, 0 = pinned to bookRotY target */
  spinning: MotionValue<number>;
};

export function BookScene({ coverAngle, bookRotY, spinning }: BookSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 40 }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#fdf8f5", "#e8e0d8", 0.65]} />
      <directionalLight position={[5, 8, 5]} intensity={1.6} />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color="#c8d8f0" />
      <directionalLight position={[0, 1, 7]} intensity={0.8} />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.28}
        scale={6}
        blur={2.2}
        far={3}
        color="#000000"
      />

      <Suspense fallback={null}>
        <BookModel coverAngle={coverAngle} bookRotY={bookRotY} spinning={spinning} />
      </Suspense>
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/* Book dimensions (in world units)                                            */
/* -------------------------------------------------------------------------- */

const BW = 1.867;  // book width  (was 2.8 / 1.5)
const BH = 2.533;  // book height (was 3.8 / 1.5)
const COVER_D = 0.047;  // cover thickness
const PAGES_D = 0.147;  // pages block thickness
const SPINE_X = -(BW / 2); // x position of spine centre

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

function BookModel({ coverAngle, bookRotY, spinning }: BookSceneProps) {
  const bookGroupRef = useRef<THREE.Group>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const autoRotAccum = useRef(0);
  const lastTimeRef = useRef(0);
  const wasSpinningRef = useRef(true);
  const { size } = useThree();

  // Build textures once (browser only — Canvas API)
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

  const spineMat = useMemo(() => texMat(textures.spine, 0.6), [textures.spine]);

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
    const dt = t - lastTimeRef.current;
    lastTimeRef.current = t;

    // Idle Y float on tilt group
    const floatY = Math.sin(t * 0.75) * 0.07;
    tilt.position.y = THREE.MathUtils.lerp(tilt.position.y, floatY, 0.06);

    // Mouse parallax tilt (subtle)
    const targetRotY = mouseRef.current.x * 0.14;
    const targetRotX = -mouseRef.current.y * 0.09;
    tilt.rotation.y = THREE.MathUtils.lerp(tilt.rotation.y, targetRotY, 0.04);
    tilt.rotation.x = THREE.MathUtils.lerp(tilt.rotation.x, targetRotX, 0.04);

    // Auto-spin vs pinned
    const isSpinning = spinning.get() > 0.5;
    if (!wasSpinningRef.current && isSpinning) {
      // Resuming spin: sync accumulator so the book continues from its current angle
      autoRotAccum.current = bookGrp.rotation.y - bookRotY.get();
    }
    wasSpinningRef.current = isSpinning;

    let targetBookRotY: number;
    if (isSpinning) {
      autoRotAccum.current += dt * 0.38;
      targetBookRotY = autoRotAccum.current + bookRotY.get();
    } else {
      targetBookRotY = bookRotY.get();
    }
    bookGrp.rotation.y = THREE.MathUtils.lerp(bookGrp.rotation.y, targetBookRotY, 0.04);

    // Cover angle
    pivot.rotation.y = THREE.MathUtils.lerp(pivot.rotation.y, coverAngle.get(), 0.1);
  });

  return (
    <group position={[0, 0.4, 0]}>
    {/* tiltGroup: handles float + mouse parallax */}
    <group ref={tiltGroupRef} rotation={[0, 0, 0]}>
      {/* bookGroup: handles the full Y-axis flip to show back cover */}
      <group ref={bookGroupRef}>
        {/* Back cover (fixed, forms the base) */}
        <mesh
          position={[0, 0, -(PAGES_D / 2 + COVER_D / 2)]}
          material={backCoverMats}
        >
          <boxGeometry args={[BW, BH, COVER_D]} />
        </mesh>

        {/* Pages block */}
        <mesh
          position={[0.04, 0, 0]}
          material={pagesMats}
        >
          <boxGeometry args={[BW - 0.14, BH - 0.12, PAGES_D]} />
        </mesh>

        {/* Spine strip */}
        <mesh
          position={[SPINE_X - 0.025, 0, 0]}
          material={spineMat}
        >
          <boxGeometry args={[0.05, BH, PAGES_D + COVER_D * 2]} />
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
            material={frontCoverMats}
          >
            <boxGeometry args={[BW, BH, COVER_D]} />
          </mesh>
        </group>

      </group>
    </group>
    </group>
  );
}
