/**
 * Escena WebGL del "viaje al núcleo": la cámara viaja según `progressRef`
 * (0..1, escrito desde fuera por el ScrollTrigger de CoreJourney.tsx), de
 * "afuera" (GlassOrb — esfera de vidrio con núcleo brillante y anillos
 * orbitando) a "adentro" (patrón facetado neutro que rodea la cámara,
 * `Crystal`). Ambos objetos comparten la misma ventana de cruce
 * (`CROSSFADE_START`/`CROSSFADE_END`) para que uno se apague justo mientras
 * el otro se prende.
 *
 * Diseño portado de digilang.vercel.app (generado con v0.app) — antes esta
 * escena era un objeto único (cristal facetado, visible y arrastrable tanto
 * afuera como adentro, con paleta de colores por cara). Ver git history si
 * hace falta esa versión.
 *
 * Solo se monta si no hay `prefers-reduced-motion` — el fallback de
 * CoreJourney no usa esta escena en absoluto.
 */
import { memo, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import { useIsMobile } from '@/shared/hooks/useReducedMotion';
import { BufferAttribute, BufferGeometry, Color, DoubleSide, BackSide, IcosahedronGeometry, MathUtils, Vector2 } from 'three';
import type { AmbientLight, DirectionalLight, Group, Mesh, MeshStandardMaterial } from 'three';
import type { ChromaticAberrationEffect, NoiseEffect } from 'postprocessing';
import { GlassOrb } from '@/home/components/GlassOrb';

const CAMERA_START_Z = 6;
const CAMERA_THRESHOLD_Z = 1.6;
// Centro geométrico del cristal — equidistante de todas las caras. La
// cámara llega hasta acá una sola vez (fase de "asentado", ver
// CAMERA_SETTLE_END) y after eso NUNCA vuelve a moverse en Z: el resto del
// recorrido "adentro" es puro giro (camera.rotation.y en CameraRig), no
// traslación — así la cámara jamás vuelve a salir del cristal.
const CAMERA_INSIDE_Z = 0;
/** Progreso (0..1) donde termina el "acercamiento" y arranca "adentro". */
export const APPROACH_END = 0.15;
/** Ventana de cruce entre GlassOrb (afuera) y el patrón facetado (adentro)
 * — orbe y facetas comparten esta misma ventana, uno se apaga mientras el
 * otro se prende, para que la transición se sienta como una sola pieza en
 * vez de dos fades independientes desincronizados. */
export const CROSSFADE_START = APPROACH_END - 0.05;
export const CROSSFADE_END = APPROACH_END + 0.04;
// Ventana corta (6% del scroll) justo después de cruzar el umbral, donde la
// cámara todavía se termina de asentar en el centro antes de que el resto
// del recorrido pase a ser solo rotación.
const CAMERA_SETTLE_END = APPROACH_END + 0.06;

// Ángulo de cada facet — se reparten en una grilla de 2 filas (arriba/abajo)
// en orden "serpiente" (fila de arriba de izquierda a derecha, fila de
// abajo de derecha a izquierda), así que ir de una facet a la siguiente del
// listado va realmente en distintas direcciones — derecha, derecha, abajo,
// izquierda, izquierda, arriba — no siempre para el mismo lado con el pitch
// como único variante. Usado por CameraRig (a dónde apunta la cámara).
// Con 14° dos facets de la misma columna (arriba/abajo) quedaban demasiado
// cerca; con 26° la separación (~52°) se siente más marcada.
const FACET_PITCH = MathUtils.degToRad(26);
const FACET_YAW_STEP = MathUtils.degToRad(55);

export function getFacetAngles(index: number, facetCount: number): { yaw: number; pitch: number } {
  const cols = Math.ceil(facetCount / 2);
  const row = Math.floor(index / cols);
  const colInRow = index % cols;
  // fila impar recorrida al revés (serpiente) — así la transición entre
  // filas es un solo paso hacia abajo/arriba, no un salto lateral grande.
  const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
  const yaw = (col - (cols - 1) / 2) * FACET_YAW_STEP;
  const pitch = row === 0 ? FACET_PITCH : -FACET_PITCH;
  return { yaw, pitch };
}

// Diferencia angular más corta entre dos ángulos (en radianes) — % de JS
// puede devolver negativo (a diferencia de Python), por eso el "+ twoPi)
// % twoPi" de más: sin él, el camino más corto salía mal la mitad de las
// veces (resultado fuera de (-π, π]).
export function shortestAngleDelta(target: number, current: number): number {
  const twoPi = Math.PI * 2;
  return (((target - current + Math.PI) % twoPi) + twoPi) % twoPi - Math.PI;
}

/**
 * Mueve la cámara según el progreso del scroll (acercamiento, traslación en
 * Z, y una vez adentro se asienta y nunca vuelve a moverse en Z) y hace
 * girar la cámara (yaw + pitch) hacia la cara elegida por click en la nav
 * de CoreJourney.tsx (`activeFacetRef`), no por scroll — girar en cada
 * pixel de scroll mareaba (fue lo primero que se probó, ver historial). El
 * giro usa el camino más corto en cada eje por separado.
 */
function CameraRig({
  progressRef,
  activeFacetRef,
  facetCount,
}: {
  progressRef: React.RefObject<number>;
  activeFacetRef: React.RefObject<number>;
  facetCount: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef.current ?? 0;

    let z: number;
    if (p <= APPROACH_END) {
      z = MathUtils.lerp(CAMERA_START_Z, CAMERA_THRESHOLD_Z, p / APPROACH_END);
    } else if (p <= CAMERA_SETTLE_END) {
      z = MathUtils.lerp(CAMERA_THRESHOLD_Z, CAMERA_INSIDE_Z, (p - APPROACH_END) / (CAMERA_SETTLE_END - APPROACH_END));
    } else {
      z = CAMERA_INSIDE_Z;
    }
    camera.position.z = z;

    // Si volviste a scrollear hacia afuera (p <= APPROACH_END), el giro
    // vuelve a (0,0) sin importar qué facet quedó elegida en la nav — si
    // no, la vista de "afuera" quedaba girada al último click, distinta a
    // como se veía al entrar la primera vez.
    const target = p <= APPROACH_END ? { yaw: 0, pitch: 0 } : getFacetAngles(activeFacetRef.current ?? 0, facetCount);
    camera.rotation.y += shortestAngleDelta(target.yaw, camera.rotation.y) * 0.07;
    camera.rotation.x += shortestAngleDelta(target.pitch, camera.rotation.x) * 0.07;
  });

  return null;
}

