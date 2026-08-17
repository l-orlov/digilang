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
import { Environment, Lightformer, Sparkles } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer, Noise } from '@react-three/postprocessing';
import { useIsMobile } from '@/shared/hooks/useReducedMotion';
import { BufferAttribute, BufferGeometry, DoubleSide, IcosahedronGeometry, MathUtils, Vector2, Vector3 } from 'three';
import type { AmbientLight, DirectionalLight, Mesh, MeshPhysicalMaterial } from 'three';
import type { ChromaticAberrationEffect, NoiseEffect } from 'postprocessing';
import { GlassOrb } from '@/home/components/GlassOrb';
import { JourneyContent } from '@/home/components/JourneyContent';
import type { JourneyFacet } from '@/home/content';

/** Espesor de cada cara (prisma triangular) — le da profundidad real: un
 * bisel angosto en cada borde, no un plano sin espesor. */
const FACET_DEPTH = 0.11;

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
/** Progreso (0..1) donde termina el giro "adentro" y arranca el outro —
 * compartido con CoreJourney.tsx para que el giro de cámara y el cambio de
 * panel de cada facet queden siempre sincronizados entre sí. */
export const INSIDE_END = 0.92;

/**
 * Cada cara del icosaedro se reemplaza por un prisma triangular: la cara
 * exterior (al radio original) más 3 paredes laterales que bajan hasta una
 * base hundida `depth` hacia el centro — le da un bisel real a cada borde
 * (se nota como una franja angosta con sombreado propio), en vez de un
 * plano sin espesor.
 *
 * A diferencia de versiones anteriores, acá NO hay atributo de color ni de
 * "explode" (antes vía `aCentroid` + shader propio, para arrastrar/hover):
 * el patrón de referencia (digilang.vercel.app) resultó ser un solo tono
 * neutro parejo — la variación que se ve entre caras es pura sombra por
 * ángulo de luz (confirmado muestreando píxeles del screenshot: mismo hue,
 * luminosidad variando ~223-248/255), no distintos colores — y este objeto
 * ya no es interactivo (nunca se ve mientras arrastre/hover tendrían
 * sentido, ver comentario en `Crystal`). Con geometría no indexada +
 * `computeVertexNormals()` cada cara ya tiene su propia normal plana (ver
 * comentario más abajo en `Lighting`), así que el degradé por cara sale
 * solo con un color base único + luz direccional.
 */
