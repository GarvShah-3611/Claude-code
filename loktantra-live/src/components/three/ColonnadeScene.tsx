"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

const PILLARS = 28;
const RING_RADIUS = 2.05;
const PILLAR_HEIGHT = 2.6;

/**
 * A ring of pillars under a shallow cap — Parliament's circular colonnade
 * abstracted far enough to also read as a broadcast "record" ring.
 *
 * Built from primitives so nothing is downloaded: the pillars are a single
 * instanced mesh (one draw call for all 28), and there is no environment
 * map, no postprocessing and no bloom pass. Lighting does the glossy work.
 */
function Colonnade(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);

  // Positions are computed once; the matrix never changes after mount.
  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    return Array.from({ length: PILLARS }, (_, i) => {
      const angle = (i / PILLARS) * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * RING_RADIUS,
        0,
        Math.sin(angle) * RING_RADIUS,
      );
      dummy.rotation.set(0, -angle, 0);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    });
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow enough to read as architecture rotating, not an object spinning.
    group.current.rotation.y += delta * 0.08;
    // Barely-there float so the object never looks frozen.
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.05 - 0.15;
  });

  return (
    <group ref={group} {...props}>
      <instancedMesh
        ref={instances}
        args={[undefined, undefined, PILLARS]}
        castShadow
        onUpdate={(self) => {
          matrices.forEach((m, i) => self.setMatrixAt(i, m));
          self.instanceMatrix.needsUpdate = true;
        }}
      >
        <cylinderGeometry args={[0.085, 0.1, PILLAR_HEIGHT, 12]} />
        <meshStandardMaterial
          color="#2a2a38"
          metalness={0.2}
          roughness={0.25}
        />
      </instancedMesh>

      {/* Entablature — the band the pillars carry. */}
      <mesh position={[0, PILLAR_HEIGHT / 2 + 0.12, 0]}>
        <cylinderGeometry args={[RING_RADIUS + 0.22, RING_RADIUS + 0.22, 0.22, 48, 1, true]} />
        <meshStandardMaterial
          color="#32323f"
          metalness={0.2}
          roughness={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shallow dome cap. */}
      <mesh position={[0, PILLAR_HEIGHT / 2 + 0.2, 0]}>
        <sphereGeometry args={[RING_RADIUS + 0.2, 48, 16, 0, Math.PI * 2, 0, Math.PI * 0.28]} />
        <meshStandardMaterial
          color="#3a3a4a"
          metalness={0.25}
          roughness={0.16}
          emissive="#6d3ee8"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Base platform. */}
      <mesh position={[0, -PILLAR_HEIGHT / 2 - 0.08, 0]}>
        <cylinderGeometry args={[RING_RADIUS + 0.45, RING_RADIUS + 0.55, 0.16, 48]} />
        <meshStandardMaterial color="#1e1e28" metalness={0.15} roughness={0.4} />
      </mesh>

      {/* The live ring: the one emissive element, and the reason the object
          reads as "on air" as well as "parliament". */}
      <mesh
        position={[0, -PILLAR_HEIGHT / 2 - 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[RING_RADIUS + 0.5, 0.018, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Eases the camera toward the pointer without re-rendering React. */
function CameraRig({ parallax }: { parallax: boolean }) {
  useFrame((state, delta) => {
    if (!parallax) return;
    const { pointer, camera } = state;
    // ±2° of lean, damped — enough to feel alive, not enough to distract.
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * delta * 2.2;
    camera.position.y += (1.4 + pointer.y * 0.3 - camera.position.y) * delta * 2.2;
    camera.lookAt(0, -0.1, 0);
  });
  return null;
}

export default function ColonnadeScene({ parallax = true }: { parallax?: boolean }) {
  return (
    <Canvas
      aria-hidden
      camera={{ position: [0, 1.4, 9.2], fov: 32 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      /* Renders only when something changes rather than every frame — but
         the object rotates continuously, so `always` is correct here and
         the frameloop is stopped by unmounting when out of view. */
      frameloop="always"
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <ambientLight intensity={0.35} />
      {/* Key light, violet, high and left. */}
      <spotLight
        position={[-5, 7, 3]}
        angle={0.5}
        penumbra={1}
        intensity={260}
        color="#8b5cf6"
      />
      {/* Rim light behind, so the pillars separate from the background. */}
      <pointLight position={[4, 2, -4.5]} intensity={160} color="#a78bfa" />
      {/* Cool fill from below to keep the undersides from going black. */}
      <pointLight position={[0, -3.5, 3]} intensity={70} color="#6d3ee8" />

      <Colonnade />
      <CameraRig parallax={parallax} />
    </Canvas>
  );
}
