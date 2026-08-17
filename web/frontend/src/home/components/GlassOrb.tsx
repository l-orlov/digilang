/**
 * Orbe del viaje — geometría/material del HeroScene de digilang.vercel.app:
 * icosaedro con MeshTransmissionMaterial, núcleo emissive, dos anillos torus,
 * envuelto en <Float>. El fade por `progressRef` (CROSSFADE_*) cruza al Crystal.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import { Color, MathUtils } from 'three';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { CROSSFADE_END, CROSSFADE_START } from '@/home/components/CoreScene';

const GLASS_BACKGROUND = new Color('#eef1f6');

function OrbitRing({
  radius = 1.7,
  rotation,
  speed = 0.25,
  fadeRef,
}: {
  radius?: number;
  rotation: [number, number, number];
  speed?: number;
  fadeRef: React.RefObject<number>;
}) {
  const mesh = useRef<Mesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const fade = fadeRef.current ?? 1;
    if (mesh.current) {
      mesh.current.visible = fade > 0.04;
      if (mesh.current.visible) mesh.current.rotation.z += delta * speed;
    }
    if (mat.current) mat.current.opacity = fade;
  });

  return (
    <mesh ref={mesh} rotation={rotation}>
      <torusGeometry args={[radius, 0.026, 32, 240]} />
      <meshStandardMaterial
        ref={mat}
        color="#c6cad4"
        metalness={1}
        roughness={0.16}
        envMapIntensity={1.5}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

export function GlassOrb({ progressRef, mobile }: { progressRef: React.RefObject<number>; mobile: boolean }) {
  const group = useRef<Group>(null);
  const fadeRef = useRef(1);
  const glassMat = useRef<{ opacity: number }>(null);
  const coreMat = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    const fade = 1 - MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);
    fadeRef.current = fade;
    const enter = MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);
    // Corte duro apenas terminó el cruce — si no, los anillos seguían
    // asomando como un círculo fino sobre el "blanco" adentro.
    const show = fade > 0.04 && p < CROSSFADE_END + 0.02;

    if (group.current) {
      group.current.visible = show;
      if (show) {
        group.current.rotation.y += 0.06 * delta;
        group.current.scale.setScalar(MathUtils.lerp(1, 1.6, enter));
      }
    }
    if (glassMat.current) glassMat.current.opacity = fade;
    if (coreMat.current) coreMat.current.opacity = fade;
  });

  return (
    <group ref={group}>
      <OrbitRing radius={1.75} rotation={[Math.PI / 2.1, 0.2, 0]} speed={0.22} fadeRef={fadeRef} />
      <OrbitRing radius={1.95} rotation={[Math.PI / 2.6, -0.5, Math.PI / 3]} speed={-0.16} fadeRef={fadeRef} />

      <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.5} floatingRange={[-0.06, 0.06]}>
        <mesh>
          <icosahedronGeometry args={[1, 10]} />
          <MeshTransmissionMaterial
            ref={glassMat}
            background={GLASS_BACKGROUND}
            samples={mobile ? 4 : 6}
            resolution={mobile ? 256 : 512}
            thickness={0.8}
            roughness={0.14}
            transmission={1}
            ior={1.34}
            chromaticAberration={0.03}
            anisotropy={0.05}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            color="#dfe4ff"
            attenuationColor="#aeb9ff"
            attenuationDistance={3.2}
          />
        </mesh>
        <mesh scale={0.32}>
          <icosahedronGeometry args={[1, 4]} />
          <meshStandardMaterial
            ref={coreMat}
            color="#5b6cff"
            metalness={0.1}
            roughness={0.4}
            emissive="#4453e6"
            emissiveIntensity={0.15}
            transparent
            opacity={1}
          />
        </mesh>
      </Float>
    </group>
  );
}