function createFacetedGeometry(radius: number, detail: number, depth: number): BufferGeometry {
  const base = new IcosahedronGeometry(radius, detail).toNonIndexed();
  const basePos = base.attributes.position;
  const faceCount = basePos.count / 3;
  const trisPerFace = 7;
  const vertCount = faceCount * trisPerFace * 3;

  const positions = new Float32Array(vertCount * 3);

  const t0 = new Vector3();
  const t1 = new Vector3();
  const t2 = new Vector3();
  const dir = new Vector3();
  const b0 = new Vector3();
  const b1 = new Vector3();
  const b2 = new Vector3();

  let vi = 0;
  const pushVert = (v: Vector3) => {
    positions[vi * 3] = v.x;
    positions[vi * 3 + 1] = v.y;
    positions[vi * 3 + 2] = v.z;
    vi++;
  };

  for (let f = 0; f < faceCount; f++) {
    const i0 = f * 3;
    t0.fromBufferAttribute(basePos, i0);
    t1.fromBufferAttribute(basePos, i0 + 1);
    t2.fromBufferAttribute(basePos, i0 + 2);
    // Cada vértice de la base de la pared usa SU PROPIA dirección radial
    // (no la del centroide de la cara) — así el punto quede compartido con
    // las caras vecinas que tocan ese mismo vértice, sin importar cuál cara
    // lo esté calculando. Antes usaban `dir` (centroide de la cara), que
    // difiere entre caras vecinas aunque el vértice de arriba (t0/t1/t2)
    // sea el mismo punto — eso dejaba las paredes sin cerrar en cada
    // vértice donde convergen 5-6 caras (hueco en forma de estrella, fijo
    // en la geometría).
    b0.copy(t0).addScaledVector(dir.copy(t0).normalize(), -depth);
    b1.copy(t1).addScaledVector(dir.copy(t1).normalize(), -depth);
    b2.copy(t2).addScaledVector(dir.copy(t2).normalize(), -depth);

    // tapa exterior
    pushVert(t0);
    pushVert(t1);
    pushVert(t2);
    // pared t0-t1
    pushVert(t0);
    pushVert(t1);
    pushVert(b1);
    pushVert(t0);
    pushVert(b1);
    pushVert(b0);
    // pared t1-t2
    pushVert(t1);
    pushVert(t2);
    pushVert(b2);
    pushVert(t1);
    pushVert(b2);
    pushVert(b1);
    // pared t2-t0
    pushVert(t2);
    pushVert(t0);
    pushVert(b0);
    pushVert(t2);
    pushVert(b0);
    pushVert(b2);
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

// Ángulo de cada facet — se reparten en una grilla de 2 filas (arriba/abajo)
// en orden "serpiente" (fila de arriba de izquierda a derecha, fila de
// abajo de derecha a izquierda), así que ir de una facet a la siguiente del
// listado va realmente en distintas direcciones — derecha, derecha, abajo,
// izquierda, izquierda, arriba — no siempre para el mismo lado con el pitch
// como único variante. Compartido entre CameraRig (a dónde apunta la
// cámara) y JourneyContent.tsx (dónde vive el texto de cada facet) — si se
// calculara por separado en cada archivo, alguno se podría desincronizar al
// tocar un solo lado.
// Con 14° dos facets de la misma columna (arriba/abajo) quedaban a solo
// ~28° de distancia angular entre sí — dentro de la ventana de fundido de
// JourneyContent.tsx (hasta 0.6 rad ≈ 34°), así que la de abajo se veía
// "transparentada" detrás de la de arriba. Con 26° la separación (~52°)
// queda claramente afuera de esa ventana, y de paso el arriba/abajo se
// siente más marcado, que era justamente el pedido.
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

/** Esquema "high-key" claro: ambient bien alto (nada se va a negro sobre el
 * fondo claro) + key/fill direccionales para que SÍ haya contraste de brillo
 * entre caras según su ángulo — a diferencia de la versión anterior (donde
 * el objetivo era aplanar ese contraste para no "ensuciar" un color por
 * cara), acá el patrón facetado es de un solo tono y esa variación de brillo
 * entre caras es justamente lo que le da textura al patrón (confirmado
 * contra el screenshot de referencia). Direccionales (no puntuales) para que
 * dentro de UNA cara no haya degradé — solo entre caras, por su ángulo. */
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
 * El patrón facetado que se ve "adentro" del viaje — ya no es un objeto
 * visible/interactivo "afuera" (eso ahora es GlassOrb): no hace falta
 * arrastre, hover ni rotación propia, porque nunca se ve mientras esas
 * interacciones tendrían sentido (antes de cruzar `APPROACH_END`). Por eso,
 * a diferencia de versiones anteriores, este componente no tiene `group`
 * con inercia ni raycast de hover — solo aparece (fade de opacity) y sus
 * propiedades de material reaccionan a `insideDepth`.
 */
function Crystal({ progressRef }: { progressRef: React.RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshPhysicalMaterial>(null);

  const geometry = useMemo(() => createFacetedGeometry(1.3, 1, FACET_DEPTH), []);

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const insideDepth = MathUtils.smoothstep(p, APPROACH_END, 1);
    if (material.current) {
      material.current.opacity = MathUtils.smoothstep(p, CROSSFADE_START, CROSSFADE_END);
      // Adentro la cámara queda muy cerca de la cara — el vector de vista
      // barre un ángulo enorme de un extremo al otro de un mismo plano, y
      // hasta un specular chico (el ~4% de Fresnel que tiene cualquier
      // dieléctrico, no hace falta metalness) se nota como un degradé
      // dentro de la cara. Roughness bien alto ahí adentro lo aplana.
      material.current.roughness = MathUtils.lerp(0.5, 0.75, insideDepth);
      material.current.clearcoat = MathUtils.lerp(0.1, 0, insideDepth);
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial
        ref={material}
        // Un solo tono neutro claro — la variación entre caras sale de la
        // luz (ver comentario en createFacetedGeometry), no de un color por
        // vértice.
        color="#E7EAEF"
        roughness={0.55}
        metalness={0}
        clearcoat={0.1}
        clearcoatRoughness={0.4}
        ior={1.5}
        side={DoubleSide}
        // El cristal no se ve "afuera" — ahí está el orbe de vidrio (ver
        // GlassOrb). Arranca invisible y se desvanece adentro (opacity
        // animado en useFrame, junto con la del orbe apagándose al revés)
        // para que la transición se sienta como una sola cosa.
        transparent
        opacity={0}
      />
    </mesh>
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
        <Bloom key="bloom" intensity={0.22} luminanceSmoothing={0.2} mipmapBlur radius={0.25} />,
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

export function CoreScene({
  progressRef,
  activeFacetRef,
  facetCount,
  facets,
}: {
  progressRef: React.RefObject<number>;
  activeFacetRef: React.RefObject<number>;
  facetCount: number;
  facets: JourneyFacet[];
}) {
  const mobile = useIsMobile();

  return (
    <Canvas
      className="dl-journey__canvas"
      style={{ position: 'absolute', inset: 0 }}
      // Tope de dpr más bajo en mobile: son pantallas de dpr 2-3, y sin este
      // tope el canvas renderiza a resolución real de pixel (2-3x el ancho
      // CSS) en una GPU bastante más floja que una de escritorio — mismo
      // criterio que el conteo de Sparkles más abajo.
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, CAMERA_START_Z], fov: 40, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Sin esto, el vidrio (transmission) y las argollas metálicas
          (metalness 1) de GlassOrb no tienen nada que reflejar/refractar y
          se ven planas — un metal puro sin envMap sale directamente negro
          salvo un brillo puntual mínimo. `frames={1}` la genera una sola
          vez (no es dinámica, no hace falta recalcularla cada frame) con
          paneles de luz propios (Lightformer), sin depender de ningún HDRI
          externo. No es el fondo visible (`background` no seteado) — solo
          entorno para reflejos. */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} color="#ffffff" position={[0, 4, 2]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.2} color="#dfe3ee" position={[-4, 0, 3]} scale={[6, 6, 1]} rotation={[0, Math.PI / 2, 0]} />
        <Lightformer intensity={1.4} color="#ffffff" position={[4, -1, -2]} scale={[6, 6, 1]} rotation={[0, -Math.PI / 2, 0]} />
        <Lightformer intensity={0.8} color="#c9cede" position={[0, -4, 0]} scale={[8, 8, 1]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>
      <Lighting progressRef={progressRef} />
      <CameraRig progressRef={progressRef} activeFacetRef={activeFacetRef} facetCount={facetCount} />
      <GlassOrb progressRef={progressRef} mobile={mobile} />
      <JourneyContent facets={facets} facetCount={facetCount} progressRef={progressRef} />
      <Crystal progressRef={progressRef} />
      {/* Puntos oscuros chicos y parejos — antes (gris-azulado, size 1.3)
          alguno le tocaba spawnear muy cerca de cámara y, aunque el tamaño
          en mundo fuera el mismo para todos, en pantalla se veía como un
          círculo gris plano gigante flotando — nada de "partícula suelta".
          Size bajo (0.55) acota cuánto puede crecer ese caso en pantalla. */}
      <Sparkles count={mobile ? 16 : 32} scale={6} size={0.55} speed={0.3} color="#1a1a24" opacity={0.6} />
      <PostFX progressRef={progressRef} mobile={mobile} />
    </Canvas>
  );
}