/** Esquema "high-key" claro: ambient + key/fill/rim direccionales. */
function Lighting({ progressRef }: { progressRef: React.RefObject<number> }) {
  const ambient = useRef<AmbientLight>(null);
  const key = useRef<DirectionalLight>(null);
  const fill = useRef<DirectionalLight>(null);
  const rim = useRef<DirectionalLight>(null);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const insideDepth = MathUtils.smoothstep(p, APPROACH_END, 1);
    if (ambient.current) ambient.current.intensity = MathUtils.lerp(0.9, 0.85, insideDepth);
    if (key.current) key.current.intensity = MathUtils.lerp(1.4, 1, insideDepth);
    if (fill.current) fill.current.intensity = MathUtils.lerp(0.5, 0.4, insideDepth);
    if (rim.current) rim.current.intensity = MathUtils.lerp(0.35, 0.2, insideDepth);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.9} />
      <directionalLight ref={key} position={[4, 3, 5]} intensity={1.4} color="#ffffff" />
      <directionalLight ref={fill} position={[-3, -1, 4]} intensity={0.5} color="#ffffff" />
      <directionalLight ref={rim} position={[-5, 3, -4]} intensity={0.35} color="#ffffff" />
    </>
  );
}

/**
 * El patrón facetado "adentro" — colores y shading del HeroScene de
 * digilang.vercel.app: Icosahedron con vertexColors (paleta pP) + flatShading,
 * scale 0.4→14 al entrar para llenar el FOV.
 */
