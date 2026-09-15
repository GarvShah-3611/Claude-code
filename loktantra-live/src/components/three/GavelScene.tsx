"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { makeWood } from "./wood";

/**
 * A rosewood gavel and sound block, turned from lathe profiles.
 *
 * Everything that sells the realism is generated at runtime rather than
 * downloaded: the wood comes from ./wood, and the reflections come from an
 * Environment built out of Lightformers instead of an HDR — drei's presets
 * fetch from a CDN this project cannot reach, and a metal or varnished
 * surface with no environment to reflect renders flat black.
 *
 * The shapes are lathes because a gavel is a turned object in real life:
 * revolving a profile is both the honest way to model it and the cheapest,
 * since the chamfers and incised bands cost nothing but extra points.
 */

/** Profile points are (radius, y) pairs revolved around the Y axis. */
const v2 = (r: number, y: number) => new THREE.Vector2(r, y);

/** The striking head: flat faces, chamfered rims, two incised bands. */
const HEAD_PROFILE = [
  v2(0, -1.02),
  v2(0.26, -1.02),
  v2(0.37, -0.97),
  v2(0.4, -0.9),
  v2(0.4, -0.78),
  v2(0.365, -0.755),
  v2(0.365, -0.715),
  v2(0.4, -0.69),
  v2(0.4, 0.69),
  v2(0.365, 0.715),
  v2(0.365, 0.755),
  v2(0.4, 0.78),
  v2(0.4, 0.9),
  v2(0.37, 0.97),
  v2(0.26, 1.02),
  v2(0, 1.02),
];

/** The handle: a flared neck, a long taper, and a turned end knob. */
const HANDLE_PROFILE = [
  v2(0, 0.06),
  v2(0.17, 0.02),
  v2(0.155, -0.06),
  v2(0.125, -0.16),
  v2(0.113, -0.5),
  v2(0.106, -1.05),
  v2(0.112, -1.42),
  v2(0.134, -1.62),
  v2(0.166, -1.74),
  v2(0.172, -1.83),
  v2(0.15, -1.92),
  v2(0.1, -1.97),
  v2(0, -1.99),
];

/** The sound block the gavel strikes: a squat disc with a chamfered rim. */
const BLOCK_PROFILE = [
  v2(0, 0),
  v2(1.02, 0),
  v2(1.12, 0.06),
  v2(1.14, 0.12),
  v2(1.14, 0.24),
  v2(1.06, 0.33),
  v2(0.94, 0.36),
  v2(0, 0.36),
];

function Gavel() {
  const group = useRef<THREE.Group>(null);

  // One wood texture per part, at different repeats, so the grain scale
  // reads correctly on a 2-unit head and a 0.1-unit handle alike.
  const headWood = useMemo(() => makeWood([2, 3], true), []);
  const handleWood = useMemo(() => makeWood([6, 1], true), []);
  const blockWood = useMemo(() => makeWood([4, 1]), []);  // end grain: rings

  useFrame((state) => {
    if (!group.current) return;
    // A slow settle rather than a spin: the object breathes, OrbitControls
    // does the turning.
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.03 + 0.02;
  });

  return (
    <group ref={group}>
      {/* Head, laid horizontal and tipped slightly toward the viewer. */}
      <group position={[0, 0.62, 0]} rotation={[0, 0, Math.PI / 2 - 0.16]}>
        <mesh castShadow>
          <latheGeometry args={[HEAD_PROFILE, 96]} />
          <meshStandardMaterial
            {...headWood}
            color="#ffffff"
            roughness={0.4}
            metalness={0}
            envMapIntensity={0.75}
          />
        </mesh>

        {/* Pewter bands seated in the incised grooves. Cool metal against a
            warm wood is what stops the object reading as one plastic blob. */}
        {[-0.735, 0.735].map((y) => (
          <mesh key={y} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.372, 0.372, 0.042, 64]} />
            <meshStandardMaterial
              color="#a49dae"
              roughness={0.26}
              metalness={1}
              envMapIntensity={1.4}
            />
          </mesh>
        ))}
      </group>

      {/* Handle, hung off the head and swung out to the right. */}
      <group position={[0, 0.62, 0]} rotation={[0, 0, -0.32]}>
        <mesh castShadow>
          <latheGeometry args={[HANDLE_PROFILE, 64]} />
          <meshStandardMaterial
            {...handleWood}
            color="#ffffff"
            roughness={0.44}
            metalness={0}
            envMapIntensity={0.7}
          />
        </mesh>
      </group>

      {/* Sound block. */}
      <mesh position={[0, -1.66, 0]} receiveShadow castShadow>
        <latheGeometry args={[BLOCK_PROFILE, 96]} />
        <meshStandardMaterial
          {...blockWood}
          color="#f6ecec"
          roughness={0.56}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function GavelScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [2.9, 1.55, 5.2], fov: 31 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
    >
      {/* The environment is the light. Built from Lightformers so it works
          offline; `resolution` is kept low because it is only ever seen as
          reflection, never directly. */}
      <Environment resolution={256}>
        {/* The env scene's own background. Without it the map is black
            between the emitters, and every gloss reflects a hard-edged
            light/dark boundary that reads as a seam across the object. */}
        <color attach="background" args={["#ddd0dc"]} />
        {/* Big and round: a soft key that wraps instead of stamping a
            rectangle onto every gloss. */}
        <Lightformer
          form="circle"
          intensity={3.2}
          position={[-4, 4, 3]}
          scale={11}
          color="#fff6ee"
        />
        <Lightformer
          form="circle"
          intensity={1.5}
          position={[5, 2, -3]}
          scale={9}
          color="#e2d5f2"
        />
        <Lightformer
          form="circle"
          intensity={0.9}
          position={[0, -4, 3]}
          scale={8}
          color="#ffeadf"
        />
        {/* A dim wrap all the way round so nothing ever falls to pure black
            on the shadow side. */}
        <Lightformer
          form="ring"
          intensity={0.5}
          position={[0, 0, -6]}
          scale={14}
          color="#f4e9f6"
        />
      </Environment>

      {/* A single shadow-casting key on top of the ambient environment, so
          the form reads even before any reflection does. */}
      {/* The shadow camera is sized to the object on purpose. Left at its
          default the frustum cut across the sound block and left a hard
          straight edge where the map ran out, which reads as a rendering
          fault rather than as light. */}
      <directionalLight
        position={[-3.5, 5.5, 3]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
      />
      <ambientLight intensity={0.22} />

      <Gavel />

      {/* Grounds the object on the ivory page instead of leaving it afloat. */}
      <ContactShadows
        position={[0, -1.69, 0]}
        opacity={0.4}
        scale={9}
        blur={2.6}
        far={3.2}
        resolution={512}
        color="#3a1c2a"
      />

      {/* The 360: drag to turn it, and it turns itself when left alone.
          Zoom and pan are off so the object cannot be lost off-frame, and
          the polar range keeps it from tipping past its own base. */}
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.9}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.58}
        target={[0, -0.45, 0]}
      />
    </Canvas>
  );
}