const CRYSTAL_FACE_COLORS = ['#eef0f6', '#d7dbe8', '#b9c0d8', '#c9bcae', '#a7b0cd'].map(
  (hex) => new Color(hex)
);

function createCrystalGeometry(): BufferGeometry {
  const geo = new IcosahedronGeometry(1, 3).toNonIndexed();
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 3) {
    const c = CRYSTAL_FACE_COLORS[Math.floor(Math.random() * CRYSTAL_FACE_COLORS.length)];
    for (let v = 0; v < 3; v++) {
      colors[(i + v) * 3] = c.r;
      colors[(i + v) * 3 + 1] = c.g;
      colors[(i + v) * 3 + 2] = c.b;
    }
  }
  geo.setAttribute('color', new BufferAttribute(colors, 3));
  return geo;
}

function Crystal({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const fill = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const fillMat = useRef<MeshStandardMaterial>(null);
  const geometry = useMemo(() => createCrystalGeometry(), []);

  useFrame((_, delta) => {
    const p = progressRef.current ?? 0;
    const appear = MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);
    const grow = MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END + 0.06);
    const scale = MathUtils.lerp(0.4, 18, grow);
    const solid = appear > 0.92;

    if (mesh.current) {
      mesh.current.visible = appear > 0.01;
      mesh.current.scale.setScalar(scale);
      mesh.current.rotation.y += 0.03 * delta;
    }
    if (fill.current) {
      // Cáscara opaca un poco más chica — tapa cualquier hueco de sorting
      // transparente para que no se vea el clear color (blanco) del canvas.
      fill.current.visible = appear > 0.2;
      fill.current.scale.setScalar(scale * 0.98);
      fill.current.rotation.y = mesh.current?.rotation.y ?? 0;
    }
    if (material.current) {
      material.current.opacity = solid ? 1 : appear;
      material.current.transparent = !solid;
      material.current.depthWrite = true;
    }
    if (fillMat.current) {
      fillMat.current.opacity = Math.min(1, appear * 1.2);
    }
  });

  return (
    <group>
      <mesh ref={fill}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          ref={fillMat}
          color="#dfe3ee"
          roughness={1}
          metalness={0}
          side={BackSide}
          flatShading
          transparent
          opacity={0}
          depthWrite
        />
      </mesh>
      <mesh ref={mesh} geometry={geometry}>
        <meshStandardMaterial
          ref={material}
          vertexColors
          flatShading
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
          transparent
          opacity={0}
          depthWrite
        />
      </mesh>
    </group>
  );
}

/**
 * Bloom fijo (el umbral de luminancia por default de postprocessing ya es
 * 1.0 — nuestro fondo/patrón claro no llega a eso, así que sin tocar nada
 * ya solo agarra el núcleo "sobre-saturado" de GlassOrb, ver el color ahí).
 * Grano y aberración cromática sí varían con el scroll: casi nada en reposo,
 * un pico justo en la ventana de cruce (mismo tramo que el fade orbe↔
 * facetas) — imitan el "ruido" que se ve en digilang.vercel.app al
 * atravesar el vidrio, sin dejarlo prendido todo el recorrido (se sentía
 * sucio sobre un fondo tan claro).
 *
 * En mobile se salta grano/aberración (Bloom se mantiene — es lo que le da
 * el brillo al núcleo, sin eso GlassOrb pierde su rasgo más reconocible):
 * son passes extra de postprocesado sobre GPUs bastante más chicas, y de
 * cerca (probado en iPhone 13 emulado) bajaban el frame rate lo suficiente
 * como para que el giro de cámara al elegir una facet en la nav se sintiera
 * más lento/atrasado — mismo criterio que el dpr/Sparkles reducidos en
 * `CoreScene` más abajo.
 *
 * memo — sin esto, cada click en la nav de CoreJourney.tsx (cambia estado
 * de React, `activeFacet`) volvía a renderizar todo el árbol de `CoreScene`
 * de arriba a abajo (React re-renderiza hijos aunque sus props no
 * cambien, salvo que estén memoizados) — inofensivo para meshes normales,
 * pero @react-three/postprocessing usa JSON.stringify para detectar cambios
 * en las `args` de cada Effect, y ese re-render terminaba comparando algo
 * que incluía una referencia circular de three.js (cámara/escena) y tiraba
 * la página entera en blanco. Las props acá nunca cambian de identidad
 * (progressRef es un ref, mobile es un booleano primitivo), así que memo
 * evita ese re-render innecesario del todo.
 */
const PostFX = memo(function PostFX({
  progressRef,
  mobile,
}: {
  progressRef: React.RefObject<number>;
  mobile: boolean;
}) {
  const noise = useRef<NoiseEffect>(null);
  const aberration = useRef<ChromaticAberrationEffect>(null);
  const offset = useRef(new Vector2());

  useFrame(() => {
    if (mobile) return;
    const p = progressRef.current ?? 0;
    // Pico angosto centrado en la ventana de cruce, no un escalón — sube y
    // vuelve a bajar de los dos lados.
    const dist = Math.abs(p - (CROSSFADE_START + CROSSFADE_END) / 2);
    const spike = 1 - MathUtils.smoothstep(dist, 0, 0.1);

    if (noise.current) noise.current.blendMode.opacity.value = 0.06 * spike;
    if (aberration.current) {
      offset.current.set(0.0025, 0.0025).multiplyScalar(spike);
      aberration.current.offset = offset.current;
    }
  });

  return (
    <EffectComposer>
      {[
        <Bloom key="bloom" intensity={0.18} luminanceSmoothing={0.3} mipmapBlur radius={0.3} />,
        ...(mobile
          ? []
          : [
              <Noise key="noise" ref={noise} premultiply />,
              <ChromaticAberration key="aberration" ref={aberration} radialModulation={false} modulationOffset={0} />,
            ]),
      ]}
    </EffectComposer>
  );
});

function FadeSparkles({
  progressRef,
  mobile,
}: {
  progressRef: React.RefObject<number>;
  mobile: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const fade = 1 - MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);
    if (group.current) group.current.visible = fade > 0.05;
  });

  return (
    <group ref={group}>
      <Sparkles count={mobile ? 48 : 90} scale={8} size={0.9} speed={0.25} color="#0c0c12" opacity={0.85} />
    </group>
  );
}

export function CoreScene({
  progressRef,
  activeFacetRef,
  facetCount,
}: {
  progressRef: React.RefObject<number>;
  activeFacetRef: React.RefObject<number>;
  facetCount: number;
}) {
  const mobile = useIsMobile();

  return (
    <Canvas
      className="dl-journey__canvas"
      style={{ position: 'absolute', inset: 0 }}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, CAMERA_START_Z], fov: 40, near: 0.05, far: 80 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#e8ebf2', 1);
      }}
    >
      <color attach="background" args={['#e8ebf2']} />
      <Environment preset="studio" environmentIntensity={0.7} background={false} />
      <Lighting progressRef={progressRef} />
      <CameraRig progressRef={progressRef} activeFacetRef={activeFacetRef} facetCount={facetCount} />
      <GlassOrb progressRef={progressRef} mobile={mobile} />
      <Crystal progressRef={progressRef} />
      <FadeSparkles progressRef={progressRef} mobile={mobile} />
      <PostFX progressRef={progressRef} mobile={mobile} />
    </Canvas>
  );
}
